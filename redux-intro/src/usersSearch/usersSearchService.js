import axios from 'axios'
const API_URL = 'http://localhost:3001'

const fetchUsers = async (name) => {
  const token = localStorage.getItem('token')
  const res = await axios.get(`${API_URL}/users/search/${name}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data.users
}

const followUser = async (userId) => {
  const token = localStorage.getItem('token')
  const res = await axios.post(`${API_URL}/users/${userId}/follow`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const unfollowUser = async (userId) => {
  const token = localStorage.getItem('token')
  const res = await axios.post(`${API_URL}/users/${userId}/unfollow`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const usersSearchService = { fetchUsers, followUser, unfollowUser }
export default usersSearchService
