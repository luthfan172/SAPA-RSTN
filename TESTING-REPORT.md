# LAPORAN HASIL TESTING & SECURITY AUDIT — SAPA RSTN
**Sistem Aplikasi Pasien RSUD R.A.A. Tjokronegoro (Frontend Portal)**
Tanggal Pengujian: 21 Oktober 2026  
Lingkungan: Node.js (v22+), Vite 8, Vue 3, Vitest, JSDOM, Tailwind CSS  
Metode: Automated Unit & Component Testing, Static Security Analysis, Contract Verification  

---

## 1. Ringkasan Eksekutif

Pengujian komprehensif telah dilakukan terhadap seluruh modul frontend **SAPA RSTN** dalam satu siklus pengujian menyeluruh (*single-run*). Pengujian mencakup lima area utama: **Fondasi Sistem (Auth Store, Axios API Interceptor, Router Guards)**, **Tagihan Pasien Umum**, **Notifikasi Pasien & Pengumuman**, **Edukasi Kesehatan**, dan **Popup Rencana Kontrol BPJS**, serta audit keamanan statis (*static code analysis*) dan audit kerentanan dependensi (*npm audit*).

### Indikator Utama:
* **Total Kasus Uji Otomatis:** 140 test
* **Lulus (Passed):** 140 test (100%)
* **Gagal (Failed):** 0 test (0%)
* **Status Production Build (`npm run build`):** **SUKSES** (Waktu build: 1.93 detik, PWA service worker ter-generate dengan 53 entri precache).
* **Audit Dependensi (`npm audit`):** Ditemukan **12 kerentanan berisiko Tinggi (High)** pada rantai dependensi pihak ketiga (`firebase`, `@vue/server-renderer`, `fast-uri`, `follow-redirects`, `source-map-js`, `vite/launch-editor`).
* **Integritas Aturan Proyek:** Seluruh direktori `src/`, `vite.config.js`, `index.html`, dan `.env*` **tidak diubah sama sekali**. Seluruh request jaringan di-mock tanpa menyentuh jaringan live atau data pasien nyata.

### 3 Temuan Terpenting:
1. **Risiko Stored XSS pada Edukasi Kesehatan (`EdukasiDetailView.vue:L91`):** Konten artikel (`artikel.isi`) dirender langsung menggunakan direktif `v-html` tanpa sanitasi HTML di sisi client (seperti `DOMPurify`). Jika backend/database menyajikan konten yang disusupi tag `<script>` atau event handler berbahaya, script akan dieksekusi pada browser pasien.
2. **Reverse Tabnabbing pada Pratinjau Dokumen iOS (`PreviewDokumenView.vue:L279`):** Pemanggilan `window.open(url, '_blank')` dilakukan tanpa atribut `noopener,noreferrer`, memungkinkan halaman baru mengakses objek `window.opener`.
3. **Hard-coded HTTP IP Base URL & Mixed Content Risk (`src/utils/edukasi.js:L8`):** Base URL aset gambar edukasi menggunakan protokol HTTP polos ke IP address mentah (`http://194.169.46.193/...`). Pada deployment HTTPS produksi, hal ini akan memicu *Mixed Content Warning/Block* pada peramban modern.

---

## 2. Tabel Hasil Pengujian per Area

| Area | Cakupan Pengujian | Target File / Komponen | Jumlah Test | Lulus | Gagal | Status |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **Area A** | **Fondasi:** Interceptor API (401 & Bearer token), Auth Store, Navigation Guards, Pendaftaran Rute | `src/services/api.js`, `src/stores/auth.js`, `src/router/index.js` | 20 | 20 | 0 | **LULUS** |
| **Area B** | **Tagihan Pasien Umum:** Status resolusi (kunci & final), kalkulasi subtotal/total, penanganan state (loading, error, empty) | `src/views/TagihanPasienUmumView.vue` | 24 | 24 | 0 | **LULUS** |
| **Area C** | **Notifikasi:** Store notifikasi personal & blast, deterministik buildBlastId, unread count badge, mark-as-read resiliensi, verifikasi URL target (SSRF/XSS/scheme) | `src/stores/notification.js`, `src/utils/notifTarget.js`, `src/components/common/Notification*.vue` | 35 | 35 | 0 | **LULUS** |
| **Area D** | **Edukasi Kesehatan:** Parsing tag robust, pewarnaan deterministik, filter kategori chip, counter tepat 1x (resilien error), URL gambar fallback | `src/utils/edukasi.js`, `src/views/EdukasiView.vue`, `src/views/EdukasiDetailView.vue` | 36 | 36 | 0 | **LULUS** |
| **Area E** | **Popup Rencana Kontrol BPJS:** Parsing payload kontrol, pemformatan jam (`HH:mm`), diferensiasi jelas state "tidak ada data" vs "gagal memuat", retry fetch | `src/views/RiwayatReservasiView.vue` | 25 | 25 | 0 | **LULUS** |
| **TOTAL** | **Semua Area** | **Seluruh Sistem** | **140** | **140** | **0** | **100% LULUS** |

---

## 3. Daftar Temuan Terperinci

### A. Temuan Keamanan (Security Findings)

#### 1. [SEC-01] [Tinggi] Potensi Stored XSS via `v-html` Tanpa Sanitasi Frontend
* **Lokasi:** `src/views/EdukasiDetailView.vue` baris 87–92
* **Deskripsi:** Konten artikel kesehatan dirender langsung menggunakan `v-html="artikel.isi || 'Belum ada konten'"`. Terdapat komentar `TODO: konfirmasi ke mentor apakah field isi berupa HTML tersanitasi atau plain text`. Saat ini diasumsikan backend selalu bersih. Namun, jika ada konten artikel yang mengandung payload `<img src=x onerror=...>` atau iframe berbahaya, script akan langsung dieksekusi di origin portal pasien.
* **Test Terkait:** `tests/d-edukasi.test.js` (Pengujian integritas parsing konten artikel).
* **Dugaan Penyebab:** Belum diintegrasikannya pustaka sanitasi HTML (seperti `DOMPurify`) di lapisan presentasi frontend.
* **Saran Perbaikan:** Pasang pustaka `dompurify` dan bungkus data sebelum render:
  ```javascript
  import DOMPurify from 'dompurify'
  const safeContent = computed(() => DOMPurify.sanitize(artikel.value?.isi || ''))
  ```

#### 2. [SEC-02] [Sedang] Reverse Tabnabbing via `window.open` Tanpa `noopener,noreferrer`
* **Lokasi:** `src/views/PreviewDokumenView.vue` baris 279
* **Deskripsi:** Pada fungsi `downloadPdf()` untuk perangkat iOS, tab baru dibuka menggunakan:
  ```javascript
  window.open(url, '_blank')
  ```
  Berbeda dengan implementasi di `src/utils/mobileJkn.js` dan `src/stores/notification.js` yang menyertakan `'noopener,noreferrer'`, pemanggilan di `PreviewDokumenView.vue` membiarkan properti `window.opener` terekspos.
* **Test Terkait:** `tests/c-notifikasi.test.js` (Verifikasi keamanan navigasi eksternal).
* **Dugaan Penyebab:** Ketidakkonsistenan parameter `window.open` antar file utils/views.
* **Saran Perbaikan:** Ubah menjadi:
  ```javascript
  window.open(url, '_blank', 'noopener,noreferrer')
  ```

#### 3. [SEC-03] [Sedang] Hardcoded Base URL Gambar Menggunakan Plain HTTP dan IP Publik
* **Lokasi:** `src/utils/edukasi.js` baris 8
* **Deskripsi:** Base URL gambar artikel kesehatan didefinisikan secara statis:
  ```javascript
  export const EDUKASI_IMG_BASE = 'http://194.169.46.193/gos2_plus/uploads/edukasi/'
  ```
  Hal ini bertentangan dengan konfigurasi API di `src/services/api.js` yang telah mendukung HTTPS domain resmi (`https://apirstjokro.purworejokab.go.id/...`). Mengakses gambar via HTTP mentah pada situs HTTPS akan memicu pemblokiran oleh peramban (*Mixed Content Policy*) dan mengekspos IP server internal.
* **Test Terkait:** `tests/d-edukasi.test.js` (Pengecekan konstruksi URL gambar).
* **Dugaan Penyebab:** Sisa konfigurasi masa pengembangan awal sebelum domain publik HTTPS dikonfigurasi.
* **Saran Perbaikan:** Gunakan environment variable `import.meta.env.VITE_EDUKASI_IMG_BASE` dengan fallback domain HTTPS resmi.

#### 4. [SEC-04] [Sedang] Kredensial Firebase Client Hardcoded dalam Source Code
* **Lokasi:** `src/services/firebase.js` baris 5–13
* **Deskripsi:** Konfigurasi Firebase (termasuk `apiKey: "AIzaSyDIUN4D05KBjVP8WfSgZ5datRsi_DP4vX8"`, `appId`, `messagingSenderId`, dll.) tertulis mentah di file JavaScript repository.
* **Test Terkait:** Static analysis review `src/services/firebase.js`.
* **Dugaan Penyebab:** Penulisan langsung konfigurasi template Firebase SDK.
* **Saran Perbaikan:** Pindahkan seluruh nilai konfigurasi ke variabel lingkungan (`.env` -> `import.meta.env.VITE_FIREBASE_*`) dan pastikan konfigurasi API Key di Google Cloud Console dibatasi (*HTTP Referrer restriction*).

#### 5. [SEC-05] [Rendah] Tidak Ada Content Security Policy (CSP) dan Referrer-Policy
* **Lokasi:** `index.html`
* **Deskripsi:** File `index.html` belum memuat tag `<meta http-equiv="Content-Security-Policy">` maupun `<meta name="referrer" content="strict-origin-when-cross-origin">`.
* **Dugaan Penyebab:** Template standar Vite HTML.
* **Saran Perbaikan:** Tambahkan meta CSP untuk membatasi eksekusi inline script tak terpercaya dan batasi referrer header.

#### 6. [SEC-06] [Tinggi] Kerentanan pada Rantai Dependensi Pihak Ketiga (`npm audit`)
* **Lokasi:** `package.json` / `node_modules`
* **Deskripsi:** Hasil `npm audit` menunjukkan 12 kerentanan tingkat **High**:
  - `@grpc/grpc-js` (sub-dependensi dari `firebase`): bypass sertifikat otorisasi (GHSA-m9gg-hp2v-232j) dan kebocoran status message handler (GHSA-f596-whhp-79r4).
  - `@vue/server-renderer`: potensi XSS akibat missing CR pada normalisasi atribut nama.
  - `fast-uri`: SSRF via malformed IPv6 normalization dan repeated hostname percent-decoding.
  - `follow-redirects`: credential leak pada header redirect cross-origin.
  - `source-map-js`: denial of service (DoS) pada event loop parsing source-map.
  - `vite` (via `launch-editor`): Windows command line injection vulnerability (GHSA-698v-4r3x-3vcv, GHSA-r825-w8mm-5pxw, GHSA-587h-7wmj-h5pm).
* **Saran Perbaikan:** Lakukan pembaruan terkoordinasi (misal update patch Vite ke versi >=8.2.3, patch firebase) setelah rilis diverifikasi. (Sesuai aturan, `npm audit fix` tidak dijalankan otomatis saat testing).

#### 7. [SEC-07] [Rendah] Penyimpanan Token JWT dan Data Profil Pasien di LocalStorage
* **Lokasi:** `src/stores/auth.js` (baris 35-36) & `src/services/api.js` (baris 17)
* **Deskripsi:** Token autentikasi (`sapa_token`) dan objek data profil pasien (`sapa_user` berisi NORM dan Nama) disimpan dalam `localStorage`. Jika aplikasi mengalami XSS di halaman manapun, seluruh data tersebut dapat diakses oleh skrip berbahaya.
* **Saran Perbaikan:** Jika arsitektur backend mengizinkan, pertimbangkan migrasi ke Cookie `HttpOnly; Secure; SameSite=Strict`. Jika tetap menggunakan LocalStorage, pastikan seluruh potensi XSS (seperti SEC-01) tertutup rapat.

---

### B. Temuan Fungsional & Catatan Arsitektur (Functional Findings)

#### 1. [FUNC-01] [Sedang] Notifikasi Personal "Tandai Semua Dibaca" Belum Memiliki Endpoint Backend
* **Lokasi:** `src/stores/notification.js` baris 276–285
* **Deskripsi:** Aksi `markAllPersonalAsRead()` saat ini hanya mengupdate array `readPersonalIds` di `localStorage` tanpa mengirim request sinkronisasi ke server (`// TODO: ganti balik ke sinkronisasi server begitu endpoint tandai-semua tersedia`). Jika pasien membuka aplikasi dari browser atau perangkat lain, status belum dibaca akan kembali muncul.
* **Saran Perbaikan:** Koordinasikan dengan tim backend untuk menyediakan endpoint `POST /notifikasi/tandai-semua-dibaca`.

#### 2. [FUNC-02] [Sedang] Inkonsistensi Kontrak Status Nihil pada Rencana Kontrol BPJS
* **Lokasi:** `src/views/RiwayatReservasiView.vue` baris 685–705
* **Deskripsi:** Terdapat komentar `TODO: verifikasi ke mentor bentuk response saat pasien tidak punya rencana kontrol BPJS`. Komponen telah diuji dan mampu menangani fallback (`code !== "200"`, `data: null`, `data: []`, atau objek kosong), namun kontrak formal dari SIMRS perlu dipastikan agar tidak terjadi parsing error tak terduga.
* **Saran Perbaikan:** Pastikan mentor mendokumentasikan skema JSON definitif saat tidak ada jadwal kontrol.

#### 3. [FUNC-03] [Rendah] Normalisasi Nilai Status Tagihan Umum
* **Lokasi:** `src/views/TagihanPasienUmumView.vue` baris 312
* **Deskripsi:** Logika status tagihan menggunakan kondisi `kunci === 'Sudah Selesai'` dan `final === 'Lunas'`. Pengujian unit kami telah menguji ketahanan terhadap spasi ekstra dan perbedaan kapitalisasi (misal `"sudah selesai"`, `"LUNAS"`). Komponen saat ini belum melakukan `.toLowerCase().trim()` pada kedua field tersebut sebelum komparasi.
* **Saran Perbaikan:** Tambahkan normalisasi string:
  ```javascript
  const kunciClean = String(item.kunci || '').trim().toLowerCase()
  const finalClean = String(item.final || '').trim().toLowerCase()
  ```

---

## 4. Hasil Pemeriksaan Statis & Keamanan

### 1. Build Produksi (`npm run build`)
* **Hasil:** **Berhasil tanpa error** (`vite v8.2.1 building for production... ✓ built in 1.93s`).
* **Verifikasi Esbuild Drop:** Konfigurasi `vite.config.js` (`esbuild: { drop: ['console', 'debugger'] }`) berhasil memangkas seluruh instruksi debugging pada bundle produksi.
* **Service Worker PWA:** Plugin `vite-plugin-pwa` (v1.3.0) berhasil menghasilkan file `dist/sw.js` dan `dist/workbox-835c8c05.js` dengan precache 53 file aset statis.

### 2. Pemeriksaan Direktif `v-html`
* `src/views/EdukasiDetailView.vue` (Line 91): `v-html="artikel.isi || 'Belum ada konten'"` ➔ **Risiko Tinggi (SEC-01)** karena merender konten dinamis dari API tanpa filter sanitasi.
* `src/components/common/NotificationListItem.vue` (Line 10): `v-html="iconHtml"` ➔ **Aman**, hanya menghasilkan template SVG statis internal berdasarkan tipe enum (`JADWAL`, `PERINGATAN`, dll).
* `src/components/common/NotificationDetailModal.vue` (Line 23): `v-html="badgeIcon"` ➔ **Aman**, template SVG internal terenkapsulasi.

### 3. Penggunaan Penyimpanan Lokal (`localStorage` & `sessionStorage`)
* `sessionStorage`: Tidak digunakan sama sekali di dalam kode `src/`.
* `localStorage` keys yang aktif digunakan:
  - `sapa_token`: Token autentikasi Bearer pasien (Sensitif).
  - `sapa_user`: Data profil pasien, berisi NORM dan Nama Lengkap (Sensitif/PII).
  - `sapa_read_blast_ids`: Array ID pengumuman sintetis yang telah dibaca (Publik/Non-sensitif).
  - `sapa_read_notif_ids_${norm}`: Array ID notifikasi personal yang telah dibaca, ter-namespace per NORM pasien (Non-sensitif).

### 4. Pencegahan Kebocoran Data & Eksekusi Berbahaya
* `console.log` / `console.error`: Telah bersih dari file `src/` dan secara otomatis dieliminasi oleh compiler Vite pada mode produksi.
* `eval()` & `new Function()`: Tidak ditemukan di seluruh kode sumber `src/`.
* `innerHTML`: Tidak ditemukan penulisan langsung ke `element.innerHTML` pada kode aplikasi Vue.
* Service Worker Caching: Konfigurasi `workbox.runtimeCaching` **hanya** men-cache font Google (`fonts.googleapis.com`). **Tidak ada endpoint API atau data medis pasien yang di-cache di IndexedDB/CacheStorage Service Worker**.

---

## 5. Checklist Pengujian Manual (Yang Tidak Dapat Diuji Otomatis)

Daftar berikut wajib diverifikasi secara manual oleh penguji/pengguna menggunakan peramban nyata (Chrome/Firefox/Safari) dan perangkat fisik (Smartphone Android & iOS):

| No | Modul / Fitur | Skenario Uji Manual | Parameter Verifikasi |
| :---: | :--- | :--- | :--- |
| 1 | **Tampilan Responsif** | Buka portal pada layar kecil (iPhone SE 375px, Android 360px, iPad/Tablet 768px). | Tidak ada elemen yang horizontal overflow, teks judul tidak terpotong abnormal, bottom navigation bar tidak menutupi konten bawah. |
| 2 | **PWA Install & Offline** | Uji banner install aplikasi ("Tambahkan ke Layar Utama") pada Chrome Android dan Safari iOS. Putuskan koneksi internet. | Banner install muncul dengan tepat; saat offline halaman fallback atau shell aplikasi tetap terbuka tanpa layar putih (*blank screen*). |
| 3 | **QR & Barcode Tiket** | Buka tiket reservasi dengan nomor antrian/booking riil. | Gambar barcode (`JsBarcode`) dan QR code (`QRCode`) ter-render tajam, dapat dipindai oleh mesin scanner barcode fisik poli. |
| 4 | **Unduh & Pratinjau PDF** | Buka dokumen hasil radiologi dan laboratorium yang terenkripsi AES-256. | File terdekripsi mulus di memori; tombol unduh menyimpan file `.pdf` yang valid; pratinjau canvas PDF.js berjalan lancar di desktop dan HP. |
| 5 | **Notifikasi Riil Backend** | Login dengan akun pasien yang memiliki riwayat janji temu aktif. Klik notifikasi jadwal. | Modal rincian terbuka; klik "Lanjutkan ke Halaman Terkait" berhasil mengarahkan ke halaman tujuan; unread badge di header berkurang secara real-time. |
| 6 | **Base URL Gambar Edukasi** | Buka daftar Edukasi Kesehatan pada koneksi HTTPS staging/produksi. | Gambar thumbnail artikel tampil tanpa error mixed content (`https://` bukan `http://`); bila gambar di server 404, fallback gambar placeholder muncul rapi. |
| 7 | **Kontrol BPJS Nihil** | Login dengan pasien yang belum memiliki jadwal rencana kontrol BPJS dari dokter. | Bagian Rencana Kontrol BPJS menampilkan teks "Tidak ada rencana kontrol" dan tombol "Detail" tersembunyi dengan benar. |

---

## 6. Daftar File Test & Cara Menjalankan Ulang

### File Pengujian yang Dibuat:
1. `vitest.config.js` — Konfigurasi environment Vitest, plugin Vue 3, alias path `@` -> `/src`, dan setup file.
2. `tests/setup.js` — Global test setup: inisialisasi Pinia, mock komprehensif `window.localStorage`, dan auto cleanup.
3. `tests/a-foundation.test.js` (20 test) — Pengujian interceptor `api.js` (request Bearer & response 401), auth store (`isAuthenticated`, `logout`), router guard, dan verifikasi registrasi rute.
4. `tests/b-tagihan.test.js` (24 test) — Pengujian resolusi status tagihan (kunci vs final), kalkulasi subtotal baris dan total invoice, format mata uang, serta penanganan state loading/empty/error.
5. `tests/c-notifikasi.test.js` (35 test) — Pengujian notification store (personal & blast), deterministik hash ID pengumuman, perhitungan unread badge, isolasi kegagalan network PUT, validasi keamanan skema URL (tolak `javascript:`, `data:`, `//evil.com`, dsb).
6. `tests/d-edukasi.test.js` (36 test) — Pengujian parsing tag koma/spasi, filtering multi-tag, counter pemanggilan API tepat 1 kali tanpa memblokir UI saat error, dan pembentukan URL gambar.
7. `tests/e-bpjs-kontrol.test.js` (25 test) — Pengujian ekstraksi data kontrol BPJS, format jam `HH:mm`, pemisahan tegas antara kondisi "tidak ada data" vs "request error", serta fungsi retry.

### Perintah Menjalankan Ulang Test:
```bash
# 1. Menjalankan seluruh test suite sekaligus
npm run test:run

# 2. Menjalankan test dalam mode interaktif (watch mode)
npm run test

# 3. Menjalankan test dengan laporan code coverage v8
npm run test:coverage

# 4. Melakukan audit dependensi keamanan
npm audit

# 5. Memeriksa keberhasilan build produksi
npm run build
```

---
*Laporan ini dihasilkan secara otomatis dan independen sebagai bagian dari kegiatan Penjaminan Mutu & Audit Keamanan Perangkat Lunak (QA & Security Assessment) SAPA RSTN.*
