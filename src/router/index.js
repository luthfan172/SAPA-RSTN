import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  // Main Layout routes
  {
    path: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: 'Dashboard', requiresAuth: false }
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/public/LoginPage.vue'),
        meta: { title: 'Masuk Akun', requiresAuth: false }
      },
      {
        path: 'pilih-penjamin',
        name: 'PilihPenjamin',
        component: () => import('../views/public/PilihPenjaminView.vue'),
        meta: { title: 'Pilih Penjamin', requiresAuth: false }
      },
      {
        path: 'jadwal-dokter',
        name: 'JadwalDokter',
        component: () => import('../views/JadwalDokterView.vue'),
        meta: { title: 'Jadwal Dokter', requiresAuth: false }
      },
      {
        path: 'info-tempat-tidur',
        name: 'InfoTT',
        component: () => import('../views/InfoTTView.vue'),
        meta: { title: 'Info Tempat Tidur', requiresAuth: false }
      },
      {
        path: 'edukasi',
        name: 'Edukasi',
        component: () => import('../views/EdukasiView.vue'),
        meta: { title: 'Edukasi Kesehatan', requiresAuth: false }
      },
      {
        path: 'edukasi/artikel/:id',
        name: 'EdukasiDetail',
        component: () => import('../views/EdukasiDetailView.vue'),
        meta: { title: 'Detail Artikel Edukasi', requiresAuth: false }
      },
      {
        path: 'daftar-online',
        name: 'DaftarOnline',
        component: () => import('../views/DaftarOnlineView.vue'),
        meta: { title: 'Daftar Online', requiresAuth: true }
      },
      {
        path: 'riwayat-reservasi',
        name: 'RiwayatReservasi',
        component: () => import('../views/RiwayatReservasiView.vue'),
        meta: { title: 'Riwayat Reservasi', requiresAuth: true }
      },
      {
        path: 'antrian-farmasi',
        name: 'AntrianFarmasi',
        component: () => import('../views/AntrianFarmasiView.vue'),
        meta: { title: 'Antrian Farmasi', requiresAuth: false }
      },
      {
        path: 'hasil-radiologi',
        name: 'HasilRadiologi',
        component: () => import('../views/HasilRadiologiView.vue'),
        meta: { title: 'Hasil Radiologi', requiresAuth: true }
      },
      {
        path: 'hasil-laboratorium',
        name: 'HasilLaboratorium',
        component: () => import('../views/HasilLaboratoriumView.vue'),
        meta: { title: 'Hasil Laboratorium', requiresAuth: true }
      },
      {
        path: 'resume-medis',
        name: 'ResumeMedis',
        component: () => import('../views/ResumeMedisView.vue'),
        meta: { title: 'Resume Medis Rawat Inap', requiresAuth: true }
      },
      {
        path: 'tagihan-umum',
        name: 'TagihanPasienUmum',
        component: () => import('../views/TagihanPasienUmumView.vue'),
        meta: { title: 'Tagihan Pasien', requiresAuth: true }
      },
      {
        path: 'preview-dokumen/:type/:id',
        name: 'PreviewDokumen',
        component: () => import('../views/PreviewDokumenView.vue'),
        meta: { title: 'Preview Dokumen', requiresAuth: true }
      },
      {
        path: 'profil',
        name: 'Profile',
        component: () => import('../views/ProfileView.vue'),
        meta: { title: 'Profil', requiresAuth: true }
      },
      {
        path: 'notifikasi',
        name: 'NotifikasiSemua',
        component: () => import('../views/NotifikasiView.vue'),
        meta: { title: 'Semua Notifikasi', requiresAuth: false }
      }
    ]
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
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

export default router

