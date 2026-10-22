<template>
  <aside
    class="fixed top-0 left-0 h-screen flex flex-col bg-white border-r border-gray-100 z-50"
    :class="isMobile ? 'w-72 shadow-2xl' : 'w-64'"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
      <div class="flex items-center gap-3">
        <img src="/logo.png" alt="Logo SAPA RSTN" class="w-10 h-10 object-contain rounded-xl shrink-0" />
        <div>
          <h2 class="text-base font-bold text-gray-800 leading-tight">SAPA RSTN</h2>
          <p class="text-[10px] text-gray-400 tracking-wide">Portal Pasien Umum</p>
        </div>
      </div>
      <!-- Close button for mobile -->
      <button
        v-if="isMobile"
        @click="$emit('close')"
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <p class="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Menu Utama</p>
      <router-link
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        @click="isMobile && $emit('close')"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
        :class="isActive(item.to) ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
      >
        <div
          class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
          :class="isActive(item.to) ? 'bg-emerald-100 shadow-sm' : 'bg-gray-100 group-hover:bg-gray-200'"
        >
          <component :is="item.iconComponent" class="w-[18px] h-[18px]" />
        </div>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Bottom: Logout / Login -->
    <div class="px-3 py-4 border-t border-gray-100 shrink-0">
      <button
        v-if="authStore.isAuthenticated"
        @click="handleLogout"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full cursor-pointer"
      >
        <div class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>
        <span>Keluar</span>
      </button>

      <router-link
        v-else
        to="/login"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200 w-full shadow-sm"
      >
        <div class="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
        </div>
        <span>Masuk Akun</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  collapsed: { type: Boolean, default: false },
  isMobile: { type: Boolean, default: false }
})

defineEmits(['close'])

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

function isActive(path) {
  return route.path === path
}

function createIcon(paths) {
  return {
    render() {
      return h('svg', {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }, paths.map(d => h('path', { d })))
    }
  }
}

const menuItems = [
  {
    to: '/',
    label: 'Dashboard',
    iconComponent: createIcon(['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'])
  },
  {
    to: '/jadwal-dokter',
    label: 'Jadwal Dokter',
    iconComponent: createIcon(['M3 4h18v18H3z', 'M16 2v4', 'M8 2v4', 'M3 10h18'])
  },
  {
    to: '/info-tempat-tidur',
    label: 'Info Tempat Tidur',
    iconComponent: createIcon(['M2 4v16', 'M2 8h20', 'M22 4v16', 'M6 8v8', 'M18 8v8', 'M2 16h20'])
  },
  {
    to: '/edukasi',
    label: 'Edukasi Kesehatan',
    iconComponent: createIcon(['M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z', 'M6 6h10', 'M6 10h10'])
  },
  {
    to: '/daftar-online',
    label: 'Daftar Online',
    iconComponent: createIcon(['M12 5v14', 'M5 12h14'])
  },
  {
    to: '/riwayat-reservasi',
    label: 'Riwayat Reservasi',
    iconComponent: createIcon(['M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2', 'M12 11h4', 'M12 16h4', 'M8 11h.01', 'M8 16h.01'])
  },
  {
    to: '/antrian-farmasi',
    label: 'Antrian Farmasi',
    iconComponent: createIcon(['M19.5 12.572l-7.5 7.428l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572'])
  },
  {
    to: '/hasil-radiologi',
    label: 'Hasil Radiologi',
    iconComponent: createIcon(['M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z', 'M2 12h3', 'M19 12h3', 'M12 2v3', 'M12 19v3'])
  },
  {
    to: '/hasil-laboratorium',
    label: 'Hasil Laboratorium',
    iconComponent: createIcon(['M10 2v7.31L4.68 18.2A2 2 0 0 0 6.4 21h11.2a2 2 0 0 0 1.72-2.8L14 9.31V2', 'M8.5 2h7', 'M7 16h10'])
  },
  {
    to: '/resume-medis',
    label: 'Resume Medis Ranap',
    iconComponent: createIcon(['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8'])
  },
  {
    to: '/tagihan-umum',
    label: 'Tagihan Pasien',
    iconComponent: createIcon(['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M9 15h6', 'M12 12v6'])
  },
  {
    to: '/profil',
    label: 'Profil Saya',
    iconComponent: createIcon(['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'])
  }
]

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>
