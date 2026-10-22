<template>
  <div class="max-w-4xl mx-auto space-y-5 sm:space-y-6" style="animation: fade-in 0.3s ease-out;">
    <!-- Banner Header -->
    <div class="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 rounded-3xl p-4 sm:p-6 text-white shadow-lg shadow-indigo-950/10 relative overflow-hidden">
      <div class="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-lg pointer-events-none"></div>
      
      <div class="relative z-10 flex items-center justify-between gap-3 sm:gap-4">
        <!-- Left: Icon Squircle + Title -->
        <div class="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M2 12h3"/><path d="M19 12h3"/><path d="M12 2v3"/><path d="M12 19v3"/>
            </svg>
          </div>
          <div class="min-w-0 space-y-0.5">
            <h2 class="text-sm sm:text-lg md:text-xl font-black text-white tracking-tight leading-snug">
              Hasil Pemeriksaan Radiologi
            </h2>
            <p class="text-[11px] sm:text-xs text-violet-200/90 font-medium truncate">
              Arsip berkas bacaan dokter & citra digital PACS
            </p>
          </div>
        </div>

        <!-- Right: Balanced Refresh Button -->
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
      <svg class="w-9 h-9 animate-spin text-violet-600" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
        <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/>
      </svg>
      <span class="text-xs font-semibold">Memuat riwayat pemeriksaan radiologi...</span>
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

    <!-- List of Radiologi Examinations (Infinite Scroll) -->
    <div v-else-if="listPemeriksaan.length > 0" class="space-y-3.5">
      <div
        v-for="item in listPemeriksaan"
        :key="item.id || item.noKunjungan || item.orderNumber"
        class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100/90 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-200 group"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <!-- Left: Icon & Detail Pemeriksaan -->
          <div class="flex items-start gap-3.5 flex-1 min-w-0">
            <div class="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0 text-violet-600 group-hover:bg-violet-100/80 transition-colors">
              <svg class="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M2 12h3"/><path d="M19 12h3"/><path d="M12 2v3"/><path d="M12 19v3"/>
                <path d="m4.93 4.93 2.12 2.12"/><path d="m16.95 16.95 2.12 2.12"/><path d="m16.95 7.05-2.12 2.12"/><path d="m4.93 19.07 2.12-2.12"/>
              </svg>
            </div>

            <div class="space-y-1.5 flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h4 class="text-sm sm:text-base font-bold text-gray-900 group-hover:text-violet-700 transition-colors leading-tight break-words">
                  {{ item.pemeriksaan || item.pemeriksaanOrder || 'Pemeriksaan Radiologi' }}
                </h4>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 inline-flex items-center gap-1 shrink-0">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Hasil Selesai</span>
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                <span class="flex items-center gap-1 font-medium">
                  <svg class="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>{{ formatDateTimeIndo(item.tglPemeriksaan || item.tglOrder) }}</span>
                </span>
                <span class="font-mono text-[11px] text-gray-400">
                  ID: <strong class="text-gray-700 font-semibold">#{{ item.id || item.noKunjungan }}</strong>
                </span>
              </div>
            </div>
          </div>

          <!-- Right: Action Buttons -->
          <div class="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
            <!-- Tombol Foto Radiologi (Fullscreen Viewer) -->
            <button
              type="button"
              @click="openGambarModal(item)"
              class="px-3.5 py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs border border-violet-200/80 hover:border-violet-300 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
            >
              <svg class="w-4 h-4 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>Foto Radiologi</span>
            </button>

            <!-- Tombol Hasil (Fullscreen Canvas PDF Preview / iOS Direct Download) -->
            <button
              type="button"
              @click="handleDocAction(item)"
              :disabled="downloadingDocId === (item.id || item.ID || item.acsn || item.ACSN || item.noKunjungan || item.NOKUNJUNGAN)"
              class="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-violet-600/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <svg v-if="downloadingDocId === (item.id || item.ID || item.acsn || item.ACSN || item.noKunjungan || item.NOKUNJUNGAN)" class="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
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
              <span>{{ downloadingDocId === (item.id || item.ID || item.acsn || item.ACSN || item.noKunjungan || item.NOKUNJUNGAN) ? 'Mengunduh...' : (isIOS ? 'Unduh Hasil' : 'Hasil') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Infinite Scroll Trigger Element -->
      <div ref="loadMoreTrigger" class="py-3 flex flex-col items-center justify-center text-center">
        <div v-if="loadingMore" class="flex items-center gap-2 py-2 text-xs font-semibold text-violet-600">
          <svg class="w-4 h-4 animate-spin text-violet-600" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/>
          </svg>
          <span>Memuat riwayat lebih lama...</span>
        </div>

        <div v-else-if="!hasMore && listPemeriksaan.length > 0" class="text-[11px] text-gray-400 py-1.5 font-medium flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Semua riwayat pemeriksaan radiologi telah ditampilkan</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center space-y-4"
    >
      <div class="w-16 h-16 rounded-2xl bg-violet-50 text-violet-400 flex items-center justify-center">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M2 12h3"/><path d="M19 12h3"/><path d="M12 2v3"/><path d="M12 19v3"/>
        </svg>
      </div>
      <div class="space-y-1 max-w-sm">
        <h3 class="text-base font-bold text-gray-800">Belum Ada Riwayat Radiologi</h3>
        <p class="text-xs text-gray-400 leading-relaxed">
          Belum ditemukan hasil pemeriksaan atau ekspertise radiologi yang terverifikasi untuk No. Rekam Medis Anda.
        </p>
      </div>
    </div>

    <!-- Modal: Immersive Interactive Mobile DICOM Photo Viewer (Pinch Zoom In/Out + Pan + Swipe) -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="modalGambarOpen"
          class="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md text-white select-none overflow-hidden"
        >
          <!-- Top Header Bar -->
          <div class="px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between gap-3 bg-gradient-to-b from-black/90 to-transparent z-30 shrink-0">
            <div class="min-w-0 space-y-0.5">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {{ currentImage?.modality || 'RADIOLOGI' }}
                </span>
                <span v-if="imageList.length > 0" class="text-xs font-mono font-bold text-gray-300">
                  {{ activeIndex + 1 }} / {{ imageList.length }}
                </span>
              </div>
              <h3 class="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
                {{ currentImage?.seriesDescription || selectedGambarItem?.pemeriksaan || 'Foto Radiologi' }}
              </h3>
            </div>

            <!-- Header Actions -->
            <div class="flex items-center gap-2 shrink-0">
              <!-- Tombol Download Foto Aktif -->
              <a
                v-if="currentImage?.imageUrl"
                :href="currentImage.imageUrl"
                :download="`Radiologi_${selectedGambarItem?.id || 'foto'}_${activeIndex + 1}.jpg`"
                target="_blank"
                class="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Unduh Foto"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span class="hidden sm:inline">Unduh</span>
              </a>

              <!-- Tombol Tutup -->
              <button
                type="button"
                @click="closeGambarModal"
                class="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-rose-600/80 active:scale-95 text-white transition-all cursor-pointer"
                title="Tutup"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Center: Interactive Touch & Zoom Viewport -->
          <div
            ref="viewportContainer"
            class="flex-1 relative flex items-center justify-center overflow-hidden touch-none cursor-grab active:cursor-grabbing"
            @touchstart.passive="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
            @wheel="onWheelZoom"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @mouseleave="onMouseUp"
          >
            <!-- Loading State -->
            <div v-if="loadingGambar" class="text-center space-y-3 p-6 z-10">
              <svg class="w-10 h-10 animate-spin text-violet-500 mx-auto" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/>
              </svg>
              <p class="text-xs text-gray-300 font-semibold">Mengambil citra DICOM dari PACS...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="gambarError" class="text-center max-w-md mx-auto p-6 space-y-4 z-10">
              <div class="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div class="space-y-1.5">
                <h4 class="text-sm font-bold text-amber-300">Foto Tidak Dapat Ditampilkan</h4>
                <p class="text-xs text-gray-300 leading-relaxed">{{ gambarError }}</p>
              </div>
              <button
                type="button"
                @click="closeGambarModal"
                class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <!-- Transformed DICOM Image Container -->
            <div
              v-else-if="imageList.length > 0"
              class="w-full h-full flex items-center justify-center relative select-none"
              :style="containerTransformStyle"
            >
              <img
                :src="currentImage?.imageUrl"
                :alt="currentImage?.seriesDescription || 'Foto Radiologi'"
                class="max-w-full max-h-full object-contain pointer-events-none transition-transform duration-100 ease-out"
                :style="{
                  transform: `scale(${zoomScale}) translate(${panX}px, ${panY}px)`
                }"
                @dblclick="toggleZoom"
              />
            </div>

            <!-- Floating Zoom Toolbar (+ / - / Reset / Scale Badge) -->
            <div
              v-if="imageList.length > 0 && !loadingGambar && !gambarError"
              class="absolute right-4 bottom-20 sm:bottom-24 z-30 flex flex-col items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-2xl"
            >
              <!-- Zoom In Button -->
              <button
                type="button"
                @click.stop="zoomIn"
                :disabled="zoomScale >= 5.0"
                class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer disabled:opacity-30"
                title="Perbesar (Zoom In)"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </button>

              <!-- Zoom Percentage Badge -->
              <span class="text-[10px] font-mono font-bold text-violet-300 px-1 py-0.5">
                {{ Math.round(zoomScale * 100) }}%
              </span>

              <!-- Zoom Out Button -->
              <button
                type="button"
                @click.stop="zoomOut"
                :disabled="zoomScale <= 0.6"
                class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer disabled:opacity-30"
                title="Perkecil (Zoom Out)"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </button>

              <!-- Reset Zoom Button -->
              <button
                v-if="zoomScale !== 1 || panX !== 0 || panY !== 0"
                type="button"
                @click.stop="resetZoom"
                class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer shadow-md"
                title="Reset Ukuran Normal (100%)"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </button>
            </div>

            <!-- Side Navigation Arrows (Desktop / Klik) -->
            <button
              v-if="imageList.length > 1 && activeIndex > 0 && !loadingGambar && !gambarError && zoomScale <= 1.05"
              type="button"
              @click.stop="prevImage"
              class="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 items-center justify-center text-white transition-all active:scale-90 cursor-pointer z-20 shadow-lg"
              title="Foto Sebelumnya"
            >
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            <button
              v-if="imageList.length > 1 && activeIndex < imageList.length - 1 && !loadingGambar && !gambarError && zoomScale <= 1.05"
              type="button"
              @click.stop="nextImage"
              class="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 items-center justify-center text-white transition-all active:scale-90 cursor-pointer z-20 shadow-lg"
              title="Foto Selanjutnya"
            >
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>

          <!-- Bottom Status & Swipe Hint Bar -->
          <div
            v-if="imageList.length > 0 && !loadingGambar && !gambarError"
            class="px-4 py-3 sm:px-6 sm:py-4 flex flex-col items-center justify-center gap-2 bg-gradient-to-t from-black/90 to-transparent z-30 shrink-0"
          >
            <!-- Dot Indicators -->
            <div v-if="imageList.length > 1 && imageList.length <= 10" class="flex items-center gap-1.5">
              <button
                v-for="(_, idx) in imageList"
                :key="idx"
                type="button"
                @click="goToImage(idx)"
                class="transition-all rounded-full cursor-pointer"
                :class="activeIndex === idx ? 'w-5 h-1.5 bg-violet-400' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'"
                :aria-label="`Buka foto ke-${idx + 1}`"
              />
            </div>

            <!-- Interactive Gesture Hint -->
            <div class="flex items-center gap-2 text-[11px] text-gray-400 font-medium tracking-wide">
              <span v-if="zoomScale > 1.05" class="flex items-center gap-1 text-violet-300">
                <span>👆</span> Geser untuk melihat area foto • Cubit untuk zoom out
              </span>
              <span v-else-if="imageList.length > 1" class="flex items-center gap-1">
                <span>👈</span> Geser layar untuk foto lain • Cubit 2 jari untuk zoom <span>👉</span>
              </span>
              <span v-else>
                Cubit 2 jari / ketuk 2x untuk memperbesar foto
              </span>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
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
const listPemeriksaan = ref([])

// Infinite Scroll State
const page = ref(1)
const pageSize = 10
const hasMore = ref(true)
const loadMoreTrigger = ref(null)
let observer = null

// State Modal Swipe & Zoom Foto DICOM
const modalGambarOpen = ref(false)
const loadingGambar = ref(false)
const gambarError = ref('')
const selectedGambarItem = ref(null)
const imageList = ref([])
const activeIndex = ref(0)

// Interactive Zoom & Pan State
const zoomScale = ref(1)
const panX = ref(0)
const panY = ref(0)
const viewportContainer = ref(null)

// Touch Gesture State
let touchStartX = 0
let touchStartY = 0
let touchStartTime = 0
let initialPinchDistance = 0
let initialPinchScale = 1
const swipeOffsetX = ref(0)
const isSwiping = ref(false)
let isPanning = false
let panStartX = 0
let panStartY = 0

// Mouse Drag State (PC)
let isMouseDown = false
let mouseStartX = 0
let mouseStartY = 0

const currentImage = computed(() => {
  if (imageList.value.length > 0 && activeIndex.value >= 0 && activeIndex.value < imageList.value.length) {
    return imageList.value[activeIndex.value]
  }
  return null
})

const containerTransformStyle = computed(() => {
  if (zoomScale.value <= 1.05) {
    return {
      transform: `translateX(${swipeOffsetX.value}px)`,
      transition: isSwiping.value ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
    }
  }
  return {
    transform: 'none'
  }
})

function getItemTimestamp(item) {
  const dStr = item.tglPemeriksaan || item.tglOrder || item.TGLPEMERIKSAAN || item.MASUK || item.masuk || item.tgl || ''
  if (!dStr) return 0
  const t = new Date(String(dStr).replace(/-/g, '/')).getTime()
  return isNaN(t) ? 0 : t
}

/**
 * Mengambil daftar pemeriksaan radiologi pasien
 * Endpoint: GET /hasil-radiologi/list-pemeriksaan (params: page, pageSize)
 */
async function fetchListPemeriksaan(isInitial = false) {
  if (isInitial) {
    loading.value = true
    errorMessage.value = ''
    page.value = 1
    hasMore.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const response = await api.get('/hasil-radiologi/list-pemeriksaan', {
      params: {
        page: page.value,
        pageSize: pageSize
      }
    })
    const res = response.data

    if (res && (res.code === '200' || res.code === 200)) {
      const rawItems = Array.isArray(res.data) ? res.data : []
      // Filter hanya data yang memiliki ID valid (tidak kosong, null, atau undefined)
      const items = rawItems.filter(item => {
        const id = item?.id ?? item?.ID ?? item?.acsn ?? item?.ACSN ?? item?.noKunjungan
        return id !== null && id !== undefined && String(id).trim() !== ''
      })

      if (isInitial) {
        listPemeriksaan.value = items
      } else {
        const existingKeys = new Set(listPemeriksaan.value.map(i => i.id || i.noKunjungan))
        for (const item of items) {
          const key = item.id || item.noKunjungan
          if (!existingKeys.has(key)) {
            listPemeriksaan.value.push(item)
            existingKeys.add(key)
          }
        }
      }

      // Selalu urutkan dari yang terbaru ke yang terlama (DESC)
      listPemeriksaan.value.sort((a, b) => getItemTimestamp(b) - getItemTimestamp(a))

      if (items.length < pageSize) {
        hasMore.value = false
      } else if (res.pagination && page.value >= res.pagination.totalPages) {
        hasMore.value = false
      }
    } else if (res && (res.code === '404' || res.code === 404)) {
      if (isInitial) {
        listPemeriksaan.value = []
      }
      hasMore.value = false
    } else {
      if (isInitial) {
        errorMessage.value = res?.message || 'Gagal memuat riwayat radiologi.'
      }
      hasMore.value = false
    }
  } catch (err) {
    if (err.response?.status === 404) {
      if (isInitial) {
        listPemeriksaan.value = []
      }
      hasMore.value = false
    } else {
      if (isInitial) {
        errorMessage.value = err.response?.data?.message || 'Terjadi gangguan saat mengambil data radiologi. Silakan coba kembali.'
      }
    }
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function handleRefresh() {
  fetchListPemeriksaan(true)
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
      listPemeriksaan.value.length > 0
    ) {
      page.value++
      fetchListPemeriksaan(false)
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

/**
 * Membuka Halaman Preview PDF Fullscreen Tersendiri
 */
function openBacaanFullscreen(item) {
  const docId = item.id || item.ID || item.acsn || item.ACSN || item.noKunjungan || item.NOKUNJUNGAN
  if (!docId) return

  router.push({
    name: 'PreviewDokumen',
    params: {
      type: 'radiologi',
      id: String(docId)
    },
    query: {
      title: item.pemeriksaan || item.PEMERIKSAAN || item.pemeriksaanOrder || 'Hasil Pemeriksaan Radiologi',
      tgl: formatDateTimeIndo(item.tglPemeriksaan || item.TGLPEMERIKSAAN || item.tglOrder)
    }
  })
}

/**
 * Handle klik tombol hasil: Jika iPhone langsung unduh/buka PDF tanpa preview
 */
async function handleDocAction(item) {
  const docId = item.id || item.ID || item.acsn || item.ACSN || item.noKunjungan || item.NOKUNJUNGAN
  if (!docId) return

  if (isIOS.value) {
    downloadingDocId.value = docId
    try {
      await directDownloadDocument('radiologi', docId, item.pemeriksaan || 'Hasil_Radiologi')
    } catch (err) {
      alert(err.message || 'Gagal mengunduh dokumen hasil radiologi.')
    } finally {
      downloadingDocId.value = null
    }
  } else {
    openBacaanFullscreen(item)
  }
}

/**
 * Membuka Modal Galeri Swipe Foto Radiologi (Mobile Gestures & Zoom Engine)
 */
async function openGambarModal(item) {
  selectedGambarItem.value = item
  modalGambarOpen.value = true
  loadingGambar.value = true
  gambarError.value = ''
  imageList.value = []
  activeIndex.value = 0
  resetZoom()

  const docId = item.id || item.ID || item.acsn || item.ACSN || item.noKunjungan || item.NOKUNJUNGAN

  try {
    const response = await api.get('/hasil-radiologi/list-gambar', {
      params: { acsn: docId }
    })
    const res = response.data

    if (res && (res.code === '200' || res.code === 200) && res.data) {
      const rawData = res.data
      const flatImages = []

      if (Array.isArray(rawData)) {
        for (const img of rawData) {
          if (typeof img === 'string') {
            flatImages.push({
              imageUrl: img,
              seriesDescription: item.pemeriksaan || 'Foto Radiologi'
            })
          } else if (img && img.imageUrl) {
            flatImages.push({
              imageUrl: img.imageUrl,
              seriesDescription: img.seriesDescription || item.pemeriksaan || 'Foto Radiologi',
              instanceNumber: img.instanceNumber
            })
          }
        }
      } else if (rawData && Array.isArray(rawData.imageUrl)) {
        // Format array URL string dari server 194.169.46.193
        rawData.imageUrl.forEach((url, idx) => {
          if (url) {
            flatImages.push({
              imageUrl: url,
              seriesDescription: `${item.pemeriksaan || 'Foto Radiologi'} (${idx + 1}/${rawData.imageUrl.length})`,
              instanceNumber: idx + 1
            })
          }
        })
      } else if (Array.isArray(rawData.series)) {
        for (const s of rawData.series) {
          if (Array.isArray(s.instances)) {
            for (const inst of s.instances) {
              flatImages.push({
                imageUrl: inst.imageUrl,
                seriesDescription: s.seriesDescription || item.pemeriksaan || 'Foto Radiologi',
                instanceNumber: inst.instanceNumber
              })
            }
          }
        }
      }

      if (flatImages.length > 0) {
        imageList.value = flatImages
      } else {
        gambarError.value = res.message || 'Pemeriksaan ini tidak memiliki citra foto atau melebihi 10 citra per series.'
      }
    } else {
      gambarError.value = res?.message || 'Foto citra radiologi tidak ditemukan atau belum dikirim ke server PACS.'
    }
  } catch (err) {
    gambarError.value = err.response?.data?.message || 'Gagal memuat citra radiologi dari server PACS.'
  } finally {
    loadingGambar.value = false
  }
}

function closeGambarModal() {
  modalGambarOpen.value = false
  selectedGambarItem.value = null
  imageList.value = []
  activeIndex.value = 0
  resetZoom()
}

/**
 * Zoom In, Zoom Out, and Reset Engine
 */
function zoomIn() {
  zoomScale.value = Math.min(5.0, Math.round((zoomScale.value + 0.5) * 10) / 10)
}

function zoomOut() {
  zoomScale.value = Math.max(0.6, Math.round((zoomScale.value - 0.5) * 10) / 10)
  if (zoomScale.value <= 1) {
    panX.value = 0
    panY.value = 0
  }
}

function resetZoom() {
  zoomScale.value = 1
  panX.value = 0
  panY.value = 0
  swipeOffsetX.value = 0
  isSwiping.value = false
  isPanning = false
}

function toggleZoom() {
  if (zoomScale.value > 1.2) {
    resetZoom()
  } else {
    zoomScale.value = 2.5
  }
}

function onWheelZoom(e) {
  e.preventDefault()
  if (e.deltaY < 0) {
    zoomScale.value = Math.min(5.0, Math.round((zoomScale.value + 0.25) * 100) / 100)
  } else {
    zoomScale.value = Math.max(0.6, Math.round((zoomScale.value - 0.25) * 100) / 100)
    if (zoomScale.value <= 1) {
      panX.value = 0
      panY.value = 0
    }
  }
}

/**
 * Touch Gesture Handlers (Pinch Zoom + Pan + Swipe)
 */
function onTouchStart(e) {
  if (e.touches.length === 2) {
    // 2 Jari = Pinch to Zoom
    isSwiping.value = false
    isPanning = false
    const x1 = e.touches[0].clientX
    const y1 = e.touches[0].clientY
    const x2 = e.touches[1].clientX
    const y2 = e.touches[1].clientY
    initialPinchDistance = Math.hypot(x2 - x1, y2 - y1)
    initialPinchScale = zoomScale.value
  } else if (e.touches.length === 1) {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
    touchStartTime = Date.now()

    if (zoomScale.value > 1.05) {
      // Sedang di-zoom -> Pan/Geser area foto
      isPanning = true
      panStartX = touchStartX - panX.value
      panStartY = touchStartY - panY.value
      isSwiping.value = false
    } else {
      // Ukuran normal -> Swipe antar foto
      isSwiping.value = true
      isPanning = false
      swipeOffsetX.value = 0
    }
  }
}

function onTouchMove(e) {
  if (e.touches.length === 2 && initialPinchDistance > 0) {
    // Proses Pinch-to-Zoom
    e.preventDefault()
    const x1 = e.touches[0].clientX
    const y1 = e.touches[0].clientY
    const x2 = e.touches[1].clientX
    const y2 = e.touches[1].clientY
    const currentDist = Math.hypot(x2 - x1, y2 - y1)
    const factor = currentDist / initialPinchDistance
    zoomScale.value = Math.min(5.0, Math.max(0.6, Math.round(initialPinchScale * factor * 100) / 100))
  } else if (e.touches.length === 1) {
    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY

    if (isPanning && zoomScale.value > 1.05) {
      e.preventDefault()
      panX.value = currentX - panStartX
      panY.value = currentY - panStartY
    } else if (isSwiping.value && zoomScale.value <= 1.05) {
      const deltaX = currentX - touchStartX
      const deltaY = currentY - touchStartY

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault()
        // Tahanan elastis pada slide batas
        if (
          (activeIndex.value === 0 && deltaX > 0) ||
          (activeIndex.value === imageList.value.length - 1 && deltaX < 0)
        ) {
          swipeOffsetX.value = deltaX * 0.25
        } else {
          swipeOffsetX.value = deltaX * 0.75
        }
      }
    }
  }
}

function onTouchEnd(e) {
  if (e.touches.length === 0) {
    initialPinchDistance = 0
    isPanning = false

    if (isSwiping.value) {
      isSwiping.value = false
      const elapsed = Date.now() - touchStartTime

      if (Math.abs(swipeOffsetX.value) > 45 && elapsed < 650) {
        if (swipeOffsetX.value < -45) {
          nextImage()
        } else if (swipeOffsetX.value > 45) {
          prevImage()
        }
      }
      swipeOffsetX.value = 0
    }
  }
}

/**
 * Mouse Drag Pan Handlers (Desktop PC)
 */
function onMouseDown(e) {
  if (zoomScale.value > 1.05) {
    isMouseDown = true
    mouseStartX = e.clientX - panX.value
    mouseStartY = e.clientY - panY.value
  }
}

function onMouseMove(e) {
  if (isMouseDown && zoomScale.value > 1.05) {
    panX.value = e.clientX - mouseStartX
    panY.value = e.clientY - mouseStartY
  }
}

function onMouseUp() {
  isMouseDown = false
}

function nextImage() {
  if (activeIndex.value < imageList.value.length - 1) {
    activeIndex.value++
    resetZoom()
  }
}

function prevImage() {
  if (activeIndex.value > 0) {
    activeIndex.value--
    resetZoom()
  }
}

function goToImage(idx) {
  if (idx >= 0 && idx < imageList.value.length) {
    activeIndex.value = idx
    resetZoom()
  }
}

/**
 * Format tanggal & waktu ke bahasa Indonesia
 */
function formatDateTimeIndo(dateTimeStr) {
  if (!dateTimeStr) return '-'
  try {
    const d = new Date(dateTimeStr.replace(/-/g, '/'))
    if (isNaN(d.getTime())) return dateTimeStr

    const bulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]

    const tgl = d.getDate()
    const bln = bulan[d.getMonth()]
    const thn = d.getFullYear()
    const jam = String(d.getHours()).padStart(2, '0')
    const mnt = String(d.getMinutes()).padStart(2, '0')

    return `${tgl} ${bln} ${thn}, ${jam}:${mnt} WIB`
  } catch {
    return dateTimeStr
  }
}

onMounted(async () => {
  await fetchListPemeriksaan(true)
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
