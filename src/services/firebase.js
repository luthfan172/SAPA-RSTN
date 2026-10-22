import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyDIUN4D05KBjVP8WfSgZ5datRsi_DP4vX8",
  authDomain: "app-rstn.firebaseapp.com",
  projectId: "app-rstn",
  storageBucket: "app-rstn.firebasestorage.app",
  messagingSenderId: "898445603457",
  appId: "1:898445603457:web:4ded02faf9613201081380",
  measurementId: "G-B04C92YKZB"
}

// Initialize Firebase App
export const app = initializeApp(firebaseConfig)

// Initialize Analytics (Check if supported in current browser environment)
export let analytics = null
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  })
}

// Messaging helper (FCM)
export const getFirebaseMessaging = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    const supported = await import('firebase/messaging').then(m => m.isSupported())
    if (supported) {
      return getMessaging(app)
    }
  }
  return null
}

export default app
