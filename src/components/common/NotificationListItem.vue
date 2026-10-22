<template>
  <div
    class="p-4 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer relative"
    :class="[
      isBlast ? (item.sudahDibaca ? 'bg-amber-50/20 border-l-4 border-amber-200/50' : 'bg-amber-50/80 border-l-4 border-amber-500') : (item.sudahDibaca ? 'bg-transparent border-l-4 border-transparent' : 'bg-emerald-50/40 border-l-4 border-emerald-500')
    ]"
    @click="emit('click', item)"
  >
    <!-- Ikon tipe notifikasi -->
    <div class="mt-0.5 shrink-0" v-html="iconHtml"></div>

    <!-- Konten teks -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <span v-if="isBlast" class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700 tracking-wider">PENGUMUMAN</span>
        <h4
          class="text-sm font-bold leading-tight truncate"
          :class="item.sudahDibaca ? 'text-gray-700' : (isBlast ? 'text-amber-900' : 'text-emerald-900')"
        >{{ item.judul }}</h4>
      </div>
      <p class="text-xs text-gray-600 mt-0.5 line-clamp-2 leading-relaxed">{{ item.pesan || item.isi }}</p>
      <p class="text-[10px] text-gray-400 mt-2 font-medium">{{ formatWaktuRelatif(item.tanggal || item.create_date) }}</p>
    </div>

    <!-- Indikator kanan: dot unread + panah -->
    <div class="flex flex-col items-center gap-1.5 shrink-0">
      <div v-if="!item.sudahDibaca" class="w-2 h-2 rounded-full mt-1.5" :class="isBlast ? 'bg-amber-500' : 'bg-emerald-500'"></div>
      <!-- Indikator panah: tampil hanya jika ada tujuan navigasi -->
      <svg
        v-if="hasTarget"
        class="w-4 h-4 text-gray-300 mt-1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** Objek item notifikasi dari store atau list lokal halaman. */
  item: {
    type: Object,
    required: true,
  },
  /**
   * Apakah item ini punya tujuan navigasi (dari resolveNotifTarget(item).kind !== 'none').
   * Diharuskan dihitung oleh komponen induk agar NotificationListItem tidak perlu import
   * resolveNotifTarget sendiri — mengurangi duplikasi pemanggilan.
   */
  hasTarget: {
    type: Boolean,
    default: false,
  },
  /** Apakah item ini adalah notifikasi global (pengumuman) */
  isBlast: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

/**
 * HTML ikon SVG sesuai tipe notifikasi — konsisten dengan getIcon di dropdown sebelumnya.
 */
const iconHtml = computed(() => {
  const baseClass = 'w-8 h-8 rounded-full flex items-center justify-center shrink-0'
  
  if (props.isBlast) {
    return `<div class="${baseClass} bg-amber-100 text-amber-600"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg></div>`
  }

  switch (props.item.tipe) {
    case 'JADWAL':
      return `<div class="${baseClass} bg-blue-100 text-blue-600"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>`
    case 'PERINGATAN':
      return `<div class="${baseClass} bg-red-100 text-red-600"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>`
    case 'PENGUMUMAN':
      return `<div class="${baseClass} bg-amber-100 text-amber-600"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg></div>`
    case 'INFO':
    default:
      return `<div class="${baseClass} bg-emerald-100 text-emerald-600 font-bold text-lg font-serif italic leading-none pb-0.5">i</div>`
  }
})

/**
 * Format waktu relatif dari tanggal ke string Indonesia.
 * Mendukung format ISO (dari dummy/blasting) dan "YYYY-MM-DD HH:mm:ss" (dari API personal).
 */
function formatWaktuRelatif(tanggal) {
  if (!tanggal) return 'Tanggal tidak tersedia'
  // Normalisasi "YYYY-MM-DD HH:mm:ss" → "YYYY-MM-DDTHH:mm:ss" agar Date() bisa parse dengan benar
  const normalized = typeof tanggal === 'string' ? tanggal.replace(' ', 'T') : tanggal
  const date = new Date(normalized)
  if (isNaN(date.getTime())) return 'Tanggal tidak tersedia'
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'Baru saja'

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} jam lalu`

  if (diffInHours < 48) return 'Kemarin'

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}
</script>
