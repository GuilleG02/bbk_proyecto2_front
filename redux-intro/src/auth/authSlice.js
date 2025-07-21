import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

const rawUser = localStorage.getItem('user')
const userStorage = rawUser && rawUser !== 'undefined' ? JSON.parse(rawUser) : null
const tokenStorage = localStorage.getItem('token')

const initialState = {
  user: userStorage || null,
  token: tokenStorage || null,
}


export const register = createAsyncThunk('auth/register', async (userData) => {
  try {
    return await authService.register(userData)
  } catch (error) {
    console.error(error)
  }
})

export const login = createAsyncThunk('auth/login', async (userData) => {
  try {
    return await authService.login(userData)
  } catch (error) {
    console.error(error)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
    })
  }
})

export default authSlice.reducer