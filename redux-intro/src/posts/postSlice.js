import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import postService from './postService'

const API_URL = postService.API_URL

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

export const fetchPostById = createAsyncThunk('posts/fetchById', async (postId, thunkAPI) => {
  try {
    const res = await axios.get(`${API_URL}/posts/${postId}`)
    return res.data.post || res.data
  } catch (error) {
    return thunkAPI.rejectWithValue('Error al cargar el post')
  }
})

export const createPost = createAsyncThunk(
  'posts/create',
  async ({ data, token }, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/posts`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      return res.data.post
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al crear el post')
    }
  }
)

export const updatePost = createAsyncThunk(
  'posts/update',
  async ({ id, data, token }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/posts/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      return res.data.post
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al actualizar el post')
    }
  }
)

export const toggleLikePost = createAsyncThunk('posts/toggleLike', async (postId, thunkAPI) => {
  try {
    const updatedPost = await postService.toggleLikePost(postId)
    return updatedPost
  } catch (err) {
    return thunkAPI.rejectWithValue('Error al cambiar like')
  }
})

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, content }, thunkAPI) => {
    try {
      const comment = await postService.addComment(postId, content)
      return { postId, comment }
    } catch (error) {
      return thunkAPI.rejectWithValue('Error al agregar comentario')
    }
  }
)

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetPosts: (state) => {
      state.posts = []
      state.loading = false
      state.error = null
      state.likesLoading = {}
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchPosts.fulfilled, (state, action) => { state.posts = action.payload; state.loading = false })
      .addCase(fetchPosts.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // fetchPostById
      .addCase(fetchPostById.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        const post = action.payload
        const index = state.posts.findIndex((p) => p._id === post._id)
        if (index !== -1) state.posts[index] = post
        else state.posts.push(post)
        state.loading = false
      })
      .addCase(fetchPostById.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // createPost
      .addCase(createPost.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createPost.fulfilled, (state, action) => { state.posts.push(action.payload); state.loading = false })
      .addCase(createPost.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // updatePost
      .addCase(updatePost.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updatePost.fulfilled, (state, action) => {
        const updatedPost = action.payload
        const index = state.posts.findIndex((p) => p._id === updatedPost._id)
        if (index !== -1) state.posts[index] = updatedPost
        state.loading = false
      })
      .addCase(updatePost.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      // toggleLikePost
      .addCase(toggleLikePost.pending, (state, action) => { state.likesLoading[action.meta.arg] = true })
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const updatedPost = action.payload
        const index = state.posts.findIndex((p) => p._id === updatedPost._id)
        if (index !== -1) state.posts[index] = updatedPost
        state.likesLoading[updatedPost._id] = false
      })
      .addCase(toggleLikePost.rejected, (state, action) => {
        const postId = action.meta.arg
        state.likesLoading[postId] = false
        state.error = action.payload
      })

      // addComment
      .addCase(addComment.pending, (state) => { state.loading = true; state.error = null })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload
        const postIndex = state.posts.findIndex((p) => p._id === postId)
        if (postIndex !== -1) {
          if (!state.posts[postIndex].comments) state.posts[postIndex].comments = []
          state.posts[postIndex].comments.push(comment)
        }
        state.loading = false
      })
      .addCase(addComment.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { resetPosts } = postSlice.actions
export default postSlice.reducer
