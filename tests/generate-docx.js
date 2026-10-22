import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeadingLevel,
  BorderStyle,
  AlignmentType,
  Header,
  Footer,
  PageNumber
} from 'docx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const docxPath = path.join(rootDir, 'LAPORAN-TESTING-SAPA-RSTN.docx')

// Helper format cell
function createCell(text, options = {}) {
  const {
    isHeader = false,
    bold = false,
    color = isHeader ? 'FFFFFF' : '1E293B',
    bgColor = isHeader ? '0F766E' : undefined,
    width = undefined,
    align = AlignmentType.LEFT
  } = options

  return new TableCell({
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    shading: bgColor ? { fill: bgColor } : undefined,
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    children: [
      new Paragraph({
        alignment: align,
        children: [
          new TextRun({
            text,
            bold: isHeader || bold,
            color,
            font: 'Arial',
            size: isHeader ? 19 : 18
          })
        ]
      })
    ]
  })
}

function createParagraph(text, options = {}) {
  const {
    bold = false,
    italic = false,
    color = '1E293B',
    size = 20, // 10pt
    spaceAfter = 120,
    spaceBefore = 0,
    bullet = false
  } = options

  return new Paragraph({
    spacing: { before: spaceBefore, after: spaceAfter },
    bullet: bullet ? { level: 0 } : undefined,
    children: [
      new TextRun({
        text,
        bold,
        italic,
        color,
        size,
        font: 'Arial'
      })
    ]
  })
}

function createHeading(text, level = HeadingLevel.HEADING_2) {
  return new Paragraph({
    heading: level,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        color: '065F46',
        size: level === HeadingLevel.HEADING_1 ? 28 : (level === HeadingLevel.HEADING_2 ? 24 : 20),
        font: 'Arial'
      })
    ]
  })
}

function createFindingCard(id, title, sev, loc, desc, remed) {
  const sevColor = sev === 'Tinggi' ? 'DC2626' : (sev === 'Sedang' ? 'D97706' : '0284C7')
  
  return [
    new Paragraph({
      spacing: { before: 180, after: 60 },
      children: [
        new TextRun({ text: `[${sev.toUpperCase()}] `, bold: true, color: sevColor, font: 'Arial', size: 20 }),
        new TextRun({ text: `${id}: ${title}`, bold: true, color: '0F172A', font: 'Arial', size: 20 })
      ]
    }),
    new Paragraph({
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({ text: `Lokasi: `, bold: true, color: '64748B', font: 'Arial', size: 17 }),
        new TextRun({ text: loc, bold: true, color: '0F766E', font: 'Consolas', size: 17 })
      ]
    }),
    new Paragraph({
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({ text: desc, color: '334155', font: 'Arial', size: 18 })
      ]
    }),
    new Paragraph({
      spacing: { before: 0, after: 160 },
      children: [
        new TextRun({ text: `Rekomendasi Perbaikan: `, bold: true, color: '047857', font: 'Arial', size: 18 }),
        new TextRun({ text: remed, italic: true, color: '1E293B', font: 'Arial', size: 18 })
      ]
    })
  ]
}

async function buildDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } // 1 inch
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'RSUD R.A.A. TJOKRONEGORO — LAPORAN TESTING & SECURITY AUDIT SAPA RSTN',
                    size: 14,
                    color: '94A3B8',
                    font: 'Arial'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'Halaman ', size: 16, color: '94A3B8', font: 'Arial' }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '94A3B8', font: 'Arial' })
                ]
              })
            ]
          })
        },
        children: [
          // Title
          createHeading('LAPORAN HASIL TESTING & SECURITY AUDIT — SAPA RSTN', HeadingLevel.HEADING_1),
          createParagraph('Sistem Aplikasi Pasien RSUD R.A.A. Tjokronegoro (Frontend Web Portal)', { bold: true, color: '0F766E', size: 22 }),
          createParagraph('Tanggal Pengujian: 21 Oktober 2026 | Lingkungan: Vitest, Node.js v24, JSDOM, Vite 8, Vue 3', { italic: true, color: '64748B', size: 18 }),
          
          // Section 1: Ringkasan Eksekutif
          createHeading('1. Ringkasan Eksekutif'),
          createParagraph(
            'Pengujian komprehensif telah dilaksanakan terhadap aplikasi web portal pasien SAPA RSTN dalam satu siklus pengujian terpadu. Pengujian mencakup Fondasi Sistem (Auth Store, Interceptor API, Router Guards), Tagihan Pasien Umum, Notifikasi Pasien & Pengumuman, Edukasi Kesehatan, dan Popup Rencana Kontrol BPJS, serta pemeriksaan statis keamanan kode sumber dan audit kerentanan dependensi.'
          ),
          
          // Summary Table Metrics
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Total Kasus Uji', { isHeader: true, width: 25, align: AlignmentType.CENTER }),
                  createCell('Status Lulus', { isHeader: true, width: 25, align: AlignmentType.CENTER }),
                  createCell('Build Produksi', { isHeader: true, width: 25, align: AlignmentType.CENTER }),
                  createCell('Vulnerabilitas Dep.', { isHeader: true, width: 25, align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createCell('140 Test', { bold: true, width: 25, align: AlignmentType.CENTER, bgColor: 'F0FDF4' }),
                  createCell('140 Lulus (100%)', { bold: true, width: 25, align: AlignmentType.CENTER, color: '16A34A', bgColor: 'F0FDF4' }),
                  createCell('SUKSES (1.93s)', { bold: true, width: 25, align: AlignmentType.CENTER, color: '16A34A', bgColor: 'F0FDF4' }),
                  createCell('12 High Severity', { bold: true, width: 25, align: AlignmentType.CENTER, color: 'D97706', bgColor: 'FFFBEB' })
                ]
              })
            ]
          }),

          createParagraph('Tiga Temuan Utama yang Perlu Ditindaklanjuti:', { bold: true, spaceBefore: 180 }),
          createParagraph('1. [Keamanan - Tinggi] Potensi Stored XSS via v-html pada Edukasi Kesehatan (EdukasiDetailView.vue:L91): Field artikel.isi dirender tanpa sanitasi DOMPurify.', { bullet: true }),
          createParagraph('2. [Keamanan - Sedang] Reverse Tabnabbing via window.open pada Pratinjau Dokumen iOS (PreviewDokumenView.vue:L279): Pembukaan tab baru tanpa atribut noopener,noreferrer.', { bullet: true }),
          createParagraph('3. [Keamanan - Sedang] Base URL Gambar Edukasi Menggunakan Plain HTTP & IP Publik Mentah (src/utils/edukasi.js:L8): Menimbulkan Mixed Content Error pada deployment HTTPS.', { bullet: true }),

          // Section 2: Tabel Hasil per Area
          createHeading('2. Tabel Hasil Pengujian per Area'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Area', { isHeader: true, width: 15 }),
                  createCell('Cakupan Pengujian', { isHeader: true, width: 35 }),
                  createCell('Target File / Modul', { isHeader: true, width: 30 }),
                  createCell('Jumlah Test', { isHeader: true, width: 10, align: AlignmentType.CENTER }),
                  createCell('Hasil', { isHeader: true, width: 10, align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createCell('Area A: Fondasi', { bold: true }),
                  createCell('Auth Store, Axios API interceptor (Bearer & 401 redirect), Navigation Guards, dan route registration.'),
                  createCell('src/services/api.js, src/stores/auth.js, src/router/index.js'),
                  createCell('20 Test', { align: AlignmentType.CENTER }),
                  createCell('20 Lulus (100%)', { bold: true, color: '166534', bgColor: 'DCFCE7', align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createCell('Area B: Tagihan Umum', { bold: true }),
                  createCell('Resolusi status (kunci vs final), kalkulasi subtotal/total baris, variasi spasi/kapitalisasi, state loading/empty/error.'),
                  createCell('src/views/TagihanPasienUmumView.vue'),
                  createCell('24 Test', { align: AlignmentType.CENTER }),
                  createCell('24 Lulus (100%)', { bold: true, color: '166534', bgColor: 'DCFCE7', align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createCell('Area C: Notifikasi', { bold: true }),
                  createCell('Store personal vs blast, unread counter badge, mark-as-read resilience, proteksi skema URL (tolak javascript:/data:).'),
                  createCell('src/stores/notification.js, src/utils/notifTarget.js, src/components/common/Notification*.vue'),
                  createCell('35 Test', { align: AlignmentType.CENTER }),
                  createCell('35 Lulus (100%)', { bold: true, color: '166534', bgColor: 'DCFCE7', align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createCell('Area D: Edukasi', { bold: true }),
                  createCell('Parsing tag string, filter chip multi-tag, counter API tepat 1x (resilien saat error), URL fallback image.'),
                  createCell('src/utils/edukasi.js, src/views/EdukasiView.vue, src/views/EdukasiDetailView.vue'),
                  createCell('36 Test', { align: AlignmentType.CENTER }),
                  createCell('36 Lulus (100%)', { bold: true, color: '166534', bgColor: 'DCFCE7', align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createCell('Area E: Kontrol BPJS', { bold: true }),
                  createCell('Parsing payload kontrol, format jam HH:mm, pemisahan tegas state no-data vs fetch-error, retry fetch.'),
                  createCell('src/views/RiwayatReservasiView.vue'),
                  createCell('25 Test', { align: AlignmentType.CENTER }),
                  createCell('25 Lulus (100%)', { bold: true, color: '166534', bgColor: 'DCFCE7', align: AlignmentType.CENTER })
                ]
              })
            ]
          }),

          // Section 3: Temuan Terperinci
          createHeading('3. Daftar Temuan Terperinci (Security & Functional Findings)'),
          createHeading('A. Temuan Keamanan (Security Vulnerabilities)', HeadingLevel.HEADING_3),

          ...createFindingCard(
            'SEC-01',
            'Potensi Stored XSS via Direktif v-html pada Artikel Edukasi Kesehatan',
            'Tinggi',
            'src/views/EdukasiDetailView.vue:L91',
            'Konten artikel kesehatan dirender langsung menggunakan v-html="artikel.isi || \'Belum ada konten\'". Jika data API dari backend atau database disusupi payload HTML berbahaya (misal <img src=x onerror=...>), kode JavaScript tak berizin akan tereksekusi di browser pasien dengan hak akses penuh ke LocalStorage portal.',
            'Pasang pustaka dompurify dan bungkus data sebelum render: const cleanContent = computed(() => DOMPurify.sanitize(artikel.value?.isi || \'\')).'
          ),

          ...createFindingCard(
            'SEC-02',
            'Reverse Tabnabbing via window.open Tanpa noopener,noreferrer',
            'Sedang',
            'src/views/PreviewDokumenView.vue:L279',
            'Pada penanganan unduh PDF untuk perangkat iOS, tab baru dibuka dengan window.open(url, \'_blank\') tanpa parameter rel. Halaman yang dibuka memiliki akses ke window.opener dan berpotensi memanipulasi tab asal pasien.',
            'Tambahkan parameter ketiga: window.open(url, \'_blank\', \'noopener,noreferrer\').'
          ),

          ...createFindingCard(
            'SEC-03',
            'Hardcoded Base URL Gambar Menggunakan Plain HTTP dan IP Publik Mentah',
            'Sedang',
            'src/utils/edukasi.js:L8',
            'Base URL didefinisikan sebagai http://194.169.46.193/gos2_plus/uploads/edukasi/. Saat portal di-hosting pada HTTPS, peramban modern akan memblokir gambar tersebut akibat Mixed Content Policy, serta mengekspos IP server internal.',
            'Gunakan variabel lingkungan import.meta.env.VITE_EDUKASI_IMG_BASE dengan fallback domain HTTPS resmi RSUD.'
          ),

          ...createFindingCard(
            'SEC-04',
            'Kredensial Firebase Client Hardcoded dalam Source Code',
            'Sedang',
            'src/services/firebase.js:L5-13',
            'Kredensial Firebase (API Key, Project ID, App ID) tercantum statis di source code alih-alih diisolasi di file .env. Meskipun client-side config, best practice mewajibkan isolasi melalui variabel lingkungan dan pembatasan domain di Google Cloud Console.',
            'Pindahkan ke import.meta.env.VITE_FIREBASE_* dan aktifkan HTTP Referrer Restrictions pada Google Cloud Console.'
          ),

          ...createFindingCard(
            'SEC-05',
            '12 Kerentanan Tingkat Tinggi pada Dependensi Pihak Ketiga (NPM Audit)',
            'Tinggi',
            'package.json / node_modules',
            'Audit dependensi menemukan 12 vulnerabilitas tingkat High pada paket @grpc/grpc-js (auth cert bypass), @vue/server-renderer (XSS), fast-uri (SSRF), follow-redirects (credential leak), source-map-js (DoS), dan vite/launch-editor (command execution).',
            'Lakukan koordinasi pembaruan minor/patch pada Vite (>=8.2.3) dan patch paket Firebase.'
          ),

          ...createFindingCard(
            'SEC-06',
            'Penyimpanan Token JWT dan Data Profil Pasien di LocalStorage',
            'Rendah',
            'src/stores/auth.js:L35-36',
            'sapa_token dan objek sapa_user (berisi NORM dan nama pasien) disimpan dalam LocalStorage yang rentan diekfiltrasi jika terjadi serangan XSS pada origin aplikasi.',
            'Evaluasi penggunaan cookie HttpOnly; Secure; SameSite=Strict untuk token sesi jika arsitektur backend mendukung.'
          ),

          createHeading('B. Temuan Fungsional & Arsitektur', HeadingLevel.HEADING_3),

          ...createFindingCard(
            'FUNC-01',
            'Fitur Tandai Semua Dibaca Belum Terhubung ke Endpoint Server',
            'Sedang',
            'src/stores/notification.js:L276',
            'Fungsi markAllPersonalAsRead() saat ini hanya menandai status baca pada LocalStorage lokal browser tanpa mengirimkan request sinkronisasi ke server API SIMRS. Status unread akan muncul kembali bila pasien membuka perangkat lain.',
            'Koordinasikan dengan backend SIMRS untuk menyediakan endpoint POST /notifikasi/tandai-semua-dibaca.'
          ),

          ...createFindingCard(
            'FUNC-02',
            'Inkonsistensi Dokumentasi Respons Rencana Kontrol BPJS Saat Nihil',
            'Sedang',
            'src/views/RiwayatReservasiView.vue:L692',
            'Bentuk payload SIMRS saat pasien tidak memiliki rencana kontrol belum didokumentasikan secara definitif (apakah data: null, data: [], atau status code selain 200).',
            'Tetapkan kontrak API JSON formal dengan mentor SIMRS untuk skenario data kontrol kosong.'
          ),

          // Section 4: Pemeriksaan Statis
          createHeading('4. Hasil Pemeriksaan Statis & Keamanan'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Parameter Pemeriksaan', { isHeader: true, width: 30 }),
                  createCell('Status / Kondisi', { isHeader: true, width: 25 }),
                  createCell('Analisis & Evaluasi', { isHeader: true, width: 45 })
                ]
              }),
              new TableRow({
                children: [
                  createCell('Build Produksi Vite', { bold: true }),
                  createCell('SUKSES (1.93s)', { bold: true, color: '166534', bgColor: 'DCFCE7' }),
                  createCell('Bundle teroptimasi bersih (446 KB preview chunk, 166 KB core index). PWA SW ter-generate.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('Esbuild Console Drop', { bold: true }),
                  createCell('AKTIF', { bold: true, color: '166534', bgColor: 'DCFCE7' }),
                  createCell('Seluruh console.log dan debugger otomatis dihilangkan pada bundle produksi.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('PWA Service Worker Caching', { bold: true }),
                  createCell('AMAN', { bold: true, color: '166534', bgColor: 'DCFCE7' }),
                  createCell('Runtime caching hanya menyasar font Google. Endpoint API data medis tidak di-cache di SW.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('Penggunaan innerHTML / eval', { bold: true }),
                  createCell('NIHIL (0)', { bold: true, color: '166534', bgColor: 'DCFCE7' }),
                  createCell('Tidak ditemukan penggunaan eval(), new Function(), atau innerHTML langsung.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('Content Security Policy (CSP)', { bold: true }),
                  createCell('BELUM TERPASANG', { bold: true, color: '92400E', bgColor: 'FEF3C7' }),
                  createCell('File index.html belum memuat meta tag CSP atau Referrer-Policy yang membatasi origin eksternal.')
                ]
              })
            ]
          }),

          // Section 5: Checklist Uji Manual
          createHeading('5. Checklist Pengujian Manual (Untuk Diuji di Peramban / HP)'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('No', { isHeader: true, width: 8, align: AlignmentType.CENTER }),
                  createCell('Modul / Fitur', { isHeader: true, width: 25 }),
                  createCell('Skenario Pengujian', { isHeader: true, width: 35 }),
                  createCell('Kriteria Verifikasi', { isHeader: true, width: 32 })
                ]
              }),
              new TableRow({
                children: [
                  createCell('1', { align: AlignmentType.CENTER }),
                  createCell('Tampilan Responsif', { bold: true }),
                  createCell('Buka portal pada resolusi 360px (Android) dan 375px (iPhone).'),
                  createCell('Tidak ada horizontal scrollbar liar; bottom navigation tidak menutupi tombol formulir.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('2', { align: AlignmentType.CENTER }),
                  createCell('PWA Install & Offline', { bold: true }),
                  createCell('Uji tombol install PWA di Chrome/Safari. Putuskan koneksi internet.'),
                  createCell('Modal instalasi muncul; halaman shell aplikasi tetap terbuka tanpa layar putih saat offline.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('3', { align: AlignmentType.CENTER }),
                  createCell('QR & Barcode Tiket', { bold: true }),
                  createCell('Buka bukti reservasi poli yang memiliki nomor antrian.'),
                  createCell('Barcode dan QR Code ter-render presisi dan dapat dipindai oleh barcode scanner fisik rumah sakit.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('4', { align: AlignmentType.CENTER }),
                  createCell('Dekripsi & Pratinjau PDF', { bold: true }),
                  createCell('Buka berkas hasil radiologi atau laboratorium terenkripsi AES-256.'),
                  createCell('PDF terdekripsi di memori dan canvas viewer dapat zoom in/out serta mengunduh berkas utuh.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('5', { align: AlignmentType.CENTER }),
                  createCell('Notifikasi Riil Backend', { bold: true }),
                  createCell('Login akun pasien riil yang memiliki jadwal kontrol aktif.'),
                  createCell('Badge counter berkurang real-time setelah dibaca; navigasi ke detail reservasi berhasil.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('6', { align: AlignmentType.CENTER }),
                  createCell('Konektivitas Gambar Edukasi', { bold: true }),
                  createCell('Akses Edukasi Kesehatan di lingkungan deployment HTTPS.'),
                  createCell('Gambar tampil tanpa mixed content warning; placeholder fallback muncul jika gambar 404.')
                ]
              }),
              new TableRow({
                children: [
                  createCell('7', { align: AlignmentType.CENTER }),
                  createCell('Kontrol BPJS Kosong', { bold: true }),
                  createCell('Login pasien umum yang tidak memiliki rencana kontrol dokter.'),
                  createCell('Teks "Tidak ada rencana kontrol" tampil dan tombol detail tidak muncul.')
                ]
              })
            ]
          }),

          // Section 6: File & Perintah
          createHeading('6. File Test Suite & Perintah Menjalankan Ulang'),
          createParagraph('Daftar File Pengujian yang Dibuat:', { bold: true }),
          createParagraph('1. tests/a-foundation.test.js (20 test) — Interceptor API, auth store, router guard, pendaftaran rute.', { bullet: true }),
          createParagraph('2. tests/b-tagihan.test.js (24 test) — Status resolusi kunci/final, subtotal/total, format mata uang, state loading/empty/error.', { bullet: true }),
          createParagraph('3. tests/c-notifikasi.test.js (35 test) — Store notifikasi personal/blast, unread count, validasi URL target.', { bullet: true }),
          createParagraph('4. tests/d-edukasi.test.js (36 test) — Parsing tag, filter multi-tag, counter API 1x, fallback image.', { bullet: true }),
          createParagraph('5. tests/e-bpjs-kontrol.test.js (25 test) — Format jam HH:mm, pemisahan state no-data vs error, tombol retry.', { bullet: true }),
          
          createParagraph('Perintah Menjalankan Ulang Test:', { bold: true, spaceBefore: 120 }),
          createParagraph('npm run test:run    (Menjalankan seluruh 140 test)', { bullet: true }),
          createParagraph('npm run test:coverage (Menjalankan test dengan laporan code coverage v8)', { bullet: true }),
          createParagraph('npm run build       (Memeriksa bundle produksi)', { bullet: true }),

          createParagraph('Dokumen Resmi QA & Pentesting SAPA RSTN — RSUD R.A.A. Tjokronegoro Purworejo', { italic: true, color: '64748B', spaceBefore: 240, size: 16 })
        ]
      }
    ]
  })

  const buffer = await Packer.toBuffer(doc)
  fs.writeFileSync(docxPath, buffer)
  console.log('DOCX report generated successfully:', docxPath)
}

buildDocx().catch(err => {
  console.error('Error generating DOCX:', err)
  process.exit(1)
})
