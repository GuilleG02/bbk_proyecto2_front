import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/authSlice'
import postReducer from '../posts/postSlice'
import usersReducer from '../users/usersSlice' 
import userReducer from '../users/userSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    users: usersReducer,  
    user: userReducer,    
  },
})
