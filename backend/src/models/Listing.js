const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'rent',
      'jobs',
      'event',
      'services',
      'ad',
      'restaurants',
      'churches',
      'voluntary'
    ]
  },
  location: {
    type: String,
    required: [true, 'Please provide a location']
  },
  photos: [
    {
      type: String
    }
  ],
  // Category-specific fields
  // Rent
  price: {
    type: Number
  },
  bedrooms: {
    type: Number
  },
  bathrooms: {
    type: Number
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'room', 'other']
  },
  // Jobs
  salary: {
    type: String
  },
  company: {
    type: String
  },
  jobType: {
    type: String,
    enum: ['fulltime', 'parttime', 'contract', 'temporary']
  },
  // Event
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  venue: {
    type: String
  },
  // Services
  serviceType: {
    type: String
  },
  rate: {
    type: String
  },
  // Ad
  adType: {
    type: String,
    enum: ['sale', 'wanted', 'free', 'other']
  },
  // Restaurants
  cuisine: {
    type: String
  },
  priceRange: {
    type: String,
    enum: ['inexpensive', 'moderate', 'expensive', 'very expensive']
  },
  // Churches
  denomination: {
    type: String
  },
  serviceTime: {
    type: String
  },
  // Voluntary
  organization: {
    type: String
  },
  commitment: {
    type: String
  },
  // Common fields
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }, 
  phoneNumber: {
    type: String,
    required: function() {
      // Make phone number required for rentals
      return this.category === 'rent';
    }
  }
});

// Set updatedAt on save
ListingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Listing', ListingSchema);
