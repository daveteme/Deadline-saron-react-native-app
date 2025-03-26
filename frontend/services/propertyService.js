import api from './api';
import { getToken } from './authService';

// Get all properties
export const getProperties = async (params = {}) => {
  try {
    const response = await api.get('/properties', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get single property
export const getProperty = async (id) => {
  try {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create property
export const createProperty = async (propertyData) => {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await api.post('/properties', propertyData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update property
export const updateProperty = async (id, propertyData) => {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete property
export const deleteProperty = async (id) => {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await api.delete(`/properties/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Upload property photos
export const uploadPropertyPhotos = async (id, photos) => {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const formData = new FormData();
    
    photos.forEach((photo, index) => {
      const fileUri = photo.uri;
      const filename = fileUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('photos', {
        uri: fileUri,
        name: filename,
        type,
      });
    });
    
    const response = await api.post(`/properties/${id}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Get properties by type
export const getPropertiesByType = async (propertyType) => {
  try {
    return await getProperties({ propertyType });
  } catch (error) {
    throw error;
  }
};

// Get user properties
export const getUserProperties = async (userId) => {
  try {
    return await getProperties({ user: userId });
  } catch (error) {
    throw error;
  }
};

// Get featured properties
export const getFeaturedProperties = async () => {
  try {
    return await getProperties({ featured: true });
  } catch (error) {
    throw error;
  }
};

// Search properties
export const searchProperties = async (query) => {
  try {
    return await getProperties({ search: query });
  } catch (error) {
    throw error;
  }
};

// Filter properties by price range
export const filterPropertiesByPrice = async (minPrice, maxPrice) => {
  try {
    return await getProperties({ minPrice, maxPrice });
  } catch (error) {
    throw error;
  }
};

// Filter properties by bedrooms
export const filterPropertiesByBedrooms = async (bedrooms) => {
  try {
    return await getProperties({ bedrooms });
  } catch (error) {
    throw error;
  }
};

// Filter properties by bathrooms
export const filterPropertiesByBathrooms = async (bathrooms) => {
  try {
    return await getProperties({ bathrooms });
  } catch (error) {
    throw error;
  }
};

// Get recently added properties
export const getRecentProperties = async (limit = 5) => {
  try {
    return await getProperties({ sort: '-createdAt', limit });
  } catch (error) {
    throw error;
  }
};