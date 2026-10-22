import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('sapa_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('sapa_user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.NORM || '')
  const userNorm = computed(() => user.value?.NORM || '')
  const namaPasien = computed(() => user.value?.NAMA || '')

  async function login(NORM, TANGGAL_LAHIR) {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      params.append('NORM', NORM)
      params.append('TANGGAL_LAHIR', TANGGAL_LAHIR)

      const response = await api.post('/auth/login', params)
      const data = response.data

      if (data.code === '200') {
        token.value = data.data.access_token

        // Store patient details if returned, fallback to NORM
        const pasienData = data.data.pasien || { NORM, TANGGAL_LAHIR }
        user.value = { ...pasienData, NORM }

        localStorage.setItem('sapa_token', data.data.access_token)
        localStorage.setItem('sapa_user', JSON.stringify(user.value))

        return { success: true }
      } else {
        error.value = data.message || 'Login gagal'
        return { success: false, message: data.message }
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Koneksi ke server gagal. Coba lagi nanti.'
      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  function fetchProfile() {
    const savedUser = localStorage.getItem('sapa_user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {}
    }
    return user.value
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('sapa_token')
    localStorage.removeItem('sapa_user')
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    userName,
    userNorm,
    namaPasien,
    login,
    fetchProfile,
    logout
  }
})
