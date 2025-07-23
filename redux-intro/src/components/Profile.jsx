import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile } from '../auth/authSlice'
import { useNavigate } from 'react-router-dom'
import '../assets/styles/profile.scss'
import { FiSettings } from 'react-icons/fi'

const Profile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        dispatch(getProfile())
    }, [dispatch])

    if (!user) return <p className="profile-loading">Cargando perfil...</p>

    const avatarUrl = user.avatar
        ? `http://localhost:3001/${user.avatar}`
        : '/avatar.png'

    const joinedDate = new Date(user.createdAt).toLocaleDateString()

    return (
        <div className="profile-container">
            <div className="profile-big-card">

                {/* FOLLOWING BAR dentro de la card */}
                <div className="following-bar">
                    {user.following && user.following.length > 0 ? (
                        user.following.map((followedUser) => {
                            const followedAvatar = followedUser.avatar
                                ? `http://localhost:3001/${followedUser.avatar}`
                                : '/avatar.png'
                            return (
                                <img
                                    key={followedUser._id}
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

                {/* CONTENIDO PRINCIPAL */}
                <div className="profile-left">
                    <div className="profile-card">

                        <div className="avatar">
                            <img src={avatarUrl} alt="avatar" />
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
                    </div>
                </div>

                <div className="profile-right">
                    <h3>Posts</h3>
                    {user.posts && user.posts.length > 0 ? (
                        user.posts.map((post) => (
                            <div key={post._id} className="post-card">
                                <h4>{post.title}</h4>
                                <p>{post.content}</p>
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
