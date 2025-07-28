import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts, toggleLikePost } from '../posts/postSlice'
import postService from '../posts/postService'
import '../assets/styles/home.scss'

// URL imagen por defecto si no hay imagen en el post
const DEFAULT_IMAGE = '/default-post-image.jpg' // pon aquí la ruta correcta a tu placeholder

export default function Home() {
  const dispatch = useDispatch()
  const { posts, loading, error, likesLoading } = useSelector((state) => state.posts)

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  const handleLike = (postId) => {
    if (!likesLoading[postId]) {
      dispatch(toggleLikePost(postId))
    }
  }

  if (loading) return <p className="profile-loading">Cargando posts...</p>
  if (error) return <p className="profile-loading">{error}</p>

  return (
    <div className="home-container">
      <h1>Posts recientes</h1>
      {posts.map((post) => {
        const userLiked = post.likes?.includes('liked')
        return (
          <div key={post._id} className="post-card">
            <div className="post-author">
              <strong>{post.author?.name || 'Anónimo'}</strong>
            </div>
            <div>
              <img
                src={post.image ? `${postService.API_URL}/uploads/${post.image}` : DEFAULT_IMAGE}
                alt="Post"
                className="post-image"
              />
            </div>
            <p className="post-description">{post.description}</p>
            <button
              onClick={() => handleLike(post._id)}
              disabled={likesLoading[post._id]}
              className="like-button"
              aria-label={userLiked ? 'Quitar like' : 'Dar like'}
              style={{
                backgroundColor: userLiked ? 'lightgreen' : '#0ef',
                cursor: likesLoading[post._id] ? 'not-allowed' : 'pointer',
              }}
            >
              👍 {userLiked ? 'Quitar Like' : 'Like'} ({post.likes?.length || 0})
            </button>

            <div className="comments-section">
              <h4>Comentarios</h4>
              {post.comments?.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <strong>{comment.author?.name || 'Anon'}</strong>: {comment.text}
                  </div>
                ))
              ) : (
                <p className="no-comments">No hay comentarios</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
