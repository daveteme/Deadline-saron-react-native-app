import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as listingService from '../../services/listingService';

// Async thunks
export const fetchListings = createAsyncThunk(
  'listings/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await listingService.getListings(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch listings');
    }
  }
);

export const fetchListingById = createAsyncThunk(
  'listings/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await listingService.getListing(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch listing');
    }
  }
);

export const createNewListing = createAsyncThunk(
  'listings/create',
  async (listingData, { rejectWithValue }) => {
    try {
      const response = await listingService.createListing(listingData);
      console.log("CreateNewListing response:", response);
      
      return response;
    } catch (error) {
      console.error("Error in createNewListing thunk:", error);
      return rejectWithValue(error.message || 'Failed to create listing');
    }
  }
);

export const updateExistingListing = createAsyncThunk(
  'listings/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await listingService.updateListing(id, data);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update listing');
    }
  }
);

export const deleteExistingListing = createAsyncThunk(
  'listings/delete',
  async (id, { rejectWithValue }) => {
    try {
      await listingService.deleteListing(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete listing');
    }
  }
);

export const uploadListingImages = createAsyncThunk(
  'listings/uploadImages',
  async ({ id, photos }, { rejectWithValue }) => {
    try {
      console.log("Uploading images for listing ID:", id);
      console.log("Photos to upload:", photos.length);
      const response = await listingService.uploadListingPhotos(id, photos);
      console.log("Upload response:", response);
      return response;
    } catch (error) {
      console.error("Error in uploadListingImages thunk:", error);
      return rejectWithValue(error.message || 'Failed to upload images');
    }
  }
);

const listingSlice = createSlice({
  name: 'listings',
  initialState: {
    items: [],
    selectedListing: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  },
  reducers: {
    clearListingError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1; // Reset to first page when changing limit
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all listings
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = {
            ...state.pagination,
            total: action.payload.count || 0,
            ...action.payload.pagination
          };
        }
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single listing
      .addCase(fetchListingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedListing = action.payload;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create listing
      .addCase(createNewListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewListing.fulfilled, (state, action) => {
        console.log("CreateNewListing fulfilled with payload:", action.payload);
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createNewListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update listing
      .addCase(updateExistingListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingListing.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedListing && state.selectedListing._id === action.payload._id) {
          state.selectedListing = action.payload;
        }
      })
      .addCase(updateExistingListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete listing
      .addCase(deleteExistingListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingListing.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        if (state.selectedListing && state.selectedListing._id === action.payload) {
          state.selectedListing = null;
        }
      })
      .addCase(deleteExistingListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upload images
      .addCase(uploadListingImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadListingImages.fulfilled, (state, action) => {
        state.loading = false;
        // If the selectedListing is the one being updated, update its photos
        if (state.selectedListing && state.selectedListing._id === action.payload.data._id) {
          state.selectedListing = action.payload.data;
        }
        // Update the listing in the items array
        const index = state.items.findIndex(item => item._id === action.payload.data._id);
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
      })
      .addCase(uploadListingImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearListingError, setPage, setLimit } = listingSlice.actions;
export default listingSlice.reducer;