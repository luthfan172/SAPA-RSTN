/**
 * notifTarget.js
 * Helper terpusat untuk menentukan tujuan navigasi dari sebuah item notifikasi.
 *
 * Mengembalikan salah satu dari:
 *   { kind: 'internal', to: { path } | { name, params } }
 *   { kind: 'external', url: 'https://...' }
 *   { kind: 'none' }
 *
 * Urutan prioritas:
 *   Skenario A — field tujuanTipe + tujuanNilai
 *   Skenario B — field tipeTujuan (+ opsional idReferensi) via TUJUAN_MAP
 *   Fallback   — { kind: 'none' }
 */

/**
 * Peta tipeTujuan → fungsi resolver yang mengembalikan objek `to` untuk router.push().
 * Sesuaikan/lengkapi jika ada route baru di src/router/index.js.
 *
 * Route yang terdaftar (dari router/index.js):
 *   /tagihan-umum        → name: TagihanPasienUmum
 *   /jadwal-dokter       → name: JadwalDokter
 *   /riwayat-reservasi   → name: RiwayatReservasi
 *   /hasil-laboratorium  → name: HasilLaboratorium
 *   /hasil-radiologi     → name: HasilRadiologi
 *   /resume-medis        → name: ResumeMedis
 *   /antrian-farmasi     → name: AntrianFarmasi
 *   /info-tempat-tidur   → name: InfoTT
 *   /edukasi             → name: Edukasi
 *   /edukasi/artikel/:id → name: EdukasiDetail
 *   /daftar-online       → name: DaftarOnline
 *   /profil              → name: Profile
 */
const TUJUAN_MAP = {
  TAGIHAN_UMUM:       ()            => ({ path: '/tagihan-umum' }),
  JADWAL_DOKTER:      ()            => ({ path: '/jadwal-dokter' }),
  RIWAYAT_RESERVASI:  ()            => ({ path: '/riwayat-reservasi' }),
  HASIL_LABORATORIUM: ()            => ({ path: '/hasil-laboratorium' }),
  HASIL_RADIOLOGI:    ()            => ({ path: '/hasil-radiologi' }),
  RESUME_MEDIS:       ()            => ({ path: '/resume-medis' }),
  ANTRIAN_FARMASI:    ()            => ({ path: '/antrian-farmasi' }),
  INFO_TEMPAT_TIDUR:  ()            => ({ path: '/info-tempat-tidur' }),
  EDUKASI:            ()            => ({ path: '/edukasi' }),
  EDUKASI_DETAIL:     (idReferensi) => ({ name: 'EdukasiDetail', params: { id: idReferensi } }),
  DAFTAR_ONLINE:      ()            => ({ path: '/daftar-online' }),
  PROFILE:            ()            => ({ path: '/profil' }),
}

/**
 * Menentukan tujuan navigasi dari item notifikasi.
 * @param {Object} item - Item notifikasi dari store.
 * @returns {{ kind: 'internal'|'external'|'none', to?: Object, url?: string }}
 */
export function resolveNotifTarget(item) {
  if (!item) return { kind: 'none' }

  // ── Skenario A: field tujuanTipe + tujuanNilai ──────────────────────────────
  if (item.tujuanTipe) {
    const tipe  = item.tujuanTipe
    const nilai = item.tujuanNilai

    if (tipe === 'INTERNAL' && nilai) {
      return { kind: 'internal', to: { path: nilai } }
    }

    if (tipe === 'EXTERNAL' && nilai) {
      return { kind: 'external', url: nilai }
    }

    // tipe === 'NONE' atau nilai kosong → tidak ada tujuan
    return { kind: 'none' }
  }

  // ── Skenario B: field tipeTujuan (+ opsional idReferensi) via TUJUAN_MAP ────
  if (item.tipeTujuan && Object.prototype.hasOwnProperty.call(TUJUAN_MAP, item.tipeTujuan)) {
    const resolver = TUJUAN_MAP[item.tipeTujuan]
    const to = resolver(item.idReferensi)
    return { kind: 'internal', to }
  }

  // ── Fallback ─────────────────────────────────────────────────────────────────
  return { kind: 'none' }
}
