// App configuration constants

// API Configuration
export const API_CONFIG = {
  baseUrl: 'http://192.168.56.1:3001/', // Should match the baseUrl in services/api.js
  timeout: 10000, // 10 seconds
};

// App Information
export const APP_INFO = {
  name: 'IMMY',
  version: '1.0.0',
  description: 'A community app for the Ethiopian and Eritrean community',
};

// Feature Flags
export const FEATURES = {
  enableNotifications: true,
  enableMessaging: true,
  enableLocationServices: true,
  enableDarkMode: false,
};

// Listing Categories
export const LISTING_CATEGORIES = [
  { id: 'rent', label: 'Rent', icon: 'home' },
  { id: 'jobs', label: 'Jobs', icon: 'briefcase' },
  { id: 'event', label: 'Events', icon: 'calendar' },
  { id: 'services', label: 'Services', icon: 'tools' },
  { id: 'ad', label: 'Ads', icon: 'tag' },
  { id: 'restaurants', label: 'Restaurants', icon: 'utensils' },
  { id: 'churches', label: 'Churches', icon: 'church' },
  { id: 'voluntary', label: 'Voluntary', icon: 'hands-helping' },
];

// Property Types
export const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Apartment' },
  { id: 'house', label: 'House' },
  { id: 'room', label: 'Room' },
  { id: 'other', label: 'Other' },
];

// Job Types
export const JOB_TYPES = [
  { id: 'fulltime', label: 'Full Time' },
  { id: 'parttime', label: 'Part Time' },
  { id: 'contract', label: 'Contract' },
  { id: 'temporary', label: 'Temporary' },
];

// Ad Types
export const AD_TYPES = [
  { id: 'sale', label: 'For Sale' },
  { id: 'wanted', label: 'Wanted' },
  { id: 'free', label: 'Free' },
  { id: 'other', label: 'Other' },
];

// Price Ranges
export const PRICE_RANGES = [
  { id: 'inexpensive', label: 'Inexpensive' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'expensive', label: 'Expensive' },
  { id: 'very expensive', label: 'Very Expensive' },
];

// Pagination
export const PAGINATION = {
  defaultLimit: 10,
  maxLimit: 50,
};

// Image Upload
export const IMAGE_UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  maxImages: 5,
};

// Timeouts
export const TIMEOUTS = {
  toast: 3000, // 3 seconds
  autoLogout: 30 * 60 * 1000, // 30 minutes
  refreshToken: 5 * 60 * 1000, // 5 minutes
};
