import { ref, computed } from 'vue'

const deferredPrompt = ref(null)
const isInstalled = ref(false)

// Attach event listeners immediately at top-level module evaluation
if (typeof window !== 'undefined') {
  // Check if app is already running in standalone mode (already installed)
  if (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  ) {
    isInstalled.value = true
  }

  // Capture early beforeinstallprompt event from browser
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt.value = null
    isInstalled.value = true
  })
}

export function usePwaInstall() {
  const canInstall = computed(() => !!deferredPrompt.value)

  async function installApp() {
    if (!deferredPrompt.value) return false
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    deferredPrompt.value = null
    return outcome === 'accepted'
  }

  return {
    canInstall,
    deferredPrompt,
    isInstalled,
    installApp
  }
}
