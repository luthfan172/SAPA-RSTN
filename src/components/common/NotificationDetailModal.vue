<template>
  <Teleport to="body">
    <transition name="notif-detail-fade">
      <div
        v-if="notificationStore.activeDetail"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="notificationStore.closeNotifDetail()"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notif-detail-title"
      >
        <div
          class="notif-detail-sheet bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          <!-- Header modal -->
          <div class="px-6 pt-6 pb-4 flex items-start justify-between gap-4 shrink-0 border-b border-gray-100">
            <div class="space-y-2 flex-1 min-w-0">
              <!-- Badge tipe notifikasi -->
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold"
                :class="badgeClass"
              >
                <span v-html="badgeIcon" class="shrink-0"></span>
                {{ badgeLabel }}
              </span>

              <!-- Judul lengkap (tidak dipotong) -->
              <h3
                id="notif-detail-title"
                class="text-lg font-bold text-gray-800 leading-snug"
              >
                {{ notificationStore.activeDetail.item.judul }}
              </h3>
            </div>

            <!-- Tombol tutup (X) -->
            <button
              @click="notificationStore.closeNotifDetail()"
              class="w-9 h-9 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center shrink-0 -mr-1 -mt-1"
              title="Tutup"
              aria-label="Tutup modal rincian notifikasi"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Body: isi pesan dan tanggal -->
          <div class="px-6 py-5 overflow-y-auto flex-1">
            <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {{ notificationStore.activeDetail.item.pesan }}
            </p>
            <p class="text-xs text-gray-400 mt-4 font-medium"
               :class="{ 'italic': !notificationStore.activeDetail.item.tanggal }">
              {{ formatTanggalLengkap(notificationStore.activeDetail.item.tanggal) }}
            </p>
          </div>

          <!-- Footer tombol aksi -->
          <div
            class="px-6 py-4 border-t border-gray-100 shrink-0 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end"
          >
            <!-- Tombol Tutup -->
            <button
              @click="notificationStore.closeNotifDetail()"
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95"
              :class="hasNavigation
                ? 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200'"
            >
              Tutup
            </button>

            <!-- Tombol navigasi lanjutan (hanya tampil jika ada tujuan) -->
            <button
              v-if="hasNavigation"
              @click="notificationStore.confirmNotifDetailNavigation(router)"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-bold shadow-sm shadow-emerald-200 transition-all duration-200"
            >
              <span>{{ navButtonLabel }}</span>
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <!-- panah kanan untuk internal, panah eksternal untuk external -->
                <template v-if="notificationStore.activeDetail.target.kind === 'internal'">
                  <polyline points="9 18 15 12 9 6"/>
                </template>
                <template v-else>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </template>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '../../stores/notification'

const router = useRouter()
const notificationStore = useNotificationStore()

/**
 * Apakah notifikasi aktif memiliki tujuan navigasi (internal atau external).
 */
const hasNavigation = computed(() => {
  const detail = notificationStore.activeDetail
  return detail && detail.target.kind !== 'none'
})

/**
 * Label tombol navigasi sesuai jenis tujuan.
 */
const navButtonLabel = computed(() => {
  const detail = notificationStore.activeDetail
  if (!detail) return ''
  return detail.target.kind === 'external'
    ? 'Buka Tautan Terkait'
    : 'Lanjutkan ke Halaman Terkait'
})

/**
 * Kelas Tailwind untuk badge tipe notifikasi — konsisten dengan getIcon di dropdown.
 * Item personal tidak memiliki field tipe — ditampilkan sebagai badge generik.
 */
const badgeClass = computed(() => {
  const detail = notificationStore.activeDetail
  if (!detail) return ''
  switch (detail.item.tipe) {
    case 'JADWAL':     return 'bg-blue-100 text-blue-700'
    case 'PERINGATAN': return 'bg-amber-100 text-amber-700'
    case 'PENGUMUMAN': return 'bg-purple-100 text-purple-700'
    case 'INFO':
    default:           return 'bg-emerald-100 text-emerald-700'
  }
})

/**
 * Label teks untuk badge tipe.
 * Menampilkan 'Notifikasi' sebagai default untuk item personal yang tidak memiliki tipe.
 */
const badgeLabel = computed(() => {
  const detail = notificationStore.activeDetail
  if (!detail) return ''
  const map = {
    JADWAL:     'Jadwal',
    PERINGATAN: 'Peringatan',
    PENGUMUMAN: 'Pengumuman',
    INFO:       'Informasi',
  }
  // Fallback ke 'Notifikasi' jika tipe tidak ada (item personal dari API saat ini)
  return map[detail.item.tipe] || 'Notifikasi'
})

/**
 * Ikon SVG kecil untuk badge (inline, konsisten dengan getIcon di dropdown).
 */
const badgeIcon = computed(() => {
  const detail = notificationStore.activeDetail
  if (!detail) return ''
  switch (detail.item.tipe) {
    case 'JADWAL':
      return `<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
    case 'PERINGATAN':
      return `<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    case 'PENGUMUMAN':
      return `<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>`
    case 'INFO':
    default:
      return `<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  }
})

/**
 * Format tanggal ke bahasa Indonesia lengkap dengan jam, contoh:
 * "Rabu, 24 September 2026 pukul 07.52 WIB"
 * Mendukung format ISO dan "YYYY-MM-DD HH:mm:ss" dari API personal.
 */
function formatTanggalLengkap(tanggal) {
  if (!tanggal) return 'Tanggal tidak tersedia'
  // Normalisasi "YYYY-MM-DD HH:mm:ss" → ISO agar Date() parse dengan benar
  const normalized = typeof tanggal === 'string' ? tanggal.replace(' ', 'T') : tanggal
  const date = new Date(normalized)
  if (isNaN(date.getTime())) return 'Tanggal tidak tersedia'

  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ]

  const namaHari  = hari[date.getDay()]
  const tgl       = date.getDate()
  const namaBulan = bulan[date.getMonth()]
  const tahun     = date.getFullYear()
  const jam       = String(date.getHours()).padStart(2, '0')
  const menit     = String(date.getMinutes()).padStart(2, '0')

  return `${namaHari}, ${tgl} ${namaBulan} ${tahun} pukul ${jam}.${menit} WIB`
}
</script>

<style scoped>
/* Transisi fade untuk overlay */
.notif-detail-fade-enter-active,
.notif-detail-fade-leave-active {
  transition: opacity 0.2s ease;
}
.notif-detail-fade-enter-from,
.notif-detail-fade-leave-to {
  opacity: 0;
}

/* Animasi slide-up untuk sheet pada mobile */
.notif-detail-sheet {
  animation: notif-sheet-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes notif-sheet-in {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 640px) {
  .notif-detail-sheet {
    animation: notif-modal-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes notif-modal-in {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
}
</style>
