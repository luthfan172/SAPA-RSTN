<template>
  <div class="max-w-7xl mx-auto space-y-5" style="animation: fade-in 0.3s ease-out;">
    <!-- Page Header Banner -->
    <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-5 sm:p-7 text-white shadow-lg shadow-emerald-950/10 relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">Jadwal Praktik Dokter</h2>
          <p class="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-xl">
            Cek jadwal dokter spesialis rawat jalan pasien umum RSUD R.A.A. Tjokronegoro untuk 7 hari ke depan.
          </p>
        </div>
        <button
          @click="fetchJadwal"
          :disabled="loading"
          class="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs sm:text-sm font-semibold transition-all duration-200 border border-white/20 active:scale-95"
        >
          <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          Segarkan
        </button>
      </div>
    </div>

    <!-- Date Selection (1 Week Window / Hari Ini - 7 Hari Ke Depan) -->
    <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-3.5">
      <!-- 7 Days Quick Selector -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <span class="text-xs sm:text-sm font-bold text-gray-700">Pilih Tanggal Praktik (Maks. 1 Minggu):</span>
          </div>
          
          <!-- Date picker input restricted to [minDate, maxDate] -->
          <div class="flex items-center gap-1.5 text-xs text-gray-500">
            <input
              type="date"
              :min="minDate"
              :max="maxDate"
              v-model="selectedDate"
              @change="onDateInputChange"
              class="px-2.5 py-1 rounded-xl border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-emerald-500 bg-gray-50/70 cursor-pointer"
            />
          </div>
        </div>

        <!-- 7 Days Cards Carousel -->
        <div class="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1 overflow-x-auto scrollbar-none">
          <button
            v-for="day in weekDays"
            :key="day.dateStr"
            @click="selectDate(day.dateStr)"
            class="p-2 sm:p-2.5 rounded-xl text-center flex flex-col items-center justify-center transition-all duration-200 border"
            :class="selectedDate === day.dateStr ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200/50 scale-[1.02]' : 'bg-gray-50/80 hover:bg-emerald-50/50 text-gray-700 border-gray-100 hover:border-emerald-200'"
          >
            <span class="text-[10px] sm:text-xs font-bold leading-tight" :class="selectedDate === day.dateStr ? 'text-white' : (day.isToday ? 'text-emerald-700' : 'text-gray-500')">
              {{ day.label }}
            </span>
            <span class="text-[11px] sm:text-xs font-extrabold mt-0.5" :class="selectedDate === day.dateStr ? 'text-emerald-100' : 'text-gray-800'">
              {{ day.subLabel }}
            </span>
          </button>
        </div>
      </div>

      <!-- Search & Poli Filter -->
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2.5 border-t border-gray-100">
        <!-- Search input -->
        <div class="relative md:col-span-2">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama dokter atau poli..."
            class="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 bg-gray-50/30"
          />
        </div>

        <!-- Poli Select -->
        <div>
          <select
            v-model="selectedPoli"
            class="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-700 focus:outline-none focus:border-emerald-500 bg-gray-50/30"
          >
            <option value="">Semua Poliklinik ({{ jadwalList.length }})</option>
            <option v-for="poli in poliOptions" :key="poli" :value="poli">
              {{ poli }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Active Date Display Info -->
    <div class="flex items-center justify-between px-1 text-xs text-gray-500">
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Menampilkan jadwal untuk: <strong class="text-gray-800">{{ formatDisplayDate(selectedDate) }}</strong></span>
      </div>
      <span class="text-[11px] text-gray-400 hidden sm:inline">Rentang: {{ formatDisplayShort(minDate) }} - {{ formatDisplayShort(maxDate) }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="n in 6" :key="n" class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse space-y-3">
        <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        <div class="h-5 bg-gray-200 rounded w-5/6"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        <div class="h-8 bg-gray-100 rounded-xl mt-4"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-2xl p-8 border border-red-100 shadow-sm text-center max-w-md mx-auto space-y-3">
      <div class="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <p class="text-sm font-semibold text-gray-800">{{ error }}</p>
      <button @click="fetchJadwal" class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors">
        Coba Lagi
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredJadwal.length === 0" class="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center max-w-md mx-auto space-y-3">
      <div class="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
      </div>
      <p class="text-sm font-bold text-gray-700">Tidak Ada Jadwal Dokter</p>
      <p class="text-xs text-gray-400">Tidak ada jadwal praktik dokter pada {{ formatDisplayDate(selectedDate) }} yang sesuai dengan filter atau kata kunci Anda.</p>
    </div>

    <!-- Doctor Cards Grid -->
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in filteredJadwal"
        :key="item.idJadwal"
        class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 group"
      >
        <div class="space-y-2">
          <!-- Poli Badge -->
          <div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold tracking-wide uppercase">
              {{ parsePoli(item.namaDokter) }}
            </span>
          </div>

          <!-- Doctor Name -->
          <div>
            <h3 class="text-sm sm:text-base font-bold text-gray-800 group-hover:text-emerald-700 transition-colors leading-snug">
              {{ parseDoctorName(item.namaDokter) }}
            </h3>
          </div>

          <!-- Jam Pelayanan -->
          <div class="flex items-center gap-2 text-xs text-gray-500 pt-1">
            <svg class="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Jam Praktik: <strong class="text-gray-700">{{ item.jamPelayanan }} WIB</strong></span>
          </div>
        </div>

        <!-- Action Button -->
        <div class="pt-2 border-t border-gray-100/80 flex items-center justify-between gap-2">
          <router-link
            v-if="authStore.isAuthenticated"
            :to="{
              path: '/daftar-online',
              query: {
                tgl: selectedDate,
                idJadwal: item.idJadwal
              }
            }"
            class="w-full py-2 px-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-semibold text-xs transition-all duration-200 text-center flex items-center justify-center gap-1.5"
          >
            <span>Daftar ke Poli Ini</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </router-link>
          <button
            v-else
            type="button"
            @click="openModalPenjamin(item)"
            class="w-full py-2 px-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-emerald-600 hover:text-white font-semibold text-xs transition-all duration-200 text-center flex items-center justify-center gap-1.5 active:scale-[0.99]"
          >
            <span>Masuk untuk Mendaftar</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Pilih Penjamin -->
    <PilihPenjaminModal
      :show="showModalPenjamin"
      :redirect-url="selectedRedirectUrl"
      @close="showModalPenjamin = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import PilihPenjaminModal from '../components/common/PilihPenjaminModal.vue'

const authStore = useAuthStore()
const showModalPenjamin = ref(false)
const selectedRedirectUrl = ref('')

function openModalPenjamin(item) {
  selectedRedirectUrl.value = `/daftar-online?tgl=${selectedDate.value}&idJadwal=${item?.idJadwal || ''}`
  showModalPenjamin.value = true
}

const loading = ref(false)
const error = ref(null)
const jadwalList = ref([])
const searchQuery = ref('')
const selectedPoli = ref('')

// Format date as YYYY-MM-DD
function getFormattedDate(d) {
  const date = new Date(d)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const todayObj = new Date()
const minDate = getFormattedDate(todayObj)

// 7 days window (Today through Today + 6)
const maxDateObj = new Date(todayObj)
maxDateObj.setDate(maxDateObj.getDate() + 6)
const maxDate = getFormattedDate(maxDateObj)

const selectedDate = ref(minDate)

// 7 Days List for quick tab buttons
const weekDays = computed(() => {
  const list = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(todayObj)
    d.setDate(d.getDate() + i)
    const dateStr = getFormattedDate(d)
    
    let label = ''
    if (i === 0) label = 'Hari Ini'
    else if (i === 1) label = 'Besok'
    else {
      label = d.toLocaleDateString('id-ID', { weekday: 'short' })
    }

    const dayNumber = d.getDate()
    const monthShort = d.toLocaleDateString('id-ID', { month: 'short' })

    list.push({
      dateStr,
      label,
      subLabel: `${dayNumber} ${monthShort}`,
      isToday: i === 0
    })
  }
  return list
})

function selectDate(val) {
  if (val < minDate) {
    selectedDate.value = minDate
  } else if (val > maxDate) {
    selectedDate.value = maxDate
  } else {
    selectedDate.value = val
  }
  fetchJadwal()
}

function onDateInputChange() {
  if (!selectedDate.value || selectedDate.value < minDate) {
    selectedDate.value = minDate
  } else if (selectedDate.value > maxDate) {
    selectedDate.value = maxDate
  }
  fetchJadwal()
}

function parsePoli(fullName) {
  if (!fullName) return 'POLI UMUM'
  if (fullName.includes(' - ')) {
    return fullName.split(' - ')[0].trim()
  }
  return 'POLIKLINIK'
}

function parseDoctorName(fullName) {
  if (!fullName) return '-'
  if (fullName.includes(' - ')) {
    const parts = fullName.split(' - ')
    return parts.slice(1).join(' - ').trim()
  }
  return fullName
}

const poliOptions = computed(() => {
  const set = new Set()
  jadwalList.value.forEach(item => {
    const poli = parsePoli(item.namaDokter)
    if (poli) set.add(poli)
  })
  return Array.from(set).sort()
})

const filteredJadwal = computed(() => {
  return jadwalList.value.filter(item => {
    const matchPoli = !selectedPoli.value || parsePoli(item.namaDokter) === selectedPoli.value
    const query = searchQuery.value.toLowerCase().trim()
    const matchSearch = !query || item.namaDokter.toLowerCase().includes(query)
    return matchPoli && matchSearch
  })
})

function formatDisplayDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function formatDisplayShort(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  })
}

async function fetchJadwal() {
  // Validate date range
  if (selectedDate.value < minDate) {
    selectedDate.value = minDate
  } else if (selectedDate.value > maxDate) {
    selectedDate.value = maxDate
  }

  loading.value = true
  error.value = null
  try {
    const response = await api.get('/daftar-umum/list-jadwal', {
      params: { tgl: selectedDate.value }
    })
    if (response.data && response.data.data) {
      jadwalList.value = response.data.data
    } else {
      jadwalList.value = []
    }
  } catch (err) {
    error.value = 'Gagal memuat jadwal dokter. Silakan periksa koneksi atau coba beberapa saat lagi.'
    jadwalList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchJadwal()
})
</script>
