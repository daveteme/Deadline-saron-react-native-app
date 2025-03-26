// frontend/services/api.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { baseUrl } from '../shared/baseUrl';

// Token key for secure storage
const TOKEN_KEY = 'immy_auth_token';

// Create axios instance
const api = axios.create({
  baseURL: `${baseUrl}api/`,
  timeout: 15000, // Increased timeout for better handling of slow networks
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get token securely
const getAuthToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

// Helper to remove token (e.g., on logout)
export const clearAuthToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    console.log('Auth token cleared');
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

// Add request interceptor to attach token
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No auth token found, sending unauthenticated request.');
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for common handling
api.interceptors.response.use(
    (response) => {
        return response.data
    }, 
    (error) => {
        console.log('API Error', error);
        if(error.response) {
            console.log('Response data:', error.response.data);
            console.log('Response status:', error.response.status);
        } else if(error.request) {
            console.log('No response recieved', error.request);
        } else {
            console.log('Error setting up request:', error.message);
        }

        return Promise.reject(
            error.response?.data || {
                success: false, 
                message: 'Network error occured'
            }
        );
    }
);

// Export the API instance
export default api;

// Utility to store token
export const setAuthToken = async (token) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    console.log('Auth token saved successfully.');
  } catch (error) {
    console.error('Error saving auth token:', error);
  }
};
