<template>
  <div class="max-w-xl mx-auto py-2 sm:py-4 space-y-5" style="animation: fade-in 0.3s ease-out;">
    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-teal-950/10 relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      <div class="relative z-10 space-y-1.5">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md">
          <span>💊 Farmasi RSUD R.A.A. Tjokronegoro</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Cek Antrian Farmasi</h2>
        <p class="text-teal-100/90 text-xs sm:text-sm max-w-md">
          Pantau status antrian penyiapan dan penyerahan resep obat Anda secara real-time.
        </p>
      </div>
    </div>

    <!-- Input NORM (for guest users) -->
    <div
      v-if="!authStore.isAuthenticated"
      class="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-4"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            <path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-800">Masukkan Nomor Rekam Medis</h3>
          <p class="text-xs text-gray-400">Masukkan NORM Anda untuk mengecek status antrian farmasi</p>
        </div>
      </div>

      <form @submit.prevent="fetchAntrian" class="flex gap-2">
        <div class="relative flex-1">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/></svg>
          </div>
          <input
            v-model="normInput"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="Contoh: 72953"
            class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
            :disabled="loading"
          />
        </div>
        <button
          type="submit"
          :disabled="!normInput.trim() || loading"
          class="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm shadow-sm transition-all duration-200 active:scale-95 shrink-0 flex items-center gap-1.5"
        >
          <svg v-if="loading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/></svg>
          <span>{{ loading ? '' : 'Cek' }}</span>
        </button>
      </form>
    </div>

    <!-- Logged-in user auto info -->
    <div
      v-if="authStore.isAuthenticated"
      class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between gap-3"
    >
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
          <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div>
          <p class="text-xs text-gray-400">No. Rekam Medis</p>
          <p class="text-sm font-bold text-gray-800">RM {{ authStore.userName }}</p>
        </div>
      </div>
      <button
        @click="fetchAntrian"
        :disabled="loading"
        class="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
      >
        <svg v-if="loading" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/></svg>
        <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        <span>{{ loading ? 'Memuat...' : 'Refresh' }}</span>
      </button>
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMsg"
      class="p-4 rounded-2xl bg-red-50 border border-red-200/80 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-3"
    >
      <svg class="w-5 h-5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      <span>{{ errorMsg }}</span>
    </div>

    <!-- Result Card -->
    <div
      v-if="antrianData && !errorMsg"
      class="space-y-4"
    >
      <!-- Status Card -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <!-- Status Banner -->
        <div
          class="p-4 sm:p-5 flex items-center gap-3.5"
          :class="statusBannerClass"
        >
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md" :class="statusIconClass">
            <!-- Sudah selesai -->
            <svg v-if="antrianData.status === '3'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <!-- Sedang diproses -->
            <svg v-else-if="antrianData.status === '2'" class="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <!-- Menunggu -->
            <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div>
            <p class="text-xs font-semibold opacity-80">Status Antrian</p>
            <h3 class="text-base sm:text-lg font-extrabold">{{ statusLabel }}</h3>
          </div>
        </div>

        <!-- Detail Grid -->
        <div class="p-5 sm:p-6 space-y-4">
          <!-- NORM Info -->
          <div class="mt-2 p-3 rounded-xl bg-gray-50/60 border border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-400 font-medium">No. Rekam Medis</span>
            <span class="font-bold text-gray-700">{{ antrianData.norm }}</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <!-- Nomor Antrian -->
            <div class="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 text-center space-y-1">
              <p class="text-[11px] font-semibold text-teal-600 uppercase tracking-wider">Nomor Antrian Anda</p>
              <p class="text-3xl sm:text-4xl font-black text-teal-700 tracking-tight">
                {{ antrianData.loket }}-{{ antrianData.nomor }}
              </p>
              <span
                v-if="getLoketType(antrianData.loket)"
                class="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                :class="antrianData.loket === 'A' ? 'bg-teal-100 text-teal-800' : 'bg-purple-100 text-purple-800'"
              >
                {{ getLoketType(antrianData.loket) }}
              </span>
            </div>

            <!-- Panggilan Terakhir -->
            <div class="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center space-y-1">
              <p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Panggilan Terakhir</p>
              <p class="text-3xl sm:text-4xl font-black text-gray-700 tracking-tight">
                {{ antrianData.panggilanTerakhir || '-' }}
              </p>
              <span class="inline-block mt-0.5 text-[11px] text-gray-400 font-medium">
                Sedang Dilayani
              </span>
            </div>
          </div>
          <!-- Additional Info -->
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
              </div>
              <div>
                <p class="text-[10px] text-gray-400 font-medium">Loket Pelayanan</p>
                <p class="text-xs sm:text-sm font-bold text-gray-800">{{ getLoketName(antrianData.loket) }}</p>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <p class="text-[10px] text-gray-400 font-medium">Belum Dipanggil</p>
                <p class="text-xs sm:text-sm font-bold text-gray-800">{{ antrianData.blmDipanggil }} pasien</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Note -->
      <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-800">
        <svg class="w-4 h-4 shrink-0 mt-0.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p class="leading-relaxed">
          Data antrian diperbarui secara berkala. Tekan tombol <strong>Refresh</strong> atau <strong>Cek</strong> untuk memperbarui status terbaru. Harap tetap memantau panggilan langsung di area farmasi.
        </p>
      </div>
    </div>

    <!-- Waiting / No data state -->
    <div
      v-if="waitingMessage && !errorMsg && !antrianData"
      class="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center space-y-4"
    >
      <div class="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div class="space-y-1 max-w-sm">
        <h3 class="text-base font-bold text-gray-800">{{ waitingMessage }}</h3>
        <p class="text-xs text-gray-400">Silakan lakukan refresh secara berkala untuk memperbarui status.</p>
      </div>
      <button
        @click="fetchAntrian"
        :disabled="loading"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm active:scale-95"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        <span>Refresh</span>
      </button>
    </div>

    <!-- Empty state for guest who hasn't searched yet -->
    <div
      v-if="!antrianData && !waitingMessage && !errorMsg && !authStore.isAuthenticated && !hasSearched"
      class="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm space-y-5"
    >
      <div class="text-center flex flex-col items-center justify-center space-y-3">
        <div class="w-16 h-16 rounded-2xl bg-teal-50 text-teal-500 flex items-center justify-center">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19.5 12.572l-7.5 7.428l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"/>
          </svg>
        </div>
        <div class="space-y-1 max-w-sm">
          <h3 class="text-base font-bold text-gray-800">Cek Antrian Obat Anda</h3>
          <p class="text-xs text-gray-400">
            Masukkan Nomor Rekam Medis (NORM) di atas untuk melihat status antrian penyiapan resep obat di instalasi farmasi.
          </p>
        </div>
      </div>

      <!-- Keterangan Loket di Empty State -->
      <div class="grid grid-cols-2 gap-2.5 pt-2 border-t border-gray-100">
        <div class="p-3 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            A
          </div>
          <div class="leading-tight">
            <span class="text-xs font-bold text-teal-900 block">Loket A</span>
            <span class="text-[11px] text-teal-700">Obat Non Racikan</span>
          </div>
        </div>
        <div class="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            B
          </div>
          <div class="leading-tight">
            <span class="text-xs font-bold text-purple-900 block">Loket B</span>
            <span class="text-[11px] text-purple-700">Obat Racikan</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { computed } from 'vue'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const normInput = ref('')
const loading = ref(false)
const errorMsg = ref(null)
const antrianData = ref(null)
const waitingMessage = ref(null)
const hasSearched = ref(false)

function getLoketName(loket) {
  if (!loket) return '-'
  const l = String(loket).trim().toUpperCase()
  if (l === 'A') return 'Loket A (Non Racikan)'
  if (l === 'B') return 'Loket B (Racikan)'
  return `Loket ${loket}`
}

function getLoketType(loket) {
  if (!loket) return ''
  const l = String(loket).trim().toUpperCase()
  if (l === 'A') return 'Non Racikan'
  if (l === 'B') return 'Racikan'
  return ''
}

const statusLabel = computed(() => {
  if (!antrianData.value) return ''
  switch (antrianData.value.status) {
    case '1': return 'Menunggu Disiapkan'
    case '2': return 'Sedang Disiapkan'
    case '3': return 'Obat Siap Diambil'
    default: return 'Menunggu'
  }
})

const statusBannerClass = computed(() => {
  if (!antrianData.value) return ''
  switch (antrianData.value.status) {
    case '3': return 'bg-emerald-50 text-emerald-800'
    case '2': return 'bg-blue-50 text-blue-800'
    default: return 'bg-amber-50 text-amber-800'
  }
})

const statusIconClass = computed(() => {
  if (!antrianData.value) return ''
  switch (antrianData.value.status) {
    case '3': return 'bg-emerald-600 text-white shadow-emerald-600/20'
    case '2': return 'bg-blue-600 text-white shadow-blue-600/20'
    default: return 'bg-amber-500 text-white shadow-amber-500/20'
  }
})

async function fetchAntrian() {
  const norm = authStore.isAuthenticated ? authStore.userName : normInput.value.trim()
  if (!norm) return

  loading.value = true
  errorMsg.value = null
  antrianData.value = null
  waitingMessage.value = null
  hasSearched.value = true

  try {
    const response = await api.get('/publik/antrian-farmasi', { params: { norm } })
    const res = response.data

    if (res.code === '200') {
      // Check if pharmacy has received the prescription
      if (res.data && res.data.loket && res.data.nomor) {
        antrianData.value = res.data
      } else {
        waitingMessage.value = res.message || 'Farmasi belum menerima resep Anda.'
      }
    } else {
      errorMsg.value = res.message || 'Gagal memuat data antrian farmasi.'
    }
  } catch (err) {
    errorMsg.value = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
    console.error('Antrian farmasi error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchAntrian()
  }
})
</script>
