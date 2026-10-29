<template>
  <div 
    class="absolute right-0 top-full mt-2 w-full sm:w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 flex flex-col"
    :class="{ 'fixed inset-x-0 mx-4 top-16': isMobile }"
    style="max-height: 70vh;"
  >
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white z-10 sticky top-0">
      <h3 class="text-base font-bold text-gray-800">
        {{ authStore.isAuthenticated ? 'Notifikasi' : 'Pengumuman' }}
      </h3>
      <button 
        v-if="hasUnread"
        @click="markAllAsRead"
        class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
      >
        Tandai semua dibaca
      </button>
    </div>

    <!-- Content -->
    <div class="overflow-y-auto flex-1 overscroll-contain">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-8 text-center flex flex-col items-center justify-center gap-2">
        <svg class="w-6 h-6 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/></svg>
      </div>

      <!-- Empty / No Notification State -->
      <div v-else-if="errorMsg || displayList.length === 0" class="p-8 text-center flex flex-col items-center justify-center">
        <p class="text-sm font-semibold text-gray-500">Tidak ada notifikasi</p>
      </div>

      <!-- List -->
      <div v-else class="divide-y divide-gray-50">
        <NotificationListItem
          v-for="item in displayList"
          :key="item.id"
          :item="{ ...item, sudahDibaca: isRead(item) }"
          :has-target="getTarget(item).kind !== 'none'"
          :is-blast="item._isBlast"
          @click="handleNotifClick"
        />
      </div>
    </div>

    <!-- Footer: Tampilkan Semua Notifikasi -->
    <div class="border-t border-gray-100 shrink-0">
      <button
        class="w-full py-3 text-center text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
        @click="goToAllNotifications"
      >
        {{ authStore.isAuthenticated ? 'Tampilkan Semua Notifikasi' : 'Tampilkan Semua Pengumuman' }}
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useNotificationStore } from '../../stores/notification'
import { useResponsive } from '../../composables/useResponsive'
import { resolveNotifTarget } from '../../utils/notifTarget'
import NotificationListItem from './NotificationListItem.vue'

const emit = defineEmits(['close'])

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { isMobile } = useResponsive()

const displayList = computed(() => {
  let combined = []

  if (authStore.isAuthenticated) {
    const personal = notificationStore.list.map(item => ({ ...item, _isBlast: false }))
    const blast = notificationStore.blastList.map(item => ({ ...item, _isBlast: true }))
    combined = [...personal, ...blast]
  } else {
    combined = notificationStore.blastList.map(item => ({ ...item, _isBlast: true }))
  }

  // Sort descending by date (safely handling null/invalid)
  combined.sort((a, b) => {
    const parseDate = (d) => {
      if (!d) return 0
      const parsed = new Date(d.replace(' ', 'T')).getTime()
      return isNaN(parsed) ? 0 : parsed
    }
    return parseDate(b.tanggal) - parseDate(a.tanggal)
  })

  return combined.slice(0, 10)
})

const isLoading = computed(() => {
  return authStore.isAuthenticated 
    ? (notificationStore.loading || notificationStore.blastLoading) 
    : notificationStore.blastLoading
})

const errorMsg = computed(() => {
  return authStore.isAuthenticated 
    ? (notificationStore.error || notificationStore.blastError) 
    : notificationStore.blastError
})

const hasUnread = computed(() => {
  return notificationStore.totalUnreadCount > 0
})

function isRead(item) {
  if (item._isBlast) return notificationStore.readBlastIds.has(item.id)
  return notificationStore.readPersonalIds.has(item.id)
}

function fetchNotifications() {
  if (authStore.isAuthenticated) {
    notificationStore.fetchNotifications()
  } else {
    notificationStore.fetchBlastNotifications()
  }
}

function markAllAsRead() {
  if (authStore.isAuthenticated) {
    notificationStore.markAllPersonalAsRead(notificationStore.list)
    notificationStore.markAllBlastAsRead(notificationStore.blastList)
  } else {
    notificationStore.markAllBlastAsRead(notificationStore.blastList)
  }
}

/**
 * Menutup panel notifikasi via emit ke parent (AppHeader).
 */
function closeDropdown() {
  emit('close')
}

/**
 * Mengembalikan objek target untuk item notifikasi.
 * Dipanggil saat render list agar konsisten (tidak dihitung berulang-ulang secara terpisah).
 */
function getTarget(item) {
  return resolveNotifTarget(item)
}

/**
 * Dipanggil saat pengguna mengklik item notifikasi.
 * Membuka modal rincian terlebih dahulu — navigasi terjadi di dalam modal.
 * Tandai dibaca dikelola oleh openNotifDetail di store.
 */
function handleNotifClick(item) {
  const context = item._isBlast ? 'blasting' : 'personal'
  notificationStore.openNotifDetail(item, context)
  closeDropdown()
}

/**
 * Navigasi ke halaman riwayat notifikasi lengkap, lalu tutup dropdown.
 * Meneruskan tab aktif saat ini ('personal') via query string agar halaman
 * tujuan bisa membuka tab yang sesuai secara langsung.
 */
function goToAllNotifications() {
  closeDropdown()
  const tab = authStore.isAuthenticated ? 'personal' : 'blasting'
  router.push({ name: 'NotifikasiSemua', query: { tab } })
}
</script>
