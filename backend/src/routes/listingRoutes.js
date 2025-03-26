const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  uploadPhotos
} = require('../controllers/listingController');

const { protect } = require('../middleware/auth');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads');
    console.log("Uploads directory path:", uploadsDir)

    if (!fs.existsSync(uploadsDir)){
      console.log("Creating uploads directory")
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

const router = express.Router();

// Main routes
router.route('/')
  .get(getListings)
  .post(protect, createListing);

router.route('/:id')
  .get(getListing)
  .put(protect, updateListing)
  .delete(protect, deleteListing);

// Photo upload route
router.post('/:id/photos', protect, upload.array('photos', 5), uploadPhotos);

module.exports = router;



