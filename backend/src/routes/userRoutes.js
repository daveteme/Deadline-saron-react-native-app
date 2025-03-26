const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  uploadProfileImage,
  getMe // Ensure this is imported from userController
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for profile image uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Create profile images directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads/profiles');
    if (!fs.existsSync(uploadsDir)){
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    // Generate unique filename based on user ID
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + req.user.id + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for profile images
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
  }
});

const router = express.Router();

// Protect all routes
router.use(protect);

// Profile routes
router.route('/profile')
  .get(getMe) // Fetch the current user's profile
  .put(updateProfile); // Update the current user's profile

// Profile image upload route
router.post('/profile/image', upload.single('profileImage'), uploadProfileImage);

// Admin routes
router.use(authorize('admin'));

router.route('/')
  .get(getUsers) // Get all users (admin only)
  .post(createUser); // Create a new user (admin only)

router.route('/:id')
  .get(getUser) // Get a single user by ID (admin only)
  .put(updateUser) // Update a user by ID (admin only)
  .delete(deleteUser); // Delete a user by ID (admin only)

module.exports = router;




