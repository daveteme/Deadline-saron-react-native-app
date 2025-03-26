import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//import * as authService from '../services/authService';
import * as SecureStore from 'expo-secure-store'

import * as authService from '../../services/authService';

const USER_KEY = 'immy_user';

// Async thunks
// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       return await authService.login(email, password);
//     } catch (error) {
//       return rejectWithValue(error.message?.data || 'Login failed');
//     }
//   }
// );

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);

      if (response.success) {
        // Fetch the latest user profile
        const updatedProfile = await authService.getUserProfile();

        // Store updated profile in SecureStore
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedProfile));
        console.log("Updated user stored in SecureStore:", updatedProfile);
        
        return { user: updatedProfile };
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);


export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/update', 
  async(updateData, { rejectWithValue }) => {
    try {
      await authService.updateProfile(updateData);

      // update the stored user info in securestore
     

      const userJson = await SecureStore.getItemAsync(USER_KEY);
      if(userJson) {
        const currentUser = JSON.parse(userJson);
        const updateUser = { ...currentUser, ...updateData };
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updateUser));
      }
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to Update")
    }
  }
)



export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getUserProfile();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      
      // Fetch user profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Update the current user with the new profile data
        state.currentUser = { ...state.currentUser, ...action.payload };
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;