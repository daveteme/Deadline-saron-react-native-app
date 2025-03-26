// services/savedService.js
import api from './api';

export const getSavedListings = async () => {
  try {
    const response = await api.get('/saved');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveListing = async (listingId, listingType) => {
  try {
    const response = await api.post('/saved', { listingId, listingType });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeSavedListing = async (listingId) => {
  try {
    const response = await api.delete(`/saved/${listingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};