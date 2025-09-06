import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/authSlice'
import postReducer from '../posts/postSlice'
import usersSearchReducer from '../usersSearch/usersSearchSlice'
import userReducer from '../users/userSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,             
    posts: postReducer,            
    usersSearch: usersSearchReducer, 
    user: userReducer,             
  },
})
