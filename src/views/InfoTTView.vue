<template>
  <div class="max-w-7xl mx-auto space-y-5" style="animation: fade-in 0.3s ease-out;">
    <!-- Page Header Banner -->
    <div class="bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-700 rounded-3xl p-5 sm:p-7 text-white shadow-lg shadow-amber-950/10 relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">Ketersediaan Tempat Tidur</h2>
          <p class="text-amber-100/90 text-xs sm:text-sm mt-1 max-w-xl">
            Informasi ketersediaan tempat tidur rawat inap per ruangan dan kelas perawatan RSUD R.A.A. Tjokronegoro.
          </p>
        </div>
        <button
          @click="fetchInfoTT"
          :disabled="loading"
          class="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs sm:text-sm font-semibold transition-all duration-200 border border-white/20 active:scale-95"
        >
          <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          Segarkan Data
        </button>
      </div>
    </div>

    <!-- Summary Stats KPI Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <div>
          <p class="text-[11px] text-gray-400 font-medium">Bed Kosong</p>
          <p class="text-lg sm:text-xl font-extrabold text-emerald-600 leading-tight">{{ totalKosong }}</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16"/><path d="M2 8h20"/><path d="M22 4v16"/><path d="M2 16h20"/></svg>
        </div>
        <div>
          <p class="text-[11px] text-gray-400 font-medium">Bed Terisi</p>
          <p class="text-lg sm:text-xl font-extrabold text-blue-600 leading-tight">{{ totalIsi }}</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div>
          <p class="text-[11px] text-gray-400 font-medium">Dipesan</p>
          <p class="text-lg sm:text-xl font-extrabold text-amber-600 leading-tight">{{ totalDipesan }}</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
        </div>
        <div>
          <p class="text-[11px] text-gray-400 font-medium">Total Kapasitas</p>
          <p class="text-lg sm:text-xl font-extrabold text-purple-600 leading-tight">{{ totalKapasitas }}</p>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-3">
      <!-- Search Input -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama ruangan bangsal (cth: Kenari, Jalak, ICU, Cendrawasih)..."
          class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-500 bg-gray-50/30"
        />
      </div>

      <!-- Filter Kelas Tabs in Requested Order (VVIP, VIP, Kelas I, Kelas II, Kelas III, ICU, HCU, Isolasi) -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          v-for="k in kelasList"
          :key="k"
          @click="selectedKelas = k"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200"
          :class="selectedKelas === k ? 'bg-amber-600 text-white shadow-sm scale-[1.02]' : 'bg-gray-100/90 text-gray-600 hover:bg-gray-200/80'"
        >
          {{ k }}
        </button>
      </div>
    </div>

    <!-- Active Filter Info -->
    <div class="flex items-center justify-between px-1 text-xs text-gray-500">
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
        <span>
          Menampilkan: <strong class="text-gray-800">{{ selectedKelas === 'Semua' ? 'Semua Kelas Perawatan' : `Kelas ${selectedKelas}` }}</strong>
          ({{ filteredTT.length }} ruangan)
        </span>
      </div>
      <span class="text-[11px] text-gray-400 hidden sm:inline">Urutan: VVIP &rarr; VIP &rarr; Kelas I-III &rarr; Intensif</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="n in 6" :key="n" class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse space-y-3">
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
        <div class="h-6 bg-gray-200 rounded w-1/2"></div>
        <div class="h-12 bg-gray-100 rounded-xl"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-2xl p-8 border border-red-100 shadow-sm text-center max-w-md mx-auto space-y-3">
      <div class="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <p class="text-sm font-semibold text-gray-800">{{ error }}</p>
      <button @click="fetchInfoTT" class="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors">
        Coba Lagi
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredTT.length === 0" class="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center max-w-md mx-auto space-y-3">
      <div class="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
      </div>
      <p class="text-sm font-bold text-gray-700">Data Ruangan Tidak Ditemukan</p>
      <p class="text-xs text-gray-400">Tidak ada ruangan dengan kelas "{{ selectedKelas }}" yang cocok dengan kata kunci pencarian Anda.</p>
    </div>

    <!-- Room Cards Grid -->
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(item, idx) in filteredTT"
        :key="`${item.ruangan}-${item.kelas}-${idx}`"
        class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 space-y-3 group"
      >
        <div class="flex items-start justify-between gap-2">
          <div>
            <h3 class="text-base font-bold text-gray-800 group-hover:text-amber-700 transition-colors leading-tight">
              Ruang {{ item.ruangan }}
            </h3>
            <span
              class="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-md text-[11px] font-bold uppercase tracking-wide"
              :class="getKelasBadgeClass(item.kelas)"
            >
              {{ item.kelas }}
            </span>
          </div>

          <!-- Availability Badge -->
          <span
            class="px-2.5 py-1 rounded-full text-xs font-bold shrink-0"
            :class="item.kosong > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'"
          >
            {{ item.kosong > 0 ? `${item.kosong} Bed Kosong` : 'Penuh' }}
          </span>
        </div>

        <!-- Progress bar kapasitas -->
        <div class="space-y-1">
          <div class="flex items-center justify-between text-[11px] text-gray-400">
            <span>Keterisian: {{ calculatePercent(item) }}%</span>
            <span>Total: {{ (item.isi || 0) + (item.kosong || 0) + (item.dipesan || 0) }} Bed</span>
          </div>
          <div class="w-full h-2 rounded-full bg-gray-100 overflow-hidden flex">
            <div
              class="h-full bg-blue-500 transition-all duration-500"
              :style="{ width: `${calculatePercent(item)}%` }"
              title="Terisi"
            ></div>
            <div
              class="h-full bg-emerald-500 transition-all duration-500"
              :style="{ width: `${100 - calculatePercent(item)}%` }"
              title="Kosong"
            ></div>
          </div>
        </div>

        <!-- Detail counts -->
        <div class="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center text-xs">
          <div class="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <p class="text-[10px] text-emerald-700 font-semibold uppercase">Kosong</p>
            <p class="text-sm font-extrabold text-emerald-800 mt-0.5">{{ item.kosong }}</p>
          </div>
          <div class="p-2 rounded-xl bg-blue-50/70 border border-blue-100">
            <p class="text-[10px] text-blue-700 font-semibold uppercase">Terisi</p>
            <p class="text-sm font-extrabold text-blue-800 mt-0.5">{{ item.isi }}</p>
          </div>
          <div class="p-2 rounded-xl bg-amber-50/70 border border-amber-100">
            <p class="text-[10px] text-amber-700 font-semibold uppercase">Dipesan</p>
            <p class="text-sm font-extrabold text-amber-800 mt-0.5">{{ item.dipesan }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const loading = ref(false)
const error = ref(null)
const ttList = ref([])
const searchQuery = ref('')
const selectedKelas = ref('Semua')

// Strictly ordered: VVIP, VIP, Kelas I, Kelas II, Kelas III, ICU, HCU, Isolasi
const KELAS_ORDER = ['VVIP', 'VIP', 'Kelas I', 'Kelas II', 'Kelas III', 'ICU', 'HCU', 'Isolasi']
const kelasList = ['Semua', ...KELAS_ORDER]

function normalizeKelas(k) {
  return (k || '').trim().toLowerCase()
}

function getKelasPriority(kelas) {
  if (!kelas) return 999
  const normalized = normalizeKelas(kelas)
  const index = KELAS_ORDER.findIndex(k => normalizeKelas(k) === normalized)
  return index !== -1 ? index : 999
}

function getKelasBadgeClass(kelas) {
  const norm = normalizeKelas(kelas)
  switch (norm) {
    case 'vvip':
      return 'bg-purple-100 text-purple-800'
    case 'vip':
      return 'bg-amber-100 text-amber-800'
    case 'kelas i':
      return 'bg-emerald-100 text-emerald-800'
    case 'kelas ii':
      return 'bg-teal-100 text-teal-800'
    case 'kelas iii':
      return 'bg-sky-100 text-sky-800'
    case 'icu':
      return 'bg-rose-100 text-rose-800'
    case 'hcu':
      return 'bg-indigo-100 text-indigo-800'
    case 'isolasi':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-amber-50 text-amber-700'
  }
}

const totalKosong = computed(() => ttList.value.reduce((sum, item) => sum + (Number(item.kosong) || 0), 0))
const totalIsi = computed(() => ttList.value.reduce((sum, item) => sum + (Number(item.isi) || 0), 0))
const totalDipesan = computed(() => ttList.value.reduce((sum, item) => sum + (Number(item.dipesan) || 0), 0))
const totalKapasitas = computed(() => totalKosong.value + totalIsi.value + totalDipesan.value)

function calculatePercent(item) {
  const total = (Number(item.isi) || 0) + (Number(item.kosong) || 0) + (Number(item.dipesan) || 0)
  if (total === 0) return 0
  return Math.round(((Number(item.isi) || 0) / total) * 100)
}

const filteredTT = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  const sel = normalizeKelas(selectedKelas.value)

  return ttList.value
    .filter(item => {
      const itemKelas = normalizeKelas(item.kelas)
      // Exact class match when not 'semua'
      const matchKelas = sel === 'semua' || itemKelas === sel
      const matchSearch = !query ||
        ((item.ruangan || '').toLowerCase().includes(query)) ||
        itemKelas.includes(query)
      return matchKelas && matchSearch
    })
    .sort((a, b) => {
      // 1. Sort by Priority (VVIP, VIP, Kelas I, Kelas II, Kelas III, ICU, HCU, Isolasi)
      const pA = getKelasPriority(a.kelas)
      const pB = getKelasPriority(b.kelas)
      if (pA !== pB) return pA - pB

      // 2. Sort by Ruangan name
      return (a.ruangan || '').localeCompare(b.ruangan || '')
    })
})

async function fetchInfoTT() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/publik/infott')
    if (response.data && response.data.data) {
      ttList.value = response.data.data
    } else {
      ttList.value = []
    }
  } catch (err) {
    error.value = 'Gagal memuat informasi tempat tidur. Silakan coba beberapa saat lagi.'
    ttList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchInfoTT()
})
</script>
