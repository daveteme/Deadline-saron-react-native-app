// Custom hook for authentication
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as authService from '../services/authService';
import { login, logout, setLoading, setError } from '../store/auth/authSlice';

/**
 * Custom hook for authentication
 * @returns {Object} Authentication state and methods
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(state => state.auth);
  const [initialized, setInitialized] = useState(false);

  /**
   * Initialize authentication state
   */
  const initAuth = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      
      // Check if user is authenticated
      const isAuth = await authService.isAuthenticated();
      
      if (isAuth) {
        // Get current user
        const currentUser = await authService.getCurrentUser();
        const authToken = await authService.getToken();
        
        if (currentUser && authToken) {
          dispatch(login({ user: currentUser, token: authToken }));
        } else {
          // Clear auth state if token exists but user data is missing
          await authService.logout();
          dispatch(logout());
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      dispatch(setError(error.message));
      
      // Clear auth state on error
      await authService.logout();
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
      setInitialized(true);
    }
  }, [dispatch]);

  /**
   * Sign in user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication result
   */
  const signIn = useCallback(async (email, password) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const result = await authService.login(email, password);
      
      dispatch(login({
        user: result.user,
        token: result.token
      }));
      
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Sign up user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Registration result
   */
  const signUp = useCallback(async (userData) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const result = await authService.register(userData);
      
      dispatch(login({
        user: result.user,
        token: result.token
      }));
      
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Sign out user
   * @returns {Promise<void>}
   */
  const signOut = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      
      await authService.logout();
      
      dispatch(logout());
    } catch (error) {
      console.error('Sign out error:', error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Get user profile
   * @returns {Promise<Object>} User profile
   */
  const getUserProfile = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      
      const profile = await authService.getUserProfile();
      
      return profile;
    } catch (error) {
      console.error('Get user profile error:', error);
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Initialize auth state on mount
  useEffect(() => {
    if (!initialized) {
      initAuth();
    }
  }, [initialized, initAuth]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    initialized,
    signIn,
    signUp,
    signOut,
    getUserProfile
  };
};

export default useAuth;
