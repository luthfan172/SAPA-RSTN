<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-200/80 safe-bottom shadow-lg shadow-gray-200/50">
    <div class="flex items-center justify-around px-2 h-16 max-w-lg mx-auto">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition-all duration-200 min-w-[56px]"
        :class="isActive(item.to) ? 'text-emerald-600 font-bold' : 'text-gray-400 hover:text-gray-600 font-medium'"
      >
        <div class="relative">
          <div
            v-if="isActive(item.to)"
            class="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"
          ></div>
          <component :is="item.iconComponent" class="w-5 h-5" :class="isActive(item.to) ? 'mt-1 text-emerald-600' : ''" />
        </div>
        <span class="text-[10px] leading-tight text-center">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
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

const navItems = computed(() => {
  if (authStore.isAuthenticated) {
    return [
      {
        to: '/',
        label: 'Beranda',
        iconComponent: createIcon(['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'])
      },
      {
        to: '/jadwal-dokter',
        label: 'Jadwal',
        iconComponent: createIcon(['M3 4h18v18H3z', 'M16 2v4', 'M8 2v4', 'M3 10h18'])
      },
      {
        to: '/daftar-online',
        label: 'Daftar',
        iconComponent: createIcon(['M12 5v14', 'M5 12h14'])
      },
      {
        to: '/info-tempat-tidur',
        label: 'Kamar',
        iconComponent: createIcon(['M2 4v16', 'M2 8h20', 'M22 4v16', 'M6 8v8', 'M18 8v8', 'M2 16h20'])
      },
      {
        to: '/profil',
        label: 'Profil',
        iconComponent: createIcon(['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'])
      }
    ]
  } else {
    return [
      {
        to: '/',
        label: 'Beranda',
        iconComponent: createIcon(['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'])
      },
      {
        to: '/jadwal-dokter',
        label: 'Jadwal',
        iconComponent: createIcon(['M3 4h18v18H3z', 'M16 2v4', 'M8 2v4', 'M3 10h18'])
      },
      {
        to: '/info-tempat-tidur',
        label: 'Kamar',
        iconComponent: createIcon(['M2 4v16', 'M2 8h20', 'M22 4v16', 'M6 8v8', 'M18 8v8', 'M2 16h20'])
      },
      {
        to: '/edukasi',
        label: 'Edukasi',
        iconComponent: createIcon(['M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z', 'M6 6h10', 'M6 10h10'])
      },
      {
        to: '/login',
        label: 'Masuk',
        iconComponent: createIcon(['M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4', 'M10 17l5-5-5-5', 'M15 12H3'])
      }
    ]
  }
})
</script>

