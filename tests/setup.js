import { vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// ── Global localStorage mock ──────────────────────────────────────────────────
const localStorageStore = {}

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: vi.fn((key) => localStorageStore[key] ?? null),
    setItem: vi.fn((key, value) => { localStorageStore[key] = String(value) }),
    removeItem: vi.fn((key) => { delete localStorageStore[key] }),
    clear: vi.fn(() => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]) }),
    key: vi.fn((index) => Object.keys(localStorageStore)[index] ?? null),
    get length() { return Object.keys(localStorageStore).length }
  },
  writable: true
})

// ── Pinia reset per test ──────────────────────────────────────────────────────
beforeEach(() => {
  // Bersihkan semua key localStorage fiktif sebelum tiap test
  Object.keys(localStorageStore).forEach(k => delete localStorageStore[k])
  vi.clearAllMocks()
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.restoreAllMocks()
})
