<template>
  <div class="max-w-md mx-auto py-2 sm:py-6" style="animation: fade-in 0.3s ease-out;">
    <div class="w-full relative">
      <!-- Logo & Header (Sidebar Style) -->
      <div class="flex items-center justify-center gap-3.5 mb-6 sm:mb-8">
        <img
          src="/logo.png"
          alt="Logo SAPA RSTN"
          class="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-2xl shrink-0 shadow-md shadow-emerald-600/10"
        />
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-gray-800 tracking-tight leading-tight">SAPA RSTN</h1>
          <p class="text-gray-500 text-xs sm:text-sm font-medium leading-tight">Portal Pasien RSUD R.A.A. Tjokronegoro</p>
        </div>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md space-y-5">
        <div>
          <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-1">Masuk ke Akun Anda</h2>
          <p class="text-gray-500 text-xs sm:text-sm">Gunakan Nomor Rekam Medis & Password Tanggal Lahir</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- NORM Field -->
          <div>
            <label for="norm" class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              Nomor Rekam Medis (NORM)
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <input
                id="norm"
                v-model="form.NORM"
                type="text"
                inputmode="numeric"
                placeholder="Contoh: 00012345"
                class="w-full !pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-400"
                :class="errors.NORM ? '!border-red-400 !ring-red-100' : ''"
                autocomplete="off"
              />
            </div>
            <p v-if="errors.NORM" class="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ errors.NORM }}
            </p>
          </div>

          <!-- Password (Tanggal Lahir) Field -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label for="password" class="block text-xs sm:text-sm font-semibold text-gray-700">
                Password
              </label>
              <span class="text-[11px] text-gray-400">Format: YYYY-MM-DD</span>
            </div>
            <div class="relative">
              <!-- Left Lock Icon -->
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>

              <!-- Input with Masking YYYY-MM-DD -->
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                :value="form.TANGGAL_LAHIR"
                @input="onDateInput"
                placeholder="Tgl Lahir (ex: 1990-12-31)"
                maxlength="10"
                class="w-full !pl-11 !pr-11 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-400 font-mono tracking-wide"
                :class="errors.TANGGAL_LAHIR ? '!border-red-400 !ring-red-100' : ''"
              />

              <!-- Right Toggle Visibility Button -->
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                tabindex="-1"
              >
                <!-- Eye Open -->
                <svg v-if="!showPassword" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <!-- Eye Closed -->
                <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                  <line x1="2" y1="2" x2="22" y2="22"/>
                </svg>
              </button>
            </div>
            <p v-if="errors.TANGGAL_LAHIR" class="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ errors.TANGGAL_LAHIR }}
            </p>
          </div>

          <!-- Canvas CAPTCHA Field -->
          <div>
            <label for="captcha" class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              Kode Verifikasi (Captcha)
            </label>
            <div class="space-y-2">
              <!-- Captcha Display & Refresh Button -->
              <div class="flex items-center gap-2">
                <div class="relative bg-slate-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner flex items-center justify-center select-none">
                  <canvas ref="captchaCanvas" width="160" height="42" class="cursor-pointer" @click="generateCaptcha" title="Klik untuk ganti kode"></canvas>
                </div>
                <button
                  type="button"
                  @click="generateCaptcha"
                  class="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 text-gray-600 hover:text-emerald-600 transition-all active:scale-95 shadow-sm"
                  title="Acak ulang captcha"
                >
                  <svg class="w-5 h-5 transition-transform duration-300 active:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                    <path d="M8 16H3v5"/>
                  </svg>
                </button>
              </div>

              <!-- Input Captcha -->
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <input
                  id="captcha"
                  v-model="form.CAPTCHA"
                  type="text"
                  placeholder="Ketik 6 kode di atas"
                  maxlength="6"
                  class="w-full !pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 text-sm tracking-widest font-semibold uppercase focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-400 placeholder:normal-case placeholder:font-normal"
                  :class="errors.CAPTCHA ? '!border-red-400 !ring-red-100' : ''"
                  autocomplete="off"
                />
              </div>
            </div>
            <p v-if="errors.CAPTCHA" class="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {{ errors.CAPTCHA }}
            </p>
          </div>

          <!-- Error Message -->
          <div
            v-if="authStore.error"
            class="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl"
            :style="authStore.error ? 'animation: shake 0.5s ease-in-out;' : ''"
          >
            <svg class="w-5 h-5 text-red-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <div>
              <p class="text-red-700 text-xs sm:text-sm font-semibold">Login Gagal</p>
              <p class="text-red-600 text-xs mt-0.5">{{ authStore.error }}</p>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-md shadow-emerald-600/20 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span v-if="authStore.loading" class="spinner"></span>
            <span v-else class="flex items-center gap-2">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Masuk ke Akun
            </span>
          </button>
        </form>

        <!-- Help Text -->
        <div class="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-100 text-xs">
          <div class="flex items-start gap-2.5">
            <svg class="w-4.5 h-4.5 text-emerald-600 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <div>
              <p class="text-emerald-900 font-bold">Petunjuk Login Pasien:</p>
              <p class="text-emerald-700 text-[11px] mt-0.5 leading-relaxed">
                Gunakan <strong>Nomor Rekam Medis (NORM)</strong> dan Password berupa <strong>Tanggal Lahir</strong> (format: <code>YYYY-MM-DD</code>).
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-gray-400 text-xs mt-6">
        &copy; {{ new Date().getFullYear() }} RSUD R.A.A. Tjokronegoro • Purworejo
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const showPassword = ref(false)
const captchaCanvas = ref(null)
const captchaCode = ref('')

const form = reactive({
  NORM: '',
  TANGGAL_LAHIR: '',
  CAPTCHA: ''
})

const errors = reactive({
  NORM: '',
  TANGGAL_LAHIR: '',
  CAPTCHA: ''
})

function onDateInput(e) {
  let raw = e.target.value.replace(/[^\d-]/g, '')
  const clean = raw.replace(/\D/g, '').slice(0, 8)
  if (clean.length > 4 && clean.length <= 6) {
    raw = `${clean.slice(0, 4)}-${clean.slice(4)}`
  } else if (clean.length > 6) {
    raw = `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`
  } else {
    raw = clean
  }
  form.TANGGAL_LAHIR = raw
}

function generateCaptcha() {
  // Karakter mudah dibaca tanpa ambigu (hindari 0, O, I, 1, l)
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  captchaCode.value = result
  form.CAPTCHA = ''
  errors.CAPTCHA = ''

  drawCaptcha(result)
}

function drawCaptcha(code) {
  nextTick(() => {
    const canvas = captchaCanvas.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Reset filter
    ctx.filter = 'none'

    // Background gradient lembut
    const bgGradient = ctx.createLinearGradient(0, 0, width, height)
    bgGradient.addColorStop(0, '#f8fafc')
    bgGradient.addColorStop(1, '#e2e8f0')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, width, height)

    // Garis gangguan (noise lines)
    const lineColors = ['#cbd5e1', '#94a3b8', '#6ee7b7', '#cbd5e1', '#a5b4fc']
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = lineColors[i % lineColors.length]
      ctx.lineWidth = 1 + Math.random() * 1.5
      ctx.beginPath()
      ctx.moveTo(Math.random() * width, Math.random() * height)
      ctx.bezierCurveTo(
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height
      )
      ctx.stroke()
    }

    // Titik gangguan (noise dots)
    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, 0.25)`
      ctx.beginPath()
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2)
      ctx.fill()
    }

    // Terapkan sedikit efek blur otentik pada karakter
    ctx.filter = 'blur(0.6px)'

    // Gambar 6 karakter dengan rotasi dan font acak
    const textColors = ['#0f766e', '#1e293b', '#0369a1', '#047857', '#4338ca', '#b45309', '#0d9488']
    const fonts = ['bold 21px Inter, sans-serif', 'bold 21px Roboto, sans-serif', 'bold 20px monospace']

    for (let i = 0; i < code.length; i++) {
      ctx.save()
      const char = code[i]
      const x = 14 + i * 23
      const y = height / 2 + 7

      // Variasi rotasi kecil (-18 deg sampai +18 deg)
      const angle = ((Math.random() - 0.5) * 36 * Math.PI) / 180
      ctx.translate(x, y)
      ctx.rotate(angle)

      ctx.font = fonts[Math.floor(Math.random() * fonts.length)]
      ctx.fillStyle = textColors[Math.floor(Math.random() * textColors.length)]
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
      ctx.shadowBlur = 3
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      ctx.fillText(char, -7, 0)
      ctx.restore()
    }

    // Kembalikan filter ke normal
    ctx.filter = 'none'
  })
}

function validate() {
  let valid = true
  errors.NORM = ''
  errors.TANGGAL_LAHIR = ''
  errors.CAPTCHA = ''

  if (!form.NORM.trim()) {
    errors.NORM = 'Nomor Rekam Medis wajib diisi'
    valid = false
  }

  if (!form.TANGGAL_LAHIR.trim()) {
    errors.TANGGAL_LAHIR = 'Password (Tanggal lahir) wajib diisi'
    valid = false
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.TANGGAL_LAHIR.trim())) {
    errors.TANGGAL_LAHIR = 'Format password harus YYYY-MM-DD (contoh: 1990-12-31)'
    valid = false
  }

  if (!form.CAPTCHA.trim()) {
    errors.CAPTCHA = 'Kode verifikasi wajib diisi'
    valid = false
  } else if (form.CAPTCHA.trim().toUpperCase() !== captchaCode.value.toUpperCase()) {
    errors.CAPTCHA = 'Kode verifikasi salah. Silakan coba lagi.'
    generateCaptcha()
    valid = false
  }

  return valid
}

async function handleLogin() {
  if (!validate()) return

  authStore.error = null
  const result = await authStore.login(form.NORM, form.TANGGAL_LAHIR)

  if (result.success) {
    const redirectPath = route.query.redirect
    if (redirectPath) {
      router.push(redirectPath)
    } else {
      router.push({ name: 'Dashboard' })
    }
  } else {
    // Refresh captcha jika login gagal
    generateCaptcha()
  }
}

onMounted(() => {
  generateCaptcha()
})
</script>
