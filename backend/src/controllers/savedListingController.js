// controllers/savedListingController.js
const SavedListing = require('../models/SavedListing');
const Listing = require('../models/Listing');

// Get all saved listings for the current user
exports.getSavedListings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all saved entries for this user
    const savedEntries = await SavedListing.find({ userId }).sort({ savedAt: -1 });
    
    // Get the actual listings with populated data
    const populatedListings = await Promise.all(
      savedEntries.map(async (entry) => {
        const listing = await Listing.findById(entry.listingId);
        if (!listing) return null;
        
        return {
          id: listing._id,
          title: listing.title,
          price: listing.price,
          location: listing.location,
          photos: listing.photos,
          category: entry.listingType,
          savedAt: entry.savedAt,
          // Include other listing details as needed
        };
      })
    );
    
    // Filter out any null entries (listings that may have been deleted)
    const validListings = populatedListings.filter(listing => listing !== null);
    
    res.json(validListings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saved listings', error: error.message });
  }
};

// Save a listing
exports.saveListing = async (req, res) => {
  try {
    const { listingId, listingType } = req.body;
    const userId = req.user.id;
    
    // Check if the listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check if already saved
    const existingSave = await SavedListing.findOne({ userId, listingId });
    if (existingSave) {
      return res.status(400).json({ message: 'Listing already saved' });
    }
    
    // Create new saved entry
    const savedListing = new SavedListing({
      userId,
      listingId,
      listingType
    });
    
    await savedListing.save();
    
    res.status(201).json({ 
      message: 'Listing saved successfully',
      savedListing
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving listing', error: error.message });
  }
};

// Remove a saved listing
exports.removeSavedListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;
    
    const result = await SavedListing.findOneAndDelete({ userId, listingId });
    
    if (!result) {
      return res.status(404).json({ message: 'Saved listing not found' });
    }
    
    res.json({ message: 'Listing removed from saved' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing saved listing', error: error.message });
  }
};