<template>
  <div class="space-y-2.5">
    <!-- QR Code Card Container -->
    <div class="flex flex-col items-center justify-center p-4 sm:p-5 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-3 text-center relative overflow-hidden">
      <!-- QR Image Box with Pure White High-Contrast Pad -->
      <div
        @click="openFullscreen"
        class="p-3 rounded-2xl bg-white border-2 border-emerald-100/80 shadow-md shadow-emerald-600/5 cursor-pointer group hover:border-emerald-500 transition-all active:scale-98 relative"
      >
        <img
          v-if="qrDataUrl"
          :src="qrDataUrl"
          alt="QR Code Booking"
          class="w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-lg"
        />
        <div v-else class="w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center text-gray-300">
          <svg class="w-8 h-8 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/></svg>
        </div>

        <!-- Zoom hint overlay on hover -->
        <div class="absolute inset-0 bg-emerald-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div class="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-bold text-emerald-800 shadow-sm flex items-center gap-1">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            <span>Perbesar QR</span>
          </div>
        </div>
      </div>

      <!-- Kode Booking Label & Action -->
      <div class="space-y-0.5">
        <span class="text-[10px] text-gray-400 block uppercase font-mono tracking-wider font-semibold">Kode Booking</span>
        <span class="font-mono text-base sm:text-lg font-black text-gray-900 tracking-wider select-all">{{ code }}</span>
      </div>

      <!-- Button Perbesar QR -->
      <button
        type="button"
        @click="openFullscreen"
        class="w-full py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-98 text-gray-700 border border-gray-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
      >
        <svg class="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        <span>Perbesar Tampilan QR Code</span>
      </button>
    </div>

    <!-- Fullscreen Mode Modal -->
    <Teleport to="body">
      <transition name="spotlight-fade">
        <div
          v-if="isFullscreen"
          class="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm text-gray-900 select-none"
          @click="closeFullscreen"
        >
          <!-- Main High-Contrast Giant QR Code Box -->
          <div
            class="flex flex-col items-center justify-center p-6 sm:p-7 rounded-3xl bg-white shadow-2xl space-y-3.5 max-w-sm w-full"
            @click.stop
          >
            <!-- Card Header with Close (X) -->
            <div class="flex items-center justify-between w-full pb-2 border-b border-gray-100">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </div>
                <span class="text-[11px] font-black uppercase tracking-wider text-gray-800">Scan Mesin APM RSUD</span>
              </div>

              <button
                type="button"
                @click="closeFullscreen"
                class="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer transition-colors"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="text-center space-y-0.5">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">RSUD R.A.A. Tjokronegoro</p>
              <h3 class="text-base font-black text-gray-900 tracking-tight">Arahkan ke Kamera Scanner APM</h3>
            </div>

            <!-- Giant Crisp QR -->
            <div class="p-3 bg-white border-2 border-gray-900 rounded-2xl shadow-inner">
              <img
                v-if="qrLargeDataUrl"
                :src="qrLargeDataUrl"
                alt="QR Code Fullscreen"
                class="w-56 h-56 sm:w-64 sm:h-64 object-contain"
              />
            </div>

            <div class="text-center space-y-0.5">
              <span class="text-[10px] text-gray-400 font-mono font-semibold uppercase">Kode Booking</span>
              <p class="font-mono text-xl font-black tracking-widest text-gray-900">{{ code }}</p>
            </div>

            <!-- APM Warning Banner -->
            <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 flex items-start gap-2 w-full">
              <svg class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
              <p class="leading-relaxed text-[11px]">
                Pastikan <strong>kecerahan layar HP diatur ke 100% (maksimal)</strong> agar scanner APM dapat membaca QR Code.
              </p>
            </div>

            <!-- Bottom Close Button (Tutup QR Code) -->
            <button
              type="button"
              @click="closeFullscreen"
              class="w-full py-3 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
            >
              Tutup QR Code
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  code: {
    type: String,
    required: true
  }
})

const qrDataUrl = ref('')
const qrLargeDataUrl = ref('')
const isFullscreen = ref(false)
let wakeLock = null

async function renderQRCode() {
  if (!props.code) return
  await nextTick()

  try {
    // Normal Card QR (High resolution)
    qrDataUrl.value = await QRCode.toDataURL(props.code, {
      margin: 1,
      width: 240,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })

    // Large Fullscreen QR (Ultra Crisp)
    qrLargeDataUrl.value = await QRCode.toDataURL(props.code, {
      margin: 1,
      width: 400,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
  } catch (e) {
    console.warn('QR Code generation error:', e)
  }
}

async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen')
      wakeLock.addEventListener('release', () => {
        wakeLock = null
      })
    } catch (err) {
      console.warn('Wake Lock error:', err)
    }
  }
}

function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release().catch(() => {})
    wakeLock = null
  }
}

function openFullscreen() {
  isFullscreen.value = true
  requestWakeLock()
}

function closeFullscreen() {
  isFullscreen.value = false
  releaseWakeLock()
}

onMounted(() => {
  renderQRCode()
})

onUnmounted(() => {
  releaseWakeLock()
})

watch(() => props.code, () => {
  renderQRCode()
})
</script>

<style scoped>
.spotlight-fade-enter-active,
.spotlight-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.spotlight-fade-enter-from,
.spotlight-fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
