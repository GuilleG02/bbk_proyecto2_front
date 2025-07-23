import axios from 'axios'

const API_URL = 'http://localhost:3001'

const register = async (userData) => {
  const res = await axios.post(`${API_URL}/users`, userData)

  if (res.data.token) {
    localStorage.setItem('token', JSON.stringify(res.data.token))
  }

  if (res.data.user) {
    localStorage.setItem('user', JSON.stringify(res.data.user))
  }

  return res.data
}

const login = async (userData) => {
  const res = await axios.post(`${API_URL}/users/login`, userData)

  if (res.data.token) {
    localStorage.setItem('token', JSON.stringify(res.data.token))
  }

  if (res.data.user) {
    localStorage.setItem('user', JSON.stringify(res.data.user))
  }

  return res.data
}

const getProfile = async () => {
  const token = JSON.parse(localStorage.getItem('token'))

  const res = await axios.get(`${API_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data.user
}

const logout = async () => {
  const token = JSON.parse(localStorage.getItem('token'))

  await axios.delete(`${API_URL}/users/logout`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  localStorage.clear()
}

const authService = { register, login, getProfile, logout }
export default authService
