import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as adService from '../../services/adService'; // Create this service similar to listingService

// Async thunks
export const fetchAds = createAsyncThunk(
  'ads/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await adService.getAds(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch ads');
    }
  }
);

export const fetchAdById = createAsyncThunk(
  'ads/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await adService.getAd(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch ad');
    }
  }
);

export const createNewAd = createAsyncThunk(
  'ads/create',
  async (adData, { rejectWithValue }) => {
    try {
      return await adService.createAd(adData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create ad');
    }
  }
);

export const updateExistingAd = createAsyncThunk(
  'ads/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await adService.updateAd(id, data);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update ad');
    }
  }
);

export const deleteExistingAd = createAsyncThunk(
  'ads/delete',
  async (id, { rejectWithValue }) => {
    try {
      await adService.deleteAd(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete ad');
    }
  }
);

const adSlice = createSlice({
  name: 'ad',
  initialState: {
    ads: [],
    loading: false,
    error: null,
    selectedAd: null,
    userAdCount: 0
  },
  reducers: {
    clearAdError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all ads
      .addCase(fetchAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAds.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = action.payload.data;
        state.userAdCount = action.payload.count || state.ads.length;
      })
      .addCase(fetchAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single ad
      .addCase(fetchAdById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAd = action.payload;
      })
      .addCase(fetchAdById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create ad
      .addCase(createNewAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewAd.fulfilled, (state, action) => {
        state.loading = false;
        state.ads.unshift(action.payload);
        state.userAdCount += 1;
      })
      .addCase(createNewAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update ad
      .addCase(updateExistingAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingAd.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.ads.findIndex(ad => ad.id === action.payload.id);
        if (index !== -1) {
          state.ads[index] = action.payload;
        }
        if (state.selectedAd && state.selectedAd.id === action.payload.id) {
          state.selectedAd = action.payload;
        }
      })
      .addCase(updateExistingAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete ad
      .addCase(deleteExistingAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingAd.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = state.ads.filter(ad => ad.id !== action.payload);
        state.userAdCount -= 1;
        if (state.selectedAd && state.selectedAd.id === action.payload) {
          state.selectedAd = null;
        }
      })
      .addCase(deleteExistingAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAdError } = adSlice.actions;
export default adSlice.reducer;