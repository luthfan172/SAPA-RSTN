import api from '../services/api'
import { decryptPdfDocument } from './crypto'

export const isIOSDevice = () => {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

/**
 * Mengambil, mendekripsi, dan langsung mengunduh/membuka PDF
 * Langsung membuka di tab Safari untuk iPhone tanpa perlu masuk halaman preview
 */
export async function directDownloadDocument(type, docId, docTitle = 'Dokumen_Hasil') {
  if (!docId) {
    throw new Error('ID Dokumen tidak valid')
  }

  let endpoint = '/hasil-radiologi/view-bacaan'
  let params = { acsn: docId, id: docId }

  if (type === 'laboratorium' || type === 'laborat') {
    endpoint = '/hasil-laboratorium/view-hasil'
    params = { noKunjungan: docId, acsn: docId, id: docId }
  } else if (type === 'resume-medis' || type === 'resume') {
    endpoint = '/resume-medis/view-resume'
    params = { idReg: docId, noKunjungan: docId, id: docId }
  }

  const response = await api.get(endpoint, { params })
  const res = response.data

  if (!res || (res.code !== '200' && res.code !== 200 && res.status !== 200 && res.status !== '200') || !res.data) {
    throw new Error(res?.message || 'Dokumen belum tersedia di server.')
  }

  const dataObj = res.data
  const file = dataObj.file || dataObj.FILE || dataObj.content || dataObj.document
  const key = dataObj.key || dataObj.KEY
  const filename = dataObj.filename || dataObj.FILENAME || `${docTitle}_${docId}.pdf`

  let pdfBlob = null

  if (file && key) {
    pdfBlob = await decryptPdfDocument(key, file)
  } else if (file) {
    const cleanStr = String(file).trim().replace(/[\r\n\t\s]/g, '')
    const bin = atob(cleanStr)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i)
    }
    pdfBlob = new Blob([bytes], { type: 'application/pdf' })
  } else {
    throw new Error('Berkas dokumen kosong atau belum tersedia.')
  }

  const blobUrl = URL.createObjectURL(pdfBlob)

  if (isIOSDevice()) {
    // Pada iPhone / iPad, buka langsung PDF di tab baru Safari
    const newTab = window.open(blobUrl, '_blank')
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
      window.location.href = blobUrl
    }
  } else {
    // Pada Android / Desktop
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000)
  }

  return true
}
