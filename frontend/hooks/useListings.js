// Custom hook for listings
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as listingService from '../services/listingService';
import {
  setListings,
  setLoading,
  setError,
  addListing,
  updateListing as updateListingAction,
  deleteListing as deleteListingAction,
  setSelectedListing
} from '../store/listings/listingSlice';

/**
 * Custom hook for listings
 * @returns {Object} Listings state and methods
 */
const useListings = () => {
  const dispatch = useDispatch();
  const { listings, selectedListing, loading, error } = useSelector(state => state.listings);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  /**
   * Fetch listings
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Listings result
   */
  const fetchListings = useCallback(async (params = {}) => {
    try {
      dispatch(setLoading(true));
      
      // Merge filters and pagination with params
      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        ...params
      };
      
      const result = await listingService.getListings(queryParams);
      
      dispatch(setListings(result.data));
      
      // Update pagination
      if (result.pagination) {
        setPagination(prevPagination => ({
          ...prevPagination,
          total: result.count || 0,
          ...result.pagination
        }));
      }
      
      return result;
    } catch (error) {
      console.error('Fetch listings error:', error);
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, filters, pagination.page, pagination.limit]);

  /**
   * Fetch listing by ID
   * @param {string} id - Listing ID
   * @returns {Promise<Object>} Listing
   */
  const fetchListingById = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      
      const listing = await listingService.getListing(id);
      
      dispatch(setSelectedListing(listing));
      
      return listing;
    } catch (error) {
      console.error('Fetch listing error:', error);
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Create listing
   * @param {Object} listingData - Listing data
   * @returns {Promise<Object>} Created listing
   */
  const createListing = useCallback(async (listingData) => {
    try {
      dispatch(setLoading(true));
      
      const listing = await listingService.createListing(listingData);
      
      dispatch(addListing(listing));
      
      return listing;
    } catch (error) {
      console.error('Create listing error:', error);
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Update listing
   * @param {string} id - Listing ID
   * @param {Object} listingData - Listing data
   * @returns {Promise<Object>} Updated listing
   */
  const updateListing = useCallback(async (id, listingData) => {
    try {
      dispatch(setLoading(true));
      
      const listing = await listingService.updateListing(id, listingData);
      
      dispatch(updateListingAction(listing));
      
      // Update selected listing if it's the same
      if (selectedListing && selectedListing.id === id) {
        dispatch(setSelectedListing(listing));
      }
      
      return listing;
    } catch (error) {
      console.error('Update listing error:', error);
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, selectedListing]);

  /**
   * Delete listing
   * @param {string} id - Listing ID
   * @returns {Promise<void>}
   */
  const deleteListing = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      
      await listingService.deleteListing(id);
      
      dispatch(deleteListingAction(id));
      
      // Clear selected listing if it's the same
      if (selectedListing && selectedListing.id === id) {
        dispatch(setSelectedListing(null));
      }
    } catch (error) {
      console.error('Delete listing error:', error);
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, selectedListing]);

  /**
   * Set filters
   * @param {Object} newFilters - New filters
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
    
    // Reset pagination when filters change
    setPagination(prevPagination => ({
      ...prevPagination,
      page: 1
    }));
  }, []);

  /**
   * Clear filters
   */
  const clearFilters = useCallback(() => {
    setFilters({});
    
    // Reset pagination
    setPagination(prevPagination => ({
      ...prevPagination,
      page: 1
    }));
  }, []);

  /**
   * Change page
   * @param {number} page - Page number
   */
  const changePage = useCallback((page) => {
    setPagination(prevPagination => ({
      ...prevPagination,
      page
    }));
  }, []);

  /**
   * Change limit
   * @param {number} limit - Items per page
   */
  const changeLimit = useCallback((limit) => {
    setPagination(prevPagination => ({
      ...prevPagination,
      limit,
      page: 1 // Reset to first page when changing limit
    }));
  }, []);

  /**
   * Get listings by category
   * @param {string} category - Category
   * @returns {Promise<Object>} Listings result
   */
  const getListingsByCategory = useCallback(async (category) => {
    return fetchListings({ category });
  }, [fetchListings]);

  /**
   * Get user listings
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Listings result
   */
  const getUserListings = useCallback(async (userId) => {
    return fetchListings({ user: userId });
  }, [fetchListings]);

  // Fetch listings when filters or pagination change
  useEffect(() => {
    fetchListings();
  }, [filters, pagination.page, pagination.limit, fetchListings]);

  return {
    listings,
    selectedListing,
    loading,
    error,
    filters,
    pagination,
    fetchListings,
    fetchListingById,
    createListing,
    updateListing,
    deleteListing,
    updateFilters,
    clearFilters,
    changePage,
    changeLimit,
    getListingsByCategory,
    getUserListings
  };
};

export default useListings;
