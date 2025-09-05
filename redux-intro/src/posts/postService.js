import axios from 'axios'

const API_URL = 'http://localhost:3001'

// Traer todos los posts
const getAllPosts = async () => {
  const res = await axios.get(`${API_URL}/posts`)
  return res.data
}

// Dar/Quitar like a un post
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

// Agregar comentario
const addComment = async (postId, content) => {
  const token = localStorage.getItem('token')
  const formData = new FormData()
  formData.append('content', content.toString()) // aseguramos string

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
