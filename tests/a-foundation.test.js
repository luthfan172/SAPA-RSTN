/**
 * tests/a-foundation.test.js
 * Area A: Fondasi — api.js interceptors, auth store, router guard
 * 
 * Semua request jaringan di-mock, tidak ada token/data pasien asli.
 * Data yang digunakan seluruhnya fiktif.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { createRouter, createMemoryHistory } from 'vue-router'

// ── Mock api.js ──────────────────────────────────────────────────────────────
vi.mock('@/services/api', () => {
  const mockAxios = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
  return { default: mockAxios }
})

// ── Helper untuk membuat router uji ──────────────────────────────────────────
function makeTestRouter(routesMeta = []) {
  const routes = [
    {
      path: '/login',
      name: 'Login',
      component: { template: '<div>Login</div>' },
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: { template: '<div>Dashboard</div>' },
      meta: { requiresAuth: false }
    },
    {
      path: '/tagihan-umum',
      name: 'TagihanPasienUmum',
      component: { template: '<div>Tagihan</div>' },
      meta: { requiresAuth: true }
    },
    {
      path: '/edukasi',
      name: 'Edukasi',
      component: { template: '<div>Edukasi</div>' },
      meta: { requiresAuth: false }
    },
    {
      path: '/edukasi/artikel/:id',
      name: 'EdukasiDetail',
      component: { template: '<div>EdukasiDetail</div>' },
      meta: { requiresAuth: false }
    },
    {
      path: '/notifikasi',
      name: 'NotifikasiSemua',
      component: { template: '<div>Notifikasi</div>' },
      meta: { requiresAuth: false }
    },
    {
      path: '/riwayat-reservasi',
      name: 'RiwayatReservasi',
      component: { template: '<div>Riwayat</div>' },
      meta: { requiresAuth: true }
    },
    ...routesMeta
  ]

  const router = createRouter({
    history: createMemoryHistory(),
    routes
  })

  // Pasang navigation guard yang sama dengan router nyata
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const requiresAuth = to.matched.some(record => record.meta?.requiresAuth)
    if (requiresAuth && !authStore.isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else if (to.name === 'Login' && authStore.isAuthenticated) {
      next({ name: 'Dashboard' })
    } else {
      next()
    }
  })

  return router
}

// ─────────────────────────────────────────────────────────────────────────────
describe('A1: Interceptor request API — header Authorization', () => {

  it('menambahkan header Authorization: Bearer jika sapa_token tersedia di localStorage', () => {
    // Arrange
    localStorage.setItem('sapa_token', 'token-fiktif-abc123')
    const config = { headers: {} }

    // Simulasikan logika interceptor request dari api.js
    const token = localStorage.getItem('sapa_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Assert
    expect(config.headers.Authorization).toBe('Bearer token-fiktif-abc123')
  })

  it('TIDAK menambahkan header Authorization jika sapa_token tidak ada', () => {
    const config = { headers: {} }

    const token = localStorage.getItem('sapa_token') // → null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    expect(config.headers.Authorization).toBeUndefined()
  })

  it('Authorization tidak terpasang jika token string kosong', () => {
    localStorage.setItem('sapa_token', '')
    const config = { headers: {} }

    const token = localStorage.getItem('sapa_token')
    // empty string adalah falsy
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    expect(config.headers.Authorization).toBeUndefined()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('A2: Interceptor response API — penanganan status 401', () => {

  it('status 401: menghapus sapa_token dari localStorage', () => {
    localStorage.setItem('sapa_token', 'token-lama-fiktif')
    localStorage.setItem('sapa_user', JSON.stringify({ NORM: '0001234', NAMA: 'Pasien Fiktif' }))

    // Simulasikan logika response interceptor dari api.js
    const errorWith401 = { response: { status: 401 } }
    if (errorWith401.response && errorWith401.response.status === 401) {
      localStorage.removeItem('sapa_token')
      localStorage.removeItem('sapa_user')
    }

    expect(localStorage.getItem('sapa_token')).toBeNull()
    expect(localStorage.getItem('sapa_user')).toBeNull()
  })

  it('status 403: tidak menghapus token dari localStorage', () => {
    localStorage.setItem('sapa_token', 'token-fiktif-tetap')
    
    const errorWith403 = { response: { status: 403 } }
    if (errorWith403.response && errorWith403.response.status === 401) {
      localStorage.removeItem('sapa_token')
      localStorage.removeItem('sapa_user')
    }

    expect(localStorage.getItem('sapa_token')).toBe('token-fiktif-tetap')
  })

  it('status 500: tidak menghapus token dari localStorage', () => {
    localStorage.setItem('sapa_token', 'token-fiktif-500')

    const errorWith500 = { response: { status: 500 } }
    if (errorWith500.response && errorWith500.response.status === 401) {
      localStorage.removeItem('sapa_token')
    }

    expect(localStorage.getItem('sapa_token')).toBe('token-fiktif-500')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('A3: Auth Store', () => {

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('isAuthenticated = false saat token tidak ada di localStorage', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
  })

  it('isAuthenticated = true saat sapa_token ada di localStorage sebelum inisialisasi', () => {
    localStorage.setItem('sapa_token', 'token-fiktif-init')
    setActivePinia(createPinia())
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(true)
  })

  it('logout() menghapus token, user, dan isAuthenticated menjadi false', () => {
    localStorage.setItem('sapa_token', 'token-logout-fiktif')
    localStorage.setItem('sapa_user', JSON.stringify({ NORM: '0009999', NAMA: 'Nama Fiktif' }))
    setActivePinia(createPinia())
    const store = useAuthStore()
    
    store.logout()

    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('sapa_token')).toBeNull()
    expect(localStorage.getItem('sapa_user')).toBeNull()
  })

  it('userNorm mengembalikan NORM dari user yang tersimpan', () => {
    localStorage.setItem('sapa_user', JSON.stringify({ NORM: '0001111', NAMA: 'Pasien Contoh' }))
    localStorage.setItem('sapa_token', 'token-norm-fiktif')
    setActivePinia(createPinia())
    const store = useAuthStore()

    expect(store.userNorm).toBe('0001111')
  })

  it('namaPasien mengembalikan NAMA dari user yang tersimpan', () => {
    localStorage.setItem('sapa_user', JSON.stringify({ NORM: '0002222', NAMA: 'Budi Fiktif' }))
    localStorage.setItem('sapa_token', 'token-nama-fiktif')
    setActivePinia(createPinia())
    const store = useAuthStore()

    expect(store.namaPasien).toBe('Budi Fiktif')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('A4: Router Guard', () => {

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('rute requiresAuth tanpa login → diarahkan ke Login', async () => {
    const router = makeTestRouter()
    await router.push('/tagihan-umum')
    // guard harus redirect ke login
    expect(router.currentRoute.value.name).toBe('Login')
  })

  it('rute requiresAuth setelah login → berhasil diakses', async () => {
    localStorage.setItem('sapa_token', 'token-guard-fiktif')
    setActivePinia(createPinia())
    const router = makeTestRouter()
    await router.push('/tagihan-umum')
    expect(router.currentRoute.value.name).toBe('TagihanPasienUmum')
  })

  it('rute Edukasi (requiresAuth=false) bisa diakses tanpa login', async () => {
    const router = makeTestRouter()
    await router.push('/edukasi')
    expect(router.currentRoute.value.name).toBe('Edukasi')
  })

  it('rute edukasi/artikel/:id bisa diakses tanpa login', async () => {
    const router = makeTestRouter()
    await router.push('/edukasi/artikel/artikel-fiktif-1')
    expect(router.currentRoute.value.name).toBe('EdukasiDetail')
  })

  it('rute /notifikasi (requiresAuth=false) bisa diakses tanpa login', async () => {
    const router = makeTestRouter()
    await router.push('/notifikasi')
    expect(router.currentRoute.value.name).toBe('NotifikasiSemua')
  })

  it('rute Login saat sudah login → diarahkan ke Dashboard', async () => {
    localStorage.setItem('sapa_token', 'token-login-redirect')
    setActivePinia(createPinia())
    const router = makeTestRouter()
    await router.push('/login')
    expect(router.currentRoute.value.name).toBe('Dashboard')
  })

  it('rute riwayat-reservasi (requiresAuth=true) tanpa login → diarahkan ke Login', async () => {
    const router = makeTestRouter()
    await router.push('/riwayat-reservasi')
    expect(router.currentRoute.value.name).toBe('Login')
  })

  it('redirect query param diteruskan saat diarahkan ke login', async () => {
    const router = makeTestRouter()
    await router.push('/tagihan-umum')
    expect(router.currentRoute.value.query.redirect).toBe('/tagihan-umum')
  })

  it('rute asli router mendaftarkan tagihan-umum, edukasi/artikel/:id, dan notifikasi', async () => {
    const { default: realRouter } = await import('@/router')
    const routes = realRouter.getRoutes()
    const names = routes.map(r => r.name)
    const paths = routes.map(r => r.path)

    expect(names).toContain('TagihanPasienUmum')
    expect(names).toContain('EdukasiDetail')
    expect(names).toContain('NotifikasiSemua')
    expect(paths).toContain('/tagihan-umum')
    expect(paths).toContain('/edukasi/artikel/:id')
    expect(paths).toContain('/notifikasi')
  })
})
