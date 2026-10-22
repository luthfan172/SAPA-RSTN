<template>
  <div class="max-w-4xl mx-auto space-y-5 sm:space-y-6" style="animation: fade-in 0.3s ease-out;">
    <!-- Page Header Banner -->
    <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-950/10 relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      <div class="relative z-10 space-y-1.5">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md border border-white/20">
          <span>🏷️ Pasien Umum (Bayar Mandiri)</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Pendaftaran Rawat Jalan Online</h2>
        <p class="text-emerald-100/90 text-xs sm:text-sm max-w-xl leading-relaxed">
          Reservasi antrian poliklinik spesialis RSUD R.A.A. Tjokronegoro. Pendaftaran dapat dilakukan maksimal 30 hari ke depan.
        </p>
      </div>
    </div>

    <!-- BPJS Notice Card -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div class="space-y-0.5">
            <div class="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
              Informasi Pasien BPJS
            </div>
            <h3 class="text-sm font-bold text-gray-800">Pasien BPJS Kesehatan (JKN / KIS)?</h3>
            <p class="text-xs text-gray-600 leading-relaxed max-w-lg">
              Pendaftaran antrian BPJS Kesehatan dialihkan melalui aplikasi resmi <strong>Mobile JKN</strong>.
            </p>
          </div>
        </div>

        <!-- Store Buttons -->
        <div class="flex items-center gap-2 shrink-0 self-start md:self-center">
          <a
            :href="PLAY_STORE_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <svg class="w-3.5 h-3.5 text-emerald-400 fill-current" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186A2.217 2.217 0 0 1 3 20.627V3.373c0-.616.23-1.185.609-1.559zm1.414-1.414C5.385.154 5.867 0 6.38 0c.691 0 1.343.276 1.85.784l9.199 9.199-3.829 3.829L5.023.4zM5.023 23.6l8.577-8.577 3.829 3.829-9.199 9.199c-.507.508-1.159.784-1.85.784-.513 0-.995-.154-1.357-.4zM18.843 10.592l2.871 2.871c.784.784.784 2.055 0 2.839l-2.871 2.871-3.829-3.829 3.829-3.752z"/>
            </svg>
            <span>Google Play</span>
          </a>

          <a
            :href="APP_STORE_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <svg class="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.64-.78 1.08-1.86.96-2.95-1 .04-2.13.66-2.79 1.44-.59.68-1.1 1.77-.96 2.84 1.12.09 2.18-.59 2.79-1.33z"/>
            </svg>
            <span>App Store</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Booking Form Container -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <!-- Section 1: Data Identitas Pasien & Kontak -->
      <div class="space-y-4">
        <div class="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-800">Identitas Pasien & Kontak WhatsApp</h3>
            <p class="text-xs text-gray-400">Pastikan data kontak benar untuk menerima tiket dan notifikasi</p>
          </div>
        </div>

        <!-- Patient Quick Summary -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-xs">
          <div>
            <span class="text-gray-400 block font-medium">Nama Pasien:</span>
            <strong class="text-gray-800 text-sm block truncate">{{ authStore.user?.NAMA || 'Pasien Umum' }}</strong>
          </div>
          <div>
            <span class="text-gray-400 block font-medium">No. Rekam Medis:</span>
            <strong class="text-emerald-700 text-sm block">RM {{ authStore.userNorm }}</strong>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <span class="text-gray-400 block font-medium">Penjamin Bayar:</span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px] mt-0.5">
              Umum (Mandiri)
            </span>
          </div>
        </div>

        <!-- Nomor WhatsApp Input -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-gray-700">
            Nomor WhatsApp Pasien <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <input
              v-model="form.noWA"
              type="tel"
              inputmode="numeric"
              placeholder="Contoh: 081234567890"
              class="w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-semibold transition-all focus:outline-none focus:ring-2"
              :class="waError ? 'border-red-300 bg-red-50/40 text-red-900 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 bg-gray-50/50 text-gray-800 focus:ring-emerald-500/20 focus:border-emerald-500'"
            />
          </div>

          <!-- WA Warning / Validation Note -->
          <div v-if="waError" class="flex items-center gap-1.5 text-xs text-red-600 font-medium">
            <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{{ waError }}</span>
          </div>
          <p v-else class="text-[11px] text-gray-500 leading-relaxed">
            ℹ️ Nomor diambil dari data profil. Pastikan kebenaran nomor WhatsApp aktif untuk menerima konfirmasi pendaftaran.
          </p>
        </div>
      </div>

      <!-- Section 2: Pilih Tanggal Rencana Kunjungan -->
      <div class="space-y-4 pt-2">
        <div class="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-800">Pilih Tanggal Rencana Kunjungan</h3>
            <p class="text-xs text-gray-400">Pendaftaran dapat dipilih maksimal 30 hari ke depan</p>
          </div>
        </div>

        <div class="space-y-2">
          <div class="relative">
            <input
              v-model="form.tglKunjungan"
              type="date"
              :min="minDate"
              :max="maxDate"
              @input="onDateChange"
              @change="onDateChange"
              class="w-full px-4 py-3 rounded-xl border text-sm font-bold transition-all focus:outline-none focus:ring-2"
              :class="tglError ? 'border-red-300 bg-red-50/40 text-red-900 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 bg-gray-50/50 text-gray-800 focus:ring-emerald-500/20 focus:border-emerald-500'"
            />
          </div>

          <!-- Date Error Alert -->
          <div v-if="tglError" class="flex items-start gap-1.5 text-xs text-red-600 font-semibold leading-tight">
            <svg class="w-4 h-4 shrink-0 text-red-500 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{{ tglError }}</span>
          </div>
          <p v-else class="text-[11px] text-gray-400">
            Rentang tanggal yang dapat dipilih: {{ formatTglIndo(minDate) }} s/d {{ formatTglIndo(maxDate) }}
          </p>
        </div>
      </div>

      <!-- Section 3: Pilih Dokter & Poliklinik Spesialis -->
      <div class="space-y-4 pt-2">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-800">Pilih Poliklinik & Dokter Spesialis</h3>
              <p class="text-xs text-gray-400">Jadwal praktik dokter spesialis pada tanggal {{ formatTglIndo(form.tglKunjungan) }}</p>
            </div>
          </div>

          <button
            v-if="form.tglKunjungan"
            type="button"
            @click="fetchJadwalDokter"
            :disabled="loadingJadwal"
            class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <svg class="w-3.5 h-3.5" :class="loadingJadwal ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            <span>Refresh Jadwal</span>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loadingJadwal" class="py-8 flex flex-col items-center justify-center gap-2 text-gray-400">
          <svg class="w-7 h-7 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/></svg>
          <span class="text-xs font-semibold">Memeriksa ketersediaan jadwal dokter & kuota...</span>
        </div>

        <!-- Empty Schedule / Error Alert -->
        <div v-else-if="jadwalError || (jadwalList.length === 0 && form.tglKunjungan)" class="p-6 rounded-2xl bg-amber-50 border border-amber-200/80 text-center space-y-2">
          <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h4 class="text-sm font-bold text-gray-800">Tidak Ada Jadwal Dokter Tersedia</h4>
          <p class="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
            {{ jadwalError || 'Tidak ada jadwal praktik dokter yang tersedia pada tanggal tersebut (kemungkinan hari libur/Minggu). Silakan pilih tanggal kunjungan lainnya.' }}
          </p>
        </div>

        <!-- Schedule Cards Grid -->
        <div v-else class="space-y-3">
          <!-- Search filter -->
          <div v-if="jadwalList.length > 4" class="relative">
            <input
              v-model="searchDokter"
              type="text"
              placeholder="Cari poli atau nama dokter..."
              class="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>

          <div class="grid sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
            <div
              v-for="item in filteredJadwal"
              :key="item.idJadwal"
              @click="selectJadwal(item)"
              class="p-4 rounded-2xl border-2 transition-all duration-200 relative cursor-pointer group"
              :class="getJadwalCardClass(item)"
            >
              <!-- Selected Badge -->
              <div
                v-if="form.idJadwal === item.idJadwal"
                class="absolute -top-2.5 -right-2 bg-emerald-600 text-white rounded-full p-1 shadow-sm"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>

              <div class="space-y-2">
                <div class="space-y-0.5">
                  <h4 class="text-sm font-bold text-gray-800 group-hover:text-emerald-700 transition-colors leading-snug">
                    {{ item.namaDokter }}
                  </h4>
                  <div class="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg class="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>Jam Pelayanan: {{ item.jamPelayanan }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Error Banner -->
      <div
        v-if="submitError"
        class="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5"
      >
        <svg class="w-5 h-5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>{{ submitError }}</span>
      </div>

      <!-- Action Button -->
      <div class="pt-2">
        <button
          type="button"
          @click="submitReservasi"
          :disabled="!isFormValid || submitting"
          class="w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99]"
          :class="isFormValid && !submitting ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25 cursor-pointer' : 'bg-gray-300 cursor-not-allowed shadow-none'"
        >
          <svg v-if="submitting" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/></svg>
          <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>{{ submitting ? 'Memproses Pendaftaran...' : 'Konfirmasi & Buat Reservasi' }}</span>
        </button>
      </div>
    </div>

    <!-- Flash Message Toast Notification -->
    <Teleport to="body">
      <transition name="slide-down">
        <div
          v-if="flashMessage.show"
          class="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-auto"
        >
          <div
            class="p-4 rounded-2xl shadow-2xl border flex items-start gap-3.5 backdrop-blur-xl transition-all duration-300"
            :class="{
              'bg-amber-500 text-white border-amber-400 shadow-amber-900/20': flashMessage.type === 'warning',
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
              <svg v-else-if="flashMessage.type === 'error'" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <svg v-else class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
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

    <!-- Success Modal / Bukti Reservasi -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="showSuccessModal && successData"
          @click="resetBookingForm"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        >
          <div
            @click.stop
            class="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center relative my-auto"
            style="animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);"
          >
            <!-- Close Button (X) in Top-Right Corner -->
            <button
              type="button"
              @click="resetBookingForm"
              class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-all cursor-pointer z-10 active:scale-95"
              title="Tutup"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <!-- Icon Success -->
            <div class="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/10">
              <svg class="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>

            <div class="space-y-1">
              <div class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Pendaftaran Berhasil
              </div>
              <h3 class="text-xl font-extrabold text-gray-800">Tiket Reservasi Rawat Jalan</h3>
              <p class="text-xs text-gray-500">Simpan bukti reservasi dan tunjukkan saat tiba di rumah sakit</p>
            </div>

            <!-- Barcode -->
            <BookingBarcode :code="successData.kodeBooking" />

            <!-- Ticket Details Card -->
            <div class="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-left space-y-3.5 text-xs">
              <div class="flex items-center justify-between pb-2.5 border-b border-emerald-100">
                <span class="text-emerald-800 font-medium">Nomor Antrian:</span>
                <span class="text-2xl font-black text-emerald-700 tracking-wider">{{ successData.nomorAntrian }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Kode Booking:</span>
                <span class="font-bold text-gray-800 font-mono text-sm">{{ successData.kodeBooking }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Tanggal Kunjungan:</span>
                <span class="font-bold text-gray-800">{{ formatTglIndo(successData.tglKunjungan) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Poli / Dokter:</span>
                <span class="font-bold text-gray-800 text-right truncate max-w-[200px]">{{ successData.namaDokter || selectedDokterName }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Jam Praktek:</span>
                <span class="font-bold text-gray-800">{{ successData.jamPraktek || selectedJam }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Penjamin:</span>
                <span class="font-bold text-emerald-700">UMUM (Bayar Mandiri)</span>
              </div>
            </div>

            <!-- Ketentuan Kedatangan -->
            <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70 text-left text-xs text-amber-900 space-y-1">
              <p class="font-bold flex items-center gap-1.5 text-amber-800">
                <svg class="w-4 h-4 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>Ketentuan Kehadiran:</span>
              </p>
              <p class="text-[11px] leading-relaxed text-amber-700">
                Pasien diharapkan hadir paling lambat <strong>15 menit sebelum jam operasional pendaftaran ditutup</strong> untuk melakukan konfirmasi di Mesin APM atau Loket Pendaftaran Rawat Jalan.
              </p>
            </div>

            <!-- Buttons -->
            <div class="space-y-2 pt-1">
              <router-link
                to="/riwayat-reservasi"
                class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Lihat Riwayat Reservasi</span>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </router-link>
              <button
                type="button"
                @click="resetBookingForm"
                class="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-98 text-gray-700 font-bold text-xs transition-all cursor-pointer"
              >
                Tutup / Selesai
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import { PLAY_STORE_URL, APP_STORE_URL } from '../utils/mobileJkn'
import BookingBarcode from '../components/common/BookingBarcode.vue'

const authStore = useAuthStore()
const route = useRoute()

// Dates Calculation: Today or Tomorrow (if past 9 AM) up to 30 days ahead
const now = new Date()
const formatDate = (d) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Jika sudah lewat jam 09:00 (now.getHours() >= 9), tanggal default dan minimum adalah hari berikutnya (besok)
const defaultStartDate = new Date(now)
if (now.getHours() >= 9) {
  defaultStartDate.setDate(now.getDate() + 1)
}

const minDate = formatDate(defaultStartDate)
const maxDateObj = new Date(now)
maxDateObj.setDate(now.getDate() + 29)
const maxDate = formatDate(maxDateObj)

// Inisialisasi tanggal: utamakan dari query parameter jika ada (kecuali jika hari ini dan sudah lewat jam 9)
const initialDate = (() => {
  if (route.query.tgl && /^\d{4}-\d{2}-\d{2}$/.test(route.query.tgl)) {
    if (route.query.tgl === formatDate(now) && now.getHours() >= 9) {
      return minDate
    }
    return route.query.tgl
  }
  return minDate
})()

// Form State
const form = reactive({
  caraBayar: '1', // 1 = Umum
  noWA: '',
  tglKunjungan: initialDate,
  idJadwal: ''
})

const searchDokter = ref('')
const loadingJadwal = ref(false)
const jadwalList = ref([])
const jadwalError = ref(null)
const submitting = ref(false)
const submitError = ref(null)

const showSuccessModal = ref(false)
const successData = ref(null)
const selectedDokterName = ref('')
const selectedJam = ref('')

// Pre-fill phone number from profile & load initial schedule
onMounted(async () => {
  if (authStore.isAuthenticated) {
    if (!authStore.user?.NOHP && !authStore.user?.noHp) {
      await authStore.fetchProfile()
    }
    const phone = authStore.user?.NOHP || authStore.user?.noHp || authStore.user?.nohp || ''
    form.noWA = phone
  }

  // Notifikasi jika user mencoba memilih hari ini padahal sudah lewat jam 09:00 WIB
  if (route.query.tgl === formatDate(now) && now.getHours() >= 9) {
    showFlash(
      'Pendaftaran Hari Ini Ditutup',
      `Pendaftaran untuk hari ini sudah ditutup setelah pukul 09:00 WIB. Silakan pilih tanggal kunjungan hari berikutnya (${formatTglIndo(minDate)}).`,
      'warning'
    )
  }

  fetchJadwalDokter(route.query.idJadwal)
})

// Sinkronisasi jika query parameter berubah
watch(() => route.query, (newQuery) => {
  if (newQuery.tgl && /^\d{4}-\d{2}-\d{2}$/.test(newQuery.tgl)) {
    if (newQuery.tgl === formatDate(now) && now.getHours() >= 9) {
      form.tglKunjungan = minDate
      showFlash(
        'Pendaftaran Hari Ini Ditutup',
        `Pendaftaran untuk hari ini sudah ditutup setelah pukul 09:00 WIB. Tanggal otomatis dialihkan ke hari berikutnya (${formatTglIndo(minDate)}).`,
        'warning'
      )
    } else {
      form.tglKunjungan = newQuery.tgl
    }
    fetchJadwalDokter(newQuery.idJadwal)
  }
})

// Validation: Indonesian Phone Number Regex
const waError = computed(() => {
  if (!form.noWA) return 'Nomor WhatsApp wajib diisi.'
  const clean = form.noWA.replace(/[\s-]/g, '')
  const indoPhoneRegex = /^(08|628|\+628)[0-9]{8,12}$/
  if (!indoPhoneRegex.test(clean)) {
    return 'Format nomor WhatsApp tidak valid (contoh: 081234567890).'
  }
  return null
})

// Validation: Date Range & Cutoff Regex/Comparison
const tglError = computed(() => {
  if (!form.tglKunjungan) return 'Tanggal kunjungan wajib diisi.'
  
  // Format check YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.tglKunjungan)) {
    return 'Format tanggal tidak valid (YYYY-MM-DD).'
  }

  // Minimum date check
  if (form.tglKunjungan < minDate) {
    if (now.getHours() >= 9 && form.tglKunjungan === formatDate(now)) {
      return `Pendaftaran untuk hari ini sudah ditutup (pukul 09:00 WIB). Silakan pilih hari berikutnya (${formatTglIndo(minDate)}).`
    }
    return `Tanggal kunjungan tidak boleh tanggal lampau (minimal ${formatTglIndo(minDate)}).`
  }

  // Maximum date check
  if (form.tglKunjungan > maxDate) {
    return `Tanggal kunjungan melebihi batas maksimal 30 hari (maksimal ${formatTglIndo(maxDate)}).`
  }

  return null
})

// Form validity
const isFormValid = computed(() => {
  return (
    !waError.value &&
    !tglError.value &&
    form.tglKunjungan &&
    form.idJadwal &&
    !loadingJadwal.value
  )
})

// Filtered Schedule
const filteredJadwal = computed(() => {
  if (!searchDokter.value.trim()) return jadwalList.value
  const q = searchDokter.value.toLowerCase()
  return jadwalList.value.filter(item =>
    item.namaDokter?.toLowerCase().includes(q)
  )
})

function onDateChange() {
  form.idJadwal = ''
  if (now.getHours() >= 9 && form.tglKunjungan === formatDate(now)) {
    form.tglKunjungan = minDate
    showFlash(
      'Pendaftaran Hari Ini Ditutup',
      `Pendaftaran untuk hari ini sudah ditutup setelah pukul 09:00 WIB. Silakan pilih tanggal kunjungan hari berikutnya (${formatTglIndo(minDate)}).`,
      'warning'
    )
    fetchJadwalDokter()
    return
  }

  if (tglError.value) {
    jadwalList.value = []
    jadwalError.value = tglError.value
    showFlash('Tanggal Tidak Valid', tglError.value, 'warning')
    return
  }
  fetchJadwalDokter()
}

async function fetchJadwalDokter(autoSelectId = null) {
  if (!form.tglKunjungan || tglError.value) return
  loadingJadwal.value = true
  jadwalError.value = null
  jadwalList.value = []
  form.idJadwal = ''

  const targetId = autoSelectId || route.query.idJadwal

  try {
    const response = await api.get('/daftar-umum/list-jadwal', {
      params: { tgl: form.tglKunjungan }
    })
    const res = response.data
    if (res.code === '200' && Array.isArray(res.data)) {
      jadwalList.value = res.data

      // Auto-select jika ada idJadwal yang sesuai dari parameter
      if (targetId) {
        const matched = res.data.find(item => String(item.idJadwal) === String(targetId))
        if (matched) {
          selectJadwal(matched)
        }
      }
    } else {
      jadwalError.value = res.message || 'Tidak ada jadwal dokter untuk tanggal ini.'
    }
  } catch (err) {
    jadwalError.value = err.response?.data?.message || 'Gagal memuat jadwal dokter.'
  } finally {
    loadingJadwal.value = false
  }
}

function selectJadwal(item) {
  if (Number(item.sisaKuota) <= 0) {
    showFlash(
      'Kuota Penuh',
      `Kuota pendaftaran untuk ${item.namaDokter} pada tanggal yang dipilih telah habis. Silakan pilih hari atau dokter lainnya.`,
      'warning'
    )
    return
  }
  form.idJadwal = item.idJadwal
  selectedDokterName.value = item.namaDokter
  selectedJam.value = item.jamPelayanan
}

// Flash Message State
const flashMessage = reactive({
  show: false,
  title: '',
  message: '',
  type: 'warning' // 'warning' | 'error' | 'success' | 'info'
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
  }, 4500)
}

function hideFlash() {
  flashMessage.show = false
  if (flashTimer) clearTimeout(flashTimer)
}

function getJadwalCardClass(item) {
  const isHabis = Number(item.sisaKuota) <= 0
  const isSelected = form.idJadwal === item.idJadwal

  if (isHabis) {
    return 'bg-gray-50/70 border-gray-200 opacity-60 cursor-not-allowed'
  }
  if (isSelected) {
    return 'bg-emerald-50/80 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
  }
  return 'bg-white border-gray-200/80 hover:border-emerald-400 hover:bg-emerald-50/20 shadow-sm'
}

function formatTglIndo(tglStr) {
  if (!tglStr) return '-'
  try {
    const d = new Date(tglStr)
    if (isNaN(d.getTime())) return tglStr
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  } catch (e) {
    return tglStr
  }
}

async function submitReservasi() {
  if (!isFormValid.value) return
  submitting.value = true
  submitError.value = null

  try {
    const params = new URLSearchParams()
    params.append('caraBayar', form.caraBayar)
    params.append('noWA', form.noWA.replace(/[\s-]/g, ''))
    params.append('tglKunjungan', form.tglKunjungan)
    params.append('idJadwal', form.idJadwal)

    const response = await api.post('/daftar-umum/add-reservasi', params)
    const res = response.data

    if (res.code === '200' || res.code === 200 || res.status === 200) {
      // Ambil data reservasi resmi yang baru tersimpan dari database agar 100% akurat dan sama persis dengan Riwayat Reservasi
      try {
        const listRes = await api.get('/daftar-umum/list-reservasi')
        if (listRes.data && (listRes.data.code === '200' || listRes.data.code === 200) && Array.isArray(listRes.data.data) && listRes.data.data.length > 0) {
          const latest = listRes.data.data[0]
          successData.value = {
            kodeBooking: latest.kodeBooking || latest.ID,
            nomorAntrian: latest.NOMOR_ANTRIAN || latest.nomorAntrian || res.data?.nomorAntrian || '01',
            tglKunjungan: latest.TANGGALKUNJUNGAN || latest.tglKunjungan || form.tglKunjungan,
            namaPoli: latest.namaPoli || '',
            namaDokter: latest.namaDokter || selectedDokterName.value,
            jamPraktek: latest.JAM_PRAKTEK || latest.jamPraktek || selectedJam.value
          }
        } else if (res.data) {
          successData.value = {
            kodeBooking: res.data.kodeBooking || res.data.id || res.data.ID,
            nomorAntrian: res.data.nomorAntrian || res.data.NOMOR_ANTRIAN || '01',
            tglKunjungan: res.data.tglKunjungan || form.tglKunjungan,
            namaPoli: '',
            namaDokter: selectedDokterName.value,
            jamPraktek: res.data.jamPraktek || selectedJam.value
          }
        }
      } catch (e) {
        if (res.data) {
          successData.value = {
            kodeBooking: res.data.kodeBooking || res.data.id || res.data.ID,
            nomorAntrian: res.data.nomorAntrian || res.data.NOMOR_ANTRIAN,
            tglKunjungan: res.data.tglKunjungan || form.tglKunjungan,
            namaPoli: '',
            namaDokter: selectedDokterName.value,
            jamPraktek: res.data.jamPraktek || selectedJam.value
          }
        }
      }
      showSuccessModal.value = true
    } else {
      submitError.value = res.message || 'Gagal membuat reservasi pendaftaran.'
      showFlash('Gagal Mendaftar', submitError.value, 'error')
    }
  } catch (err) {
    submitError.value = err.response?.data?.message || 'Terjadi kesalahan saat memproses pendaftaran. Silakan coba lagi.'
    showFlash('Terjadi Kesalahan', submitError.value, 'error')
  } finally {
    submitting.value = false
  }
}

function resetBookingForm() {
  showSuccessModal.value = false
  successData.value = null
  form.idJadwal = ''
  fetchJadwalDokter()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translate(-50%, -24px) scale(0.95);
}
</style>
