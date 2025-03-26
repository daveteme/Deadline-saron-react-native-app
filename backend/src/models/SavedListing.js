// models/SavedListing.js
const mongoose = require('mongoose');

const SavedListingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  listingType: {
    type: String,
    enum: ['rent', 'ad', 'event', 'jobs', 'services', 'voluntary', 'churches', 'restaurants'],
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index to prevent duplicate saves
SavedListingSchema.index({ userId: 1, listingId: 1 }, { unique: true });

module.exports = mongoose.model('SavedListing', SavedListingSchema);