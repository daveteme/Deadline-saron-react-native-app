import api from './api';
import { getToken } from './authService';

// Get all listings
export const getListings = async (params = {}) => {
  try {
    const response = await api.get('/listings', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get single listing
export const getListing = async (id) => {
  try {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create listing
// export const createListing = async (listingData) => {
//   try {
//     const token = await getToken();
    
//     if (!token) {
//       throw new Error('Not authenticated');
//     }
    
//     const response = await api.post('/listings', listingData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// services/listingService.js
export const createListing = async (listingData) => {
  try {
    console.log("Creating listing with data:", JSON.stringify(listingData));
    const response = await api.post('/listings', {
      ...listingData,
      user: listingData.user
    });
    
    console.log("Raw API response:", response);
    return response.data; // Return the whole response data object
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
};

// Update listing
export const updateListing = async (id, listingData) => {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await api.put(`/listings/${id}`, listingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete listing
export const deleteListing = async (id) => {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await api.delete(`/listings/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Upload listing photos
export const uploadListingPhotos = async (id, photos) => {
  try {
    console.log("Starting photo upload for listing ID:", id);
    console.log("Number of photos:", photos.length);
    
    const token = await getToken();
    console.log("Auth token retrieved:", token ? "Yes" : "No");
    
    if (!token) {
      console.error("No auth token found for photo upload");
      throw new Error('Not authenticated');
    }
    
    const formData = new FormData();
    
    photos.forEach((photo, index) => {
      console.log(`Processing photo ${index}:`, photo);
      const fileUri = photo.uri;
      const filename = fileUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      console.log(`Adding photo to FormData:`, {
        uri: fileUri,
        name: filename,
        type
      });
      
      formData.append('photos', {
        uri: fileUri,
        name: filename,
        type,
      });
    });
    
    console.log("Making API request to:", `/listings/${id}/photos`);
    
    const response = await api.post(`/listings/${id}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log("Photo upload response status:", response.status);
    console.log("Photo upload response data:", response.data);
    
    return response;
  } catch (error) {
    console.error("Error in uploadListingPhotos:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received for request:", error.request);
    }
    throw error;
  }
};
// Get listings by category
export const getListingsByCategory = async (category) => {
  try {
    return await getListings({ category });
  } catch (error) {
    throw error;
  }
};

// Get user listings
export const getUserListings = async (userId) => {
  try {
    return await getListings({ user: userId });
  } catch (error) {
    throw error;
  }
};