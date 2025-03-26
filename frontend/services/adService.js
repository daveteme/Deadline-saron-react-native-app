import api from './api';
import { getToken } from './authService';

// Get all ads
export const getAds = async (params = {}) => {
  try {
    const response = await api.get('/ads', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get single ad
export const getAd = async (id) => {
  try {
    const response = await api.get(`/ads/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create ad
export const createAd = async (adData) => {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await api.post('/ads', adData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update ad
export const updateAd = async (id, adData) => {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await api.put(`/ads/${id}`, adData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete ad
export const deleteAd = async (id) => {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await api.delete(`/ads/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Upload ad images
export const uploadAdImages = async (id, images) => {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const formData = new FormData();
    
    images.forEach((image, index) => {
      const fileUri = image.uri;
      const filename = fileUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('images', {
        uri: fileUri,
        name: filename,
        type,
      });
    });
    
    const response = await api.post(`/ads/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Get ads by category
export const getAdsByCategory = async (category) => {
  try {
    return await getAds({ category });
  } catch (error) {
    throw error;
  }
};

// Get user ads
export const getUserAds = async (userId) => {
  try {
    return await getAds({ user: userId });
  } catch (error) {
    throw error;
  }
};

// Get featured ads
export const getFeaturedAds = async () => {
  try {
    return await getAds({ featured: true });
  } catch (error) {
    throw error;
  }
};

// Search ads
export const searchAds = async (query) => {
  try {
    return await getAds({ search: query });
  } catch (error) {
    throw error;
  }
};