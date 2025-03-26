import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as propertyService from '../../services/propertyService'; // Create this service similar to listingService

// Async thunks
export const fetchProperties = createAsyncThunk(
  'properties/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await propertyService.getProperties(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch properties');
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  'properties/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await propertyService.getProperty(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch property');
    }
  }
);

export const createNewProperty = createAsyncThunk(
  'properties/create',
  async (propertyData, { rejectWithValue }) => {
    try {
      return await propertyService.createProperty(propertyData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create property');
    }
  }
);

export const updateExistingProperty = createAsyncThunk(
  'properties/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await propertyService.updateProperty(id, data);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update property');
    }
  }
);

export const deleteExistingProperty = createAsyncThunk(
  'properties/delete',
  async (id, { rejectWithValue }) => {
    try {
      await propertyService.deleteProperty(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete property');
    }
  }
);

const propertySlice = createSlice({
  name: 'property',
  initialState: {
    properties: [],
    loading: false,
    error: null,
    selectedProperty: null
  },
  reducers: {
    clearPropertyError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all properties
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.data;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single property
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProperty = action.payload;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create property
      .addCase(createNewProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.properties.unshift(action.payload);
      })
      .addCase(createNewProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update property
      .addCase(updateExistingProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingProperty.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.properties.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
        if (state.selectedProperty && state.selectedProperty.id === action.payload.id) {
          state.selectedProperty = action.payload;
        }
      })
      .addCase(updateExistingProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete property
      .addCase(deleteExistingProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = state.properties.filter(p => p.id !== action.payload);
        if (state.selectedProperty && state.selectedProperty.id === action.payload) {
          state.selectedProperty = null;
        }
      })
      .addCase(deleteExistingProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearPropertyError } = propertySlice.actions;
export default propertySlice.reducer;