/**
 * Helper to redirect users to Mobile JKN app on Play Store / App Store.
 *
 * NOTE: Opening the Mobile JKN app directly from a browser is NOT possible
 * because BPJS Kesehatan has not published a public deep link scheme for
 * their app. The best UX is to redirect to the store page where users
 * will see an "Open" button if the app is already installed, or "Install"
 * if not. This is the same approach used by bpjs-kesehatan.go.id.
 */

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=app.bpjs.mobile&hl=id'
export const APP_STORE_URL = 'https://apps.apple.com/id/app/mobile-jkn/id1237601115'

export function isIOS() {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export function getMobileJknUrl() {
  return isIOS() ? APP_STORE_URL : PLAY_STORE_URL
}

export function openMobileJkn() {
  window.open(getMobileJknUrl(), '_blank', 'noopener,noreferrer')
}

export function openMobileJknAndroid() {
  window.open(PLAY_STORE_URL, '_blank', 'noopener,noreferrer')
}

export function openMobileJknIOS() {
  window.open(APP_STORE_URL, '_blank', 'noopener,noreferrer')
}

