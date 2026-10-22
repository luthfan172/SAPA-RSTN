# SAPA RSTN (Sistem Aplikasi Pasien RSUD R.A.A. Tjokronegoro)

Aplikasi Portal Layanan Pasien Digital Resmi **RSUD R.A.A. Tjokronegoro Purworejo** berbasis Progressive Web App (PWA), Vue 3, Vite, dan TailwindCSS.

---

## 🚀 Fitur Versi 1.1.1-20260826 *(Versi Terbaru)*

Pembaruan versi 1.1.1-20260826 berfokus pada kompatibilitas penuh perangkat iOS/iPhone, akurasi tiket pendaftaran, penyempurnaan alur reservasi, dan performa:

### 1. 🍏 Direct PDF Download & Safari Native Viewer untuk iPhone / iPad (iOS)
- **Tombol Direct Download Khusus iOS**: Pada modul **Hasil Radiologi**, **Hasil Laboratorium**, dan **Resume Medis**, tombol di perangkat iPhone otomatis berlabel **"Unduh Hasil"** / **"Unduh Resume"**.
- **Dekripsi Background Tanpa Layar Preview**: Sekali klik, berkas otomatis diambil dan didekripsi di latar belakang, lalu seketika membuka PDF native di tab Safari / Files tanpa perlu masuk ke halaman pratinjau.
- **Polyfill & Safari WebKit Compatibility**: Penambahan polyfill `Promise.withResolvers`, penanganan transfer ArrayBuffer aman (*non-detached*), dan pembatasan alokasi memori canvas (*pixelRatio clamping*) guna mencegah crash WebKit pada browser Safari.

### 2. 🎟️ Sinkronisasi Akurasi Tiket Pendaftaran Online
- **Sinkronisasi Data Resmi Database**: Memperbaiki tampilan modal pendaftaran berhasil agar seketika mengambil nomor antrian, kode booking, dan detail dokter resmi dari database RS (menggantikan fallback dummy).
- **Akurasi QR Code**: QR Code pendaftaran yang keluar di modal langsung cocok 100% dengan data yang terbaca di mesin scanner APM RSUD dan menu Riwayat Reservasi.

### 3. 🔍 Penyempurnaan UX Modal Reservasi & Ketentuan Kehadiran
- **Navigasi & Penutupan Modal yang Fleksibel**: Penambahan tombol tutup `(X)` di kanan atas modal, penutupan via klik backdrop luar, tombol "Tutup / Selesai", dan *responsive scroll container* (`max-h-[90vh]`) untuk layar ponsel kecil.
- **Pembaruan Kalimat Ketentuan Kehadiran**: *"Pasien diharapkan hadir paling lambat 15 menit sebelum jam operasional pendaftaran ditutup untuk melakukan konfirmasi di Mesin APM atau Loket Pendaftaran Rawat Jalan."*

### 4. ⚡ Optimalisasi Profil & PWA Production
- **Pembersihan Request Redundan**: Menghilangkan panggilan API profil yang tidak perlu, data profil dipetakan langsung dari respon login token.
- **Konfigurasi Produksi**: Pengaturan PWA production build, penonaktifan service worker dev-caching, dan aturan Apache `.htaccess` untuk SPA rewrite mode.

---

## 📦 Fitur Versi 1.1.0

### 1. 📋 Resume Medis Rawat Inap
- **Akses Riwayat Rawat Inap**: Mengambil daftar riwayat perawatan rawat inap pasien (`GET /resume-medis/list-ranap`).
- **Informasi Kartu**: Menampilkan **No. Daftar**, nama **DPJP**, **Tanggal Daftar / Periode Rawat**, ruangan perawatan, serta status validasi resume.
- **Dekripsi Dokumen PDF**: Membuka dan mendekripsi berkas ringkasan pulang resmi dokter (`GET /resume-medis/view-resume?idReg=...`).
- **Flash Message Warning**: Notifikasi instan jika berkas belum selesai divalidasi oleh DPJP.

### 2. 🧪 Hasil Laboratorium
- **Riwayat Pemeriksaan Lab**: Mengambil arsip riwayat uji laboratorium pasien (`GET /hasil-laboratorium/list-pemeriksaan`).
- **Viewer PDF Terdekripsi**: Dekripsi dokumen hasil tes laboratorium secara otomatis (`GET /hasil-laboratorium/view-hasil?noKunjungan=...`).
- **Pemberitahuan Konfirmasi**: Flash message jika hasil tes masih dalam proses verifikasi analis di Instalasi Laboratorium.

### 3. 🩻 Hasil Radiologi
- **Daftar Ekspertise Radiologi**: Mengambil data arsip rontgen/USG/CT-Scan (`GET /hasil-radiologi/list-pemeriksaan`).
- **Paginasi & Dekripsi Berkas**: Pembacaan hasil ekspertise dokter spesialis radiologi (`GET /hasil-radiologi/view-bacaan?acsn=...`).

### 4. 📄 Interactive Canvas PDF Viewer & Gestur Touchscreen
- **Touchscreen Pinch-to-Zoom (2 Jari)**: Rentangkan atau cubit layar untuk memperbesar (*zoom in*) atau memperkecil (*zoom out*) dokumen PDF secara real-time dan mulus.
- **Double-Tap to Zoom**: Ketuk 2x untuk memperbesar cepat ke 2.0x atau mengembalikan ke ukuran pas (*Fit to screen*).
- **Smooth Step Zooming**: Tombol perbesar/perkecil bertahap halus (+/- 10%) berbasis akselerasi grafis 60 FPS dan *debounced crisp canvas re-rendering*.
- **Aksi Dokumen**: Fitur **Unduh PDF** (`.pdf`) dan **Bagikan** (*Web Share API* untuk WhatsApp/Email).

### 5. ⚡ Infinite Scroll
- Pengguliran data tanpa batas berbasis `IntersectionObserver` pada modul Resume Medis, Hasil Laboratorium, dan Hasil Radiologi.
- Penanganan data tanpa duplikasi dan indikator status muat data.

### 6. 🛡️ Canvas Captcha & Keamanan Login
- **Canvas Captcha**: Alfanumerik 6-karakter acak dengan efek rotasi teks, *blur*, dan garis/titik distorsi di sisi front-end.
- **Enkripsi AES-256-CBC**: Dekripsi dokumen rekam medis langsung di sisi klien menggunakan CryptoJS.
- **JWT Authentication**: Proteksi rute dan *interceptor bearer token* otomatis.

### 7. ⏱️ Sinkronisasi Jadwal & Aturan Cutoff Jam 9 Pagi
- Sinkronisasi otomatis tanggal dan dokter dari jadwal poliklinik ke formulir pendaftaran online.
- Aturan Cutoff 09:00 WIB: Pemberitahuan otomatis untuk memilih tanggal berikutnya jika reservasi dilakukan di hari H setelah jam 9 pagi.

---

## 📱 Fitur Versi 1.0.0 *(Initial Release)*

Fitur fondasi utama sistem pendaftaran dan informasi mandiri pasien:

### 1. 🔐 Autentikasi & Akun Pasien
- Login menggunakan Nomor Rekam Medis (No. RM) dan Tanggal Lahir pasien.
- Profil Pasien (Nama, NIK, No. RM, Jenis Kelamin, Tanggal Lahir, Alamat) dan manajemen sesi.

### 2. 📅 Jadwal Dokter Poliklinik
- Jadwal dokter spesialis per poliklinik/hari dengan fitur pencarian interaktif.

### 3. 📝 Pendaftaran Online (Reservasi Rawat Jalan)
- Pendaftaran mandiri untuk pasien **BPJS Kesehatan** dan **Pasien Umum/Bayar Sendiri**.
- Pemilihan tanggal kunjungan, poliklinik tujuan, dokter spesialis, dan validasi rujukan.
- Bukti booking dengan Barcode dan QR Code untuk *check-in* mandiri di rumah sakit.

### 4. 📋 Riwayat Reservasi Pasien
- Daftar riwayat pendaftaran rawat jalan dengan status (Aktif, Selesai, Batal, Kedaluwarsa) serta fitur pembatalan mandiri.

### 5. 💊 Antrian Farmasi
- Pelacakan status penyiapan resep obat di Instalasi Farmasi secara *real-time*.

### 6. 🛏️ Informasi Ketersediaan Tempat Tidur (Kamar)
- Pantauan kapasitas dan sisa kamar rawat inap realtime per kelas perawatan.

### 7. 📰 Edukasi Kesehatan & PWA
- Artikel tips kesehatan resmi dan dukungan PWA (*Add to Home Screen*).

---

## 🛠️ Stack Teknologi:
- **Framework**: [Vue 3](https://vuejs.org/) (Composition API `<script setup>`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **Kriptografi**: CryptoJS (AES-256-CBC)
- **PDF Engine**: PDF.js (`pdfjs-dist`) & HTML5 Canvas
- **PWA**: `vite-plugin-pwa`

---

## 💻 Panduan Menjalankan Aplikasi:

```bash
# Install dependencies
npm install

# Jalankan server development
npm run dev

# Build untuk production
npm run build
```
