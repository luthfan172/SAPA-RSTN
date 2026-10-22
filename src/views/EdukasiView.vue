<template>
  <div class="max-w-4xl mx-auto space-y-6 pb-20" style="animation: fade-in 0.3s ease-out;">
    <!-- Banner -->
    <div class="bg-gradient-to-br from-teal-500 via-emerald-600 to-teal-800 rounded-[2rem] p-6 sm:p-10 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute right-20 -bottom-20 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl pointer-events-none"></div>
      <div class="relative z-10 flex flex-col sm:flex-row gap-6 items-center sm:items-start justify-between">
        <div class="text-left">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">Edukasi Kesehatan</h2>
          <p class="text-emerald-50 text-sm sm:text-base mt-2 max-w-xl leading-relaxed opacity-90">
            Jelajahi pusat informasi medis, tips pola hidup sehat, dan panduan perawatan terpercaya dari tenaga medis profesional.
          </p>
        </div>
        <div class="hidden sm:flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 shrink-0">
          <svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/><path d="M6 14h6"/></svg>
        </div>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="space-y-4">
      <!-- Search Input -->
      <div class="relative w-full">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari artikel berdasarkan judul, ringkasan, atau tag (misal: otot, gym, sehat)..."
          class="w-full bg-white border border-gray-100 rounded-full py-3.5 pl-12 pr-11 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all shadow-md shadow-gray-100/50 text-gray-700 placeholder-gray-400"
        >
        <!-- Tombol Clear Search -->
        <button
          v-if="searchQuery"
          type="button"
          @click="searchQuery = ''"
          class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
          title="Hapus pencarian"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <!-- Tag Filter Chips — dibangun dinamis dari data API -->
      <div class="flex overflow-x-auto hide-scrollbar gap-2.5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 justify-start">
        <button
          @click="selectTag('Semua')"
          class="px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer"
          :class="selectedTag === 'Semua' ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-emerald-600 hover:border-emerald-200'"
        >
          Semua
        </button>
        <button
          v-for="tag in availableTags"
          :key="tag"
          @click="selectTag(tag)"
          class="px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer"
          :class="selectedTag.toLowerCase() === tag.toLowerCase() ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-emerald-600 hover:border-emerald-200'"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Info Hasil Pencarian & Batasan 10 Artikel -->
      <div
        v-if="isSearching && !loading && !error && filteredArtikel.length > 0"
        class="flex items-center justify-between text-xs text-gray-500 px-1 pt-0.5"
      >
        <div class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>
            Menampilkan <strong class="text-gray-800">{{ filteredArtikel.length }}</strong> artikel untuk
            <span class="font-bold text-emerald-700">"{{ searchQuery.trim() || selectedTag }}"</span>
            <span class="text-gray-400 text-[11px] ml-1">(dibatasi maksimal 10 hasil)</span>
          </span>
        </div>
        <button
          @click="resetSearch"
          class="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline cursor-pointer flex items-center gap-1 shrink-0 ml-2"
        >
          <span>Reset</span>
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-12 text-center flex flex-col items-center justify-center gap-2 text-gray-400">
      <svg class="w-8 h-8 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/></svg>
      <span class="text-xs font-semibold">Memuat artikel...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center space-y-3">
      <p class="text-sm text-red-500 font-medium">{{ error }}</p>
      <button @click="fetchEdukasi" class="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 cursor-pointer">Coba Lagi</button>
    </div>

    <!-- Empty State (API tidak mengembalikan data) -->
    <div v-else-if="artikelList.length === 0" class="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
      <div class="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/><path d="M6 14h6"/></svg>
      </div>
      <h3 class="text-base font-bold text-gray-800">Belum ada artikel edukasi</h3>
    </div>

    <!-- Empty State (Filter/Pencarian Kosong) -->
    <div v-else-if="filteredArtikel.length === 0" class="py-12 text-center text-gray-400 space-y-3">
       <svg class="w-12 h-12 mx-auto text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
       <p class="text-sm font-semibold text-gray-500">Tidak ada artikel yang cocok dengan pencarian</p>
       <p class="text-xs text-gray-400">Coba gunakan kata kunci atau tag lain yang relevan.</p>
       <button @click="resetSearch" class="px-4 py-2 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer inline-block">
         Tampilkan Semua Artikel
       </button>
    </div>

    <!-- Daftar Artikel (Maksimal 3 artikel per halaman) & Navigation Bar -->
    <div v-else class="space-y-6">
      <!-- Grid Kartu Artikel -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="item in paginatedArtikel"
          :key="item.id"
          @click="openArtikel(item)"
          class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col h-full active:scale-[0.98] border border-gray-100"
        >
          <!-- Thumbnail -->
          <div class="h-48 w-full bg-gray-50 relative overflow-hidden shrink-0">
            <img
              v-if="item.imgUrl"
              :src="item.imgUrl"
              :alt="item.judul"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              @error="onImgError($event)"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-200">
              <svg class="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/><path d="M6 14h6"/></svg>
            </div>
            <!-- Counter dilihat (dari field counter di list API) -->
            <div class="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-sm backdrop-blur-md bg-black/30">
              <svg class="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3" fill="#34d399" stroke="none"/></svg>
              <span class="text-emerald-300">{{ item.counter ?? 0 }}</span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5 flex flex-col flex-1">
            <!-- Chip Tag -->
            <div class="flex flex-wrap gap-1.5 mb-3">
              <span
                v-for="tag in parseTags(item.tags)"
                :key="tag"
                @click.stop="selectTag(tag)"
                class="px-2 py-0.5 rounded-lg text-[10px] font-bold border cursor-pointer hover:opacity-80 transition-opacity"
                :class="getTagColorClass(tag)"
                title="Cari berdasarkan tag ini"
              >{{ tag }}</span>
            </div>

            <h3 class="text-base font-extrabold text-gray-800 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">{{ item.judul }}</h3>
            <p class="text-sm text-gray-500 mt-2.5 line-clamp-3 leading-relaxed flex-1">{{ item.ringkasan }}</p>

            <div class="mt-5 pt-4 border-t border-dashed border-gray-100 flex items-center justify-between gap-2 text-xs text-gray-400 font-medium">
              <!-- Tanggal -->
              <span class="flex items-center gap-1.5 shrink-0">
                <svg class="w-4 h-4 text-emerald-500/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ formatTglIndo(item.create_date) }}
              </span>

              <!-- Nama Pembuat Artikel -->
              <span class="flex items-center gap-1.5 min-w-0" :title="item.create_by || 'Admin'">
                <svg class="w-4 h-4 text-emerald-500/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span class="truncate">{{ item.create_by || 'Admin' }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Navigation Bar / Pagination ─── -->
      <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3">
        <!-- Tombol Navigasi Halaman -->
        <nav aria-label="Navigasi Halaman Artikel" class="flex flex-wrap items-center justify-center gap-2">
          <!-- Tombol Halaman Sebelumnya -->
          <button
            type="button"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border"
            :class="currentPage === 1
              ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
              : 'border-gray-200 bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 cursor-pointer shadow-xs active:scale-95'"
            title="Halaman Sebelumnya"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Sebelumnya</span>
          </button>

          <!-- Daftar Nomor Halaman -->
          <div class="flex items-center gap-1.5">
            <template v-for="(p, idx) in visiblePages" :key="idx">
              <!-- Jika Ellipsis -->
              <span
                v-if="p === '...'"
                class="w-9 h-9 flex items-center justify-center text-xs text-gray-400 font-bold select-none"
              >
                …
              </span>

              <!-- Nomor Halaman -->
              <button
                v-else
                type="button"
                @click="goToPage(p)"
                class="w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-95"
                :class="p === currentPage
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'"
                :aria-current="p === currentPage ? 'page' : undefined"
              >
                {{ p }}
              </button>
            </template>
          </div>

          <!-- Tombol Halaman Berikutnya -->
          <button
            type="button"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border"
            :class="currentPage === totalPages
              ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
              : 'border-gray-200 bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 cursor-pointer shadow-xs active:scale-95'"
            title="Halaman Berikutnya"
          >
            <span>Berikutnya</span>
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </nav>

        <!-- Info Halaman & Item -->
        <div class="text-xs text-gray-400 font-medium text-center">
          Menampilkan <span class="font-bold text-gray-700">{{ showingRange }}</span> dari <span class="font-bold text-emerald-600">{{ filteredArtikel.length }}</span> artikel
          <span class="text-gray-300 mx-1.5">•</span>
          Halaman <strong class="text-gray-700">{{ currentPage }}</strong> dari <strong class="text-gray-700">{{ totalPages }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { edukasiImgUrl, parseTags, formatTglIndo, getTagColorClass } from '../utils/edukasi'

const router = useRouter()

const loading = ref(false)
const error = ref(null)
const artikelList = ref([])
const allArticles = ref([]) // Simpan seluruh artikel agar daftar tag master tidak hilang saat filter
const searchQuery = ref('')
const selectedTag = ref('Semua')

// ─── Pagination Configuration ───
// Maksimal 3 artikel per halaman sesuai instruksi
const ARTICLES_PER_PAGE = 3
const currentPage = ref(1)

// Cache create_by agar tidak request berulang kali untuk artikel yang sama
const authorCache = new Map()

async function enrichAuthors(items) {
  if (!items || items.length === 0) return
  items.forEach(async (item) => {
    if (item.create_by) return
    if (authorCache.has(item.id)) {
      item.create_by = authorCache.get(item.id)
      return
    }
    try {
      const res = await api.get('publik/edukasi-view', { params: { slug: item.id } })
      const author = res.data?.data?.create_by || 'Admin'
      authorCache.set(item.id, author)
      item.create_by = author
    } catch {
      item.create_by = 'Admin'
    }
  })
}

// Batas maksimal hasil pencarian (teks atau tag)
const MAX_SEARCH_RESULTS = 10

// Status apakah user sedang mencari (lewat teks atau tag tertentu)
const isSearching = computed(() => {
  return Boolean(searchQuery.value.trim()) || selectedTag.value !== 'Semua'
})

// Tag unik dari seluruh data artikel yang ada di database
const availableTags = computed(() => {
  const seen = new Set()
  const result = []
  const source = allArticles.value.length > 0 ? allArticles.value : artikelList.value
  for (const item of source) {
    for (const tag of parseTags(item.tags)) {
      const lower = tag.toLowerCase()
      if (!seen.has(lower)) {
        seen.add(lower)
        result.push(tag)
      }
    }
  }
  return result
})

// Filter artikel berdasarkan teks dan tag, serta membatasi maksimal 10 artikel saat pencarian aktif
const filteredArtikel = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const activeTag = selectedTag.value.toLowerCase()

  const filtered = artikelList.value.filter(item => {
    const itemTags = parseTags(item.tags)
    const itemTagsLower = itemTags.map(t => t.toLowerCase())

    // 1. Pencarian teks & tag via search bar:
    // Cocok pada judul, ringkasan, atau tag artikel
    const matchSearch = !q ||
      (item.judul || '').toLowerCase().includes(q) ||
      (item.ringkasan || '').toLowerCase().includes(q) ||
      (item.tags || '').toLowerCase().includes(q) ||
      itemTagsLower.some(t => t.includes(q))

    // 2. Pencarian / filter via tag chip:
    // Cocok jika "Semua" ATAU tag artikel mengandung tag yang dipilih
    const matchTag = selectedTag.value === 'Semua' ||
      itemTagsLower.includes(activeTag)

    return matchSearch && matchTag
  })

  // Jika sedang mencari (menggunakan teks atau tag), batasi maksimal 10 yang muncul
  if (isSearching.value) {
    return filtered.slice(0, MAX_SEARCH_RESULTS)
  }

  return filtered
})

// ─── Pagination Computed Properties ───
// Total halaman (minimal 1 jika ada data)
const totalPages = computed(() => {
  if (filteredArtikel.value.length === 0) return 1
  return Math.ceil(filteredArtikel.value.length / ARTICLES_PER_PAGE)
})

// Potongan artikel yang ditampilkan pada halaman aktif (maksimal 3 artikel)
const paginatedArtikel = computed(() => {
  const start = (currentPage.value - 1) * ARTICLES_PER_PAGE
  return filteredArtikel.value.slice(start, start + ARTICLES_PER_PAGE)
})

// Teks rentang artikel yang sedang tampil (misal: "1-3")
const showingRange = computed(() => {
  const total = filteredArtikel.value.length
  if (total === 0) return '0'
  const start = (currentPage.value - 1) * ARTICLES_PER_PAGE + 1
  const end = Math.min(start + ARTICLES_PER_PAGE - 1, total)
  return `${start}-${end}`
})

// List nomor halaman yang ditampilkan pada navigation bar (dengan ellipsis jika banyak halaman)
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = []
  pages.push(1)

  if (current > 3) {
    pages.push('...')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('...')
  }

  pages.push(total)
  return pages
})

/**
 * Pindah ke halaman tertentu
 */
function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function fetchEdukasi() {
  loading.value = true
  error.value = null

  try {
    const q = searchQuery.value.trim()
    const tag = selectedTag.value !== 'Semua' ? selectedTag.value : ''
    const searchTerm = q || tag

    // Jika sedang mencari teks atau tag, batasi pageSize ke 10 sesuai instruksi
    const pageSize = isSearching.value ? MAX_SEARCH_RESULTS : 100

    const response = await api.get('/publik/edukasi-list', {
      params: {
        cari: searchTerm,
        pageSize: pageSize
      }
    })
    const data = response.data
    if (data.code === '200') {
      const mapped = (data.data || []).map(item => ({
        ...item,
        imgUrl: edukasiImgUrl(item.gambar),
        create_by: item.create_by || authorCache.get(item.id) || ''
      }))

      artikelList.value = mapped
      enrichAuthors(artikelList.value)

      // Jika memuat seluruh data awal (tanpa pencarian), simpan sebagai master allArticles
      if (!q && !tag && mapped.length > 0) {
        allArticles.value = mapped
      }
    } else if (data.code === '404') {
      artikelList.value = []
    } else {
      throw new Error(data.message || 'Gagal memuat artikel')
    }
  } catch (err) {
    if (err.response?.status === 404 || err.response?.data?.code === '404') {
      artikelList.value = []
    } else {
      error.value = err.message || 'Terjadi kesalahan jaringan. Periksa koneksi Anda.'
    }
  } finally {
    loading.value = false
  }
}

/**
 * Memilih tag filter dan memicu pencarian tag, serta mereset ke halaman 1
 */
function selectTag(tag) {
  selectedTag.value = tag
  currentPage.value = 1
}

/**
 * Reset pencarian teks dan tag ke kondisi awal, serta mereset ke halaman 1
 */
function resetSearch() {
  searchQuery.value = ''
  selectedTag.value = 'Semua'
  currentPage.value = 1
}

/**
 * Handler @error pada <img> untuk mencegah loop tak berujung.
 */
function onImgError(event) {
  event.target.removeAttribute('src')
  event.target.style.display = 'none'
}

function openArtikel(item) {
  router.push({ name: 'EdukasiDetail', params: { id: encodeURIComponent(item.id) } })
}

// Debounce re-fetch saat user mengetik di search bar & reset ke halaman 1
let searchTimer = null
watch(searchQuery, () => {
  clearTimeout(searchTimer)
  currentPage.value = 1
  searchTimer = setTimeout(() => {
    fetchEdukasi()
  }, 350)
})

// Re-fetch saat tag dipilih
watch(selectedTag, () => {
  fetchEdukasi()
})

// Pastikan jika filter mengubah total halaman sehingga currentPage di luar jangkauan, sesuaikan currentPage
watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal
  }
})

onMounted(() => {
  fetchEdukasi()
})
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
