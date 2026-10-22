/**
 * Utilitas bersama untuk fitur Edukasi Kesehatan.
 */

// URL gambar sudah diverifikasi: /gos2_plus/uploads/edukasi/ → HTTP 200 ✓
// /gos2_plus/web/rsudapi/uploads/edukasi/ → HTTP 404 ✗ (salah)
// /gos2_plus/web/uploads/edukasi/         → HTTP 200 ✓ (alternatif valid)
export const EDUKASI_IMG_BASE = 'http://194.169.46.193/gos2_plus/uploads/edukasi/'

/**
 * Menghasilkan URL lengkap gambar edukasi dari nama file.
 * @param {string|null|undefined} nama - Nama file gambar (mis. "edukasi_xxx.jpg")
 * @returns {string} URL lengkap atau string kosong jika nama tidak ada
 */
export function edukasiImgUrl(nama) {
  return nama ? EDUKASI_IMG_BASE + nama : ''
}

/**
 * Mem-parsing field tags (string dipisah koma) menjadi array string.
 * Menangani null/undefined secara aman.
 * @param {string|null|undefined} str - String tags dari API (mis. "protein, sehat")
 * @returns {string[]} Array tag yang sudah di-trim, tanpa elemen kosong
 */
export function parseTags(str) {
  if (!str) return []
  return str.split(',').map(t => t.trim()).filter(Boolean)
}

/**
 * Mengformat string tanggal "YYYY-MM-DD HH:mm:ss" menjadi format Indonesia panjang.
 * Aman untuk Safari (spasi diganti T sebelum parsing).
 * @param {string|null|undefined} tglStr - String tanggal dari API
 * @returns {string} Tanggal format Indonesia (mis. "12 Oktober 2026") atau "-"
 */
export function formatTglIndo(tglStr) {
  if (!tglStr) return '-'
  try {
    // Ganti spasi dengan T agar kompatibel Safari (ISO 8601)
    const normalized = String(tglStr).replace(' ', 'T')
    const d = new Date(normalized)
    if (isNaN(d.getTime())) return tglStr
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch (e) {
    return tglStr
  }
}

/**
 * Menentukan kelas warna Tailwind untuk sebuah tag secara deterministik.
 * Warna dipilih berdasarkan hash sederhana dari string tag.
 * @param {string} tag
 * @returns {string} Kelas CSS Tailwind (text + bg + border)
 */
export function getTagColorClass(tag) {
  const palette = [
    'text-emerald-700 bg-emerald-50 border-emerald-200/60',
    'text-teal-700 bg-teal-50 border-teal-200/60',
    'text-blue-700 bg-blue-50 border-blue-200/60',
    'text-violet-700 bg-violet-50 border-violet-200/60',
    'text-rose-700 bg-rose-50 border-rose-200/60',
    'text-amber-700 bg-amber-50 border-amber-200/60',
    'text-cyan-700 bg-cyan-50 border-cyan-200/60',
    'text-indigo-700 bg-indigo-50 border-indigo-200/60',
  ]
  if (!tag) return palette[0]
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0
  }
  return palette[hash % palette.length]
}
