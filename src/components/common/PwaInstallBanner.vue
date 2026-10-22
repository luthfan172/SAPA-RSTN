<template>
  <transition name="slide-up">
    <div
      v-if="canInstall && !isInstalled && !dismissed"
      class="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-full bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-emerald-100 shadow-2xl shadow-emerald-950/15 space-y-3"
      style="animation: bounce-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);"
    >
      <div class="flex items-start gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/20">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/>
            <path d="M2 20h20"/>
            <path d="M12 8v4"/>
            <path d="M10 10h4"/>
          </svg>
        </div>

        <div class="flex-1 min-w-0 text-left">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Aplikasi Tersedia</span>
            <button
              type="button"
              @click="dismissBanner"
              class="w-5 h-5 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <h4 class="text-sm font-extrabold text-gray-900 leading-tight">Install SAPA RSTN</h4>
          <p class="text-xs text-gray-500 leading-snug mt-0.5">
            Pasang di komputer / HP untuk akses cepat tanpa perlu membuka browser.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 pt-1">
        <button
          type="button"
          @click="dismissBanner"
          class="flex-1 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors cursor-pointer text-center"
        >
          Nanti Saja
        </button>
        <button
          type="button"
          @click="handleInstall"
          class="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 text-center"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>Install Sekarang</span>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { usePwaInstall } from '../../composables/usePwaInstall'

const { canInstall, isInstalled, installApp } = usePwaInstall()
const dismissed = ref(false)

async function handleInstall() {
  await installApp()
}

function dismissBanner() {
  dismissed.value = true
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
