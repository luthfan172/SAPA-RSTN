<template>
  <div class="max-w-xl mx-auto py-2 sm:py-6 space-y-6" style="animation: fade-in 0.3s ease-out;">
    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-950/10 relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      <div class="relative z-10 space-y-1.5">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md">
          <span>Pendaftaran Rawat Jalan</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Pilih Jenis Penjamin</h2>
        <p class="text-emerald-100/90 text-xs sm:text-sm max-w-md">
          Silakan pilih jenis penjamin layanan kesehatan Anda untuk melanjutkan proses pendaftaran poli.
        </p>
      </div>
    </div>

    <!-- Options Cards -->
    <div class="space-y-4">
      <!-- 1. Pasien UMUM -->
      <div class="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-500/80 shadow-md space-y-4 hover:border-emerald-600 transition-all duration-200">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="flex-1 space-y-1">
            <div class="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold">
              Penjamin Umum / Mandiri
            </div>
            <h3 class="text-lg font-bold text-gray-800">Pasien UMUM (Bayar Mandiri)</h3>
            <p class="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Pendaftaran antrian rawat jalan secara online untuk pasien umum non-BPJS di RSUD R.A.A. Tjokronegoro.
            </p>
          </div>
        </div>

        <router-link
          to="/login"
          class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>Masuk ke Akun Pasien Umum</span>
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </router-link>
      </div>

      <!-- 2. Pasien BPJS Kesehatan -->
      <div class="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 rounded-3xl p-6 sm:p-7 border-2 border-blue-200 shadow-sm space-y-4">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div class="flex-1 space-y-1">
            <div class="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">
              BPJS Kesehatan / JKN / KIS
            </div>
            <h3 class="text-lg font-bold text-gray-800">Pasien BPJS Kesehatan</h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Pendaftaran antrian online untuk peserta <strong>BPJS Kesehatan</strong> dialihkan melalui aplikasi resmi <strong>Mobile JKN</strong>.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2.5 pt-1">
          <a
            :href="PLAY_STORE_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="p-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
          >
            <svg class="w-4.5 h-4.5 text-emerald-400 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186A2.217 2.217 0 0 1 3 20.627V3.373c0-.616.23-1.185.609-1.559zm1.414-1.414C5.385.154 5.867 0 6.38 0c.691 0 1.343.276 1.85.784l9.199 9.199-3.829 3.829L5.023.4zM5.023 23.6l8.577-8.577 3.829 3.829-9.199 9.199c-.507.508-1.159.784-1.85.784-.513 0-.995-.154-1.357-.4zM18.843 10.592l2.871 2.871c.784.784.784 2.055 0 2.839l-2.871 2.871-3.829-3.829 3.829-3.752z"/>
            </svg>
            <div class="text-left leading-none">
              <span class="block text-[9px] text-gray-400">Buka / Download</span>
              <span class="text-xs font-bold text-white">Google Play</span>
            </div>
          </a>

          <a
            :href="APP_STORE_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="p-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
          >
            <svg class="w-4.5 h-4.5 text-white fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.64-.78 1.08-1.86.96-2.95-1 .04-2.13.66-2.79 1.44-.59.68-1.1 1.77-.96 2.84 1.12.09 2.18-.59 2.79-1.33z"/>
            </svg>
            <div class="text-left leading-none">
              <span class="block text-[9px] text-gray-400">Buka / Download</span>
              <span class="text-xs font-bold text-white">App Store</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PLAY_STORE_URL, APP_STORE_URL } from '../../utils/mobileJkn'
</script>

