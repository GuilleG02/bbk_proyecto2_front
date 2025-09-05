import axios from 'axios'

const API_URL = 'http://localhost:3001/users'

const register = async (userData) => {
  // Si es FormData, no tocar Content-Type, Axios lo hace solo
  const headers = userData instanceof FormData ? {} : { 'Content-Type': 'application/json' }

  // Depuración: ver qué se envía
  if (userData instanceof FormData) {
    console.log('FormData enviado:', [...userData.entries()])
  } else {
    console.log('JSON enviado:', userData)
  }

  const res = await axios.post(API_URL, userData, { headers })

  if (res.data.token) {
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
  }
  return res.data
}

const login = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData)
  if (res.data.token) localStorage.setItem('token', res.data.token)
  if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user))
  return res.data
}

const getProfile = async () => {
  const token = localStorage.getItem('token')
  const res = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data.user
}

const logout = async () => {
  const token = localStorage.getItem('token')
  await axios.delete(`${API_URL}/logout`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  localStorage.clear()
}

const authService = { register, login, getProfile, logout }
export default authService
