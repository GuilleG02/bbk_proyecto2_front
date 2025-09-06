import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import usersSearchService from './usersSearchService'

export const fetchUsers = createAsyncThunk(
  'usersSearch/fetchUsers',
  async (name, thunkAPI) => {
    try {
      return await usersSearchService.fetchUsers(name)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al obtener usuarios')
    }
  }
)

export const followUser = createAsyncThunk(
  'usersSearch/followUser',
  async (userId, thunkAPI) => {
    try {
      return await usersSearchService.followUser(userId)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al seguir usuario')
    }
  }
)

export const unfollowUser = createAsyncThunk(
  'usersSearch/unfollowUser',
  async (userId, thunkAPI) => {
    try {
      return await usersSearchService.unfollowUser(userId)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al dejar de seguir usuario')
    }
  }
)

const initialState = {
  users: [],
  loading: false,
  error: null,
}

const usersSearchSlice = createSlice({
  name: 'usersSearch',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(followUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id)
        if (index !== -1) state.users[index] = action.payload
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id)
        if (index !== -1) state.users[index] = action.payload
      })
  }
})

export default usersSearchSlice.reducer
