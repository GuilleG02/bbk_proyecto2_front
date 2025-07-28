import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from './userService';

export const followUser = createAsyncThunk(
  'user/followUser',
  async (userId, thunkAPI) => {
    try {
      return await userService.followUser(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al seguir usuario');
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'user/unfollowUser',
  async (userId, thunkAPI) => {
    try {
      return await userService.unfollowUser(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al dejar de seguir usuario');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoading: false,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(followUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(unfollowUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
