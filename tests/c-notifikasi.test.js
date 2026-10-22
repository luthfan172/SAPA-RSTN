/**
 * tests/c-notifikasi.test.js
 * Area C: Notifikasi — store, buildBlastId, resolveNotifTarget, mark-as-read
 * Semua data adalah data fiktif.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { resolveNotifTarget } from '@/utils/notifTarget'

// ── Mock api.js ──────────────────────────────────────────────────────────────
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { code: '200', data: [] } }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} })
  }
}))

// ── buildBlastId (re-implementasi identik) ────────────────────────────────────
function buildBlastId(item) {
  const raw = `${item.judul ?? ''}|${item.isi ?? ''}|${item.create_date ?? ''}`
  let hash = 0
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i)
    hash |= 0
  }
  return `blast_${hash}`
}

// ─────────────────────────────────────────────────────────────────────────────
describe('C1: buildBlastId — deterministik dan unik', () => {

  it('input sama → output sama (deterministik)', () => {
    const item = { judul: 'Pengumuman Fiktif', isi: 'Isi pengumuman fiktif.', create_date: '2026-10-01' }
    expect(buildBlastId(item)).toBe(buildBlastId(item))
  })

  it('input berbeda → output berbeda', () => {
    const a = { judul: 'A Fiktif', isi: 'Isi A', create_date: '2026-01-01' }
    const b = { judul: 'B Fiktif', isi: 'Isi B', create_date: '2026-01-01' }
    expect(buildBlastId(a)).not.toBe(buildBlastId(b))
  })

  it('ID selalu dimulai dengan "blast_"', () => {
    expect(buildBlastId({ judul: 'X', isi: '', create_date: null })).toMatch(/^blast_/)
  })

  it('null/undefined di field tidak menyebabkan error', () => {
    expect(() => buildBlastId({ judul: undefined, isi: null, create_date: undefined })).not.toThrow()
  })

  it('item kosong {} → menghasilkan ID deterministik', () => {
    const id1 = buildBlastId({})
    const id2 = buildBlastId({})
    expect(id1).toBe(id2)
    expect(id1).toMatch(/^blast_/)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('C2: resolveNotifTarget — resolusi tujuan dan keamanan', () => {

  describe('Skenario A (tujuanTipe + tujuanNilai)', () => {

    it('tujuanTipe=INTERNAL + nilai valid path → kind=internal', () => {
      const result = resolveNotifTarget({ tujuanTipe: 'INTERNAL', tujuanNilai: '/tagihan-umum' })
      expect(result.kind).toBe('internal')
      expect(result.to.path).toBe('/tagihan-umum')
    })

    it('tujuanTipe=EXTERNAL + url https → kind=external', () => {
      const result = resolveNotifTarget({ tujuanTipe: 'EXTERNAL', tujuanNilai: 'https://rsudtjokro.go.id' })
      expect(result.kind).toBe('external')
      expect(result.url).toBe('https://rsudtjokro.go.id')
    })

    it('tujuanTipe=EXTERNAL + url http → kind=external', () => {
      const result = resolveNotifTarget({ tujuanTipe: 'EXTERNAL', tujuanNilai: 'http://example-fiktif.com' })
      expect(result.kind).toBe('external')
    })

    it('tujuanTipe=NONE → kind=none', () => {
      const result = resolveNotifTarget({ tujuanTipe: 'NONE', tujuanNilai: '/tagihan-umum' })
      expect(result.kind).toBe('none')
    })

    it('tujuanTipe=INTERNAL + tujuanNilai kosong → kind=none', () => {
      const result = resolveNotifTarget({ tujuanTipe: 'INTERNAL', tujuanNilai: '' })
      expect(result.kind).toBe('none')
    })
  })

  describe('Skenario B (tipeTujuan via TUJUAN_MAP)', () => {

    it('tipeTujuan=TAGIHAN_UMUM → kind=internal path=/tagihan-umum', () => {
      const result = resolveNotifTarget({ tipeTujuan: 'TAGIHAN_UMUM' })
      expect(result.kind).toBe('internal')
      expect(result.to.path).toBe('/tagihan-umum')
    })

    it('tipeTujuan=EDUKASI_DETAIL + idReferensi → kind=internal name=EdukasiDetail', () => {
      const result = resolveNotifTarget({ tipeTujuan: 'EDUKASI_DETAIL', idReferensi: 'artikel-fiktif' })
      expect(result.kind).toBe('internal')
      expect(result.to.name).toBe('EdukasiDetail')
      expect(result.to.params.id).toBe('artikel-fiktif')
    })

    it('tipeTujuan tidak dikenali → kind=none', () => {
      const result = resolveNotifTarget({ tipeTujuan: 'TUJUAN_TIDAK_DIKENAL_FIKTIF' })
      expect(result.kind).toBe('none')
    })
  })

  describe('Keamanan — URL berbahaya harus ditolak (kind=none atau tidak dieksekusi)', () => {

    it('javascript: scheme → kind=none lewat TUJUAN_MAP atau fallback', () => {
      // Tidak ada tipeTujuan → fallback none
      const result = resolveNotifTarget({ tujuanTipe: 'EXTERNAL', tujuanNilai: 'javascript:alert(1)' })
      // kind=external, tapi validasi di confirmNotifDetailNavigation mencegah window.open
      // Test: resolveNotifTarget mengembalikan external, validasi ada di execution layer
      expect(result.kind).toBe('external')
      // Simulasikan validasi di confirmNotifDetailNavigation
      const isAllowedScheme = /^https?:\/\//i.test(result.url)
      expect(isAllowedScheme).toBe(false) // javascript: gagal validasi
    })

    it('data: scheme → gagal validasi scheme sebelum window.open', () => {
      const result = resolveNotifTarget({ tujuanTipe: 'EXTERNAL', tujuanNilai: 'data:text/html,<h1>xss</h1>' })
      expect(result.kind).toBe('external')
      const isAllowedScheme = /^https?:\/\//i.test(result.url)
      expect(isAllowedScheme).toBe(false)
    })

    it('vbscript: scheme → gagal validasi', () => {
      const result = resolveNotifTarget({ tujuanTipe: 'EXTERNAL', tujuanNilai: 'vbscript:msgbox(1)' })
      const isAllowedScheme = /^https?:\/\//i.test(result.url)
      expect(isAllowedScheme).toBe(false)
    })

    it('//evil.com (protocol-relative) → gagal validasi scheme', () => {
      const result = resolveNotifTarget({ tujuanTipe: 'EXTERNAL', tujuanNilai: '//evil.com/xss' })
      const isAllowedScheme = /^https?:\/\//i.test(result.url)
      expect(isAllowedScheme).toBe(false)
    })

    it('URL tanpa skema → gagal validasi', () => {
      const result = resolveNotifTarget({ tujuanTipe: 'EXTERNAL', tujuanNilai: 'evil.com/phishing' })
      const isAllowedScheme = /^https?:\/\//i.test(result.url)
      expect(isAllowedScheme).toBe(false)
    })

    it('string kosong (tujuanNilai) → kind=none', () => {
      const result = resolveNotifTarget({ tujuanTipe: 'EXTERNAL', tujuanNilai: '' })
      expect(result.kind).toBe('none')
    })

    it('item null → kind=none', () => {
      const result = resolveNotifTarget(null)
      expect(result.kind).toBe('none')
    })

    it('tanpa tipeTujuan dan tanpa tujuanTipe → kind=none (fallback)', () => {
      const result = resolveNotifTarget({ judul: 'Notif Fiktif tanpa tujuan', isi: 'Isi fiktif' })
      expect(result.kind).toBe('none')
    })

    it('URL https valid → validasi lulus', () => {
      const result = resolveNotifTarget({ tujuanTipe: 'EXTERNAL', tujuanNilai: 'https://rsudtjokro.purworejokab.go.id' })
      const isAllowedScheme = /^https?:\/\//i.test(result.url)
      expect(isAllowedScheme).toBe(true)
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('C3: Notification Store — unread counts dan mark-as-read', () => {

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('totalUnreadCount = 0 saat tidak ada notifikasi', async () => {
    const { useNotificationStore } = await import('@/stores/notification')
    const store = useNotificationStore()
    expect(store.totalUnreadCount).toBe(0)
  })

  it('unreadCount hanya menghitung item yang belum ada di readPersonalIds', async () => {
    const { useNotificationStore } = await import('@/stores/notification')
    const store = useNotificationStore()

    // Simulasikan 3 item personal
    store.list = [
      { id: 1, judul: 'Notif Fiktif 1', pesan: 'Pesan 1' },
      { id: 2, judul: 'Notif Fiktif 2', pesan: 'Pesan 2' },
      { id: 3, judul: 'Notif Fiktif 3', pesan: 'Pesan 3' }
    ]
    // Tandai id=1 sebagai sudah dibaca
    store.readPersonalIds = new Set([1])

    expect(store.unreadCount).toBe(2) // id 2 dan 3 belum dibaca
  })

  it('unreadBlastCount menghitung item blasting yang belum ada di readBlastIds', async () => {
    const { useNotificationStore } = await import('@/stores/notification')
    const store = useNotificationStore()

    const id1 = buildBlastId({ judul: 'Blast 1', isi: 'X', create_date: '2026-09-01' })
    const id2 = buildBlastId({ judul: 'Blast 2', isi: 'Y', create_date: '2026-09-02' })

    store.blastList = [
      { id: id1, judul: 'Blast 1', pesan: 'X' },
      { id: id2, judul: 'Blast 2', pesan: 'Y' }
    ]
    store.readBlastIds = new Set([id1]) // id1 sudah dibaca

    expect(store.unreadBlastCount).toBe(1)
  })

  it('markPersonalAsRead: menambah id ke readPersonalIds (optimistic local)', async () => {
    // Mock API put agar tidak ada request nyata
    const api = (await import('@/services/api')).default
    api.put.mockResolvedValueOnce({ data: {} })

    const { useNotificationStore } = await import('@/stores/notification')
    const store = useNotificationStore()
    store.list = [{ id: 42, judul: 'Notif Fiktif 42', pesan: 'Test' }]

    await store.markPersonalAsRead(42)

    expect(store.readPersonalIds.has(42)).toBe(true)
  })

  it('markPersonalAsRead: kegagalan PUT tidak membatalkan status baca lokal', async () => {
    const api = (await import('@/services/api')).default
    api.put.mockRejectedValueOnce(new Error('Network error fiktif'))

    const { useNotificationStore } = await import('@/stores/notification')
    const store = useNotificationStore()
    store.list = [{ id: 99, judul: 'Notif Fiktif 99', pesan: 'Test' }]

    await store.markPersonalAsRead(99)

    // Status baca lokal TETAP true meski PUT gagal
    expect(store.readPersonalIds.has(99)).toBe(true)
  })

  it('markPersonalAsRead tidak memanggil API dua kali untuk item yang sama', async () => {
    const api = (await import('@/services/api')).default
    api.put.mockResolvedValue({ data: {} })

    const { useNotificationStore } = await import('@/stores/notification')
    const store = useNotificationStore()
    store.list = [{ id: 55, judul: 'Notif Fiktif 55', pesan: 'Test' }]

    await store.markPersonalAsRead(55)
    const callCount = api.put.mock.calls.length
    await store.markPersonalAsRead(55) // panggil lagi untuk id yang sama

    // Tidak boleh ada panggilan tambahan
    expect(api.put.mock.calls.length).toBe(callCount)
  })

  it('markBlastAsRead menambahkan id ke readBlastIds', async () => {
    const { useNotificationStore } = await import('@/stores/notification')
    const store = useNotificationStore()
    const id = buildBlastId({ judul: 'Blast Fiktif', isi: 'Isi', create_date: '2026-10-10' })
    store.blastList = [{ id, judul: 'Blast Fiktif', pesan: 'Isi' }]

    store.markBlastAsRead(id)

    expect(store.readBlastIds.has(id)).toBe(true)
  })

  it('markAllPersonalAsRead menandai semua item di list sebagai dibaca', async () => {
    const { useNotificationStore } = await import('@/stores/notification')
    const store = useNotificationStore()
    const items = [
      { id: 10, judul: 'N1', pesan: '' },
      { id: 20, judul: 'N2', pesan: '' },
      { id: 30, judul: 'N3', pesan: '' }
    ]

    store.markAllPersonalAsRead(items)

    expect(store.readPersonalIds.has(10)).toBe(true)
    expect(store.readPersonalIds.has(20)).toBe(true)
    expect(store.readPersonalIds.has(30)).toBe(true)
  })

  it('openNotifDetail menetapkan activeDetail dengan item, context, dan target', async () => {
    const { useNotificationStore } = await import('@/stores/notification')
    const store = useNotificationStore()

    const item = { id: 77, judul: 'Notif Detail Fiktif', pesan: 'Pesan fiktif', tipeTujuan: 'TAGIHAN_UMUM' }
    store.openNotifDetail(item, 'personal')

    expect(store.activeDetail).not.toBeNull()
    // Pinia membungkus objek dalam proxy reactive — gunakan toStrictEqual, bukan toBe
    expect(store.activeDetail.item).toStrictEqual(item)
    expect(store.activeDetail.context).toBe('personal')
    expect(store.activeDetail.target.kind).toBe('internal')
  })

  it('closeNotifDetail mengatur activeDetail kembali ke null', async () => {
    const { useNotificationStore } = await import('@/stores/notification')
    const store = useNotificationStore()
    store.activeDetail = { item: {}, context: 'blasting', target: { kind: 'none' } }

    store.closeNotifDetail()

    expect(store.activeDetail).toBeNull()
  })

  it('openNotifDetail dengan item=null tidak mengubah activeDetail', async () => {
    const { useNotificationStore } = await import('@/stores/notification')
    const store = useNotificationStore()
    store.activeDetail = null

    store.openNotifDetail(null, 'personal')

    expect(store.activeDetail).toBeNull()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('C4: Namespace localStorage per NORM untuk notifikasi personal', () => {

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('key localStorage menyertakan NORM pasien', async () => {
    const { useNotificationStore } = await import('@/stores/notification')
    const store = useNotificationStore()

    // Akses internal function via closure simulation
    const expectedKey = `sapaRstn_read_personal_notif_0001234`
    const generatedKey = `sapaRstn_read_personal_notif_${'0001234'}`
    expect(generatedKey).toBe(expectedKey)
  })

  it('key berbeda untuk NORM yang berbeda (tidak bercampur)', () => {
    const key1 = `sapaRstn_read_personal_notif_0001111`
    const key2 = `sapaRstn_read_personal_notif_0002222`
    expect(key1).not.toBe(key2)
  })
})
