import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPost, updatePost, fetchPostById } from '../posts/postSlice'
import { useNavigate, useParams } from 'react-router-dom'
import '../assets/styles/PostForm.scss'

const DEFAULT_POST_IMAGE = 'default-post-image.jpg'

const PostForm = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)
  const post = useSelector((state) =>
    state.posts.posts.find((p) => p._id === id)
  )

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  // Si es edición, cargar datos del post
  useEffect(() => {
    if (id && !post) {
      dispatch(fetchPostById(id))
    } else if (post) {
      setTitle(post.title || '')
      setDescription(post.description || '')
      setImage(post.image || null)
    }
  }, [id, post, dispatch])

  if (!user || !token) return <p>Debes iniciar sesión correctamente</p>

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description.trim()) {
      return alert('La descripción es obligatoria')
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title) // Se envía al backend aunque no se muestre
      formData.append('description', description)
      if (image instanceof File) {
        formData.append('image', image)
      } else if (image) {
        formData.append('image', image)
      } else {
        formData.append('image', DEFAULT_POST_IMAGE)
      }

      if (id) {
        await dispatch(updatePost({ id, data: formData, token })).unwrap()
        alert('Post actualizado')
      } else {
        await dispatch(createPost({ data: formData, token })).unwrap()
        alert('Post creado')
      }

      navigate('/')
    } catch (error) {
      console.error('Error al crear/actualizar post:', error)
      alert(error || 'Error al crear/actualizar post')
    }
    setLoading(false)
  }

  const handleDeletePost = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este post?')) return
    try {
      await fetch(`http://localhost:3001/posts/${post._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Post eliminado')
      navigate('/')
    } catch (error) {
      console.error(error)
      alert('Error al eliminar post')
    }
  }

  return (
    <div className="post-form-container">
      {/* <h2>{id ? 'Editar Post' : 'Crear Post'}</h2> */}
      <form onSubmit={handleSubmit} className="post-form">
        {/* Título solo se envía al backend, no se muestra */}
        {/* <label>
          Título:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del post"
          />
        </label> */}

        <label>
          Descripción:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción del post"
          />
        </label>

        <label>
          Imagen del post:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        {image && !(image instanceof File) && (
          <img
            src={`http://localhost:3001/uploads/${image}`}
            alt="Vista previa"
            style={{ width: '200px', marginTop: '10px' }}
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Procesando...' : id ? 'Actualizar Post' : 'Crear Post'}
        </button>

        {id && (
          <button
            type="button"
            onClick={handleDeletePost}
            className="delete-button"
            style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }}
          >
            Eliminar Post
          </button>
        )}
      </form>
    </div>
  )
}

export default PostForm
