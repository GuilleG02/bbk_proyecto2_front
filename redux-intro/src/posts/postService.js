import axios from 'axios'

const API_URL = 'http://localhost:3001'

const getAllPosts = async () => {
  const res = await axios.get(`${API_URL}/posts`)
  return res.data
}

const toggleLikePost = async (postId) => {
  const token = localStorage.getItem('token')

  const res = await axios.post(
    `${API_URL}/posts/${postId}/toggleLike`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return res.data.post
}

const addComment = async (postId, text) => {
  const token = localStorage.getItem('token')

  const formData = new FormData()
  formData.append('content', text.toString()) // aseguramos string
  // futuro: formData.append('image', file)

  const res = await axios.post(
    `${API_URL}/comments/${postId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return res.data.comment
}



const postService = {
  API_URL,
  getAllPosts,
  toggleLikePost,
  addComment,
}

export default postService
