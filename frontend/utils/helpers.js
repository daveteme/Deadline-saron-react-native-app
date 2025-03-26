// Utility helper functions

import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { IMAGE_UPLOAD } from '../constants/config';

/**
 * Sleep function for async operations
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after the specified time
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate a random ID
 * @param {number} length - Length of the ID
 * @returns {string} Random ID
 */
export const generateId = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value - Value to check
 * @returns {boolean} Whether the value is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true;
  }
  
  return false;
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
};

/**
 * Get platform-specific value
 * @param {Object} options - Platform-specific options
 * @returns {*} Value for the current platform
 */
export const getPlatformValue = (options) => {
  const { ios, android, default: defaultValue } = options;
  
  if (Platform.OS === 'ios' && ios !== undefined) {
    return ios;
  }
  
  if (Platform.OS === 'android' && android !== undefined) {
    return android;
  }
  
  return defaultValue;
};

/**
 * Pick an image from the device library or camera
 * @param {Object} options - Image picker options
 * @returns {Promise<Object>} Selected image
 */
export const pickImage = async (options = {}) => {
  const {
    fromCamera = false,
    allowsEditing = true,
    aspect = [4, 3],
    quality = 0.8,
    maxWidth = IMAGE_UPLOAD.maxWidth,
    maxHeight = IMAGE_UPLOAD.maxHeight,
  } = options;
  
  // Request permissions
  if (fromCamera) {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Camera permission not granted');
    }
  } else {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Media library permission not granted');
    }
  }
  
  // Launch picker
  const pickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing,
    aspect,
    quality,
  };
  
  const result = fromCamera
    ? await ImagePicker.launchCameraAsync(pickerOptions)
    : await ImagePicker.launchImageLibraryAsync(pickerOptions);
  
  if (result.canceled) {
    return null;
  }
  
  // Process image
  const image = result.assets[0];
  
  // Resize if needed
  if (maxWidth || maxHeight) {
    const manipResult = await ImageManipulator.manipulateAsync(
      image.uri,
      [{ resize: { width: maxWidth, height: maxHeight } }],
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    );
    
    return manipResult;
  }
  
  return image;
};

/**
 * Group an array of objects by a key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get file extension from a URI
 * @param {string} uri - File URI
 * @returns {string} File extension
 */
export const getFileExtension = (uri) => {
  return uri.split('.').pop().toLowerCase();
};

/**
 * Check if a file is an image
 * @param {string} uri - File URI
 * @returns {boolean} Whether the file is an image
 */
export const isImageFile = (uri) => {
  const extension = getFileExtension(uri);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
};
