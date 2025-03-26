import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

// Import reducers
import authReducer from './store/auth/authSlice';
import listingReducer from './store/listings/listingSlice';
import languageReducer from './store/language/languageSlice';
import adReducer from './store/ad/adSlice';
import propertyReducer from './store/property/propertySlice';

// Configure persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'language'] // only auth and language will be persisted
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  listings: listingReducer,
  language: languageReducer,
  ads: adReducer,
  properties: propertyReducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // disable serializable check for redux-persist
    })
});

// Create persistor
export const persistor = persistStore(store);

export default store;
