// Utility functions for validating data

/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a password
 * @param {string} password - The password to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false
  } = options;
  
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < minLength) {
    return { isValid: false, message: `Password must be at least ${minLength} characters long` };
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (requireNumbers && !/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, message: 'Password is valid' };
};

/**
 * Validate a phone number
 * @param {string} phoneNumber - The phone number to validate
 * @param {string} countryCode - Country code for validation (default: 'ET' for Ethiopia)
 * @returns {boolean} Whether the phone number is valid
 */
export const isValidPhoneNumber = (phoneNumber, countryCode = 'ET') => {
  if (!phoneNumber) return false;
  
  // Remove non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Validate based on country code
  switch (countryCode) {
    case 'ET': // Ethiopia
      // Ethiopian numbers: +251 9X XXX XXXX (12 digits with country code)
      return /^251[9][0-9]{8}$/.test(cleaned) || /^0[9][0-9]{8}$/.test(cleaned);
    case 'US': // United States
      // US numbers: +1 XXX XXX XXXX (11 digits with country code)
      return /^1[0-9]{10}$/.test(cleaned) || /^[0-9]{10}$/.test(cleaned);
    default:
      // Generic validation: at least 10 digits
      return cleaned.length >= 10;
  }
};

/**
 * Validate a name (no numbers or special characters)
 * @param {string} name - The name to validate
 * @returns {boolean} Whether the name is valid
 */
export const isValidName = (name) => {
  if (!name) return false;
  
  // Only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[A-Za-z\s'-]+$/;
  return nameRegex.test(name);
};

/**
 * Validate a URL
 * @param {string} url - The URL to validate
 * @returns {boolean} Whether the URL is valid
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validate a date
 * @param {Date|string} date - The date to validate
 * @param {Object} options - Validation options
 * @returns {boolean} Whether the date is valid
 */
export const isValidDate = (date, options = {}) => {
  const { minDate, maxDate } = options;
  
  // Convert to Date object if string
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if valid date
  if (isNaN(dateObj.getTime())) {
    return false;
  }
  
  // Check min date
  if (minDate && dateObj < new Date(minDate)) {
    return false;
  }
  
  // Check max date
  if (maxDate && dateObj > new Date(maxDate)) {
    return false;
  }
  
  return true;
};

/**
 * Validate a price
 * @param {number|string} price - The price to validate
 * @param {Object} options - Validation options
 * @returns {boolean} Whether the price is valid
 */
export const isValidPrice = (price, options = {}) => {
  const { min = 0, max = Number.MAX_SAFE_INTEGER } = options;
  
  // Convert to number if string
  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if valid number
  if (isNaN(priceNum)) {
    return false;
  }
  
  // Check range
  return priceNum >= min && priceNum <= max;
};

/**
 * Validate a listing
 * @param {Object} listing - The listing to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateListing = (listing) => {
  const errors = {};
  
  // Required fields
  if (!listing.title) {
    errors.title = 'Title is required';
  } else if (listing.title.length < 5) {
    errors.title = 'Title must be at least 5 characters long';
  }
  
  if (!listing.description) {
    errors.description = 'Description is required';
  } else if (listing.description.length < 20) {
    errors.description = 'Description must be at least 20 characters long';
  }
  
  if (!listing.category) {
    errors.category = 'Category is required';
  }
  
  if (!listing.location) {
    errors.location = 'Location is required';
  }
  
  // Category-specific validations
  if (listing.category === 'rent') {
    if (!isValidPrice(listing.price)) {
      errors.price = 'Valid price is required for rent listings';
    }
    
    if (!listing.propertyType) {
      errors.propertyType = 'Property type is required for rent listings';
    }
  } else if (listing.category === 'jobs') {
    if (!listing.jobType) {
      errors.jobType = 'Job type is required for job listings';
    }
  } else if (listing.category === 'event') {
    if (!isValidDate(listing.startDate)) {
      errors.startDate = 'Valid start date is required for event listings';
    }
    
    if (listing.endDate && !isValidDate(listing.endDate)) {
      errors.endDate = 'End date must be valid';
    }
    
    if (listing.startDate && listing.endDate && new Date(listing.startDate) > new Date(listing.endDate)) {
      errors.endDate = 'End date must be after start date';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
