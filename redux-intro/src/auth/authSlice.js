import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

const rawUser = localStorage.getItem('user')
const userStorage = rawUser && rawUser !== 'undefined' ? JSON.parse(rawUser) : null

const rawToken = localStorage.getItem('token')
// token es string plano, no parsear ni modificar
const tokenStorage = rawToken && rawToken.startsWith('eyJ') ? rawToken : null

const initialState = {
  user: userStorage || null,
  token: tokenStorage || null,
  isError: false,
  isSuccess: false,
  message: '',
}

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    return await authService.register(userData)
  } catch (error) {
    const message = error.response?.data?.error || 'Error al registrar'
    return thunkAPI.rejectWithValue(message)
  }
})

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    return await authService.login(userData)
  } catch (error) {
    const message = error.response?.data?.error || 'Error al iniciar sesión'
    return thunkAPI.rejectWithValue(message)
  }
})

export const getProfile = createAsyncThunk('auth/profile', async (_, thunkAPI) => {
  try {
    return await authService.getProfile()
  } catch (error) {
    const message = error.response?.data?.error || 'Error al obtener perfil'
    return thunkAPI.rejectWithValue(message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isSuccess = true
        state.message = action.payload.message
      })
      .addCase(register.rejected, (state, action) => {
        state.isError = true
        state.message = action.payload
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isSuccess = true
        state.message = action.payload.message
      })
      .addCase(login.rejected, (state, action) => {
        state.isError = true
        state.message = action.payload
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
      })
  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer
