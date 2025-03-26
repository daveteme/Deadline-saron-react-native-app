// routes/savedListingRoutes.js
const express = require('express');
const router = express.Router();
const savedListingController = require('../controllers/savedListingController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all saved listings for current user
router.get('/', savedListingController.getSavedListings);

// Save a listing
router.post('/', savedListingController.saveListing);

// Remove a saved listing
router.delete('/:listingId', savedListingController.removeSavedListing);

module.exports = router;