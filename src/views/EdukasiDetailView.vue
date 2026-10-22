<template>
  <div class="max-w-3xl mx-auto pb-20" style="animation: fade-in 0.3s ease-out;">
    <!-- Loading State -->
    <div v-if="loading" class="py-20 text-center flex flex-col items-center justify-center gap-2 text-gray-400">
      <svg class="w-10 h-10 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/></svg>
      <span class="text-sm font-semibold">Memuat artikel...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-20 text-center flex flex-col items-center justify-center space-y-4">
      <div class="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <h3 class="text-lg font-bold text-gray-800">{{ error }}</h3>
      <div class="flex gap-3">
        <button @click="fetchEdukasiDetail" class="px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors shadow-sm cursor-pointer">Coba Lagi</button>
        <button @click="$router.push('/edukasi')" class="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors shadow-sm cursor-pointer">Kembali ke Daftar</button>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="artikel" class="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-emerald-900/5 border border-emerald-50">
      <!-- Thumbnail -->
      <div class="w-full relative overflow-hidden" style="height: clamp(220px, 45vw, 480px);">
        <img
          v-if="imgUrl"
          :src="imgUrl"
          :alt="artikel.judul"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          @error="onImgError"
        />
        <!-- Fallback: tampil hanya jika tidak ada gambar -->
        <div
          class="img-fallback absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-indigo-50"
          :style="imgUrl ? 'display:none' : ''"
        >
          <svg class="w-24 h-24 text-emerald-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/><path d="M6 14h6"/></svg>
        </div>
        <!-- Gradient ringan di bawah agar tombol kembali terbaca -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent pointer-events-none"></div>
        <!-- Tombol kembali -->
        <button
          @click="$router.push('/edukasi')"
          class="absolute top-4 left-4 sm:top-6 sm:left-6 px-4 py-2 bg-white/90 hover:bg-white backdrop-blur-md rounded-full text-gray-700 text-sm font-semibold flex items-center gap-2 transition-all duration-200 active:scale-95 border border-white/60 shadow-md cursor-pointer"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Kembali
        </button>
      </div>


      <div class="p-6 sm:p-10 md:p-12 relative">
        <div class="mb-8 space-y-5">
          <!-- Chip Tag -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in parseTags(artikel.tags)"
              :key="tag"
              class="px-3 py-1.5 rounded-xl text-xs font-bold border"
              :class="getTagColorClass(tag)"
            >{{ tag }}</span>
          </div>

          <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight drop-shadow-sm">{{ artikel.judul }}</h1>

          <div class="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-gray-500 pb-6 border-b border-dashed border-gray-200">
            <!-- Tanggal -->
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-500/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {{ formatTglIndo(artikel.create_date) }}
            </span>
            <!-- Penulis — hanya tampil jika create_by ada dan tidak kosong -->
            <span v-if="artikel.create_by" class="flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-500/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {{ artikel.create_by }}
            </span>
            <!-- Counter dilihat (nilai asli dari edukasi-view + optimistic +1 jika counter sukses) -->
            <span class="flex items-center gap-2 text-emerald-600 font-semibold">
              <svg class="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3" fill="#10b981" stroke="none"/></svg>
              {{ counterTampil }} kali dilihat
            </span>

          </div>
        </div>

        <!-- Article Body -->
        <!-- TODO: konfirmasi ke mentor apakah field isi berupa HTML tersanitasi atau plain text -->
        <!-- Saat ini diasumsikan HTML tersanitasi dari backend -->
        <div
          class="article-body"
          v-html="artikel.isi || 'Belum ada konten'"
        ></div>

        <!-- Banner: Diterbitkan oleh Tim Medis -->
        <div class="mt-10 pt-8 border-t border-dashed border-emerald-100">
          <div class="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/80 shadow-sm">
            <!-- Icon Shield / Medical -->
            <div class="flex-shrink-0 w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-200">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <!-- Teks -->
            <div class="flex flex-col gap-1 min-w-0">
              <p class="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Artikel ini diterbitkan oleh Tim Medis
              </p>
              <div class="flex items-center gap-2 mt-0.5">
                <!-- Icon Penulis -->
                <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span class="text-sm font-semibold text-gray-700">
                  {{ artikel.create_by || 'Tim Medis RSUD' }}
                </span>
              </div>
              <p class="text-xs text-gray-400 mt-1 leading-relaxed">
                Konten ini telah ditinjau dan diverifikasi oleh tenaga medis profesional kami untuk memastikan keakuratan informasi kesehatan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { edukasiImgUrl, parseTags, formatTglIndo, getTagColorClass } from '../utils/edukasi'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref(null)
const artikel = ref(null)

// URL gambar yang sudah di-resolve
const imgUrl = computed(() => artikel.value ? edukasiImgUrl(artikel.value.gambar) : '')

// Counter: nilai asli dari API + optimistic +1 jika panggilan counter sukses
const counterAsli = ref(0)
const counterOptimistic = ref(false)
const counterTampil = computed(() => counterAsli.value + (counterOptimistic.value ? 1 : 0))

// Flag agar counter tidak dikirim dua kali untuk slug yang sama
let counterSent = false
let lastCountedSlug = ''

async function fetchEdukasiDetail() {
  // Decode slug dari param route (encodeURIComponent dilakukan di EdukasiView)
  const slug = decodeURIComponent(route.params.id || '')
  if (!slug) {
    error.value = 'Slug artikel tidak valid'
    return
  }

  // Reset state untuk slug baru
  if (slug !== lastCountedSlug) {
    counterSent = false
    counterOptimistic.value = false
  }

  loading.value = true
  error.value = null
  artikel.value = null

  try {
    const response = await api.get('publik/edukasi-view', { params: { slug } })
    const data = response.data

    if (data.code === '200' && data.data) {
      artikel.value = data.data
      counterAsli.value = Number(data.data.counter) || 0

      // Kirim counter tepat satu kali per slug per kunjungan (non-blocking)
      if (!counterSent && slug) {
        counterSent = true
        lastCountedSlug = slug
        kirimCounter(slug)
      }
    } else if (data.code === '404') {
      error.value = 'Artikel tidak ditemukan'
    } else {
      throw new Error(data.message || 'Gagal memuat artikel')
    }
  } catch (err) {
    if (err.response?.status === 404 || err.response?.data?.code === '404') {
      error.value = 'Artikel tidak ditemukan'
    } else {
      error.value = err.message || 'Terjadi kesalahan jaringan. Periksa koneksi Anda.'
    }
  } finally {
    loading.value = false
  }
}

/**
 * Mengirim hitungan kunjungan ke endpoint edukasi-counter.
 * Best-effort: kegagalan hanya dicatat di console, tidak menampilkan error ke pengguna.
 * Pembaruan optimistic: counter tampil +1 HANYA jika endpoint berhasil (code 200).
 * @param {string} slug - Nilai field `id` artikel (bukan route param name)
 */
async function kirimCounter(slug) {
  if (!slug) return
  try {
    const response = await api.get('publik/edukasi-counter', { params: { slug } })
    if (response.data?.code === '200') {
      counterOptimistic.value = true
    }
  } catch (err) {
    console.warn('[Edukasi] Gagal mengirim counter:', err?.message || err)
  }
}

/**
 * Handler @error pada <img> untuk mencegah loop tak berujung.
 */
function onImgError(event) {
  event.target.removeAttribute('src')
  event.target.style.display = 'none'
  const parent = event.target.parentElement
  if (parent) {
    const fallback = parent.querySelector('.img-fallback')
    if (fallback) fallback.style.display = 'flex'
  }
}

// Jika navigasi antar artikel pada komponen yang sama (slug berubah), muat ulang
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchEdukasiDetail()
  }
})

onMounted(() => {
  fetchEdukasiDetail()
})
</script>
