<template>
  <div class="fixed inset-0 z-50 bg-gray-950 flex flex-col h-screen w-screen overflow-hidden">
    <!-- Top Fullscreen Navbar -->
    <header class="h-14 sm:h-16 bg-gray-900 border-b border-gray-800 text-white px-3 sm:px-6 flex items-center justify-between gap-3 shrink-0 shadow-md">
      <!-- Left: Back Button & Document Info -->
      <div class="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
        <button
          type="button"
          @click="goBack"
          class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-800 hover:bg-gray-700 active:scale-95 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0 border border-gray-700"
          title="Kembali"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div class="min-w-0 space-y-0.5">
          <div class="flex items-center gap-2">
            <h1 class="text-xs sm:text-sm font-extrabold text-white truncate max-w-[180px] sm:max-w-md">
              {{ docTitle || 'Hasil Pemeriksaan' }}
            </h1>
            <span class="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-900/60 text-violet-300 border border-violet-700/50">
              Dokumen Resmi
            </span>
          </div>
          <p class="text-[10px] sm:text-xs text-gray-400 truncate">
            <span>Ref ID: #{{ docId }}</span>
            <span v-if="docDate" class="hidden sm:inline"> • {{ docDate }}</span>
          </p>
        </div>
      </div>

      <!-- Right: Actions (Share, Download) -->
      <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <!-- Share button (if supported on mobile) -->
        <button
          v-if="canShare"
          type="button"
          @click="shareDocument"
          :disabled="!pdfBlob"
          class="px-2.5 sm:px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-40"
          title="Bagikan Dokumen"
        >
          <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          <span class="hidden md:inline">Bagikan</span>
        </button>

        <!-- Download Button -->
        <button
          type="button"
          @click="downloadPdf"
          :disabled="!pdfBlob"
          class="px-3.5 sm:px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-900/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-40"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Unduh PDF</span>
        </button>
      </div>
    </header>

    <!-- Main Fullscreen Content -->
    <main class="flex-1 w-full h-full flex flex-col bg-gray-950 overflow-hidden relative">
      <!-- Loading State -->
      <div v-if="loading" class="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400 gap-3">
        <svg class="w-10 h-10 animate-spin text-violet-500" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/>
        </svg>
        <div class="space-y-1">
          <p class="text-sm font-bold text-gray-200">Mengambil & Mendekripsi Dokumen PDF...</p>
          <p class="text-xs text-gray-500">Memproses keamanan berkas rekam medis Anda</p>
        </div>
      </div>

      <!-- Error / Not Found State -->
      <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto">
        <div class="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-800/80 text-amber-400 flex items-center justify-center shadow-inner">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="space-y-1.5">
          <h3 class="text-sm font-bold text-amber-300">
            {{ isLab ? 'Dokumen Hasil Laboratorium Belum Tersedia' : (isResume ? 'Resume Medis Belum Tersedia' : (isRad ? 'Dokumen Hasil Radiologi Belum Tersedia' : 'Gagal Membuka Dokumen')) }}
          </h3>
          <p class="text-xs text-gray-300 leading-relaxed">
            {{ isLab ? 'Berkas hasil laboratorium belum diterbitkan atau masih dalam proses validasi analis. Silakan lakukan konfirmasi ke bagian Laboratorium RSUD R.A.A. Tjokronegoro.' : (isResume ? 'Dokumen resume medis rawat inap belum diterbitkan atau masih dalam proses penandatanganan DPJP. Silakan konfirmasi ke bagian Rekam Medis.' : (isRad ? 'Dokumen hasil bacaan radiologi belum tersedia. Silakan lakukan konfirmasi ke bagian Radiologi RSUD R.A.A. Tjokronegoro.' : error)) }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="fetchAndDecryptDoc"
            class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer"
          >
            Coba Muat Ulang
          </button>
          <button
            type="button"
            @click="goBack"
            class="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs border border-gray-700 transition-all cursor-pointer"
          >
            Kembali
          </button>
        </div>
      </div>

      <!-- Interactive Canvas PDF Viewer with iOS Direct Download Bar -->
      <div v-else-if="pdfBlob" class="flex-1 w-full h-full flex flex-col overflow-hidden">
        <!-- Prominent Banner for iOS / iPhone users -->
        <div v-if="isIOS" class="bg-gradient-to-r from-violet-950 via-indigo-950 to-slate-900 border-b border-indigo-800/60 p-3 sm:p-4 text-white flex items-center justify-between gap-3 shrink-0 shadow-lg">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-9 h-9 rounded-xl bg-violet-600/30 border border-violet-400/30 flex items-center justify-center text-violet-300 shrink-0">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-white truncate">Dokumen PDF Siap Dibuka</p>
              <p class="text-[10px] text-violet-300 truncate">Buka di Safari Native / Simpan ke File</p>
            </div>
          </div>
          <button
            type="button"
            @click="downloadPdf"
            class="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-violet-900/40 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Buka / Unduh PDF</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <div class="flex-1 w-full h-full overflow-hidden">
          <PdfViewer :blob="pdfBlob" class="rounded-none border-none h-full" />
        </div>
      </div>

      <!-- Fallback Raw Text Content -->
      <div v-else-if="rawText" class="flex-1 p-6 overflow-auto text-xs font-mono text-gray-200 bg-gray-900 whitespace-pre-wrap leading-relaxed">
        {{ rawText }}
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { decryptPdfDocument } from '../utils/crypto'
import PdfViewer from '../components/common/PdfViewer.vue'

const route = useRoute()
const router = useRouter()

const docId = computed(() => {
  return String(route.params.id || route.query.id || route.params.acsn || route.query.acsn || '').trim()
})
const docTitle = computed(() => route.query.title || 'Hasil Pemeriksaan')
const docDate = computed(() => route.query.tgl || '')
const docType = computed(() => {
  return String(route.params.type || route.query.type || 'radiologi').trim().toLowerCase()
})
const isRad = computed(() => docType.value === 'radiologi' || docType.value === 'rad')
const isLab = computed(() => docType.value === 'laboratorium' || docType.value === 'laborat')
const isResume = computed(() => docType.value === 'resume-medis' || docType.value === 'resume')

const loading = ref(true)
const error = ref('')
const pdfBlob = ref(null)
const rawText = ref('')
const filename = ref('Dokumen_Hasil.pdf')

const canShare = computed(() => typeof navigator !== 'undefined' && !!navigator.share)
const isIOS = computed(() => {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
})

async function fetchAndDecryptDoc() {
  if (!docId.value) {
    error.value = 'ID Dokumen tidak ditemukan.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''
  pdfBlob.value = null
  rawText.value = ''

  try {
    let endpoint = '/hasil-radiologi/view-bacaan'
    let params = { acsn: docId.value, id: docId.value }

    if (docType.value === 'laboratorium' || docType.value === 'laborat') {
      endpoint = '/hasil-laboratorium/view-hasil'
      params = { noKunjungan: docId.value, acsn: docId.value, id: docId.value }
    } else if (docType.value === 'resume-medis' || docType.value === 'resume') {
      endpoint = '/resume-medis/view-resume'
      params = { idReg: docId.value, noKunjungan: docId.value, id: docId.value }
    }

    const response = await api.get(endpoint, { params })
    const res = response.data

    if (res && (res.code === '200' || res.code === 200 || res.status === 200 || res.status === '200') && res.data) {
      const dataObj = res.data
      const file = dataObj.file || dataObj.FILE || dataObj.content || dataObj.document
      const key = dataObj.key || dataObj.KEY
      const resFilename = dataObj.filename || dataObj.FILENAME

      if (resFilename) filename.value = resFilename

      if (file && key) {
        // Dekripsi menggunakan CryptoJS
        const decryptedBlob = await decryptPdfDocument(key, file)
        pdfBlob.value = decryptedBlob
      } else if (file) {
        // Cek jika file raw base64 / binary
        processRawFile(file)
      } else {
        if (isRad.value) {
          error.value = 'Dokumen hasil bacaan radiologi belum tersedia. Silakan lakukan konfirmasi ke bagian Radiologi.'
        } else {
          error.value = 'Dokumen berkas tidak ditemukan atau belum diarsipkan.'
        }
      }
    } else {
      if (isRad.value) {
        error.value = 'Dokumen hasil bacaan radiologi belum tersedia. Silakan lakukan konfirmasi ke bagian Radiologi.'
      } else {
        error.value = res?.message || 'Dokumen rekam medis tidak ditemukan di server.'
      }
    }
  } catch (err) {
    console.error('Fetch/Decrypt Document Error:', err)
    if (isRad.value && (err.response?.status === 404 || err.response?.data?.code === '404' || err.response?.data?.code === 404)) {
      error.value = 'Dokumen hasil bacaan radiologi belum tersedia. Silakan lakukan konfirmasi ke bagian Radiologi.'
    } else {
      error.value = err.response?.data?.message || err.message || 'Gagal memuat berkas dokumen dari server.'
    }
  } finally {
    loading.value = false
  }
}

function processRawFile(rawContent) {
  try {
    const cleanStr = rawContent.trim().replace(/[\r\n\t\s]/g, '')
    const isBase64 = /^[A-Za-z0-9+/=]+$/.test(cleanStr) && cleanStr.length > 50

    if (isBase64) {
      const bin = atob(cleanStr)
      const bytes = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) {
        bytes[i] = bin.charCodeAt(i)
      }
      pdfBlob.value = new Blob([bytes], { type: 'application/pdf' })
      return
    }

    rawText.value = rawContent
  } catch {
    rawText.value = rawContent
  }
}

function downloadPdf() {
  if (!pdfBlob.value) return

  const url = URL.createObjectURL(pdfBlob.value)

  if (isIOS.value) {
    // Pada iPhone / iPad, buka tab baru langsung ke PDF engine bawaan Apple
    window.open(url, '_blank')
  } else {
    const link = document.createElement('a')
    link.href = url
    link.download = filename.value || `Hasil_${docId.value}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 3000)
  }
}

async function shareDocument() {
  if (!pdfBlob.value || !navigator.share) return

  try {
    const file = new File([pdfBlob.value], filename.value, { type: 'application/pdf' })
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: docTitle.value,
        text: `Dokumen Hasil ${docTitle.value} - RSUD R.A.A. Tjokronegoro`
      })
    } else {
      await navigator.share({
        title: docTitle.value,
        text: `Dokumen Hasil ${docTitle.value}`
      })
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Share error:', err)
    }
  }
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else if (docType.value === 'resume-medis' || docType.value === 'resume') {
    router.push('/resume-medis')
  } else if (docType.value === 'laboratorium' || docType.value === 'laborat') {
    router.push('/hasil-laboratorium')
  } else {
    router.push('/hasil-radiologi')
  }
}

onMounted(() => {
  fetchAndDecryptDoc()
})
</script>
