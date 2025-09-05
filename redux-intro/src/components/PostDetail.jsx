import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchPostById,
    toggleLikePost,
    addComment
} from '../posts/postSlice'
import { followUser, unfollowUser } from '../users/userSlice'
import { updateUserFollowing } from '../auth/authSlice'
import '../assets/styles/PostDetail.scss'

const DEFAULT_POST_IMAGE = '/default-post-image.jpg'

const PostDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const post = useSelector(state => state.posts.posts.find(p => p._id === id))
    const { user } = useSelector(state => state.auth)
    const [commentText, setCommentText] = useState('')
    const [loadingComment, setLoadingComment] = useState(false)
    const [loadingFollow, setLoadingFollow] = useState(false)

    useEffect(() => {
        if (!post) {
            dispatch(fetchPostById(id))
        }
    }, [id, post, dispatch])

    if (!post) return <p>Cargando post...</p>

    const author = post.author
    const userLiked = post.likes?.includes(user?._id)
    const isFollowing = user?.following?.some(
        fId => fId.toString() === author?._id?.toString()
    )

    const handleToggleLike = () => {
        if (!user) return alert('Debes iniciar sesión para dar like')
        dispatch(toggleLikePost(post._id))
    }

    const handleAddComment = async () => {
        if (!commentText.trim()) return
        setLoadingComment(true)
        try {
            await dispatch(addComment({ postId: post._id, content: commentText })).unwrap()
            setCommentText('')
        } catch (error) {
            console.error('Error agregando comentario:', error)
            alert('Error al agregar comentario')
        }
        setLoadingComment(false)
    }

    const handleFollowToggle = async (authorId) => {
        if (!user) {
            alert('Debes iniciar sesión para seguir usuarios.')
            return
        }

        if (!authorId) {
            console.error('No se recibió un ID de usuario válido para seguir.')
            return
        }

        // ✅ Verificación para evitar seguirse a uno mismo
        if (authorId === user._id) {
            alert('No puedes seguirte a ti mismo')
            return
        }

        setLoadingFollow(true)
        try {
            let updatedFollowing
            if (isFollowing) {
                updatedFollowing = await dispatch(unfollowUser(authorId)).unwrap()
            } else {
                updatedFollowing = await dispatch(followUser(authorId)).unwrap()
            }
            dispatch(updateUserFollowing(updatedFollowing.following))
        } catch (error) {
            console.error('Error siguiendo/deseguiendo usuario:', error)
            alert(error.message || 'Error al seguir/deseguir usuario')
        }
        setLoadingFollow(false)
    }

    return (
        <div className="post-detail-container">
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <img
                src={post.image ? `http://localhost:3001/uploads/${post.image}` : DEFAULT_POST_IMAGE}
                alt="Post"
                className="post-image-detail"
            />
            <p>Autor: {author?.name || 'Anónimo'}</p>

            {author && user && author._id && (
                <button
                    onClick={() => handleFollowToggle(author._id)}
                    disabled={loadingFollow}
                    className={isFollowing ? 'following' : ''}
                >
                    {loadingFollow ? 'Procesando...' : isFollowing ? 'Unfollow' : 'Follow'}
                </button>
            )}

            <button
                onClick={handleToggleLike}
                style={{ backgroundColor: userLiked ? 'lightgreen' : '#0ef' }}
            >
                {userLiked ? 'Quitar Like' : 'Like'} ({post.likes?.length || 0})
            </button>

            <section className="comments-section">
                <h3>Comentarios</h3>
                {post.comments?.length === 0 && <p>No hay comentarios</p>}
                {post.comments?.map(comment => (
                    <div key={comment._id} className="comment">
                        <strong>{comment.author?.name || 'Anon'}</strong>: {comment.content}
                    </div>
                ))}

                <div className="add-comment">
                    <textarea
                        placeholder="Agregar un comentario..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button onClick={handleAddComment} disabled={loadingComment}>
                        {loadingComment ? 'Agregando...' : 'Agregar comentario'}
                    </button>
                </div>
            </section>
        </div>
    )
}

export default PostDetail
