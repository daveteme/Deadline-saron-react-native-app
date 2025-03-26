// utils/savedListingUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save a listing to AsyncStorage
 * @param {Object} listing - The listing to save
 * @returns {Promise<boolean>} - Returns true if saved successfully, false if already saved
 */
export const saveListing = async (listing) => {
  try {
    // Get current saved listings
    const savedJSON = await AsyncStorage.getItem('savedListings');
    const savedListings = savedJSON ? JSON.parse(savedJSON) : [];
    
    // Check if already saved
    const isAlreadySaved = savedListings.some(item => item.id === listing.id);
    if (isAlreadySaved) {
      return false;
    }
    
    // Add timestamp and save
    const listingWithTimestamp = {
      ...listing,
      savedAt: new Date().toISOString()
    };
    
    savedListings.push(listingWithTimestamp);
    await AsyncStorage.setItem('savedListings', JSON.stringify(savedListings));
    return true;
  } catch (error) {
    console.error('Error saving listing:', error);
    throw error;
  }
};

/**
 * Remove a listing from saved
 * @param {string|number} listingId - The ID of the listing to remove
 * @returns {Promise<boolean>} - Returns true if removed, false if not found
 */
export const removeSavedListing = async (listingId) => {
  try {
    // Get current saved listings
    const savedJSON = await AsyncStorage.getItem('savedListings');
    if (!savedJSON) return false;
    
    const savedListings = JSON.parse(savedJSON);
    
    // Check if the listing exists
    const initialLength = savedListings.length;
    const filteredListings = savedListings.filter(item => item.id !== listingId);
    
    // If nothing was removed, return false
    if (filteredListings.length === initialLength) {
      return false;
    }
    
    // Save updated list
    await AsyncStorage.setItem('savedListings', JSON.stringify(filteredListings));
    return true;
  } catch (error) {
    console.error('Error removing saved listing:', error);
    throw error;
  }
};

/**
 * Check if a listing is saved
 * @param {string|number} listingId - The ID of the listing to check
 * @returns {Promise<boolean>} - Returns true if saved, false otherwise
 */
export const isListingSaved = async (listingId) => {
  try {
    const savedJSON = await AsyncStorage.getItem('savedListings');
    if (!savedJSON) return false;
    
    const savedListings = JSON.parse(savedJSON);
    return savedListings.some(item => item.id === listingId);
  } catch (error) {
    console.error('Error checking if listing is saved:', error);
    return false;
  }
};

/**
 * Get all saved listings
 * @returns {Promise<Array>} - Returns array of saved listings
 */
export const getSavedListings = async () => {
  try {
    const savedJSON = await AsyncStorage.getItem('savedListings');
    return savedJSON ? JSON.parse(savedJSON) : [];
  } catch (error) {
    console.error('Error getting saved listings:', error);
    return [];
  }
};