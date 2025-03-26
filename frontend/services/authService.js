// frontend/services/authService.js
import api from './api';
import * as SecureStore from 'expo-secure-store';

// Token key for secure storage
const TOKEN_KEY = 'immy_auth_token';
const USER_KEY = 'immy_user';

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);

    // Store token and user data
    if (response.success && response.token) {
      await SecureStore.setItemAsync(TOKEN_KEY, response.token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(response.user));
      console.log("Token saved", response.token) // This line is added for the purpose of debugging 
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });

    // Store token and user data
    if (response.success && response.token) {
      await SecureStore.setItemAsync(TOKEN_KEY, response.token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(response.user));
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch (error) {
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const userJson = await SecureStore.getItemAsync(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    throw error;
  }
};

// Get auth token
export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = await getToken();
    return !!token;
  } catch (error) {
    return false;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/me', profileData);
    
    // Update stored user info
    if (response.success) {
      const userJson = await SecureStore.getItemAsync(USER_KEY);
      if (userJson) {
        const currentUser = JSON.parse(userJson);
        const updatedUser = { ...currentUser, ...response.data };
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));
      }
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

