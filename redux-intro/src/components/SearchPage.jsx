import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchPosts, toggleLikePost } from '../posts/postSlice'
import { fetchUsers } from '../users/usersSlice'
import postService from '../posts/postService'
import '../assets/styles/searchpage.scss'

const DEFAULT_POST_IMAGE = '/default-post-image.jpg'
const DEFAULT_AVATAR = '/avatar.png'

// Componente buscador
const SearchBar = () => {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [type, setType] = useState('posts')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) {
      navigate(`/search/${type}/${text.trim()}`)
    } else {
      navigate(`/search/${type}`)
    }
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="posts">Posts</option>
        <option value="users">Usuarios</option>
      </select>
      <input
        type="text"
        placeholder="Buscar..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Buscar</button>
    </form>
  )
}

const SearchPage = () => {
  const dispatch = useDispatch()
  const { searchType, searchText } = useParams()
  const { user } = useSelector((state) => state.auth)

  // Selectores seguros
  const postsState = useSelector((state) => state.posts) || {}
  const posts = postsState.posts || []
  const postsLoading = postsState.loading || false
  const likesLoading = postsState.likesLoading || {}

  const usersState = useSelector((state) => state.users) || {}
  const users = usersState.users || []
  const usersLoading = usersState.loading || false

  // Traer datos al montar
  useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchUsers())
  }, [dispatch])

  // Filtrado memoizado
  const filteredPosts = useMemo(() => {
    if (searchType === 'posts' && searchText) {
      return posts.filter((p) =>
        p.description.toLowerCase().includes(searchText.toLowerCase())
      )
    }
    return []
  }, [posts, searchType, searchText])

  const filteredUsers = useMemo(() => {
    if (searchType === 'users' && searchText) {
      return users.filter((u) =>
        u.name.toLowerCase().includes(searchText.toLowerCase())
      )
    }
    return []
  }, [users, searchType, searchText])

  const handleLike = (postId) => {
    if (!likesLoading[postId]) dispatch(toggleLikePost(postId))
  }

  return (
    <div className="search-page">
      <SearchBar />

      {!searchType && <p className="profile-loading">Escribe algo y presiona Buscar</p>}

      {searchType === 'posts' && searchText && (
        <div className="home-container">
          {postsLoading ? (
            <p className="profile-loading">Cargando publicaciones...</p>
          ) : filteredPosts.length === 0 ? (
            <p className="profile-loading">No se encontraron publicaciones.</p>
          ) : (
            filteredPosts.map((post) => {
              const userLiked = post.likes?.includes(user?._id)
              const avatarUrl = post.author?.avatar
                ? `http://localhost:3001/${post.author.avatar}`
                : DEFAULT_AVATAR
              return (
                <div key={post._id} className="post-card">
                  <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="post-author">
                      <img src={avatarUrl} alt="avatar" className="author-image" />
                      <strong>{post.author?.name || 'Anónimo'}</strong>
                    </div>
                    <img
                      src={post.image ? `${postService.API_URL}/uploads/${post.image}` : DEFAULT_POST_IMAGE}
                      alt="Post"
                      className="post-image"
                    />
                    <p className="post-description">{post.description}</p>
                  </Link>
                  <button
                    onClick={() => handleLike(post._id)}
                    disabled={likesLoading[post._id]}
                    className="like-button"
                    style={{ backgroundColor: userLiked ? 'lightgreen' : '#0ef' }}
                  >
                    👍 {userLiked ? 'Quitar Like' : 'Like'} ({post.likes?.length || 0})
                  </button>
                </div>
              )
            })
          )}
        </div>
      )}

      {searchType === 'users' && searchText && (
        <div className="home-container">
          {usersLoading ? (
            <p className="profile-loading">Cargando usuarios...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="profile-loading">No se encontraron usuarios.</p>
          ) : (
            filteredUsers.map((u) => (
              <div key={u._id} className="post-card">
                <Link to={`/profile/${u._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="post-author">
                    <img
                      src={u.avatar ? `http://localhost:3001/${u.avatar}` : DEFAULT_AVATAR}
                      alt="avatar"
                      className="author-image"
                    />
                    <strong>{u.name}</strong>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default SearchPage
