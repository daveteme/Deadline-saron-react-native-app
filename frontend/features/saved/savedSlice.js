// features/saved/savedSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get saved listings from AsyncStorage
export const fetchSavedListings = createAsyncThunk(
  'saved/fetchSavedListings',
  async (_, { rejectWithValue }) => {
    try {
      const savedJSON = await AsyncStorage.getItem('savedListings');
      return savedJSON ? JSON.parse(savedJSON) : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Save a listing
export const saveListingItem = createAsyncThunk(
  'saved/saveListingItem',
  async (listing, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      // Check if already saved to prevent duplicates
      const isAlreadySaved = state.saved.items.some(item => item.id === listing.id);
      
      if (isAlreadySaved) {
        return { success: false, message: 'Already saved' };
      }
      
      // Add current timestamp to the listing
      const listingWithTimestamp = {
        ...listing,
        savedAt: new Date().toISOString(),
      };
      
      const updatedSavedListings = [...state.saved.items, listingWithTimestamp];
      await AsyncStorage.setItem('savedListings', JSON.stringify(updatedSavedListings));
      
      return { success: true, listing: listingWithTimestamp };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove a saved listing
export const removeSavedListing = createAsyncThunk(
  'saved/removeSavedListing',
  async (listingId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const updatedSavedListings = state.saved.items.filter(item => item.id !== listingId);
      await AsyncStorage.setItem('savedListings', JSON.stringify(updatedSavedListings));
      
      return { success: true, listingId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const savedSlice = createSlice({
  name: 'saved',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSavedState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch saved listings
      .addCase(fetchSavedListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedListings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSavedListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Save listing
      .addCase(saveListingItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveListingItem.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.items.push(action.payload.listing);
        }
      })
      .addCase(saveListingItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove saved listing
      .addCase(removeSavedListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSavedListing.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.items = state.items.filter(item => item.id !== action.payload.listingId);
        }
      })
      .addCase(removeSavedListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSavedState } = savedSlice.actions;
export default savedSlice.reducer;