import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile } from '../auth/authSlice'
import { useNavigate } from 'react-router-dom'
import '../assets/styles/profile.scss'
import { FiSettings } from 'react-icons/fi'

const DEFAULT_POST_IMAGE = '/default-post-image.jpg'
const DEFAULT_AVATAR = '/avatar.png'

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  if (!user) return <p className="profile-loading">Cargando perfil...</p>

  const avatarUrl = user.avatar && user.avatar !== 'null' && user.avatar !== ''
    ? `http://localhost:3001${user.avatar}`
    : DEFAULT_AVATAR

  const joinedDate = new Date(user.createdAt).toLocaleDateString()

  // Helper para obtener URL de la imagen del post
  const getPostImageUrl = (post) => {
    if (!post.image || post.image === 'null' || post.image === '') return DEFAULT_POST_IMAGE
    return `http://localhost:3001/uploads/${post.image}`
  }

  return (
    <div className="profile-container">
      <div className="profile-big-card">

        <div className="following-bar">
          {user.following && user.following.length > 0 ? (
            user.following.map((followedUser, index) => {
              const followedAvatar = followedUser.avatar && followedUser.avatar !== 'null' && followedUser.avatar !== ''
                ? `http://localhost:3001${followedUser.avatar}`
                : DEFAULT_AVATAR
              return (
                <img
                  key={followedUser._id || index}
                  className="following-avatar"
                  src={followedAvatar}
                  alt={followedUser.name || 'Usuario'}
                  title={followedUser.name || 'Usuario'}
                />
              )
            })
          ) : (
            <p className="no-following">No sigues a nadie aún.</p>
          )}
        </div>

        <div className="profile-left">
          <div className="profile-card">
            <div className="avatar">
              <img src={avatarUrl} alt={user.name || 'Avatar'} />
            </div>
            <h2>{user.name}</h2>
            <div className="profile-info">
              <div className="profile-field">
                <strong>Email:</strong>
                <span>{user.email}</span>
              </div>
              <div className="profile-field">
                <strong>Edad:</strong>
                <span>{user.age}</span>
              </div>
              <div className="profile-field">
                <strong>Miembro desde:</strong>
                <span>{joinedDate}</span>
              </div>
            </div>

            <button className="edit-btn" onClick={() => navigate('/edit-profile')}>
              <FiSettings /> Editar perfil
            </button>

            <button className="create-post-btn" onClick={() => navigate('/create-post')}>
              Crear nuevo post
            </button>
          </div>
        </div>

        <div className="profile-right">
          <h3>Mis Posts</h3>
          {user.posts && user.posts.length > 0 ? (
            user.posts.map((post) => (
              <div key={post._id} className="post-card">
                <img
                  src={getPostImageUrl(post)}
                  alt={post.title || 'Post'}
                  className="post-image"
                  onClick={() => navigate(`/edit-post/${post._id}`)}
                  style={{ cursor: 'pointer' }}
                />
                <h4
                  className="editable-post"
                  onClick={() => navigate(`/edit-post/${post._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {post.title}
                </h4>
                <p>{post.description}</p>
                <small>{new Date(post.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          ) : (
            <p>Este usuario no tiene posts aún.</p>
          )}
        </div>

      </div>
    </div>
  )
}

export default Profile
