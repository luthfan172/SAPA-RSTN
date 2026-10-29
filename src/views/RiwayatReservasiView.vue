<template>
  <div class="max-w-4xl mx-auto space-y-5 sm:space-y-6" style="animation: fade-in 0.3s ease-out;">
    <!-- Combined Banner & BPJS Info Card -->
    <div class="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 rounded-3xl p-6 sm:p-7 text-white shadow-lg shadow-teal-950/10 relative overflow-hidden space-y-5">
      <!-- Dekorasi background blur -->
      <div class="absolute -right-10 -bottom-10 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute -left-10 -top-10 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl pointer-events-none"></div>

      <!-- Bagian Atas: Judul & Aksi -->
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1.5">
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Riwayat Reservasi Pasien</h2>
          <p class="text-teal-100/90 text-xs sm:text-sm max-w-xl leading-relaxed">
            Daftar riwayat dan tiket bukti pendaftaran poliklinik rawat jalan Anda di RSUD R.A.A. Tjokronegoro.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            @click="fetchReservasi"
            :disabled="loading"
            class="px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all border border-white/20 flex items-center gap-1.5 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <svg class="w-3.5 h-3.5" :class="loading ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            <span>Refresh</span>
          </button>

          <router-link
            to="/daftar-online"
            class="px-4 py-2.5 rounded-2xl bg-white text-emerald-800 font-bold text-xs shadow-md hover:bg-emerald-50 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Daftar Baru</span>
          </router-link>
        </div>
      </div>

      <!-- Bagian Bawah: Informasi BPJS Kesehatan Terintegrasi -->
      <div class="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <!-- Kiri: icon + info rencana kontrol + note -->
        <div class="flex items-start sm:items-center gap-3.5 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-white border border-white/50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 shadow-sm">
            <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="min-w-0">
            <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 border border-white/25 text-[10px] font-bold uppercase tracking-wider mb-1">
              BPJS Kesehatan
            </div>
            <div class="text-[13px] leading-snug">
              <span class="font-semibold text-white/80">Rencana kontrol selanjutnya :</span>
              <span v-if="bpjsLoading" class="text-white/60 italic ml-1 text-xs">Memuat...</span>
              <span v-else-if="bpjsError" class="text-red-200 ml-1 text-xs">
                Gagal memuat
                <button type="button" @click="fetchKontrolBpjs" class="underline font-bold ml-1 cursor-pointer text-white">Coba lagi</button>
              </span>
              <span v-else-if="bpjsKontrol" class="font-extrabold text-white ml-1">
                {{ formatTglIndo(bpjsKontrol.TANGGALKUNJUNGAN) }} &mdash; {{ bpjsKontrol.poli }}
              </span>
              <span v-else class="text-white/60 ml-1 text-xs">Tidak ada rencana kontrol</span>
            </div>
            <!-- Note BPJS -->
            <p class="mt-1.5 text-[11px] leading-relaxed text-yellow-200/95 flex items-center flex-wrap gap-1.5">
              <span class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <strong class="text-yellow-200 font-bold">Perhatian:</strong>
              </span>
              <span>Reservasi kontrol ulang untuk pasien BPJS Kesehatan/JKN dapat langsung dilakukan melalui aplikasi Mobile JKN.</span>
              <a
                :href="mobileJknUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white text-blue-700 font-extrabold text-[11px] shadow-sm hover:bg-blue-50 active:scale-95 transition-all cursor-pointer border border-white/80"
                title="Buka aplikasi Mobile JKN"
              >
                <span>Mobile JKN</span>
                <svg class="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </p>
          </div>
        </div>

        <!-- Kanan: Tombol Detail -->
        <div v-if="bpjsKontrol" class="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            @click="showBpjsDetailModal = true"
            class="px-4 py-2 rounded-xl bg-white text-emerald-800 font-extrabold text-xs hover:bg-emerald-50 active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Lihat Detail</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-12 text-center flex flex-col items-center justify-center gap-2 text-gray-400">
      <svg class="w-8 h-8 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/></svg>
      <span class="text-xs font-semibold">Memuat riwayat reservasi...</span>
    </div>

    <!-- Compact Clean Reservations List -->
    <div v-else-if="reservasiList.length > 0" class="space-y-3.5">
      <div
        v-for="item in reservasiList"
        :key="item.kodeBooking"
        @click="openDetailModal(item)"
        class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100/90 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 cursor-pointer group active:scale-[0.99]"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <!-- Left: Antrian & Basic Info -->
          <div class="flex items-start gap-3.5 flex-1 min-w-0">
            <!-- No Antrian Squircle -->
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-50 border border-teal-100 flex flex-col items-center justify-center shrink-0 group-hover:bg-teal-100/70 transition-colors">
              <span class="text-[9px] font-bold text-teal-600 uppercase tracking-widest leading-none">Antrian</span>
              <strong class="text-xl sm:text-2xl font-black text-teal-800 tracking-tight leading-tight mt-0.5">
                {{ item.NOMOR_ANTRIAN || '-' }}
              </strong>
            </div>

            <!-- Detail Poli, Dokter & Tanggal -->
            <div class="space-y-1.5 flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h4 class="text-sm sm:text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-tight break-words">
                  {{ item.namaPoli || 'Poliklinik Rawat Jalan' }}
                </h4>
                <span
                  v-if="!isExpired(item.TANGGALKUNJUNGAN, item.JAM_PRAKTEK)"
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 inline-flex items-center gap-1 shrink-0"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Aktif</span>
                </span>
                <span
                  v-else
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-500 shrink-0"
                >
                  Selesai
                </span>
              </div>

              <!-- Nama Dokter (Wrap jika panjang) -->
              <p class="text-xs text-gray-700 font-semibold leading-relaxed break-words">
                {{ item.namaDokter || '-' }}
              </p>

              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 pt-0.5">
                <span class="flex items-center gap-1 font-medium text-gray-600">
                  <svg class="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span>{{ formatTglIndo(item.TANGGALKUNJUNGAN) }}</span>
                </span>
                <span class="font-mono text-[11px] text-gray-400">
                  Kode: <strong class="text-gray-700 font-semibold">{{ item.kodeBooking }}</strong>
                </span>
              </div>
            </div>
          </div>

          <!-- Right: Actions & QR Button -->
          <div class="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
            <button
              v-if="canCancel(item.TANGGALKUNJUNGAN)"
              type="button"
              @click.stop="confirmCancel(item)"
              :disabled="cancellingId === item.kodeBooking"
              class="px-2.5 py-1.5 rounded-xl text-red-600 hover:bg-red-50 font-semibold text-xs border border-red-200 transition-all active:scale-95 cursor-pointer"
            >
              <span>{{ cancellingId === item.kodeBooking ? 'Membatalkan...' : 'Batalkan' }}</span>
            </button>

            <!-- Tombol QR Code -->
            <button
              type="button"
              @click.stop="openDetailModal(item)"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
              :class="!isExpired(item.TANGGALKUNJUNGAN, item.JAM_PRAKTEK) ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span>{{ !isExpired(item.TANGGALKUNJUNGAN, item.JAM_PRAKTEK) ? 'QR Code' : 'Detail' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty History Card -->
    <div
      v-else
      class="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center space-y-4"
    >
      <div class="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>
        </svg>
      </div>
      <div class="space-y-1 max-w-sm">
        <h3 class="text-base font-bold text-gray-800">Belum Ada Riwayat Reservasi</h3>
        <p class="text-xs text-gray-400">
          Anda belum memiliki riwayat pendaftaran online rawat jalan aktif.
        </p>
      </div>
      <router-link
        to="/daftar-online"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
      >
        <span>Daftar Kunjungan Sekarang</span>
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </router-link>
    </div>

    <!-- Modal Detail Tiket & QR Code Scanner -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="selectedTicket"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div class="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 text-center" style="animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
            <!-- Modal Header -->
            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
              <div class="text-left">
                <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Tiket Reservasi</span>
                <h3 class="text-base sm:text-lg font-black text-gray-800">Bukti Pendaftaran Rawat Jalan</h3>
              </div>
              <button
                @click="selectedTicket = null"
                class="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <!-- QR Code Section (Hanya jika belum lewat) -->
            <div v-if="!isExpired(selectedTicket.TANGGALKUNJUNGAN, selectedTicket.JAM_PRAKTEK)">
              <BookingBarcode :code="selectedTicket.kodeBooking" />
            </div>
            <div v-else class="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-500 font-medium">
              ⏱️ QR Code tidak tersedia karena waktu kunjungan telah terlewat.
            </div>

            <!-- Ticket details info -->
            <div class="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-left space-y-2.5 text-xs">
              <div class="flex items-center justify-between pb-2 border-b border-emerald-100">
                <span class="text-emerald-800 font-bold">Nomor Antrian:</span>
                <span class="text-2xl font-black text-emerald-700 tracking-wider">{{ selectedTicket.NOMOR_ANTRIAN || '-' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Kode Booking:</span>
                <span class="font-bold text-gray-800 font-mono text-sm">{{ selectedTicket.kodeBooking }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Nama Pasien:</span>
                <span class="font-bold text-gray-800">{{ selectedTicket.NAMA || authStore.namaPasien }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">No. Rekam Medis:</span>
                <span class="font-bold text-gray-800">RM {{ selectedTicket.NORM || authStore.userNorm }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Tanggal Kunjungan:</span>
                <span class="font-bold text-gray-800">{{ formatTglIndo(selectedTicket.TANGGALKUNJUNGAN) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Poliklinik:</span>
                <span class="font-bold text-gray-800">{{ selectedTicket.namaPoli || '-' }}</span>
              </div>
              <div class="flex items-start justify-between gap-2">
                <span class="text-gray-500 shrink-0">Dokter Spesialis:</span>
                <span class="font-bold text-gray-800 text-right flex-1 break-words leading-snug">{{ selectedTicket.namaDokter || '-' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Penjamin:</span>
                <span class="font-bold text-emerald-700">{{ selectedTicket.caraBayar || 'UMUM (Bayar Mandiri)' }}</span>
              </div>
            </div>

            <!-- Ketentuan Kehadiran -->
            <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70 text-left text-xs text-amber-900 space-y-1">
              <p class="font-bold flex items-center gap-1.5 text-amber-800">
                <svg class="w-4 h-4 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>Ketentuan Kehadiran:</span>
              </p>
              <p class="text-[11px] leading-relaxed text-amber-700">
                Pasien diharapkan hadir paling lambat <strong>15 menit sebelum jam operasional pendaftaran ditutup</strong> untuk melakukan konfirmasi di Mesin APM atau Loket Pendaftaran Rawat Jalan.
              </p>
            </div>

            <!-- Close button -->
            <button
              type="button"
              @click="selectedTicket = null"
              class="w-full py-3 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Tutup Tiket
            </button>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Modal Detail Rencana Kontrol BPJS -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="showBpjsDetailModal && bpjsKontrol"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div class="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 text-center" style="animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);">

            <!-- Modal Header -->
            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
              <div class="text-left">
                <span class="text-[10px] font-bold text-blue-600 uppercase tracking-wider">BPJS Kesehatan</span>
                <h3 class="text-base sm:text-lg font-black text-gray-800">Rencana Kontrol</h3>
              </div>
              <button
                @click="showBpjsDetailModal = false"
                class="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <!-- QR Code Section -->
            <div v-if="bpjsQrDataUrl">
              <button
                type="button"
                @click="showBpjsQrFullscreen = true"
                class="mx-auto block p-3 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer group relative"
                title="Tap untuk perbesar QR"
              >
                <img
                  :src="bpjsQrDataUrl"
                  alt="QR Pendaftaran BPJS"
                  class="w-36 h-36 object-contain rounded-lg"
                />
                <div class="absolute inset-0 rounded-2xl bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg class="w-5 h-5 text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                </div>
              </button>
            </div>
            <div v-else-if="!bpjsQrDataUrl" class="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-500 font-medium">
              ⏱️ QR Code tidak tersedia.
            </div>

            <!-- Detail info card -->
            <div class="p-4 sm:p-5 rounded-2xl bg-blue-50/60 border border-blue-100 text-left space-y-2.5 text-xs">
              <!-- Nomor Antrian -->
              <div class="flex items-center justify-between pb-2 border-b border-blue-100">
                <span class="text-blue-800 font-bold">Nomor Antrian:</span>
                <span class="text-2xl font-black text-blue-700 tracking-wider">{{ bpjsKontrol.NOMOR_ANTRIAN }}</span>
              </div>
              <!-- Kode Booking -->
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Kode Booking:</span>
                <span class="font-bold text-gray-800 font-mono text-sm">{{ bpjsKontrol.ID }}</span>
              </div>
              <!-- Tanggal Kontrol -->
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Tanggal Kontrol:</span>
                <span class="font-bold text-gray-800">{{ formatTglIndo(bpjsKontrol.TANGGALKUNJUNGAN) }}</span>
              </div>
              <!-- Estimasi Jam -->
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Estimasi Jam:</span>
                <span class="font-bold text-gray-800">{{ formatJamEstimasi(bpjsKontrol.ESTIMASI_PELAYANAN) }}</span>
              </div>
              <!-- Poliklinik -->
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Poliklinik:</span>
                <span class="font-bold text-gray-800 text-right">{{ bpjsKontrol.poli }}</span>
              </div>
              <!-- Dokter -->
              <div class="flex items-start justify-between gap-2">
                <span class="text-gray-500 shrink-0">Dokter:</span>
                <span class="font-bold text-gray-800 text-right flex-1 break-words leading-snug">{{ bpjsKontrol.namaDokter }}</span>
              </div>
            </div>

            <!-- Info Mobile JKN -->
            <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70 text-left text-xs text-amber-900 space-y-1">
              <p class="font-bold flex items-center gap-1.5 text-amber-800">
                <svg class="w-4 h-4 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>Info Lanjutan:</span>
              </p>
              <p class="text-[11px] leading-relaxed text-amber-700">
                Informasi selengkapnya tersedia di aplikasi
                <a :href="mobileJknUrl" target="_blank" rel="noopener noreferrer" class="underline font-bold text-amber-900 hover:text-amber-950">Mobile JKN</a>
                (<a :href="PLAY_STORE_URL" target="_blank" rel="noopener noreferrer" class="underline font-bold text-amber-800">Play Store</a> /
                <a :href="APP_STORE_URL" target="_blank" rel="noopener noreferrer" class="underline font-bold text-amber-800">App Store</a>).
              </p>
            </div>

            <!-- Tombol Tutup -->
            <button
              type="button"
              @click="showBpjsDetailModal = false"
              class="w-full py-3 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-[0.98]"
            >
              Tutup
            </button>
          </div>
        </div>
      </transition>
    </Teleport>


    <!-- Fullscreen QR BPJS -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="showBpjsQrFullscreen && bpjsQrDataUrl"
          class="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/75 backdrop-blur-md"
          @click="showBpjsQrFullscreen = false"
        >
          <div
            class="flex flex-col items-center gap-4 p-6 rounded-3xl bg-white shadow-2xl max-w-xs w-full"
            style="animation: scale-up 0.25s cubic-bezier(0.16, 1, 0.3, 1);"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between w-full">
              <div>
                <p class="text-[10px] font-bold text-blue-600 uppercase tracking-widest">BPJS Kesehatan</p>
                <h4 class="text-sm font-black text-gray-800">No. Pendaftaran</h4>
              </div>
              <button
                type="button"
                @click="showBpjsQrFullscreen = false"
                class="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer transition-all"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <!-- QR Besar -->
            <div class="p-3 rounded-2xl border-2 border-gray-900 bg-white shadow-inner">
              <img
                :src="bpjsQrDataUrl"
                alt="QR Pendaftaran BPJS Fullscreen"
                class="w-56 h-56 object-contain"
              />
            </div>

            <!-- Kode -->
            <div class="text-center">
              <p class="text-[10px] text-gray-400 font-mono font-semibold uppercase tracking-widest">Kode</p>
              <p class="font-mono text-lg font-black tracking-widest text-gray-900">{{ bpjsKontrol?.ID }}</p>
            </div>

            <button
              type="button"
              @click="showBpjsQrFullscreen = false"
              class="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs transition-all cursor-pointer active:scale-95"
            >
              Tutup
            </button>
          </div>
        </div>
      </transition>
    </Teleport>

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
              'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/20': flashMessage.type === 'success',
              'bg-amber-500 text-white border-amber-400 shadow-amber-900/20': flashMessage.type === 'warning',
              'bg-red-600 text-white border-red-500 shadow-red-900/20': flashMessage.type === 'error',
              'bg-blue-600 text-white border-blue-500 shadow-blue-900/20': flashMessage.type === 'info'
            }"
          >
            <div class="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg v-if="flashMessage.type === 'success'" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <svg v-else-if="flashMessage.type === 'warning'" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <svg v-else class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <div class="flex-1 space-y-0.5 text-left">
              <h4 class="text-sm font-extrabold tracking-tight">{{ flashMessage.title }}</h4>
              <p class="text-xs leading-relaxed opacity-95">{{ flashMessage.message }}</p>
            </div>
            <button
              type="button"
              @click="flashMessage.show = false"
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
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import QRCode from 'qrcode'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import { PLAY_STORE_URL, APP_STORE_URL, getMobileJknUrl } from '../utils/mobileJkn'
import BookingBarcode from '../components/common/BookingBarcode.vue'

const mobileJknUrl = computed(() => getMobileJknUrl())

const authStore = useAuthStore()

const loading = ref(false)
const reservasiList = ref([])
const cancellingId = ref(null)
const selectedTicket = ref(null)

// State rencana kontrol BPJS — terpisah dari state reservasi umum
const bpjsKontrol = ref(null)      // objek data saat berhasil & ada data
const bpjsLoading = ref(true)      // true saat fetch pertama berlangsung
const bpjsError = ref(false)       // true jika request gagal (bukan 'tidak ada data')
const showBpjsDetailModal = ref(false)
const bpjsQrDataUrl = ref('')
const showBpjsQrFullscreen = ref(false)

// Generate QR dari bpjsKontrol.ID saat modal dibuka
watch(showBpjsDetailModal, async (val) => {
  if (val && bpjsKontrol.value?.ID) {
    await nextTick()
    try {
      bpjsQrDataUrl.value = await QRCode.toDataURL(String(bpjsKontrol.value.ID), {
        margin: 1,
        width: 160,
        errorCorrectionLevel: 'H',
        color: { dark: '#1e3a5f', light: '#ffffff' }
      })
    } catch (e) {
      bpjsQrDataUrl.value = ''
      console.warn('BPJS QR generation error:', e)
    }
  } else if (!val) {
    bpjsQrDataUrl.value = ''
  }
})

// Flash Message State
const flashMessage = reactive({
  show: false,
  title: '',
  message: '',
  type: 'success'
})
let flashTimer = null

function showFlash(title, message, type = 'success') {
  if (flashTimer) clearTimeout(flashTimer)
  flashMessage.title = title
  flashMessage.message = message
  flashMessage.type = type
  flashMessage.show = true

  flashTimer = setTimeout(() => {
    flashMessage.show = false
  }, 4500)
}

async function fetchReservasi() {
  loading.value = true
  try {
    const response = await api.get('/daftar-umum/list-reservasi')
    if (response.data?.code === '200' && Array.isArray(response.data.data)) {
      reservasiList.value = response.data.data
    } else {
      reservasiList.value = []
    }
  } catch (err) {
    console.warn('Could not fetch reservasi list:', err)
    reservasiList.value = []
  } finally {
    loading.value = false
  }
}

/**
 * Cek apakah hari dan jam layanan telah terlewat
 */
function isExpired(tglKunjungan, jamPraktek) {
  if (!tglKunjungan) return true
  const now = new Date()

  // Ambil jam selesai jika ada format "08:00 - 12:00"
  let endHour = 23
  let endMinute = 59

  if (jamPraktek && typeof jamPraktek === 'string') {
    const parts = jamPraktek.split('-')
    if (parts.length >= 2) {
      const endPart = parts[1].trim()
      const timeMatch = endPart.match(/(\d{1,2})[:.](\d{2})/)
      if (timeMatch) {
        endHour = parseInt(timeMatch[1], 10)
        endMinute = parseInt(timeMatch[2], 10)
      }
    } else {
      const timeMatch = jamPraktek.match(/(\d{1,2})[:.](\d{2})/)
      if (timeMatch) {
        endHour = parseInt(timeMatch[1], 10) + 1
        endMinute = parseInt(timeMatch[2], 10)
      }
    }
  }

  // Parse YYYY-MM-DD
  const parts = tglKunjungan.split('-').map(Number)
  if (parts.length < 3) return true
  const [year, month, day] = parts
  const serviceEndDateTime = new Date(year, month - 1, day, endHour, endMinute, 59)

  return now > serviceEndDateTime
}

function canCancel(tglKunjungan) {
  if (!tglKunjungan) return false
  const todayStr = new Date().toISOString().split('T')[0]
  return tglKunjungan > todayStr
}

function openDetailModal(item) {
  selectedTicket.value = item
}

async function confirmCancel(item) {
  if (!confirm(`Apakah Anda yakin ingin membatalkan reservasi poli ${item.namaPoli} (Kode: ${item.kodeBooking})?`)) {
    return
  }

  cancellingId.value = item.kodeBooking

  try {
    const params = new URLSearchParams()
    params.append('kodeBooking', item.kodeBooking)

    const response = await api.post('/daftar-umum/batal', params)
    const res = response.data

    if (res.code === '200') {
      showFlash('Berhasil Dibatalkan', 'Reservasi pendaftaran Anda telah berhasil dibatalkan.', 'success')
      fetchReservasi()
    } else {
      showFlash('Gagal Membatalkan', res.message || 'Gagal membatalkan reservasi.', 'error')
    }
  } catch (err) {
    const msg = err.response?.data?.message || 'Terjadi kesalahan saat membatalkan reservasi.'
    showFlash('Terjadi Kesalahan', msg, 'error')
  } finally {
    cancellingId.value = null
  }
}

async function fetchKontrolBpjs() {
  bpjsLoading.value = true
  bpjsError.value = false
  try {
    const response = await api.get('/resume-medis/kontrol-bpjs')
    const code = response.data?.code
    const data = response.data?.data

    // TODO: verifikasi ke mentor bentuk response saat pasien tidak punya rencana kontrol BPJS
    // — saat ini ditangani secara defensif untuk beberapa kemungkinan bentuk
    const tidakAdaData =
      code !== '200' ||
      data === null ||
      data === undefined ||
      (Array.isArray(data) && data.length === 0) ||
      (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0)

    if (code === '200' && !tidakAdaData) {
      // Berhasil & ada data
      bpjsKontrol.value = data
    } else {
      // Berhasil tapi tidak ada data — bukan error, tampil 'Tidak ada rencana kontrol'
      bpjsKontrol.value = null
      bpjsError.value = false
    }
  } catch (err) {
    // Gagal memuat (network error, status bukan 2xx, dsb.) — state ini BERBEDA dari 'tidak ada data'
    console.warn('Gagal memuat rencana kontrol BPJS:', err)
    bpjsKontrol.value = null
    bpjsError.value = true
  } finally {
    bpjsLoading.value = false
  }
}

function formatJamEstimasi(jamStr) {
  if (!jamStr) return '-'
  return jamStr.slice(0, 5) // "09:50:00" -> "09:50"
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

function formatTglSingkat(tglStr) {
  if (!tglStr) return '-'
  try {
    const d = new Date(tglStr)
    if (isNaN(d.getTime())) return tglStr
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  } catch (e) {
    return tglStr
  }
}

onMounted(() => {
  fetchReservasi()
  fetchKontrolBpjs()
})
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
