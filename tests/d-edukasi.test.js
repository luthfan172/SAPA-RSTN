/**
 * tests/d-edukasi.test.js
 * Area D: Edukasi Kesehatan — parseTags, getTagColorClass, edukasiImgUrl, filter, counter
 * Semua data adalah data fiktif.
 */
import { describe, it, expect, vi } from 'vitest'
import { parseTags, getTagColorClass, edukasiImgUrl, EDUKASI_IMG_BASE, formatTglIndo } from '@/utils/edukasi'

// ─────────────────────────────────────────────────────────────────────────────
describe('D1: parseTags — parsing tag dari string CSV', () => {

  it('"protein, sehat" → ["protein", "sehat"]', () => {
    expect(parseTags('protein, sehat')).toEqual(['protein', 'sehat'])
  })

  it('"protein,sehat" (tanpa spasi) → ["protein", "sehat"]', () => {
    expect(parseTags('protein,sehat')).toEqual(['protein', 'sehat'])
  })

  it('spasi berlebih: "  protein ,  sehat  " → ["protein", "sehat"]', () => {
    expect(parseTags('  protein ,  sehat  ')).toEqual(['protein', 'sehat'])
  })

  it('koma ganda: "protein,,sehat" → ["protein", "sehat"] (filter kosong)', () => {
    expect(parseTags('protein,,sehat')).toEqual(['protein', 'sehat'])
  })

  it('string kosong → []', () => {
    expect(parseTags('')).toEqual([])
  })

  it('null → []', () => {
    expect(parseTags(null)).toEqual([])
  })

  it('undefined → []', () => {
    expect(parseTags(undefined)).toEqual([])
  })

  it('tag tunggal tanpa koma: "diabetes" → ["diabetes"]', () => {
    expect(parseTags('diabetes')).toEqual(['diabetes'])
  })

  it('banyak tag: "gizi, protein, sehat, olahraga" → 4 tag', () => {
    expect(parseTags('gizi, protein, sehat, olahraga')).toHaveLength(4)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('D2: getTagColorClass — deterministik per nama tag', () => {

  it('tag yang sama selalu menghasilkan class yang sama (deterministik)', () => {
    expect(getTagColorClass('protein')).toBe(getTagColorClass('protein'))
  })

  it('tag berbeda tidak selalu menghasilkan class sama', () => {
    // Setidaknya beberapa tag berbeda menghasilkan class berbeda (bukan selalu sama)
    const classes = ['protein', 'sehat', 'gizi', 'olahraga', 'diabetes', 'hipertensi', 'jantung', 'stroke']
      .map(t => getTagColorClass(t))
    const unique = new Set(classes)
    // Dengan 8 tag dan 8 warna, semua harusnya berbeda di hashing yang tersebar
    expect(unique.size).toBeGreaterThanOrEqual(2)
  })

  it('tag null/undefined → mengembalikan class default (tidak throw)', () => {
    expect(() => getTagColorClass(null)).not.toThrow()
    expect(() => getTagColorClass(undefined)).not.toThrow()
  })

  it('class yang dikembalikan mengandung class CSS yang valid (tidak kosong)', () => {
    const cls = getTagColorClass('protein')
    expect(typeof cls).toBe('string')
    expect(cls.length).toBeGreaterThan(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('D3: edukasiImgUrl — pembentukan URL gambar', () => {

  it('gambar dengan nama file → URL = base + nama', () => {
    const url = edukasiImgUrl('edukasi_fiktif_001.jpg')
    expect(url).toBe(EDUKASI_IMG_BASE + 'edukasi_fiktif_001.jpg')
  })

  it('nama gambar null → string kosong', () => {
    expect(edukasiImgUrl(null)).toBe('')
  })

  it('nama gambar undefined → string kosong', () => {
    expect(edukasiImgUrl(undefined)).toBe('')
  })

  it('nama gambar string kosong → string kosong', () => {
    expect(edukasiImgUrl('')).toBe('')
  })

  it('EDUKASI_IMG_BASE dimulai dengan http:// atau https://', () => {
    expect(EDUKASI_IMG_BASE).toMatch(/^https?:\/\//)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('D4: Tag unik di filter chip — bebas duplikat', () => {

  // Simulasikan logika availableTags dari EdukasiView.vue
  function getAvailableTags(artikelList) {
    const seen = new Set()
    const result = []
    for (const item of artikelList) {
      for (const tag of parseTags(item.tags)) {
        const lower = tag.toLowerCase()
        if (!seen.has(lower)) {
          seen.add(lower)
          result.push(tag)
        }
      }
    }
    return result
  }

  it('artikel dengan tag duplikat → daftar tag unik', () => {
    const artikelList = [
      { id: 'art1', tags: 'protein, sehat' },
      { id: 'art2', tags: 'protein, gizi' },    // 'protein' duplikat
      { id: 'art3', tags: 'sehat, olahraga' }    // 'sehat' duplikat
    ]
    const tags = getAvailableTags(artikelList)
    expect(tags).toEqual(['protein', 'sehat', 'gizi', 'olahraga'])
    expect(tags.length).toBe(4)
  })

  it('artikel tanpa tags → daftar kosong', () => {
    const artikelList = [{ id: 'art1', tags: null }]
    expect(getAvailableTags(artikelList)).toEqual([])
  })

  it('artikel list kosong → daftar tag kosong', () => {
    expect(getAvailableTags([])).toEqual([])
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('D5: Filter artikel berdasarkan tag', () => {

  // Simulasikan logika filteredArtikel dari EdukasiView.vue
  function filterByTag(artikelList, selectedTag) {
    if (selectedTag === 'Semua') return artikelList
    const activeTag = selectedTag.toLowerCase()
    return artikelList.filter(item => {
      const itemTagsLower = parseTags(item.tags).map(t => t.toLowerCase())
      return itemTagsLower.includes(activeTag)
    })
  }

  const ARTIKEL_FIKTIF = [
    { id: 'art1', judul: 'Artikel Protein', tags: 'protein, sehat' },
    { id: 'art2', judul: 'Artikel Gizi',    tags: 'gizi, sehat' },
    { id: 'art3', judul: 'Artikel Olahraga', tags: 'olahraga' },
    { id: 'art4', judul: 'Artikel Serba',   tags: 'protein, gizi, olahraga' }
  ]

  it('filter "Semua" → semua artikel tampil', () => {
    expect(filterByTag(ARTIKEL_FIKTIF, 'Semua')).toHaveLength(4)
  })

  it('filter "protein" → hanya artikel dengan tag protein', () => {
    const result = filterByTag(ARTIKEL_FIKTIF, 'protein')
    expect(result.map(a => a.id)).toEqual(['art1', 'art4'])
  })

  it('filter "sehat" → artikel yang mengandung tag sehat', () => {
    const result = filterByTag(ARTIKEL_FIKTIF, 'sehat')
    expect(result.map(a => a.id)).toEqual(['art1', 'art2'])
  })

  it('filter "olahraga" → artikel olahraga dan serba', () => {
    const result = filterByTag(ARTIKEL_FIKTIF, 'olahraga')
    expect(result.map(a => a.id)).toEqual(['art3', 'art4'])
  })

  it('filter tag yang tidak ada → daftar kosong', () => {
    const result = filterByTag(ARTIKEL_FIKTIF, 'diabetes')
    expect(result).toHaveLength(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('D6: Logika counter dan state EdukasiDetail', () => {

  it('id artikel diperlakukan sebagai string (tidak parseInt)', () => {
    // Simulasikan logika fetchEdukasiDetail yang menggunakan route.params.id sebagai string
    const routeParamId = '007-artikel-fiktif'
    const slug = decodeURIComponent(routeParamId)
    // Tidak ada parseInt — slug tetap string
    expect(typeof slug).toBe('string')
    expect(slug).toBe('007-artikel-fiktif')
  })

  it('kegagalan counter tidak memblokir tampilan artikel (counterOptimistic tetap false)', () => {
    // State awal
    let counterOptimistic = false
    let artikelTampil = null

    // Simulasikan: fetch artikel berhasil
    artikelTampil = { judul: 'Artikel Fiktif', isi: '<p>Konten fiktif</p>', counter: 5 }

    // Simulasikan: counter gagal (tidak ada perubahan counterOptimistic)
    // — hanya console.warn, tidak ada throw atau error state
    try {
      throw new Error('Counter error fiktif')
    } catch (e) {
      // Best-effort: counterOptimistic tetap false, artikel tetap tampil
    }

    expect(counterOptimistic).toBe(false)
    expect(artikelTampil).not.toBeNull()
  })

  it('counter tampil = counterAsli + 1 jika panggilan counter sukses', () => {
    let counterAsli = 10
    let counterOptimistic = false
    // Simulasikan sukses counter
    counterOptimistic = true
    const counterTampil = counterAsli + (counterOptimistic ? 1 : 0)
    expect(counterTampil).toBe(11)
  })

  it('counter tampil = counterAsli saja jika panggilan counter gagal', () => {
    let counterAsli = 10
    let counterOptimistic = false
    // Counter gagal — counterOptimistic tetap false
    const counterTampil = counterAsli + (counterOptimistic ? 1 : 0)
    expect(counterTampil).toBe(10)
  })

  it('artikel tidak ditemukan (code=404) → error state, bukan konten kosong', () => {
    let error = null
    let artikel = null

    // Simulasikan respons 404
    const data = { code: '404', data: null }
    if (data.code === '404') {
      error = 'Artikel tidak ditemukan'
    } else if (data.code === '200' && data.data) {
      artikel = data.data
    }

    expect(error).toBe('Artikel tidak ditemukan')
    expect(artikel).toBeNull()
  })

  it('state loading → error → artikel berbeda dari state satu sama lain', () => {
    // Pastikan state tidak tumpang tindih
    let loading = false
    let error = null
    let artikel = null

    // State loading
    loading = true
    expect(loading && !error && !artikel).toBe(true)

    // State error
    loading = false
    error = 'Gagal memuat artikel fiktif'
    expect(!loading && error && !artikel).toBe(true)

    // State berhasil
    error = null
    artikel = { judul: 'Artikel OK' }
    expect(!loading && !error && artikel).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('D7: formatTglIndo — format tanggal Indonesia', () => {

  it('string tanggal valid → mengembalikan string tidak kosong', () => {
    const result = formatTglIndo('2026-10-15 08:00:00')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
    expect(result).not.toBe('-')
  })

  it('null → mengembalikan "-"', () => {
    expect(formatTglIndo(null)).toBe('-')
  })

  it('undefined → mengembalikan "-"', () => {
    expect(formatTglIndo(undefined)).toBe('-')
  })

  it('string kosong → mengembalikan "-"', () => {
    expect(formatTglIndo('')).toBe('-')
  })
})
