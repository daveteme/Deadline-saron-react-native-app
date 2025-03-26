// const Listing = require('../models/Listing');

// // @desc    Upload photos to a listing
// // @route   POST /api/listings/:id/photos
// // @access  Private
// exports.uploadPhotos = async (req, res, next) => {
//   try {
//     const listing = await Listing.findById(req.params.id);

//     if (!listing) {
//       return res.status(404).json({ success: false, message: `Listing not found with id of ${req.params.id}` });
//     }

//     if (listing.user.toString() !== req.user.id && req.user.role !== 'admin') {
//       return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to update this listing` });
//     }

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ success: false, message: 'Please upload at least one photo' });
//     }

//     const photoUrls = req.files.map(file => `/uploads/${file.filename}`);

//     listing.photos = listing.photos.concat(photoUrls);
//     await listing.save();

//     res.status(200).json({ success: true, data: listing });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get all listings
// // @route   GET /api/listings
// // @access  Public
// exports.getListings = async (req, res, next) => {
//   try {
//     let query;
//     const reqQuery = { ...req.query };
//     const removeFields = ['select', 'sort', 'page', 'limit'];

//     removeFields.forEach(param => delete reqQuery[param]);

//     let queryStr = JSON.stringify(reqQuery);
//     queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

//     query = Listing.find(JSON.parse(queryStr)).populate({ path: 'user', select: 'name email' });

//     if (req.query.select) {
//       const fields = req.query.select.split(',').join(' ');
//       query = query.select(fields);
//     }

//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(',').join(' ');
//       query = query.sort(sortBy);
//     } else {
//       query = query.sort('-createdAt');
//     }

//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10) || 10;
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;
//     const total = await Listing.countDocuments(JSON.parse(queryStr));

//     query = query.skip(startIndex).limit(limit);

//     const listings = await query;

//     const pagination = {};
//     if (endIndex < total) pagination.next = { page: page + 1, limit };
//     if (startIndex > 0) pagination.prev = { page: page - 1, limit };

//     res.status(200).json({ success: true, count: listings.length, pagination, data: listings });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get single listing
// // @route   GET /api/listings/:id
// // @access  Public
// exports.getListing = async (req, res, next) => {
//   try {
//     const listing = await Listing.findById(req.params.id).populate({ path: 'user', select: 'name email' });

//     if (!listing) {
//       return res.status(404).json({ success: false, message: `Listing not found with id of ${req.params.id}` });
//     }

//     res.status(200).json({ success: true, data: listing });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Create new listing
// // @route   POST /api/listings
// // @access  Private
// exports.createListing = async (req, res, next) => {
//   try {
//     req.body.user = req.user._id;

//     const listing = await Listing.create(req.body);

//     res.status(201).json({ success: true, data: listing });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Update listing
// // @route   PUT /api/listings/:id
// // @access  Private
// exports.updateListing = async (req, res, next) => {
//   try {
//     let listing = await Listing.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { 
//         new: true,
//         runValidators: true
//       }
//     ).populate('user', '_id name email');  // Add population

//     if (!listing) {
//       return res.status(404).json({ success: false, message: `Listing not found with id of ${req.params.id}` });
//     }

//     if (listing.user.toString() !== req.user._id && req.user.role !== 'admin') {
//       return res.status(401).json({ success: false, message: `User ${req.user._id} is not authorized to update this listing` });
//     }

//     listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

//     res.status(200).json({ success: true, data: listing });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Delete listing
// // @route   DELETE /api/listings/:id
// // @access  Private
// exports.deleteListing = async (req, res, next) => {
//   try {
//     const listing = await Listing.findById(req.params.id);

//     if (!listing) {
//       return res.status(404).json({ success: false, message: `Listing not found with id of ${req.params.id}` });
//     }

//     if (listing.user.toString() !== req.user.id && req.user.role !== 'admin') {
//       return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to delete this listing` });
//     }

//     await listing.deleteOne();

//     res.status(200).json({ success: true, data: {} });
//   } catch (error) {
//     next(error);
//   }
// };


const Listing = require('../models/Listing');

// @desc    Upload photos to a listing
// @route   POST /api/listings/:id/photos
// @access  Private
exports.uploadPhotos = async (req, res, next) => {
  try {
      console.log("uploadPhotos called with ID:", req.params.id);
      console.log("Files received:",  req.files);

      if(!req.files || req.files.length === 0) {
        console.log("No files in request");
        return res.status(400).json({
          success: false, 
          message: 'Please upload at least one photo'
        })
      }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      console.log("Listing not found")
      return res.status(404).json({ 
        success: false, 
        message: `Listing not found with id of ${req.params.id}` 
      });
    }

    console.log("Listing user:", listing.user);
    console.log("Current user:", req.user._id);

    if (listing.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ 
        success: false, 
        message: `User ${req.user._id} is not authorized to update this listing` 
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please upload at least one photo' 
      });
    }

    const photoUrls = req.files.map(file => {
      console.log("Processing file:", file.filename);
      return `/uploads/${file.filename}`;
    });

    console.log("Photo URLs to add:", photoUrls);
    console.log("Current photos:", listing.photos);

    listing.photos = listing.photos.concat(photoUrls);
    console.log("Updated photos array:", listing.photos)

    await listing.save();
    console.log("List saved successfully")

    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    console.error("Error in uploadPhotos:", error);
    next(error);
  }
};

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
exports.getListings = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];

    removeFields.forEach(param => delete reqQuery[param]);
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Listing.find(JSON.parse(queryStr))
      .populate({ path: 'user', select: '_id name email' });

    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Listing.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);
    const listings = await query;

    const pagination = {};
    if (endIndex < total) pagination.next = { page: page + 1, limit };
    if (startIndex > 0) pagination.prev = { page: page - 1, limit };

    res.status(200).json({ 
      success: true, 
      count: listings.length, 
      pagination, 
      data: listings 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
exports.getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate({ path: 'user', select: '_id name email' });

    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        message: `Listing not found with id of ${req.params.id}` 
      });
    }

    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
exports.createListing = async (req, res, next) => {
  try {
    console.log("Creating listing with body:", req.body);
    req.body.user = req.user._id;
    const listing = await Listing.create(req.body);
    
    console.log("Listing created:", listing);
    
    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    console.error("Error creating listing:", error);
    next(error);
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
exports.updateListing = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        message: `Listing not found with id of ${req.params.id}` 
      });
    }

    if (listing.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ 
        success: false, 
        message: `User ${req.user._id} is not authorized to update this listing` 
      });
    }

    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', '_id name email');

    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        message: `Listing not found with id of ${req.params.id}` 
      });
    }

    if (listing.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ 
        success: false, 
        message: `User ${req.user._id} is not authorized to delete this listing` 
      });
    }

    await listing.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};


