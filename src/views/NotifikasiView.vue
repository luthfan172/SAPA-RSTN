<template>
  <div class="max-w-4xl mx-auto space-y-5 sm:space-y-6" style="animation: fade-in 0.3s ease-out;">

    <!-- Banner Header -->
    <div class="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-3xl p-4 sm:p-6 text-white shadow-lg shadow-emerald-950/10 relative overflow-hidden">
      <div class="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-lg pointer-events-none"></div>
      <div class="relative z-10 flex items-center gap-3 sm:gap-4">
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
        <div class="min-w-0 space-y-0.5">
          <h2 class="text-sm sm:text-lg md:text-xl font-black text-white tracking-tight leading-snug">
            Semua Notifikasi
          </h2>
          <p class="text-[11px] sm:text-xs text-emerald-200/90 font-medium">
            Riwayat notifikasi personal &amp; pengumuman lengkap
          </p>
        </div>
      </div>
    </div>

    <!-- Tab Switcher Personal / Pengumuman -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="flex border-b border-gray-100">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="switchTab(tab.key)"
          class="flex-1 py-3 text-sm font-semibold transition-colors relative"
          :class="activeTab === tab.key
            ? 'text-emerald-700 bg-emerald-50/60'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
        >
          {{ tab.label }}
          <!-- Garis bawah aktif -->
          <span
            v-if="activeTab === tab.key"
            class="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-600 rounded-full"
          ></span>
        </button>
      </div>

      <!-- ── TAB PERSONAL ──────────────────────────────────────────────── -->
      <div v-if="activeTab === 'personal'">

        <!-- Belum login -->
        <div
          v-if="!authStore.isAuthenticated"
          class="py-12 flex flex-col items-center justify-center gap-4 text-center px-6"
        >
          <div class="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center">
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div class="space-y-1.5">
            <h3 class="text-base font-bold text-gray-700">Masuk untuk Melihat Notifikasi</h3>
            <p class="text-xs text-gray-400 leading-relaxed max-w-xs">
              Notifikasi personal hanya tersedia bagi pasien yang sudah masuk ke akun.
            </p>
          </div>
          <button
            @click="router.push({ name: 'Login', query: { redirect: route.fullPath } })"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Masuk Sekarang
          </button>
        </div>

        <!-- Loading awal personal -->
        <div v-else-if="personal.loading && personal.list.length === 0" class="py-16 flex flex-col items-center justify-center gap-3 text-gray-400">
          <svg class="w-8 h-8 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/>
          </svg>
          <span class="text-xs font-semibold">Memuat notifikasi personal...</span>
        </div>

        <!-- Error personal -->
        <div v-else-if="personal.error && personal.list.length === 0" class="py-10 text-center space-y-3 px-6">
          <p class="text-sm text-red-500 font-medium">{{ personal.error }}</p>
          <button
            @click="fetchPersonal(true)"
            class="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-all cursor-pointer"
          >Coba Lagi</button>
        </div>

        <!-- Empty personal -->
        <div v-else-if="personal.list.length === 0" class="py-12 flex flex-col items-center justify-center gap-3 text-center px-6">
          <div class="w-14 h-14 rounded-2xl bg-gray-50 text-gray-300 flex items-center justify-center">
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <p class="text-sm font-semibold text-gray-500">Belum ada notifikasi personal</p>
        </div>

        <!-- List + Infinite Scroll personal -->
        <div v-else class="divide-y divide-gray-50">
          <!-- Tandai semua dibaca (personal) -->
          <div v-if="personal.list.some(i => !notificationStore.readPersonalIds.has(i.id))" class="px-4 py-2 flex justify-end border-b border-gray-50">
            <button
              @click="notificationStore.markAllPersonalAsRead(personal.list)"
              class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Tandai semua dibaca
            </button>
          </div>

          <NotificationListItem
            v-for="item in personal.list"
            :key="item.id"
            :item="{ ...item, sudahDibaca: notificationStore.readPersonalIds.has(item.id) }"
            :has-target="resolveNotifTarget(item).kind !== 'none'"
            @click="handleItemClick($event, 'personal')"
          />

          <!-- Trigger infinite scroll -->
          <div ref="personalLoadMoreTrigger" class="py-3 flex items-center justify-center text-center">
            <div v-if="personal.loadingMore" class="flex items-center gap-2 py-1 text-xs font-semibold text-emerald-600">
              <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/>
              </svg>
              <span>Memuat lebih banyak...</span>
            </div>
            <div v-else-if="!personal.hasMore" class="text-[11px] text-gray-400 py-1.5 font-medium flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Semua notifikasi personal telah ditampilkan</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── TAB PENGUMUMAN ─────────────────────────────────────────────── -->
      <div v-else-if="activeTab === 'blasting'">

        <!-- Loading awal pengumuman -->
        <div v-if="notificationStore.blastLoading && notificationStore.blastList.length === 0" class="py-16 flex flex-col items-center justify-center gap-3 text-gray-400">
          <svg class="w-8 h-8 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/>
          </svg>
          <span class="text-xs font-semibold">Memuat pengumuman...</span>
        </div>

        <!-- Error pengumuman -->
        <div v-else-if="notificationStore.blastError && notificationStore.blastList.length === 0" class="py-10 text-center space-y-3 px-6">
          <p class="text-sm text-red-500 font-medium">{{ notificationStore.blastError }}</p>
          <button
            @click="fetchBlasting()"
            class="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-all cursor-pointer"
          >Coba Lagi</button>
        </div>

        <!-- Empty pengumuman -->
        <div v-else-if="notificationStore.blastList.length === 0" class="py-12 flex flex-col items-center justify-center gap-3 text-center px-6">
          <div class="w-14 h-14 rounded-2xl bg-gray-50 text-gray-300 flex items-center justify-center">
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 11l18-5v12L3 14v-3z"/>
              <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
            </svg>
          </div>
          <p class="text-sm font-semibold text-gray-500">Belum ada pengumuman</p>
        </div>

        <!-- List pengumuman (satu kali fetch, tampil semua — tidak ada infinite scroll) -->
        <div v-else class="divide-y divide-gray-50">
          <!-- Tandai semua dibaca (blasting) -->
          <div v-if="notificationStore.blastList.some(i => !notificationStore.readBlastIds.has(i.id))" class="px-4 py-2 flex justify-end border-b border-gray-50">
            <button
              @click="notificationStore.markAllBlastAsRead(notificationStore.blastList)"
              class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Tandai semua dibaca
            </button>
          </div>

          <NotificationListItem
            v-for="item in notificationStore.blastList"
            :key="item.id"
            :item="{ ...item, sudahDibaca: notificationStore.readBlastIds.has(item.id) }"
            :has-target="resolveNotifTarget(item).kind !== 'none'"
            :is-blast="true"
            @click="handleItemClick($event, 'blasting')"
          />

          <!-- Indikator akhir daftar (tanpa infinite scroll) -->
          <div class="text-[11px] text-gray-400 py-3 font-medium flex items-center justify-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Semua pengumuman telah ditampilkan</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'
import { resolveNotifTarget } from '../utils/notifTarget'
import NotificationListItem from '../components/common/NotificationListItem.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// ── Tab state ─────────────────────────────────────────────────────────────────

const tabs = [
  { key: 'personal',  label: 'Personal' },
  { key: 'blasting',  label: 'Pengumuman' },
]

/** Tab yang sedang aktif; dibaca dari query string, default 'personal'. */
const activeTab = ref(
  tabs.some(t => t.key === route.query.tab)
    ? route.query.tab
    : 'personal'
)

function switchTab(key) {
  activeTab.value = key
  router.replace({ query: { ...route.query, tab: key } })
}

// ── State per-tab (terpisah dari store dropdown) ──────────────────────────────

const PAGE_SIZE = 15

const personal = reactive({
  list:        [],
  page:        1,
  loading:     false,
  loadingMore: false,
  error:       '',
  hasMore:     true,
})

// Blasting tidak memiliki state lokal — dikelola di notificationStore (blastList, blastLoading, blastError)

// ── IntersectionObserver refs ─────────────────────────────────────────────────

const personalLoadMoreTrigger = ref(null)
let personalObserver = null

// ── Fetch Personal ────────────────────────────────────────────────────────────

async function fetchPersonal(isInitial = false) {
  if (!authStore.isAuthenticated) return
  if (isInitial) {
    personal.loading     = true
    personal.error       = ''
    personal.page        = 1
    personal.hasMore     = true
    personal.list        = []
  } else {
    personal.loadingMore = true
  }

  try {
    const response = await api.get('/notifikasi/list', {
      params: { page: personal.page, pageSize: PAGE_SIZE }
    })
    const res = response.data

    if (res && (res.code === '200' || res.code === 200)) {
      const raw = Array.isArray(res.data) ? res.data : []
      // Normalisasi field API → field seragam komponen, filter publish !== '0'
      const items = raw
        .filter(r => r.publish !== '0')
        .map(notificationStore.normalizePersonalItem)
      if (isInitial) {
        personal.list = items
      } else {
        const existingIds = new Set(personal.list.map(i => i.id))
        items.forEach(item => { if (!existingIds.has(item.id)) personal.list.push(item) })
      }
      // Manfaatkan pagination.hasNext dari API (persis pola Tagihan)
      if (res.pagination) {
        personal.hasMore = res.pagination.hasNext === true
      } else {
        personal.hasMore = items.length >= PAGE_SIZE
      }
    } else if (res && (res.code === '404' || res.code === 404)) {
      if (isInitial) personal.list = []
      personal.hasMore = false
    } else {
      if (isInitial) personal.error = res?.message || 'Gagal memuat notifikasi personal.'
      personal.hasMore = false
    }
  } catch (err) {
    if (err.response?.status === 404 || err.response?.data?.code === '404') {
      if (isInitial) personal.list = []
      personal.hasMore = false
    } else {
      if (isInitial) personal.error = err.response?.data?.message || 'Terjadi kesalahan jaringan.'
    }
  } finally {
    personal.loading     = false
    personal.loadingMore = false
  }
}

// ── Fetch Blasting (Pengumuman) ───────────────────────────────────────────────

/**
 * Delegasi ke store — satu kali fetch, semua data dikembalikan sekaligus.
 * API /notifikasi/info-rstn tidak mendukung paginasi.
 */
async function fetchBlasting() {
  await notificationStore.fetchBlastNotifications()
}

// ── IntersectionObserver setup ────────────────────────────────────────────────

function setupPersonalObserver() {
  if (personalObserver) personalObserver.disconnect()
  personalObserver = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (
      entry.isIntersecting &&
      personal.hasMore &&
      !personal.loading &&
      !personal.loadingMore &&
      personal.list.length > 0
    ) {
      personal.page++
      fetchPersonal(false)
    }
  }, { rootMargin: '150px', threshold: 0.1 })

  nextTick(() => {
    if (personalLoadMoreTrigger.value) {
      personalObserver.observe(personalLoadMoreTrigger.value)
    }
  })
}

// ── Item click handler ────────────────────────────────────────────────────────

/**
 * Klik item notifikasi:
 * 1. Tandai dibaca di store (badge bel tetap sinkron).
 * 2. Update sudahDibaca di list lokal halaman ini (UI langsung berubah).
 * 3. Buka modal rincian (reuse NotificationDetailModal via store).
 *
 * @param {Object} item    - item notifikasi yang diklik
 * @param {string} context - 'personal' | 'blasting'
 */
function handleItemClick(item, context) {
  if (context === 'personal') {
    // Tandai di readPersonalIds store (localStorage, tidak ada API saat ini)
    notificationStore.markPersonalAsRead(item.id)
    // Tidak perlu mutasi personal.list karena template membaca readPersonalIds secara reaktif
  } else {
    // Tandai di readBlastIds store
    notificationStore.markBlastAsRead(item.id)
    // Tidak perlu mutasi blasting.list karena template membaca readBlastIds secara reaktif
  }
  // Buka modal rincian yang sama dengan dropdown — menggunakan store yang sama persis
  notificationStore.openNotifDetail(item, context)
}

// ── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(async () => {
  // Fetch kedua tab sekaligus saat halaman pertama dimuat
  await Promise.all([
    fetchPersonal(true),
    fetchBlasting(),   // satu kali fetch — tidak ada paginasi untuk Pengumuman
  ])
  setupPersonalObserver()
  // Tidak ada setupBlastingObserver — tab Pengumuman tidak memakai infinite scroll
})

// Re-attach observer saat tab berganti (refs bisa berubah saat v-if toggle)
watch(activeTab, async (newTab) => {
  await nextTick()
  if (newTab === 'personal') {
    setupPersonalObserver()
  }
  // Tab blasting tidak perlu setup observer
})

onUnmounted(() => {
  if (personalObserver) personalObserver.disconnect()
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
