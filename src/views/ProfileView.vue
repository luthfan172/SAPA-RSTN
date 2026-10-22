<template>
  <div class="max-w-4xl mx-auto space-y-5 sm:space-y-6" style="animation: fade-in 0.3s ease-out;">
    <!-- Profile Header Banner -->
    <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-950/10 relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div class="flex items-center gap-4 sm:gap-5">
          <!-- Avatar Initial -->
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md text-white shrink-0">
            <span class="text-2xl sm:text-3xl font-black">{{ userInitial }}</span>
          </div>

          <div class="space-y-1">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md border border-white/20">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>Pasien Terdaftar</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              {{ authStore.user?.NAMA || ('Pasien RM ' + authStore.userNorm) }}
            </h2>
            <p class="text-xs sm:text-sm text-emerald-100 font-medium flex items-center gap-2">
              <span>No. Rekam Medis:</span>
              <span class="px-2 py-0.5 rounded-md bg-white/20 font-bold tracking-wider">{{ authStore.userNorm }}</span>
            </p>
          </div>
        </div>

        <!-- Refresh Button -->
        <button
          @click="refreshProfile"
          :disabled="loadingProfile"
          class="self-start sm:self-center px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 shrink-0"
        >
          <svg class="w-3.5 h-3.5" :class="loadingProfile ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          <span>{{ loadingProfile ? 'Memuat...' : 'Perbarui Profil' }}</span>
        </button>
      </div>
    </div>

    <!-- Data Detail Pasien -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div class="flex items-center justify-between pb-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-bold text-gray-800">Data Pribadi Pasien</h3>
            <p class="text-xs text-gray-400">Informasi identitas lengkap sesuai database rekam medis RSUD</p>
          </div>
        </div>
      </div>

      <!-- Detail Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Nama Lengkap -->
        <div class="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1">
          <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Nama Lengkap</p>
          <p class="text-sm sm:text-base font-bold text-gray-800">
            {{ authStore.user?.NAMA || '-' }}
          </p>
        </div>

        <!-- No. Rekam Medis -->
        <div class="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
          <p class="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">No. Rekam Medis (NORM)</p>
          <p class="text-sm sm:text-base font-black text-emerald-700 tracking-wider">
            {{ authStore.user?.NORM || '-' }}
          </p>
        </div>

        <!-- NIK / No KTP -->
        <div class="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1">
          <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">NIK / No. KTP</p>
          <p class="text-sm sm:text-base font-bold text-gray-800">
            {{ authStore.user?.noKtp || '-' }}
          </p>
        </div>

        <!-- Tanggal Lahir -->
        <div class="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1">
          <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tanggal Lahir</p>
          <p class="text-sm sm:text-base font-bold text-gray-800">
            {{ formatTgl(authStore.user?.tglLahir || authStore.user?.TANGGAL_LAHIR) }}
          </p>
        </div>

        <!-- Jenis Kelamin -->
        <div class="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1">
          <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Jenis Kelamin</p>
          <p class="text-sm sm:text-base font-bold text-gray-800">
            {{ authStore.user?.jnsKelamin || '-' }}
          </p>
        </div>

        <!-- No HP / Telepon -->
        <div class="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1">
          <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Nomor HP / WhatsApp</p>
          <p class="text-sm sm:text-base font-bold text-gray-800">
            {{ authStore.user?.NOHP || '-' }}
          </p>
        </div>

        <!-- No BPJS / Asuransi -->
        <div class="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1">
          <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">No. Kartu BPJS / JKN</p>
          <p class="text-sm sm:text-base font-bold text-gray-800">
            {{ authStore.user?.noBpjs || '-' }}
          </p>
        </div>
      </div>

      <!-- Alamat Lengkap -->
      <div class="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1">
        <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Alamat Lengkap</p>
        <p class="text-sm sm:text-base font-bold text-gray-800 leading-relaxed">
          {{ authStore.user?.ALAMAT || '-' }}
        </p>
      </div>
    </div>

    <!-- Menu Navigasi Tambahan -->
    <div class="bg-white divide-y divide-gray-100 border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
      <router-link
        to="/riwayat-reservasi"
        class="flex items-center gap-4 px-6 py-4.5 hover:bg-gray-50/80 transition-colors group cursor-pointer"
      >
        <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">Riwayat Reservasi Pasien</p>
          <p class="text-xs text-gray-400">Lihat bukti tiket dan histori pendaftaran rawat jalan</p>
        </div>
        <svg class="w-4 h-4 text-gray-300 group-hover:text-emerald-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </router-link>

      <router-link
        to="/antrian-farmasi"
        class="flex items-center gap-4 px-6 py-4.5 hover:bg-gray-50/80 transition-colors group cursor-pointer"
      >
        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19.5 12.572l-7.5 7.428l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"/></svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">Status Antrian Farmasi</p>
          <p class="text-xs text-gray-400">Pantau penyiapan resep obat Anda di instalasi farmasi</p>
        </div>
        <svg class="w-4 h-4 text-gray-300 group-hover:text-emerald-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </router-link>

      <div class="flex items-center gap-4 px-6 py-4.5">
        <div class="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-bold text-gray-800">SAPA RSTN v1.1.1-20260826</p>
          <p class="text-xs text-gray-400">RSUD R.A.A. Tjokronegoro Purworejo</p>
        </div>
      </div>
    </div>

    <!-- Logout Button -->
    <div class="pt-1">
      <button
        @click="handleLogout"
        class="w-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200/80 py-3.5 px-4 rounded-2xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
      >
        <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span>Keluar dari Akun</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loadingProfile = ref(false)

const userInitial = computed(() => {
  const name = authStore.user?.NAMA
  if (name && name.trim()) {
    return name.trim().charAt(0).toUpperCase()
  }
  const norm = authStore.userNorm
  return norm ? norm.slice(-2) : 'P'
})

function formatTgl(tglStr) {
  if (!tglStr) return '-'
  try {
    const d = new Date(tglStr)
    if (isNaN(d.getTime())) return tglStr
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  } catch (e) {
    return tglStr
  }
}

async function refreshProfile() {
  loadingProfile.value = true
  await authStore.fetchProfile()
  loadingProfile.value = false
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchProfile()
  }
})

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>
