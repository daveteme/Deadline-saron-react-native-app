// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import languageReducer from '../features/language/languageSlice';
import authReducer from '../features/authorization/authSlice';
import adReducer from '../features/ad/adSlice';
import propertyReducer from '../features/property/propertySlice';
import listingsReducer from '../features/listings/listingSlice';
import savedReducer from '../features/saved/savedSlice';
// Removed messaging reducer

export const store = configureStore({
    reducer: {
        language: languageReducer, 
        auth: authReducer, 
        property: propertyReducer, 
        ad: adReducer, 
        listings: listingsReducer,
        saved: savedReducer, // Replaced messaging with saved
    }, 
});

export default store;