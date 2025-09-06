import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchPosts, toggleLikePost } from '../posts/postSlice'
import '../assets/styles/home.scss'

const DEFAULT_POST_IMAGE = '/default-post-image.jpg'
const DEFAULT_AVATAR = '/avatar.png'

export default function Home() {
  const dispatch = useDispatch()
  const { posts, loading, error, likesLoading } = useSelector((state) => state.posts)
  const { user } = useSelector((state) => state.auth)

  const [showFollowedOnly, setShowFollowedOnly] = useState(false)

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  const handleLike = (postId) => {
    if (!likesLoading[postId]) {
      dispatch(toggleLikePost(postId))
    }
  }

  const followedUserIds = user?.following?.map((f) => f._id) || []

  const filteredPosts = posts
    .filter((post) =>
      showFollowedOnly ? followedUserIds.includes(post.author?._id) : true
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  if (loading) return <p className="profile-loading">Cargando posts...</p>
  if (error) return <p className="profile-loading">{error}</p>

  return (
    <div className="home-container">
      <div className="toggle-buttons">
        <button
          className={`toggle-button ${!showFollowedOnly ? 'active' : ''}`}
          onClick={() => setShowFollowedOnly(false)}
        >
          Público
        </button>
        <button
          className={`toggle-button ${showFollowedOnly ? 'active' : ''}`}
          onClick={() => setShowFollowedOnly(true)}
        >
          Seguidos
        </button>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="no-followed-posts">
          {showFollowedOnly
            ? 'Tus seguidos no han publicado nada aún.'
            : 'No hay publicaciones disponibles.'}
        </div>
      ) : (
        filteredPosts.map((post) => {
          const userLiked = post.likes?.includes(user?._id)
          const lastComment = post.comments?.length
            ? post.comments[post.comments.length - 1]
            : null

          // Avatar del autor
          const avatarUrl = post.author?.avatar
            ? post.author.avatar.startsWith('/uploads')
              ? `http://localhost:3001${post.author.avatar}` // ya tiene /uploads
              : `http://localhost:3001/uploads/${post.author.avatar}` // solo nombre
            : DEFAULT_AVATAR

          // Imagen del post
          const postImageUrl = post.image
            ? `http://localhost:3001/uploads/${post.image}`
            : DEFAULT_POST_IMAGE

          return (
            <div key={post._id} className="post-card">
              <Link
                to={`/posts/${post._id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="post-author">
                  <img src={avatarUrl} alt="avatar" className="author-image" />
                  <strong>{post.author?.name || 'Anónimo'}</strong>
                </div>

                <div>
                  <img src={postImageUrl} alt="Post" className="post-image" />
                </div>

                <p className="post-description">{post.description}</p>
              </Link>

              <button
                onClick={() => handleLike(post._id)}
                disabled={likesLoading[post._id]}
                className="like-button"
                aria-label={userLiked ? 'Quitar like' : 'Dar like'}
                style={{
                  backgroundColor: userLiked ? 'var(--color-accent-hover)' : 'var(--color-card-bg)',
                  color: userLiked ? 'var(--color-bg)' : 'var(--color-text)',
                  border: userLiked ? 'none' : '1px solid var(--color-text-muted)',
                  cursor: likesLoading[post._id] ? 'not-allowed' : 'pointer',
                }}
              >
                👍 {userLiked ? 'Quitar Like' : 'Like'} ({post.likes?.length || 0})
              </button>


              <div className="comments-section">
                <h4>Último comentario</h4>
                {lastComment && lastComment.content ? (
                  <div className="comment">
                    <strong>{lastComment.author?.name || 'Anon'}</strong>: {lastComment.content}
                  </div>
                ) : (
                  <p className="no-comments">No hay comentarios</p>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
