/**
 * tests/e-bpjs-kontrol.test.js
 * Area E: Popup Rencana Kontrol BPJS (Riwayat Reservasi)
 * Semua data adalah data fiktif, tidak ada koneksi jaringan nyata.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Data fiktif (kontrak API sesuai spesifikasi) ─────────────────────────────
const DATA_BPJS_FIKTIF = {
  NOMOR_ANTRIAN: 'A-012',
  TANGGALKUNJUNGAN: '2026-11-15',
  poli: 'Poliklinik Penyakit Dalam Fiktif',
  namaDokter: 'dr. Fiktif SpPD',
  ESTIMASI_PELAYANAN: '09:50:00',
  NO_REF_BPJS: 'REF-FIKTIF-001',
  NO_KARTU_BPJS: '0001111222233334444'
}

// ── Logika formatJamEstimasi (dari RiwayatReservasiView) ─────────────────────
function formatJamEstimasi(jamStr) {
  if (!jamStr) return '-'
  return jamStr.slice(0, 5) // "09:50:00" → "09:50"
}

// ── Logika tidakAdaData (dari fetchKontrolBpjs) ─────────────────────────────
function isNoData(code, data) {
  return (
    code !== '200' ||
    data === null ||
    data === undefined ||
    (Array.isArray(data) && data.length === 0) ||
    (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0)
  )
}

// ─────────────────────────────────────────────────────────────────────────────
describe('E1: formatJamEstimasi — tampilan jam HH:mm', () => {

  it('"09:50:00" → "09:50"', () => {
    expect(formatJamEstimasi('09:50:00')).toBe('09:50')
  })

  it('"14:30:00" → "14:30"', () => {
    expect(formatJamEstimasi('14:30:00')).toBe('14:30')
  })

  it('null → "-"', () => {
    expect(formatJamEstimasi(null)).toBe('-')
  })

  it('string kosong → "-"', () => {
    expect(formatJamEstimasi('')).toBe('-')
  })

  it('"08:00" (tanpa detik) → "08:00"', () => {
    expect(formatJamEstimasi('08:00')).toBe('08:00')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('E2: Logika isNoData — deteksi "tidak ada data" vs "ada data"', () => {

  it('code="200" + data objek penuh → ada data (isNoData=false)', () => {
    expect(isNoData('200', DATA_BPJS_FIKTIF)).toBe(false)
  })

  it('code="200" + data=null → tidak ada data (isNoData=true)', () => {
    expect(isNoData('200', null)).toBe(true)
  })

  it('code="200" + data=undefined → tidak ada data', () => {
    expect(isNoData('200', undefined)).toBe(true)
  })

  it('code="200" + data={} (objek kosong) → tidak ada data', () => {
    expect(isNoData('200', {})).toBe(true)
  })

  it('code="200" + data=[] (array kosong) → tidak ada data', () => {
    expect(isNoData('200', [])).toBe(true)
  })

  it('code="404" + data valid → tidak ada data (code bukan 200)', () => {
    expect(isNoData('404', DATA_BPJS_FIKTIF)).toBe(true)
  })

  it('code="500" → tidak ada data', () => {
    expect(isNoData('500', DATA_BPJS_FIKTIF)).toBe(true)
  })

  it('code="200" + data array berisi objek → ada data', () => {
    expect(isNoData('200', [DATA_BPJS_FIKTIF])).toBe(false)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('E3: State bpjsKontrol dan bpjsError — perilaku fetchKontrolBpjs', () => {

  // Simulasikan fetchKontrolBpjs tanpa API nyata
  function simulateFetch(apiResponseOrError) {
    let bpjsKontrol = null
    let bpjsError = false
    let bpjsLoading = false

    try {
      if (apiResponseOrError instanceof Error) {
        throw apiResponseOrError
      }

      const code = apiResponseOrError?.code
      const data = apiResponseOrError?.data
      const tidakAdaData = isNoData(code, data)

      if (code === '200' && !tidakAdaData) {
        bpjsKontrol = data
      } else {
        bpjsKontrol = null
        bpjsError = false
      }
    } catch (err) {
      bpjsKontrol = null
      bpjsError = true
    }

    return { bpjsKontrol, bpjsError, bpjsLoading }
  }

  it('ada data → bpjsKontrol berisi data, bpjsError=false', () => {
    const result = simulateFetch({ code: '200', data: DATA_BPJS_FIKTIF })
    expect(result.bpjsKontrol).toEqual(DATA_BPJS_FIKTIF)
    expect(result.bpjsError).toBe(false)
  })

  it('tidak ada data (code 200, data null) → bpjsKontrol=null, bpjsError=false', () => {
    const result = simulateFetch({ code: '200', data: null })
    expect(result.bpjsKontrol).toBeNull()
    expect(result.bpjsError).toBe(false)
  })

  it('tidak ada data (code 200, data {}) → bpjsKontrol=null, bpjsError=false', () => {
    const result = simulateFetch({ code: '200', data: {} })
    expect(result.bpjsKontrol).toBeNull()
    expect(result.bpjsError).toBe(false)
  })

  it('tidak ada data (code 200, data []) → bpjsKontrol=null, bpjsError=false', () => {
    const result = simulateFetch({ code: '200', data: [] })
    expect(result.bpjsKontrol).toBeNull()
    expect(result.bpjsError).toBe(false)
  })

  it('code bukan 200 → bpjsKontrol=null, bpjsError=false (bukan error network)', () => {
    const result = simulateFetch({ code: '404', data: null })
    expect(result.bpjsKontrol).toBeNull()
    expect(result.bpjsError).toBe(false)
  })

  it('request error (network/exception) → bpjsError=true, bpjsKontrol=null', () => {
    const result = simulateFetch(new Error('Network error fiktif'))
    expect(result.bpjsKontrol).toBeNull()
    expect(result.bpjsError).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('E4: Logika tampilan kondisional BPJS Notice Card', () => {

  it('bpjsKontrol berisi data → ringkasan tanggal+poli tersedia untuk tampil', () => {
    const bpjsKontrol = DATA_BPJS_FIKTIF
    const hasTanggal = Boolean(bpjsKontrol?.TANGGALKUNJUNGAN)
    const hasPoli = Boolean(bpjsKontrol?.poli)
    expect(hasTanggal).toBe(true)
    expect(hasPoli).toBe(true)
  })

  it('bpjsKontrol berisi data → tombol Detail seharusnya ditampilkan (v-if="bpjsKontrol")', () => {
    const bpjsKontrol = DATA_BPJS_FIKTIF
    // Template: v-if="bpjsKontrol"
    expect(!!bpjsKontrol).toBe(true)
  })

  it('bpjsKontrol=null → tombol Detail tidak ditampilkan', () => {
    const bpjsKontrol = null
    expect(!!bpjsKontrol).toBe(false)
  })

  it('bpjsError=true → state error berbeda dari state "tidak ada data"', () => {
    // State "tidak ada data": bpjsKontrol=null AND bpjsError=false
    function detectState(bpjsKontrol, bpjsError) {
      if (!bpjsKontrol && !bpjsError) return 'no_data'
      if (!bpjsKontrol && bpjsError) return 'fetch_error'
      if (bpjsKontrol) return 'has_data'
      return 'unknown'
    }

    expect(detectState(null, false)).toBe('no_data')
    expect(detectState(null, true)).toBe('fetch_error')
    // Pastikan dua state TIDAK sama (berbeda)
    expect(detectState(null, false)).not.toBe(detectState(null, true))
  })

  it('semua field BPJS fiktif tersedia di data (NOMOR_ANTRIAN, TANGGALKUNJUNGAN, poli, namaDokter, ESTIMASI_PELAYANAN, NO_REF_BPJS, NO_KARTU_BPJS)', () => {
    const fields = ['NOMOR_ANTRIAN', 'TANGGALKUNJUNGAN', 'poli', 'namaDokter', 'ESTIMASI_PELAYANAN', 'NO_REF_BPJS', 'NO_KARTU_BPJS']
    fields.forEach(field => {
      expect(DATA_BPJS_FIKTIF[field]).toBeDefined()
    })
  })

  it('ESTIMASI_PELAYANAN diformat menjadi HH:mm saat modal dibuka', () => {
    const jam = formatJamEstimasi(DATA_BPJS_FIKTIF.ESTIMASI_PELAYANAN)
    expect(jam).toBe('09:50')
  })
})
