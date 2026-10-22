<template>
  <div class="max-w-4xl mx-auto space-y-5 sm:space-y-6" style="animation: fade-in 0.3s ease-out;">
    <!-- Banner Header -->
    <div class="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-800 rounded-3xl p-4 sm:p-6 text-white shadow-lg shadow-indigo-950/10 relative overflow-hidden">
      <div class="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-lg pointer-events-none"></div>
      
      <div class="relative z-10 flex items-center justify-between gap-3 sm:gap-4">
        <!-- Left: Icon Squircle + Title -->
        <div class="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div class="min-w-0 space-y-0.5">
            <h2 class="text-sm sm:text-lg md:text-xl font-black text-white tracking-tight leading-snug">
              Resume Medis Rawat Inap
            </h2>
            <p class="text-[11px] sm:text-xs text-blue-200/90 font-medium truncate">
              Ringkasan pulang & riwayat perawatan rawat inap pasien
            </p>
          </div>
        </div>

        <!-- Right: Refresh Button -->
        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            @click="handleRefresh"
            :disabled="loading || loadingMore"
            class="px-3 sm:px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold text-xs backdrop-blur-md border border-white/25 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" :class="loading ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            <span class="hidden sm:inline">{{ loading ? 'Memuat...' : 'Refresh' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Initial Loading State -->
    <div v-if="loading" class="py-16 text-center flex flex-col items-center justify-center gap-3 text-gray-400">
      <svg class="w-9 h-9 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
        <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/>
      </svg>
      <span class="text-xs font-semibold">Memuat riwayat resume medis rawat inap...</span>
    </div>

    <!-- Error State -->
    <div
      v-else-if="errorMessage"
      class="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-5 text-center space-y-3"
    >
      <div class="flex items-center justify-center gap-2 font-bold text-sm">
        <svg class="w-5 h-5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>
      <button
        type="button"
        @click="handleRefresh"
        class="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-all active:scale-95 cursor-pointer shadow-sm"
      >
        Coba Lagi
      </button>
    </div>

    <!-- List of Resume Medis Ranap (Infinite Scroll) -->
    <div v-else-if="listRanap.length > 0" class="space-y-3.5">
      <div
        v-for="item in listRanap"
        :key="item.noKunjungan || item.id || item.noRegistrasi || item.NOMOR"
        class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100/90 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <!-- Left: Icon & Detail Info -->
          <div class="flex items-start gap-3.5 flex-1 min-w-0">
            <div class="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 group-hover:bg-blue-100/80 transition-colors">
              <svg class="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>

            <div class="space-y-1.5 flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs sm:text-sm font-bold text-gray-400">No. Daftar:</span>
                <h4 class="text-sm sm:text-base font-extrabold text-blue-700 tracking-tight font-mono">
                  #{{ item.idReg || item.id_reg || item.idRegister || item.noRegistrasi || item.noKunjungan || item.id || item.NOMOR }}
                </h4>
                <span v-if="item.ruangan || item.ruangPerawatan || item.namaRuang" class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 inline-flex items-center">
                  {{ item.ruangan || item.ruangPerawatan || item.namaRuang }}
                </span>
                <span
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold border inline-flex items-center gap-1 shrink-0"
                  :class="hasValidResume(item) ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="hasValidResume(item) ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                  <span>{{ hasValidResume(item) ? 'Resume Selesai' : 'Sedang Dirawat / Proses' }}</span>
                </span>
              </div>

              <!-- DPJP & Tanggal Daftar -->
              <div class="space-y-1 text-xs pt-0.5">
                <!-- DPJP -->
                <div class="flex items-center gap-1.5 text-gray-700">
                  <svg class="w-3.5 h-3.5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span class="text-gray-400 text-[11px]">DPJP:</span>
                  <span class="font-bold text-gray-900 truncate">{{ item.dpjp || item.dokterDpjp || item.namaDokter || item.dokter || '-' }}</span>
                </div>

                <!-- Tanggal Daftar -->
                <div class="flex items-center gap-1.5 text-gray-600 text-[11px]">
                  <svg class="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span class="text-gray-400">Tanggal Daftar:</span>
                  <strong class="text-gray-800 font-semibold">{{ formatDateIndo(item.tglDaftar || item.tanggalDaftar || item.tglMasuk || item.tglKunjungan || item.TANGGAL) }}</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Action Button -->
          <div class="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
            <button
              type="button"
              @click="handleDocAction(item)"
              :disabled="downloadingDocId === (item.idReg || item.id_reg || item.noRegistrasi || item.noKunjungan || item.id || item.NOMOR)"
              class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <svg v-if="downloadingDocId === (item.idReg || item.id_reg || item.noRegistrasi || item.noKunjungan || item.id || item.NOMOR)" class="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/>
              </svg>
              <svg v-else-if="isIOS" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <span>{{ downloadingDocId === (item.idReg || item.id_reg || item.noRegistrasi || item.noKunjungan || item.id || item.NOMOR) ? 'Mengunduh...' : (isIOS ? 'Unduh Resume' : 'Resume Medis') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Infinite Scroll Trigger Element -->
      <div ref="loadMoreTrigger" class="py-3 flex flex-col items-center justify-center text-center">
        <!-- Spinner when loading next page -->
        <div v-if="loadingMore" class="flex items-center gap-2 py-2 text-xs font-semibold text-blue-600">
          <svg class="w-4 h-4 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/>
          </svg>
          <span>Memuat riwayat rawat inap lebih lama...</span>
        </div>

        <!-- End of List message -->
        <div v-else-if="!hasMore && listRanap.length > 0" class="text-[11px] text-gray-400 py-1.5 font-medium flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Semua riwayat rawat inap telah ditampilkan</span>
        </div>
      </div>

      <!-- Info Konfirmasi Layanan -->
      <div class="p-4 sm:p-5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start gap-3.5 text-xs text-blue-900 shadow-sm">
        <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <div class="space-y-0.5">
          <h4 class="font-bold text-blue-950">Informasi Berkas Ringkasan Pulang:</h4>
          <p class="text-blue-800 leading-relaxed">
            Dokumen resume medis rawat inap resmi diterbitkan setelah pasien menyelesaikan proses administrasi kepulangan dan berkas telah ditandatangani oleh DPJP. Jika berkas belum muncul, silakan <strong>konfirmasi ke bagian Rekam Medis RSUD R.A.A. Tjokronegoro</strong>.
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center space-y-4"
    >
      <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </div>
      <div class="space-y-1.5 max-w-md">
        <h3 class="text-base font-bold text-gray-800">Belum Ada Riwayat Rawat Inap</h3>
        <p class="text-xs text-gray-400 leading-relaxed">
          Belum ditemukan riwayat perawatan rawat inap atau dokumen resume medis untuk No. Rekam Medis Anda.
        </p>
      </div>
    </div>

    <!-- Flash Message Toast Notification -->
    <Teleport to="body">
      <transition name="slide-down">
        <div
          v-if="flashMessage.show"
          class="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
        >
          <div
            class="max-w-md w-full rounded-2xl p-4 shadow-xl border flex items-start gap-3 pointer-events-auto backdrop-blur-md transition-all"
            :class="{
              'bg-amber-600 text-white border-amber-500 shadow-amber-900/20': flashMessage.type === 'warning',
              'bg-red-600 text-white border-red-500 shadow-red-900/20': flashMessage.type === 'error',
              'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/20': flashMessage.type === 'success',
              'bg-blue-600 text-white border-blue-500 shadow-blue-900/20': flashMessage.type === 'info'
            }"
          >
            <!-- Icon -->
            <div class="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg v-if="flashMessage.type === 'warning'" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <svg v-else class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 space-y-0.5 text-left">
              <h4 class="text-sm font-extrabold tracking-tight">{{ flashMessage.title }}</h4>
              <p class="text-xs leading-relaxed opacity-95">{{ flashMessage.message }}</p>
            </div>

            <!-- Close Button -->
            <button
              type="button"
              @click="hideFlash"
              class="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0 transition-colors -mr-1 -mt-1 cursor-pointer"
            >
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { directDownloadDocument } from '../utils/directDownload'

const router = useRouter()

const isIOS = computed(() => {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
})

const downloadingDocId = ref(null)
const loading = ref(false)
const loadingMore = ref(false)
const errorMessage = ref('')
const listRanap = ref([])

// Infinite Scroll Pagination State
const page = ref(1)
const pageSize = 10
const hasMore = ref(true)
const loadMoreTrigger = ref(null)
let observer = null

// Flash Message State
const flashMessage = reactive({
  show: false,
  title: '',
  message: '',
  type: 'warning'
})
let flashTimer = null

function showFlash(title, message, type = 'warning') {
  if (flashTimer) clearTimeout(flashTimer)
  flashMessage.title = title
  flashMessage.message = message
  flashMessage.type = type
  flashMessage.show = true

  flashTimer = setTimeout(() => {
    flashMessage.show = false
  }, 5000)
}

function hideFlash() {
  flashMessage.show = false
  if (flashTimer) clearTimeout(flashTimer)
}

function hasValidResume(item) {
  if (item.hasResume === 0 || item.hasResume === '0' || item.hasResume === false || item.statusResume === 0) {
    return false
  }
  return true
}

function formatDateIndo(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr.replace(/-/g, '/'))
    if (isNaN(d.getTime())) return dateStr

    const bulan = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ]

    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`
  } catch {
    return dateStr
  }
}

function getItemTimestamp(item) {
  const dStr = item.tglDaftar || item.tanggalDaftar || item.tglMasuk || item.tglKunjungan || item.TANGGAL || item.MASUK || item.masuk || ''
  if (!dStr) return 0
  const t = new Date(String(dStr).replace(/-/g, '/')).getTime()
  return isNaN(t) ? 0 : t
}

async function fetchListRanap(isInitial = false) {
  if (isInitial) {
    loading.value = true
    errorMessage.value = ''
    page.value = 1
    hasMore.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const response = await api.get('/resume-medis/list-ranap', {
      params: {
        page: page.value,
        pageSize: pageSize
      }
    })
    const res = response.data

    if (res && (res.code === '200' || res.code === 200)) {
      const items = Array.isArray(res.data) ? res.data : []
      if (isInitial) {
        listRanap.value = items
      } else {
        const existingKeys = new Set(listRanap.value.map(i => i.noKunjungan || i.id || i.noRegistrasi || i.NOMOR))
        for (const item of items) {
          const key = item.noKunjungan || item.id || item.noRegistrasi || item.NOMOR
          if (!existingKeys.has(key)) {
            listRanap.value.push(item)
            existingKeys.add(key)
          }
        }
      }

      // Selalu urutkan dari yang terbaru ke yang terlama (DESC)
      listRanap.value.sort((a, b) => getItemTimestamp(b) - getItemTimestamp(a))

      if (items.length < pageSize) {
        hasMore.value = false
      } else if (res.pagination && page.value >= res.pagination.totalPages) {
        hasMore.value = false
      }
    } else if (res && (res.code === '404' || res.code === 404)) {
      if (isInitial) {
        listRanap.value = []
      }
      hasMore.value = false
    } else {
      if (isInitial) {
        errorMessage.value = res?.message || 'Gagal memuat riwayat rawat inap.'
      }
      hasMore.value = false
    }
  } catch (err) {
    if (err.response?.status === 404) {
      if (isInitial) {
        listRanap.value = []
      }
      hasMore.value = false
    } else {
      if (isInitial) {
        errorMessage.value = err.response?.data?.message || 'Terjadi gangguan saat mengambil data resume medis rawat inap.'
      }
    }
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function handleRefresh() {
  fetchListRanap(true)
}

function setupObserver() {
  if (observer) {
    observer.disconnect()
  }

  observer = new IntersectionObserver((entries) => {
    const target = entries[0]
    if (
      target.isIntersecting &&
      hasMore.value &&
      !loading.value &&
      !loadingMore.value &&
      listRanap.value.length > 0
    ) {
      page.value++
      fetchListRanap(false)
    }
  }, {
    rootMargin: '150px',
    threshold: 0.1
  })

  nextTick(() => {
    if (loadMoreTrigger.value) {
      observer.observe(loadMoreTrigger.value)
    }
  })
}

function openResumeFullscreen(item) {
  if (item.hasResume === 0 || item.hasResume === '0' || item.hasResume === false) {
    showFlash(
      'Resume Belum Tersedia',
      'Dokumen resume medis rawat inap belum selesai divalidasi atau pasien masih dalam perawatan. Silakan konfirmasi ke bagian Rekam Medis / Rawat Inap.',
      'warning'
    )
    return
  }

  const docId = item.idReg || item.id_reg || item.noRegistrasi || item.noKunjungan || item.id || item.NOMOR
  if (!docId) return

  router.push({
    name: 'PreviewDokumen',
    params: {
      type: 'resume-medis',
      id: String(docId)
    },
    query: {
      title: `Resume Medis - ${item.ruangan || item.ruangPerawatan || 'Rawat Inap'}`,
      tgl: formatDateIndo(item.tglMasuk || item.tglKunjungan)
    }
  })
}

/**
 * Handle klik tombol resume: Jika iPhone langsung unduh/buka PDF tanpa preview
 */
async function handleDocAction(item) {
  if (item.hasResume === 0 || item.hasResume === '0' || item.hasResume === false) {
    showFlash(
      'Resume Belum Tersedia',
      'Dokumen resume medis rawat inap belum selesai divalidasi atau pasien masih dalam perawatan. Silakan konfirmasi ke bagian Rekam Medis / Rawat Inap.',
      'warning'
    )
    return
  }

  const docId = item.idReg || item.id_reg || item.noRegistrasi || item.noKunjungan || item.id || item.NOMOR
  if (!docId) return

  if (isIOS.value) {
    downloadingDocId.value = docId
    try {
      await directDownloadDocument('resume-medis', docId, `Resume_${item.ruangan || 'Ranap'}`)
    } catch (err) {
      showFlash('Gagal Mengunduh Dokumen', err.message || 'Dokumen resume medis belum tersedia.', 'error')
    } finally {
      downloadingDocId.value = null
    }
  } else {
    openResumeFullscreen(item)
  }
}

onMounted(async () => {
  await fetchListRanap(true)
  setupObserver()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
