<template>
  <div class="max-w-4xl mx-auto space-y-5 sm:space-y-6" style="animation: fade-in 0.3s ease-out;">
    <!-- Banner Header -->
    <div class="bg-gradient-to-r from-orange-700 via-amber-700 to-yellow-800 rounded-3xl p-4 sm:p-6 text-white shadow-lg shadow-orange-950/10 relative overflow-hidden">
      <div class="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-lg pointer-events-none"></div>
      <div class="relative z-10 flex items-center justify-between gap-3 sm:gap-4">
        <div class="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <path d="M14 2v6h6"/><path d="M9 15h6"/><path d="M12 12v6"/>
            </svg>
          </div>
          <div class="min-w-0 space-y-0.5">
            <h2 class="text-sm sm:text-lg md:text-xl font-black text-white tracking-tight leading-snug">Tagihan Pasien</h2>
            <p class="text-[11px] sm:text-xs text-orange-200/90 font-medium truncate">Riwayat tagihan &amp; pembayaran rawat jalan</p>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button type="button" @click="handleRefresh" :disabled="loading || loadingMore" class="px-3 sm:px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold text-xs backdrop-blur-md border border-white/25 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" :class="loading ? 'animate-spin' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            <span class="hidden sm:inline">{{ loading ? 'Memuat...' : 'Refresh' }}</span>
          </button>
        </div>
      </div>
    </div>
    <div v-if="loading" class="py-16 text-center flex flex-col items-center justify-center gap-3 text-gray-400">
      <svg class="w-9 h-9 animate-spin text-orange-600" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
        <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/>
      </svg>
      <span class="text-xs font-semibold">Memuat daftar tagihan pasien...</span>
    </div>
    <div v-else-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-5 text-center space-y-3">
      <div class="flex items-center justify-center gap-2 font-bold text-sm">
        <svg class="w-5 h-5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>
      <button type="button" @click="handleRefresh" class="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-all active:scale-95 cursor-pointer shadow-sm">Coba Lagi</button>
    </div>
    <div v-else-if="listTagihan.length > 0" class="space-y-3.5">
      <div class="flex items-center gap-2 flex-wrap">
        <button v-for="chip in filterChips" :key="chip.key" type="button" @click="filterAktif = chip.key"
          class="px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer"
          :class="filterAktif === chip.key ? 'bg-orange-600 text-white border-orange-600 shadow-sm shadow-orange-600/20' : 'bg-white text-gray-500 border-gray-200 hover:border-orange-300 hover:text-orange-600'">
          {{ chip.label }}<span v-if="chip.count > 0" class="ml-1 opacity-80">({{ chip.count }})</span>
        </button>
      </div>
      <div v-if="listTagihanFiltered.length === 0" class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center space-y-2">
        <p class="text-sm font-semibold text-gray-500">Tidak ada tagihan dengan status ini.</p>
      </div>
      <div v-for="item in listTagihanFiltered" :key="item.idTagihan" class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100/90 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 group">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-start gap-3.5 flex-1 min-w-0">
            <div class="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-orange-600 group-hover:bg-orange-100/80 transition-colors">
              <svg class="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6"/><path d="M9 15h6"/><path d="M12 12v6"/>
              </svg>
            </div>
            <div class="space-y-1.5 flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h4 class="text-sm sm:text-base font-bold text-gray-900 group-hover:text-orange-700 transition-colors leading-tight break-words">{{ item.ruangan || 'Rawat Jalan' }}</h4>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold border inline-flex items-center gap-1 shrink-0" :class="getStatusMap(resolveStatusTagihan(item)).badgeClass">
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusMap(resolveStatusTagihan(item)).dotClass"></span>
                  <span>{{ getStatusMap(resolveStatusTagihan(item)).label }}</span>
                </span>
              </div>
              <p v-if="resolveStatusTagihan(item) === 'BELUM_SELESAI'" class="text-[10px] text-gray-400 font-medium">Sedang diproses kasir</p>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                <span class="flex items-center gap-1 font-medium">
                  <svg class="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>{{ formatTglIndo(item.tgl) }}</span>
                </span>
                <span class="font-mono text-[11px] text-gray-400">No. Tagihan: <strong class="text-gray-700 font-semibold">#{{ item.idTagihan }}</strong></span>
              </div>
              <div class="pt-1 flex items-baseline gap-1.5">
                <span class="text-[11px] text-gray-400 font-medium shrink-0">{{ resolveStatusTagihan(item) === 'BELUM_SELESAI' ? 'Tagihan saat ini:' : resolveStatusTagihan(item) === 'BELUM_LUNAS' ? 'Total tagihan:' : 'Telah dibayar:' }}</span>
                <span class="text-sm font-extrabold" :class="resolveStatusTagihan(item) === 'LUNAS' ? 'text-emerald-700' : 'text-orange-700'">{{ formatRupiah(item.totalTagihan) }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
            <button type="button" @click="openDetail(item)" class="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <span>Lihat Rincian</span>
            </button>
          </div>
        </div>
      </div>
      <div ref="loadMoreTrigger" class="py-3 flex flex-col items-center justify-center text-center">
        <div v-if="loadingMore" class="flex items-center gap-2 py-2 text-xs font-semibold text-orange-600">
          <svg class="w-4 h-4 animate-spin text-orange-600" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/>
          </svg>
          <span>Memuat tagihan lebih lama...</span>
        </div>
        <div v-else-if="!hasMore && listTagihan.length > 0" class="text-[11px] text-gray-400 py-1.5 font-medium flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Semua riwayat tagihan telah ditampilkan</span>
        </div>
      </div>
      <div class="p-4 sm:p-5 bg-orange-50/70 border border-orange-200/80 rounded-2xl flex items-start gap-3.5 text-xs text-orange-900 shadow-sm">
        <div class="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <div class="space-y-0.5">
          <h4 class="font-bold text-orange-950">Informasi Tagihan:</h4>
          <p class="text-orange-800 leading-relaxed">Untuk konfirmasi pembayaran atau pertanyaan terkait tagihan, silakan <strong>hubungi Bagian Kasir / Administrasi Keuangan RSUD R.A.A. Tjokronegoro</strong>.</p>
        </div>
      </div>
    </div>
    <div v-else class="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
      <div class="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <path d="M14 2v6h6"/><path d="M9 15h6"/><path d="M12 12v6"/>
        </svg>
      </div>
      <div class="space-y-1.5 max-w-md">
        <h3 class="text-base font-bold text-gray-800">Belum Ada Riwayat Tagihan</h3>
        <p class="text-xs text-gray-400 leading-relaxed">Belum ditemukan tagihan pasien untuk Nomor Rekam Medis Anda. Jika Anda merasa sudah pernah melakukan kunjungan, silakan hubungi bagian Administrasi Keuangan.</p>
      </div>
    </div>
    <Teleport to="body">
      <transition name="fade">
        <div v-if="selectedTagihan" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="selectedTagihan = null">
          <div class="bg-white w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl shadow-2xl" style="animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
            <div class="flex items-center justify-between p-6 sm:p-7 pb-4 border-b border-gray-100 shrink-0">
              <div class="text-left space-y-1">
                <span class="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Rincian Tagihan</span>
                <h3 class="text-base sm:text-lg font-black text-gray-800">No. {{ selectedTagihan.idTagihan }}</h3>
                <div class="flex flex-wrap items-center gap-2 text-[10px] text-gray-500 font-medium">
                  <span>{{ formatTglIndo(selectedTagihan.tgl) }}</span>
                  <span v-if="selectedTagihan.ruangan" class="text-gray-400">·</span>
                  <span v-if="selectedTagihan.ruangan">{{ selectedTagihan.ruangan }}</span>
                </div>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border" :class="getStatusMap(resolveStatusTagihan(selectedTagihan)).badgeClass">
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusMap(resolveStatusTagihan(selectedTagihan)).dotClass"></span>
                  {{ getStatusMap(resolveStatusTagihan(selectedTagihan)).label }}
                </span>
              </div>
              <button @click="selectedTagihan = null" class="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6 sm:p-7 space-y-4">
              <div v-if="detailLoading" class="py-10 text-center flex flex-col items-center justify-center gap-3 text-gray-400">
                <svg class="w-7 h-7 animate-spin text-orange-600" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/>
                </svg>
                <span class="text-xs font-semibold">Memuat rincian tagihan...</span>
              </div>
              <div v-else-if="detailError" class="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-center space-y-3">
                <div class="flex items-center justify-center gap-2 font-bold text-xs">
                  <svg class="w-4 h-4 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{{ detailError }}</span>
                </div>
                <button type="button" @click="fetchDetail(selectedTagihan.idTagihan)" class="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-all active:scale-95 cursor-pointer shadow-sm">Coba Lagi</button>
              </div>
              <div v-else-if="detailData !== null" class="space-y-5">
                <div v-if="resolveStatusTagihan(selectedTagihan) === 'BELUM_SELESAI'" class="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-800">
                  <svg class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <span>Rincian biaya di bawah ini masih dapat berubah karena tagihan belum dikunci oleh kasir.</span>
                </div>
                <div v-if="detailGrouped.length > 0">
                  <div v-for="grup in detailGrouped" :key="grup.ruangan" class="mb-4">
                    <div class="flex items-center justify-between py-1.5 mb-1 border-b border-orange-100">
                      <span class="text-[11px] font-extrabold text-orange-700 uppercase tracking-wider">{{ grup.ruangan }}</span>
                      <span class="text-[11px] font-bold text-orange-700">{{ formatRupiah(grup.subtotalGrup) }}</span>
                    </div>
                    <table class="w-full text-xs">
                      <thead>
                        <tr class="text-gray-400 text-left">
                          <th class="py-2 pr-2 font-semibold">Tindakan</th>
                          <th class="py-2 px-2 font-semibold text-center">Jml</th>
                          <th class="py-2 px-2 font-semibold text-right">Tarif</th>
                          <th class="py-2 pl-2 font-semibold text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(r, idx) in grup.items" :key="idx" class="border-b border-gray-50 hover:bg-gray-50/60">
                          <td class="py-2.5 pr-2">
                            <div class="font-semibold text-gray-800 leading-tight">{{ r.tindakan }}</div>
                            <div v-if="r.tanggal && r.tanggal !== '-'" class="text-[10px] text-gray-400 mt-0.5">{{ formatTglDetail(r.tanggal) }}</div>
                          </td>
                          <td class="py-2.5 px-2 text-center text-gray-600 font-medium">{{ formatJumlah(r.JUMLAH) }}</td>
                          <td class="py-2.5 px-2 text-right text-gray-600 font-medium whitespace-nowrap">{{ formatRupiah(parseFloat(r.TARIF) || 0) }}</td>
                          <td class="py-2.5 pl-2 text-right font-bold text-gray-800 whitespace-nowrap">{{ formatRupiah((parseFloat(r.JUMLAH) || 0) * (parseFloat(r.TARIF) || 0)) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-else class="py-6 text-center text-xs text-gray-400">Tidak ada rincian tersedia.</div>
              </div>
            </div>
            <div class="p-6 sm:p-7 pt-4 border-t border-gray-100 shrink-0 space-y-3">
              <div v-if="selectedTagihan && detailData !== null" class="flex items-center justify-between px-1">
                <span class="text-xs font-bold text-gray-700">Total Tagihan</span>
                <span class="text-sm font-extrabold text-orange-700">{{ formatRupiah(hitungTotalTagihan()) }}</span>
              </div>
              <button type="button" @click="selectedTagihan = null" class="w-full py-3 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer">Tutup</button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
    <Teleport to="body">
      <transition name="slide-down">
        <div v-if="flashMessage.show" class="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
          <div class="max-w-md w-full rounded-2xl p-4 shadow-xl border flex items-start gap-3 pointer-events-auto backdrop-blur-md transition-all"
            :class="{'bg-amber-600 text-white border-amber-500 shadow-amber-900/20': flashMessage.type === 'warning','bg-red-600 text-white border-red-500 shadow-red-900/20': flashMessage.type === 'error','bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/20': flashMessage.type === 'success','bg-orange-600 text-white border-orange-500 shadow-orange-900/20': flashMessage.type === 'info'}">
            <div class="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg v-if="flashMessage.type === 'warning'" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <svg v-else-if="flashMessage.type === 'error'" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <svg v-else class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </div>
            <div class="flex-1 space-y-0.5 text-left">
              <h4 class="text-sm font-extrabold tracking-tight">{{ flashMessage.title }}</h4>
              <p class="text-xs leading-relaxed opacity-95">{{ flashMessage.message }}</p>
            </div>
            <button type="button" @click="hideFlash" class="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0 transition-colors -mr-1 -mt-1 cursor-pointer">
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import api from '../services/api'

const loading = ref(false)
const loadingMore = ref(false)
const errorMessage = ref('')
const listTagihan = ref([])
const page = ref(1)
const pageSize = 10
const hasMore = ref(true)
const loadMoreTrigger = ref(null)
let observer = null
const selectedTagihan = ref(null)
const detailLoading = ref(false)
const detailError = ref('')
const detailData = ref(null)
const flashMessage = reactive({ show: false, title: '', message: '', type: 'warning' })
let flashTimer = null

const rupiahFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })

function formatRupiah(value) {
  const num = Number(value)
  if (value === null || value === undefined || isNaN(num)) return '-'
  return rupiahFormatter.format(num)
}

function formatTglIndo(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(String(dateStr).replace(/-/g, '/'))
    if (isNaN(d.getTime())) return dateStr
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    const tgl = d.getDate()
    const bln = months[d.getMonth()]
    const thn = d.getFullYear()
    const jam = String(d.getHours()).padStart(2, '0')
    const mnt = String(d.getMinutes()).padStart(2, '0')
    return `${days[d.getDay()]}, ${tgl} ${bln} ${thn} ${jam}:${mnt}`
  } catch { return dateStr }
}

function formatTglDetail(dateStr) {
  if (!dateStr || dateStr === '-') return '-'
  return formatTglIndo(dateStr)
}

function formatJumlah(val) {
  const n = parseFloat(val)
  if (isNaN(n)) return '0'
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, '')
}

const STATUS_TAGIHAN_MAP = {
  BELUM_SELESAI: { label: 'Belum Selesai', badgeClass: 'bg-slate-100 text-slate-600 border-slate-200/60', dotClass: 'bg-slate-400' },
  BELUM_LUNAS: { label: 'Belum Lunas', badgeClass: 'bg-red-50 text-red-600 border-red-200/60', dotClass: 'bg-red-400' },
  LUNAS: { label: 'Lunas', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', dotClass: 'bg-emerald-500' }
}
const STATUS_TAGIHAN_FALLBACK = STATUS_TAGIHAN_MAP.BELUM_SELESAI
function getStatusMap(status) { return STATUS_TAGIHAN_MAP[status] || STATUS_TAGIHAN_FALLBACK }

// TODO: konfirmasi ke mentor semua kemungkinan nilai field kunci & final (baru terverifikasi: kunci="Sudah Selesai", final="Lunas")
function resolveStatusTagihan(item) {
  const kunci = String(item.kunci ?? '').trim().toLowerCase()
  const final = String(item.final ?? '').trim().toLowerCase()
  const terkunci = kunci === 'sudah selesai'
  if (!terkunci) return 'BELUM_SELESAI'
  return final === 'lunas' ? 'LUNAS' : 'BELUM_LUNAS'
}

const filterAktif = ref('SEMUA')
const filterChips = computed(() => [
  { key: 'SEMUA', label: 'Semua', count: 0 },
  { key: 'BELUM_SELESAI', label: 'Belum Selesai', count: listTagihan.value.filter(i => resolveStatusTagihan(i) === 'BELUM_SELESAI').length },
  { key: 'BELUM_LUNAS', label: 'Belum Lunas', count: listTagihan.value.filter(i => resolveStatusTagihan(i) === 'BELUM_LUNAS').length },
  { key: 'LUNAS', label: 'Lunas', count: listTagihan.value.filter(i => resolveStatusTagihan(i) === 'LUNAS').length }
])
const listTagihanFiltered = computed(() => {
  if (filterAktif.value === 'SEMUA') return listTagihan.value
  return listTagihan.value.filter(i => resolveStatusTagihan(i) === filterAktif.value)
})

function getItemTimestamp(item) {
  const dStr = item.tgl || ''
  if (!dStr) return 0
  const t = new Date(String(dStr).replace(/-/g, '/')).getTime()
  return isNaN(t) ? 0 : t
}

const detailGrouped = computed(() => {
  if (!detailData.value || !Array.isArray(detailData.value)) return []
  const grupMap = new Map()
  for (const row of detailData.value) {
    const ruangan = row.ruangan || 'Lainnya'
    if (!grupMap.has(ruangan)) grupMap.set(ruangan, { ruangan, items: [], subtotalGrup: 0 })
    const jumlah = parseFloat(row.JUMLAH) || 0
    const tarif = parseFloat(row.TARIF) || 0
    grupMap.get(ruangan).items.push(row)
    grupMap.get(ruangan).subtotalGrup += jumlah * tarif
  }
  return Array.from(grupMap.values())
})

function hitungTotalTagihan() {
  if (!selectedTagihan.value) return 0
  const fromList = Number(selectedTagihan.value.totalTagihan)
  if (!isNaN(fromList) && fromList > 0) return fromList
  if (!detailData.value || !Array.isArray(detailData.value)) return 0
  return detailData.value.reduce((acc, r) => acc + (parseFloat(r.JUMLAH) || 0) * (parseFloat(r.TARIF) || 0), 0)
}

function showFlash(title, message, type = 'warning') {
  if (flashTimer) clearTimeout(flashTimer)
  flashMessage.title = title
  flashMessage.message = message
  flashMessage.type = type
  flashMessage.show = true
  flashTimer = setTimeout(() => { flashMessage.show = false }, 5000)
}

function hideFlash() {
  flashMessage.show = false
  if (flashTimer) clearTimeout(flashTimer)
}

async function fetchListTagihan(isInitial = false) {
  if (isInitial) {
    loading.value = true
    errorMessage.value = ''
    page.value = 1
    hasMore.value = true
  } else {
    loadingMore.value = true
  }
  try {
    const response = await api.get('/tagihan/list-tagihan', { params: { page: page.value, pageSize: pageSize } })
    const res = response.data
    if (res && res.code === '200') {
      const items = Array.isArray(res.data) ? res.data : []
      if (isInitial) {
        listTagihan.value = items
      } else {
        const existingKeys = new Set(listTagihan.value.map(i => i.idTagihan))
        for (const item of items) {
          if (!existingKeys.has(item.idTagihan)) { listTagihan.value.push(item); existingKeys.add(item.idTagihan) }
        }
      }
      listTagihan.value.sort((a, b) => getItemTimestamp(b) - getItemTimestamp(a))
      if (res.pagination) {
        hasMore.value = res.pagination.hasNext === true
      } else {
        hasMore.value = items.length >= pageSize
      }
    } else if (res && res.code === '404') {
      if (isInitial) listTagihan.value = []
      hasMore.value = false
    } else {
      if (isInitial) errorMessage.value = res?.message || 'Gagal memuat daftar tagihan.'
      hasMore.value = false
    }
  } catch (err) {
    if (err.response?.status === 404 || err.response?.data?.code === '404') {
      if (isInitial) listTagihan.value = []
      hasMore.value = false
    } else {
      if (isInitial) errorMessage.value = err.response?.data?.message || 'Terjadi gangguan saat mengambil data tagihan.'
    }
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

async function fetchDetail(idTagihan) {
  detailLoading.value = true
  detailError.value = ''
  detailData.value = null
  try {
    const response = await api.get('/tagihan/tagihan-detail', { params: { idTagihan } })
    const res = response.data
    if (res && res.code === '200') {
      detailData.value = Array.isArray(res.data) ? res.data : []
    } else if (res && res.code === '404') {
      detailData.value = []
    } else {
      detailError.value = res?.message || 'Gagal memuat rincian tagihan.'
    }
  } catch (err) {
    if (err.response?.status === 404 || err.response?.data?.code === '404') {
      detailData.value = []
    } else {
      detailError.value = err.response?.data?.message || 'Terjadi kesalahan saat memuat rincian tagihan.'
    }
  } finally {
    detailLoading.value = false
  }
}

function handleRefresh() { fetchListTagihan(true) }

function openDetail(item) {
  selectedTagihan.value = item
  detailData.value = null
  detailError.value = ''
  fetchDetail(item.idTagihan)
}

function setupObserver() {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver((entries) => {
    const target = entries[0]
    if (target.isIntersecting && hasMore.value && !loading.value && !loadingMore.value && listTagihan.value.length > 0) {
      page.value++
      fetchListTagihan(false)
    }
  }, { rootMargin: '150px', threshold: 0.1 })
  nextTick(() => { if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value) })
}

onMounted(async () => { await fetchListTagihan(true); setupObserver() })
onUnmounted(() => { if (observer) observer.disconnect() })
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scale-up { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-down-enter-from { opacity: 0; transform: translateY(-20px); }
.slide-down-leave-to { opacity: 0; transform: translateY(-10px); }
</style>