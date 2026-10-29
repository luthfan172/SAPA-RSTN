import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import api from '../services/api'
import { useAuthStore } from './auth'
import { resolveNotifTarget } from '../utils/notifTarget'

// Batas maksimal ID tersimpan di localStorage (identik dengan pola readBlastIds)
const MAX_READ_IDS = 200

// Key localStorage untuk readBlastIds (publik, tidak per-user)
const BLAST_READ_KEY = 'sapaRstn_read_blast_notif'

/**
 * Hasilkan ID unik yang deterministik untuk item notifikasi global.
 * Karena API /notifikasi/info-rstn tidak mengembalikan field `id`,
 * kita hash kombinasi judul+isi+create_date menjadi string stabil.
 * Sama input → sama output, sehingga status "sudah dibaca" di localStorage
 * tetap konsisten antar sesi selama konten item tidak berubah.
 *
 * @param {{ judul?: string, isi?: string, create_date?: string|null }} item
 * @returns {string} ID sintetis dengan prefix 'blast_'
 */
function buildBlastId(item) {
  const raw = `${item.judul ?? ''}|${item.isi ?? ''}|${item.create_date ?? ''}`
  let hash = 0
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i)
    hash |= 0
  }
  return `blast_${hash}`
}

/**
 * Normalisasi satu item notifikasi personal dari API ke bentuk seragam yang dipakai
 * seluruh komponen (judul, pesan, tanggal, sudahDibaca dikelola via readPersonalIds).
 *
 * Field API personal:
 *   id (number), norm, judul, isi → pesan, create_date → tanggal, status, publish
 *
 * Normalisasi ini dilakukan SEKALI di sini, sehingga NotificationListItem, NotificationDetailModal,
 * dan NotificationDropdown tidak perlu tahu dari API mana data itu berasal.
 */
function normalizePersonalItem(raw) {
  return {
    // Identitas (angka, dipakai apa adanya)
    id:          raw.id,
    norm:        raw.norm,
    // Konten — field API → nama seragam komponen
    judul:       raw.judul   ?? '',
    pesan:       raw.isi     ?? '',   // API: isi → komponen: pesan
    tanggal:     raw.create_date ?? null, // API: create_date → komponen: tanggal
    // Tidak ada field tipe dari API personal saat ini
    // TODO: API notifikasi personal belum menyediakan field kategori/tipe —
    //       tampilkan ikon default untuk semua item sampai mentor menambahkannya
    tipe:        undefined,
    // Publish: opsional filter, bukan status baca
    publish:     raw.publish,
    status:      raw.status,
    // sudahDibaca TIDAK diambil dari API (tidak ada field yang terkonfirmasi maknanya);
    // status baca personal dikelola 100% via readPersonalIds + localStorage
    sudahDibaca: false, // placeholder — diisi reaktif oleh computed di view
  }
}

export const useNotificationStore = defineStore('notification', () => {
  // ── State dropdown (list singkat untuk bel header) ─────────────────────────
  const list    = ref([])
  const loading = ref(false)
  const error   = ref(null)

  /**
   * State detail notifikasi yang sedang aktif ditampilkan di modal.
   * null  → tidak ada modal yang terbuka.
   * object → { item, context, target } saat modal sedang tampil.
   */
  const activeDetail = ref(null)

  // ── readBlastIds — status baca lokal untuk Blasting (Pengumuman) ───────────
  /**
   * Set ID sintetis notifikasi blasting (pengumuman) yang sudah dibaca.
   * Persisten ke localStorage dengan key BLAST_READ_KEY (tidak per-user,
   * karena pengumuman bersifat publik).
   * ID dihasilkan oleh buildBlastId() — deterministik antar sesi.
   */
  const readBlastIds = ref(new Set())

  // ── Muat readBlastIds dari localStorage saat inisialisasi ──────────────────
  ;(function loadReadBlastFromStorage() {
    try {
      const raw = localStorage.getItem(BLAST_READ_KEY)
      if (raw) {
        const arr = JSON.parse(raw)
        readBlastIds.value = new Set(Array.isArray(arr) ? arr : [])
      }
    } catch {
      readBlastIds.value = new Set()
    }
  })()

  function saveReadBlastToStorage() {
    try {
      let arr = Array.from(readBlastIds.value)
      if (arr.length > MAX_READ_IDS) arr = arr.slice(arr.length - MAX_READ_IDS)
      localStorage.setItem(BLAST_READ_KEY, JSON.stringify(arr))
    } catch {
      // Abaikan jika localStorage penuh
    }
  }

  // ── State blasting (untuk dropdown jika diperlukan) ────────────────────────
  const blastList    = ref([])
  const blastLoading = ref(false)
  const blastError   = ref(null)

  // ── readPersonalIds — status baca lokal untuk Personal ────────────────────
  /**
   * Set ID notifikasi personal yang sudah dibaca, disimpan di localStorage
   * dengan namespace per-NORM pasien agar tidak bercampur antar akun pada
   * perangkat yang sama.
   *
   * TODO: ganti balik ke sinkronisasi server (POST /notifikasi/.../tandai-dibaca)
   *       begitu endpoint ini selesai dibuat mentor — saat ini status baca personal
   *       disimpan lokal karena backend belum menyediakan field/endpoint status baca.
   */
  const readPersonalIds = ref(new Set())

  /**
   * Kembalikan key localStorage yang di-namespace per NORM.
   * Fallback ke 'unknown' jika NORM belum tersedia.
   */
  function getPersonalReadKey(norm) {
    return `sapaRstn_read_personal_notif_${norm || 'unknown'}`
  }

  /**
   * Muat readPersonalIds dari localStorage sesuai NORM yang sedang login.
   * Dipanggil saat init store dan saat NORM berubah (login/logout/ganti akun).
   */
  function loadReadPersonalFromStorage(norm) {
    try {
      const key  = getPersonalReadKey(norm)
      const raw  = localStorage.getItem(key)
      if (raw) {
        const arr = JSON.parse(raw)
        readPersonalIds.value = new Set(Array.isArray(arr) ? arr : [])
      } else {
        readPersonalIds.value = new Set()
      }
    } catch {
      readPersonalIds.value = new Set()
    }
  }

  /**
   * Simpan readPersonalIds ke localStorage, dibatasi MAX_READ_IDS entry terbaru.
   */
  function saveReadPersonalToStorage(norm) {
    try {
      const key  = getPersonalReadKey(norm)
      let   arr  = Array.from(readPersonalIds.value)
      // Jaga ukuran: simpan MAX_READ_IDS entry paling akhir ditambahkan
      if (arr.length > MAX_READ_IDS) arr = arr.slice(arr.length - MAX_READ_IDS)
      localStorage.setItem(key, JSON.stringify(arr))
    } catch {
      // Abaikan jika localStorage penuh
    }
  }

  // ── Reactive watch: muat ulang readPersonalIds saat NORM berubah ───────────
  // (login akun baru, logout, atau reload halaman setelah login berbeda)
  // Catatan: useAuthStore() dipanggil di dalam defineStore agar Pinia sudah ready
  const authStore = useAuthStore()
  watch(
    () => authStore.userNorm,
    (newNorm) => {
      loadReadPersonalFromStorage(newNorm)
    },
    { immediate: true }
  )

  // ── unreadCount untuk badge bel header ───────────────────────────────────────
  const unreadCount = computed(() =>
    list.value.filter(n => !readPersonalIds.value.has(n.id)).length
  )

  const unreadBlastCount = computed(() =>
    blastList.value.filter(n => !readBlastIds.value.has(n.id)).length
  )

  const totalUnreadCount = computed(() => {
    if (authStore.isAuthenticated) {
      return unreadCount.value + unreadBlastCount.value
    }
    return unreadBlastCount.value
  })

  // ── Fetch dropdown (bel header) — list singkat personal ───────────────────
  async function fetchNotifications(showLoading = true) {
    if (showLoading) loading.value = true
    error.value   = null

    try {
      const response = await api.get('/notifikasi/list', {
        params: { page: 1, pageSize: 5 }
      })
      const res = response.data
      if (res && (res.code === '200' || res.code === 200)) {
        const raw = Array.isArray(res.data) ? res.data : []
        // Filter opsional: sembunyikan item dengan publish === '0'
        list.value = raw
          .filter(r => r.publish !== '0')
          .map(normalizePersonalItem)
        error.value = null
      } else if (
        res && (
          res.code === '404' || res.code === 404 ||
          (res.message && res.message.toLowerCase().includes('tidak ada notifikasi'))
        )
      ) {
        list.value = []
        error.value = null
      } else {
        throw new Error(res?.message || 'Gagal memuat notifikasi')
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || ''
      if (
        err.response?.status === 404 ||
        err.response?.data?.code === '404' ||
        err.response?.data?.code === 404 ||
        msg.toLowerCase().includes('tidak ada notifikasi')
      ) {
        list.value = []
        error.value = null
      } else {
        error.value = msg || 'Terjadi kesalahan jaringan'
      }
    } finally {
      if (showLoading) loading.value = false
    }
  }

  // ── Polling untuk notifikasi baru ──────────────────────────────────────────
  let pollingInterval = null
  
  function startPolling(intervalMs = 30000) {
    stopPolling() // Pastikan tidak ada duplikasi interval
    pollingInterval = setInterval(() => {
      if (authStore.isAuthenticated) {
        // Fetch tanpa memunculkan loading spinner agar tidak mengganggu UI
        fetchNotifications(false)
      }
    }, intervalMs)
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  // ── markPersonalAsRead ────────────────────────────────────────────────────
  /**
   * Menandai satu item notifikasi personal sebagai sudah dibaca secara lokal dan di server.
   *
   * Sinkron ke server via PUT /notifikasi/dibaca; status baca lokal tetap dipertahankan
   * karena API list belum mengembalikan field status baca secara native.
   */
  async function markPersonalAsRead(id) {
    if (readPersonalIds.value.has(id)) return
    
    // 1. Optimistic update lokal
    const newSet = new Set(readPersonalIds.value)
    newSet.add(id)
    readPersonalIds.value = newSet
    saveReadPersonalToStorage(authStore.userNorm)

    // 2. Kirim ke server (best-effort, tidak memblokir/reverting UI jika gagal)
    try {
      await api.put('/notifikasi/dibaca', { idNotif: id }, {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (err) {
      console.warn('Gagal menandai notifikasi dibaca ke server:', err)
      // JANGAN revert readPersonalIds — tetap anggap terbaca secara lokal
    }
  }

  // ── markAllPersonalAsRead — localStorage only (sementara) ─────────────────
  /**
   * Menandai seluruh item notifikasi personal yang termuat sebagai sudah dibaca.
   *
   * TODO: ganti balik ke sinkronisasi server begitu endpoint tandai-semua tersedia.
   * Referensi endpoint (dikomentari, jangan dihapus):
   *   // await api.post('/notifikasi/tandai-semua-dibaca')
   */
  function markAllPersonalAsRead(personalList) {
    if (!personalList || personalList.length === 0) return
    const newSet = new Set(readPersonalIds.value)
    personalList.forEach(item => newSet.add(item.id))
    // Juga tandai item di dropdown
    list.value.forEach(item => newSet.add(item.id))
    readPersonalIds.value = newSet
    saveReadPersonalToStorage(authStore.userNorm)
  }

  // ── markAsRead — kompatibilitas mundur (dipakai openNotifDetail) ──────────
  function markAsRead(id) {
    markPersonalAsRead(id)
  }

  // ── markAllAsRead — dipanggil dari NotificationDropdown ──────────────────
  function markAllAsRead() {
    markAllPersonalAsRead(list.value)
  }

  // ── fetchBlastNotifications — ambil pengumuman dari API asli ───────────────
  /**
   * Fetch notifikasi global (Pengumuman/Blasting) dari endpoint publik.
   * Endpoint ini:
   *   - Tidak memerlukan autentikasi (tidak boleh mengirim token)
   *   - Tidak mendukung paginasi — semua data dikembalikan sekaligus
   *   - Setiap item TIDAK memiliki field `id` — gunakan buildBlastId()
   *   - Field `create_date` bisa null — ditangani di komponen
   *
   * State yang dikelola: blastList, blastLoading, blastError
   */
  async function fetchBlastNotifications() {
    blastLoading.value = true
    blastError.value   = null

    try {
      // Endpoint publik — tidak perlu dan tidak boleh mewajibkan token.
      // Interceptor api.js hanya menambah Authorization jika token ada di localStorage,
      // sehingga pengguna yang belum login sudah aman tanpa perlu tindakan tambahan.
      // Tidak ada parameter paginasi yang dikirim karena endpoint tidak mendukungnya.
      const response = await api.get('/notifikasi/info-rstn')
      const res = response.data

      if (res && (res.code === '200' || res.code === 200)) {
        const raw = Array.isArray(res.data) ? res.data : []
        // Normalisasi: tambahkan id sintetis + seragamkan nama field
        blastList.value = raw.map(item => ({
          id:      buildBlastId(item),
          judul:   item.judul    ?? '',
          pesan:   item.isi      ?? '',   // isi → pesan (sama dengan pola personal)
          tanggal: item.create_date ?? null,  // bisa null, ditangani di komponen
          tipe:    undefined,             // tidak ada tipe dari API ini
        }))
        blastError.value = null
      } else if (
        res && (
          res.code === '404' || res.code === 404 ||
          (res.message && res.message.toLowerCase().includes('tidak ada notifikasi'))
        )
      ) {
        // Respons 404 atau "Tidak ada notifikasi global" adalah kondisi wajar saat tidak ada data
        blastList.value = []
        blastError.value = null
      } else {
        // Kode selain 200 dianggap error (bukan empty state)
        blastError.value = res?.message || 'Gagal memuat pengumuman.'
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || ''
      if (
        err.response?.status === 404 ||
        err.response?.data?.code === '404' ||
        err.response?.data?.code === 404 ||
        msg.toLowerCase().includes('tidak ada notifikasi')
      ) {
        blastList.value = []
        blastError.value = null
      } else {
        blastError.value = msg || 'Terjadi kesalahan jaringan.'
      }
    } finally {
      blastLoading.value = false
    }
  }

  // ── markBlastAsRead — status baca lokal untuk Blasting ────────────────────
  /**
   * Menandai notifikasi blasting (pengumuman) sebagai dibaca secara lokal.
   * Beroperasi terhadap ID sintetis dari buildBlastId() — disimpan ke localStorage.
   * @param {string} id - ID sintetis dari buildBlastId()
   */
  function markBlastAsRead(id) {
    if (readBlastIds.value.has(id)) return
    const newSet = new Set(readBlastIds.value)
    newSet.add(id)
    readBlastIds.value = newSet
    saveReadBlastToStorage()
  }

  // ── markAllBlastAsRead ────────────────────────────────────────────────────
  /**
   * Menandai seluruh item blasting yang termuat sebagai sudah dibaca.
   * Murni localStorage — tidak ada endpoint tandai-dibaca untuk pengumuman.
   * @param {Array} blastingList - Array item blasting yang sedang ditampilkan
   */
  function markAllBlastAsRead(blastingList) {
    if (!blastingList || blastingList.length === 0) return
    const newSet = new Set(readBlastIds.value)
    blastingList.forEach(item => newSet.add(item.id))
    readBlastIds.value = newSet
    saveReadBlastToStorage()
  }

  // ── openNotifDetail ────────────────────────────────────────────────────────
  /**
   * Membuka modal rincian notifikasi.
   * Menandai item sebagai sudah dibaca (optimistic), lalu menyimpan data detail
   * ke `activeDetail` agar modal dapat merender isinya.
   *
   * @param {Object} item    - Item notifikasi dari list store.
   * @param {string} context - Konteks asal item: 'personal' | 'blasting'.
   */
  function openNotifDetail(item, context) {
    if (!item) return
    if (context === 'personal') {
      markPersonalAsRead(item.id)
    }
    const target = resolveNotifTarget(item)
    activeDetail.value = { item, context, target }
  }

  /**
   * Menutup modal rincian notifikasi.
   */
  function closeNotifDetail() {
    activeDetail.value = null
  }

  /**
   * Mengeksekusi navigasi dari modal rincian setelah pengguna menekan tombol lanjut.
   * Validasi keamanan dijalankan tepat sebelum eksekusi (tidak dilonggarkan):
   *   - Internal: router.resolve() untuk memastikan route terdaftar.
   *   - External: regex ^https?:\\/\\// untuk whitelist skema http/https saja.
   *
   * @param {import('vue-router').Router} router - Instance Vue Router dari komponen pemanggil.
   */
  function confirmNotifDetailNavigation(router) {
    if (!activeDetail.value) return
    const { target } = activeDetail.value

    if (target.kind === 'internal') {
      const resolved = router.resolve(target.to)
      if (resolved.matched && resolved.matched.length > 0) {
        closeNotifDetail()
        router.push(target.to)
      } else {
        closeNotifDetail()
      }
    } else if (target.kind === 'external') {
      if (/^https?:\/\//i.test(target.url)) {
        closeNotifDetail()
        window.open(target.url, '_blank', 'noopener,noreferrer')
      } else {
        closeNotifDetail()
      }
    } else {
      closeNotifDetail()
    }
  }

  return {
    // ── Notifikasi personal (dropdown bel) ────────────────────────────────
    list,
    loading,
    error,
    unreadCount,
    unreadBlastCount,
    totalUnreadCount,
    activeDetail,
    readPersonalIds,
    fetchNotifications,
    startPolling,
    stopPolling,
    markAsRead,
    markPersonalAsRead,
    markAllPersonalAsRead,
    markAllAsRead,
    // ── Notifikasi blasting (Pengumuman) ────────────────────────────────────
    blastList,
    blastLoading,
    blastError,
    readBlastIds,
    fetchBlastNotifications,
    markBlastAsRead,
    markAllBlastAsRead,
    // ── Modal rincian ────────────────────────────────────────────────────────
    openNotifDetail,
    closeNotifDetail,
    confirmNotifDetailNavigation,
    // ── Helper untuk digunakan view ──────────────────────────────────────────
    normalizePersonalItem,
  }
})
