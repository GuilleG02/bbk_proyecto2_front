import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostById, toggleLikePost, addComment } from '../posts/postSlice'
import { followUser, unfollowUser } from '../users/userSlice' // importa tus acciones
import { updateUserFollowing } from '../auth/authSlice' // acción para actualizar user.following
import '../assets/styles/PostDetail.scss'

const DEFAULT_POST_IMAGE = '/default-post-image.jpg'

const PostDetail = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const post = useSelector((state) => state.posts.posts.find((p) => p._id === id))
    const { user } = useSelector((state) => state.auth)
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

    // Comparar IDs como strings para evitar problemas
    const isFollowing = user?.following?.some(
        (followingId) => followingId.toString() === author?._id?.toString()
    )

    const handleToggleLike = () => {
        dispatch(toggleLikePost(post._id))
    }

    const handleAddComment = async () => {
        if (!commentText.trim()) return
        setLoadingComment(true)
        try {
            await dispatch(addComment({ postId: post._id, content: commentText })).unwrap()
            setCommentText('')
        } catch (error) {
            console.error('Error agregando comentario:', error.message || error)
            alert('Error al agregar el comentario')
        }
        setLoadingComment(false)
    }

    const handleFollowToggle = async () => {
        if (!user) return alert('Debes iniciar sesión para seguir usuarios.')
        setLoadingFollow(true)
        try {
            let updatedFollowing
            if (isFollowing) {
                updatedFollowing = await dispatch(unfollowUser(author._id)).unwrap()
            } else {
                updatedFollowing = await dispatch(followUser(author._id)).unwrap()
            }
            // Actualizar el estado auth con el array updatedFollowing
            dispatch(updateUserFollowing(updatedFollowing.following))
        } catch (error) {
            alert(error)
        }
        setLoadingFollow(false)
    }

    return (
        <div className="post-detail-container">
            <h2>{post.description}</h2>
            <img
                src={post.image ? `http://localhost:3001/uploads/${post.image}` : DEFAULT_POST_IMAGE}
                alt="Post"
                className="post-image-detail"
            />
            <p>Autor: {author?.name || 'Anónimo'}</p>
            {author && user && (
                <button
                    onClick={handleFollowToggle}
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
                {post.comments?.map((comment) => (
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
