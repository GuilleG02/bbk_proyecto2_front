import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import postService from './postService'

const initialState = {
  posts: [],
  loading: false,
  error: null,
  likesLoading: {},
}

export const fetchPosts = createAsyncThunk('posts/fetchAll', async (_, thunkAPI) => {
  try {
    return await postService.getAllPosts()
  } catch (err) {
    return thunkAPI.rejectWithValue('Error al cargar los posts')
  }
})

export const toggleLikePost = createAsyncThunk('posts/toggleLike', async (postId, thunkAPI) => {
  try {
    await postService.toggleLikePost(postId)
    return postId
  } catch (err) {
    return thunkAPI.rejectWithValue('Error al cambiar like')
  }
})

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetPosts: (state) => {
      state.posts = []
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload
        state.loading = false
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(toggleLikePost.pending, (state, action) => {
        state.likesLoading[action.meta.arg] = true
      })
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const postId = action.payload
        const post = state.posts.find((p) => p._id === postId)
        if (post) {
          const likedIndex = post.likes?.indexOf('liked') ?? -1
          if (likedIndex >= 0) {
            // Quitar like
            post.likes.splice(likedIndex, 1)
          } else {
            // Agregar like
            post.likes = [...(post.likes || []), 'liked']
          }
        }
        state.likesLoading[postId] = false
      })
      .addCase(toggleLikePost.rejected, (state, action) => {
        const postId = action.meta.arg
        state.likesLoading[postId] = false
        state.error = action.payload
      })
  },
})

export const { resetPosts } = postSlice.actions
export default postSlice.reducer
