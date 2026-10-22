<template>
  <div class="flex flex-col h-full w-full bg-gray-950 overflow-hidden select-none">
    <!-- Toolbar Controls -->
    <div class="px-3 sm:px-5 py-2.5 bg-gray-900 border-b border-gray-800 text-white flex items-center justify-between gap-2 shrink-0 text-xs shadow-xs z-10">
      <div class="flex items-center gap-2">
        <span class="text-[11px] text-gray-300 font-medium">
          Halaman <strong class="text-white">{{ totalPages > 0 ? currentPage : 0 }}</strong> / {{ totalPages }}
        </span>
      </div>

      <!-- Zoom Controls -->
      <div class="flex items-center gap-1">
        <button
          type="button"
          @click="zoomOut"
          :disabled="targetScale <= 0.5"
          class="w-8 h-8 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors cursor-pointer active:scale-95 border border-gray-700"
          title="Perkecil"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>

        <span class="w-12 text-center text-[11px] font-mono text-gray-200 font-bold">
          {{ Math.round(targetScale * 100) }}%
        </span>

        <button
          type="button"
          @click="zoomIn"
          :disabled="targetScale >= 3.5"
          class="w-8 h-8 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors cursor-pointer active:scale-95 border border-gray-700"
          title="Perbesar"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>

        <button
          type="button"
          @click="resetZoom"
          class="px-2.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-[11px] font-bold text-teal-300 transition-colors ml-1 cursor-pointer active:scale-95 border border-gray-700"
          title="Paskan ke Layar"
        >
          Fit
        </button>

        <a
          v-if="blobUrl"
          :href="blobUrl"
          target="_blank"
          class="p-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors ml-1 cursor-pointer active:scale-95 border border-gray-700"
          title="Buka Dokumen Asli di Tab Baru (Safari Viewer)"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
    </div>

    <!-- PDF Pages Scroll & Pinch Container (Full 2D Touch & Smooth Gestures) -->
    <div
      ref="containerRef"
      class="flex-1 w-full h-full overflow-x-auto overflow-y-auto p-3 sm:p-6 bg-gray-950 relative"
      style="touch-action: pan-x pan-y; -webkit-overflow-scrolling: touch; overscroll-behavior: contain;"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd"
    >
      <!-- Loading State -->
      <div v-if="loading" class="h-full flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
        <svg class="w-9 h-9 animate-spin text-teal-500" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/>
        </svg>
        <span class="text-xs font-semibold text-gray-300">Memuat halaman dokumen PDF...</span>
      </div>

      <!-- Error / Fallback State -->
      <div v-else-if="error" class="my-auto p-5 text-center text-xs text-gray-200 bg-gray-900 border border-gray-800 rounded-2xl max-w-md mx-auto space-y-3">
        <div class="w-10 h-10 rounded-xl bg-rose-950/80 text-rose-400 flex items-center justify-center mx-auto border border-rose-800/80">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div class="space-y-1">
          <p class="text-rose-300 font-semibold">{{ error }}</p>
          <p class="text-gray-400 text-[11px]">Buka berkas langsung dengan mesin PDF bawaan perangkat Safari Anda:</p>
        </div>
        <div class="pt-1 flex items-center justify-center gap-2">
          <a
            v-if="blobUrl"
            :href="blobUrl"
            target="_blank"
            class="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Buka Dokumen PDF</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>

      <!-- Canvas Rendering Wrapper with Smooth Transition Scaling -->
      <div
        v-show="!loading && !error"
        class="min-w-full w-max mx-auto flex flex-col items-center gap-5 pb-8 origin-top will-change-transform"
        :style="wrapperStyle"
      >
        <div
          v-for="pageNum in totalPages"
          :key="pageNum"
          class="bg-white shadow-2xl rounded-sm overflow-hidden border border-gray-700/80 shrink-0"
        >
          <canvas :ref="el => setCanvasRef(el, pageNum)" class="block"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'

// Safari / iOS Polyfill: Promise.withResolvers (required for modern pdfjs-dist)
if (typeof Promise.withResolvers === 'undefined') {
  if (typeof window !== 'undefined') {
    window.Promise.withResolvers = function () {
      let resolve, reject
      const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })
      return { promise, resolve, reject }
    }
  }
}

// Set worker source
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker
} catch (e) {
  console.warn('Could not set worker source directly:', e)
}

const props = defineProps({
  blob: {
    type: [Blob, Uint8Array],
    default: null
  },
  url: {
    type: String,
    default: ''
  }
})

const containerRef = ref(null)
const loading = ref(true)
const error = ref('')
const totalPages = ref(0)
const currentPage = ref(1)
const canvasRefs = ref({})
const blobUrl = ref('')

watch(() => props.blob, (newBlob) => {
  if (blobUrl.value && blobUrl.value.startsWith('blob:')) {
    try { URL.revokeObjectURL(blobUrl.value) } catch (e) {}
  }
  if (newBlob instanceof Blob) {
    blobUrl.value = URL.createObjectURL(newBlob)
  } else if (newBlob instanceof Uint8Array) {
    blobUrl.value = URL.createObjectURL(new Blob([newBlob], { type: 'application/pdf' }))
  } else {
    blobUrl.value = props.url || ''
  }
}, { immediate: true })

// Smooth Zoom Engine State
const targetScale = ref(1.0)      // Current active target zoom level
const renderedScale = ref(1.0)    // Scale at which canvas was last drawn
const isPinching = ref(false)     // Active multi-touch pinch
const gestureMultiplier = ref(1.0)// Live pinch factor

let startDist = 0
let startScale = 1.0
let lastTapTime = 0
let renderDebounceTimer = null
let pdfDoc = null

// Smooth 60 FPS CSS Transform Style
const wrapperStyle = computed(() => {
  if (isPinching.value) {
    return {
      transform: `scale(${gestureMultiplier.value})`,
      transformOrigin: 'top center',
      transition: 'none'
    }
  }

  const visualScale = renderedScale.value > 0 ? (targetScale.value / renderedScale.value) : 1.0
  if (Math.abs(visualScale - 1.0) > 0.001) {
    return {
      transform: `scale(${visualScale})`,
      transformOrigin: 'top center',
      transition: 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)'
    }
  }

  return {
    transform: 'none',
    transformOrigin: 'top center',
    transition: 'none'
  }
})

function setCanvasRef(el, pageNum) {
  if (el) {
    canvasRefs.value[pageNum] = el
  }
}

// Touch Handlers with Realtime Smooth Pinch & Double-Tap
function handleTouchStart(e) {
  if (e.touches.length === 2) {
    isPinching.value = true
    startDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
    startScale = targetScale.value
    gestureMultiplier.value = 1.0
  } else if (e.touches.length === 1) {
    const now = Date.now()
    if (now - lastTapTime < 300) {
      // Double tap smooth zoom
      if (targetScale.value > 1.2) {
        resetZoom()
      } else {
        setTargetScale(2.0)
      }
      lastTapTime = 0
    } else {
      lastTapTime = now
    }
  }
}

function handleTouchMove(e) {
  if (isPinching.value && e.touches.length === 2) {
    e.preventDefault()
    const currentDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
    if (startDist > 0) {
      const ratio = currentDist / startDist
      gestureMultiplier.value = ratio
      const rawScale = startScale * ratio
      targetScale.value = Math.min(Math.max(Number(rawScale.toFixed(2)), 0.5), 3.5)
    }
  }
}

function handleTouchEnd(e) {
  if (isPinching.value) {
    isPinching.value = false
    const finalScale = Math.min(Math.max(Number((startScale * gestureMultiplier.value).toFixed(2)), 0.5), 3.5)
    gestureMultiplier.value = 1.0
    setTargetScale(finalScale)
  }
}

function setTargetScale(newScale) {
  const clamped = Math.min(Math.max(Number(newScale.toFixed(2)), 0.5), 3.5)
  targetScale.value = clamped

  // Debounce actual canvas re-rendering so UI animates immediately without lag
  if (renderDebounceTimer) clearTimeout(renderDebounceTimer)
  renderDebounceTimer = setTimeout(() => {
    scheduleRender()
  }, 220)
}

function zoomIn() {
  if (targetScale.value < 3.5) {
    setTargetScale(targetScale.value + 0.10)
  }
}

function zoomOut() {
  if (targetScale.value > 0.5) {
    setTargetScale(targetScale.value - 0.10)
  }
}

async function resetZoom() {
  await calculateOptimalScale()
  setTargetScale(targetScale.value)
}

async function loadPdf() {
  loading.value = true
  error.value = ''
  totalPages.value = 0
  pdfDoc = null
  canvasRefs.value = {}

  try {
    let rawBytes = null
    if (props.blob) {
      const arrayBuffer = props.blob instanceof Blob ? await props.blob.arrayBuffer() : props.blob.buffer
      rawBytes = new Uint8Array(arrayBuffer)
    } else if (props.url) {
      // URL source
    } else {
      loading.value = false
      return
    }

    const version = pdfjsLib.version || '6.2.108'
    const cMapUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/cmaps/`
    const standardFontDataUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/standard_fonts/`

    function getSourceConfig() {
      if (rawBytes) {
        // Clone Uint8Array slice to prevent buffer detaching in Safari worker transfers
        return {
          data: new Uint8Array(rawBytes.slice(0)),
          cMapUrl,
          cMapPacked: true,
          standardFontDataUrl,
          isEvalSupported: false
        }
      }
      return {
        url: props.url,
        cMapUrl,
        cMapPacked: true,
        standardFontDataUrl,
        isEvalSupported: false
      }
    }

    try {
      const loadingTask = pdfjsLib.getDocument(getSourceConfig())
      pdfDoc = await loadingTask.promise
    } catch (workerErr) {
      console.warn('Primary PDF worker failed in Safari/WebKit, attempting CDN fallback worker...', workerErr)
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`
        const retryTask = pdfjsLib.getDocument(getSourceConfig())
        pdfDoc = await retryTask.promise
      } catch (cdnErr) {
        console.warn('CDN Worker failed, loading with worker disabled (main thread fallback)...', cdnErr)
        // Disable worker completely as last resort for older Safari/iOS
        pdfjsLib.GlobalWorkerOptions.workerSrc = false
        const fallbackTask = pdfjsLib.getDocument(getSourceConfig())
        pdfDoc = await fallbackTask.promise
      }
    }

    totalPages.value = pdfDoc.numPages

    await nextTick()
    await calculateOptimalScale()
    await scheduleRender()
  } catch (err) {
    console.error('PDF.js Error in Safari:', err)
    error.value = 'Gagal merender dokumen PDF: ' + (err.message || 'Format tidak didukung')
  } finally {
    loading.value = false
  }
}

async function calculateOptimalScale() {
  if (!pdfDoc || !containerRef.value) return

  try {
    const page = await pdfDoc.getPage(1)
    const viewport = page.getViewport({ scale: 1.0 })
    const containerWidth = containerRef.value.clientWidth - 32
    if (containerWidth > 0 && viewport.width > 0) {
      const fitScale = Math.min(Math.max(containerWidth / viewport.width, 0.6), 1.4)
      targetScale.value = Number(fitScale.toFixed(2))
    }
  } catch {
    targetScale.value = 1.0
  }
}

async function scheduleRender() {
  if (!pdfDoc) return
  renderedScale.value = targetScale.value
  for (let pageNum = 1; pageNum <= totalPages.value; pageNum++) {
    await renderPage(pageNum)
  }
}

async function renderPage(pageNum) {
  const canvas = canvasRefs.value[pageNum]
  if (!canvas || !pdfDoc) return

  try {
    const page = await pdfDoc.getPage(pageNum)
    // Clamp pixelRatio to max 2 for Safari iOS (prevents memory limit crash)
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    const viewport = page.getViewport({ scale: renderedScale.value })

    canvas.width = Math.floor(viewport.width * pixelRatio)
    canvas.height = Math.floor(viewport.height * pixelRatio)
    canvas.style.width = `${Math.floor(viewport.width)}px`
    canvas.style.height = `${Math.floor(viewport.height)}px`

    const ctx = canvas.getContext('2d')
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    }

    await page.render(renderContext).promise
  } catch (renderErr) {
    console.warn(`Render error on page ${pageNum}:`, renderErr)
  }
}

// Trackpad pinch / Ctrl + Wheel zoom support
function handleWheel(e) {
  if (e.ctrlKey) {
    e.preventDefault()
    if (e.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }
}

watch(() => [props.blob, props.url], () => {
  loadPdf()
})

onMounted(() => {
  loadPdf()
  if (containerRef.value) {
    containerRef.value.addEventListener('wheel', handleWheel, { passive: false })
  }
})

onUnmounted(() => {
  if (blobUrl.value && blobUrl.value.startsWith('blob:')) {
    try { URL.revokeObjectURL(blobUrl.value) } catch (e) {}
  }
  if (containerRef.value) {
    containerRef.value.removeEventListener('wheel', handleWheel)
  }
  if (renderDebounceTimer) {
    clearTimeout(renderDebounceTimer)
  }
})
</script>
