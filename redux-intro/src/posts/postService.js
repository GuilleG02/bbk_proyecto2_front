import axios from 'axios'

const API_URL = 'http://localhost:3001'

const getAllPosts = async () => {
  const token = localStorage.getItem('token')

  const res = await axios.get(`${API_URL}/posts`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit: 20, page: 1 },
  })

  return res.data
}

const toggleLikePost = async (postId) => {
  const token = JSON.parse(localStorage.getItem('token'))
  await axios.post(`${API_URL}/posts/like/${postId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

const postService = { getAllPosts, toggleLikePost }
export default postService
