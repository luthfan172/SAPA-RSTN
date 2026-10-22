<template>
  <header class="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-200/60">
    <div class="flex items-center justify-between h-16 px-4 md:px-8">
      <!-- Left side -->
      <div class="flex items-center gap-3">
        <!-- Back button on mobile when not on Dashboard -->
        <button
          v-if="isMobile && route.path !== '/'"
          @click="handleBack"
          class="p-2 -ml-1.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          title="Kembali ke Beranda"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <!-- Brand logo on Mobile if on Dashboard -->
        <div v-if="isMobile && route.path === '/'" class="flex items-center gap-2.5">
          <img src="/logo.png" alt="Logo SAPA RSTN" class="w-8 h-8 object-contain rounded-lg shrink-0" />
          <div>
            <h1 class="text-sm font-bold text-gray-800 leading-tight">SAPA RSTN</h1>
            <p class="text-[9px] text-emerald-600 font-medium leading-none">RSUD R.A.A Tjokronegoro</p>
          </div>
        </div>

        <!-- Page title (Desktop/Tablet or Mobile Subpage) -->
        <div v-else-if="!isMobile || route.path !== '/'">
          <h1 class="text-base sm:text-lg font-bold text-gray-800 leading-tight">{{ currentTitle }}</h1>
          <p class="text-xs text-gray-400 hidden md:block mt-0.5">{{ formattedDate }}</p>
        </div>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-2">
        <!-- Notification bell -->
        <div ref="notifContainer" class="relative">
          <button 
            @click="toggleNotifPanel"
            class="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span v-if="notificationStore.totalUnreadCount > 0" class="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full ring-2 ring-white flex items-center justify-center text-[8px] font-bold text-white">
              {{ notificationStore.totalUnreadCount > 9 ? '9+' : notificationStore.totalUnreadCount }}
            </span>
          </button>
          <NotificationDropdown v-if="showNotifPanel" @close="showNotifPanel = false" />
          <!-- Modal rincian notifikasi: dirender selalu (v-if dikelola store),
               sejajar dengan dropdown agar tidak ikut ter-unmount saat panel ditutup. -->
          <NotificationDetailModal />
        </div>

        <template v-if="authStore.isAuthenticated">
          <!-- Profile -->
          <button
            class="flex items-center gap-2 py-1.5 px-2 sm:px-3 rounded-xl hover:bg-gray-100 transition-colors"
            @click="$router.push({ name: 'Profile' })"
          >
            <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-200/50">
              <svg class="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="hidden md:block text-left">
              <p class="text-sm font-semibold text-gray-700 leading-tight truncate max-w-[160px]">
                {{ authStore.namaPasien || ('RM ' + authStore.userNorm) }}
              </p>
              <p class="text-[10px] text-gray-400 mt-0.5">RM {{ authStore.userNorm }}</p>
            </div>
          </button>
        </template>

        <!-- Guest / Public User -->
        <template v-else>
          <router-link
            v-if="route.path !== '/login'"
            to="/login"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all duration-200 active:scale-95"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            <span>Masuk</span>
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useNotificationStore } from '../../stores/notification'
import { useResponsive } from '../../composables/useResponsive'
import NotificationDropdown from './NotificationDropdown.vue'
import NotificationDetailModal from './NotificationDetailModal.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { isMobile } = useResponsive()

const notifContainer = ref(null)
const showNotifPanel = ref(false)

function toggleNotifPanel() {
  showNotifPanel.value = !showNotifPanel.value
  if (showNotifPanel.value) {
    if (authStore.isAuthenticated) {
      notificationStore.fetchNotifications(false) // refresh data di background saat dropdown dibuka
    }
    notificationStore.fetchBlastNotifications()
  }
}

function handleClickOutside(event) {
  if (showNotifPanel.value && notifContainer.value && !notifContainer.value.contains(event.target)) {
    showNotifPanel.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  if (authStore.isAuthenticated) {
    notificationStore.fetchNotifications()
    notificationStore.startPolling(30000) // Polling setiap 30 detik
  }
  // Selalu muat pengumuman agar pengguna umum bisa melihat badge notifikasi
  notificationStore.fetchBlastNotifications()
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
  notificationStore.stopPolling()
})

watch(() => authStore.isAuthenticated, (newVal) => {
  if (newVal) {
    notificationStore.fetchNotifications()
    notificationStore.startPolling(30000)
  } else {
    notificationStore.stopPolling()
  }
})

const currentTitle = computed(() => route.meta.title || 'Dashboard')

function handleBack() {
  const directHomeRoutes = ['/edukasi', '/jadwal-dokter', '/info-tempat-tidur', '/login', '/pilih-penjamin', '/antrian-farmasi']
  if (directHomeRoutes.includes(route.path)) {
    router.push('/')
  } else if (window.history.state && window.history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
}

const formattedDate = computed(() => {
  const now = new Date()
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
})
</script>

