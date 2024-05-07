const User = require("../models/userModel");

const multer = require('multer');

// Define storage for multer
const storage = multer.memoryStorage();

// Initialize multer upload with storage options
exports.upload = multer({ storage: storage });

exports.getAllUsers = async (req, res, next) => {
  try {
    let query = User.find();

    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["sort", "page", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);
    query = User.find(queryObj);

    // Sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const users = await query;

    res.status(200).json({
      status: "success",
      message: `${users.length} users found..`,
      results: users.length,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch users data",
    });
  }
};

exports.getOneUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No user found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Found the user...",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch user data",
    });
  }
};

exports.createOneUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(200).json({
      status: "success",
      message: "User created successfully..",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to create user",
    });
  }
};

exports.updateOneUser = async (req, res, next) => {
  try {
    let userData = req.body;
    // Check if request content type is JSON
    // if (req.is('application/json')) {
    //   userData = req.body; // If JSON, use req.body directly
    // } else {
    //   // If not JSON, parse formData
    //   // Ensure to use the field names based on your formData structure
    //   parkData = {
    //     // Extract formData fields
    //     parkName: req.body.parkName,
    //     address: req.body.address,
    //     // Add other properties as needed
    //   };
    // }

    // If image is uploaded, it will be available in req.file
    if (req.file) {
      userData.image = req.file.buffer; // Save image data in buffer format
    }

    const user = await User.findByIdAndUpdate(req.params.id, userData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No document found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User updated successfully..",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to update user",
    });
  }
};

exports.deleteOneUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No user found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully..",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to delete user",
    });
  }
};

exports.userNameId = async (req, res, next) => {
  try {
    const doc = await User.find({}, { username: 1, _id: 1 });

    res.status(200).json({
      status: "success",
      message: `${doc.length} documents found...`,
      results: doc.length,
      doc,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch user data",
    });
  }
};


exports.getUserImage = async (req, res, next) => {
  try {
    // Find the park by ID
    const user = await User.findById(req.params.id);

    // If park not found or park does not have an image, return 404
    if (!user || !user.image) {
      return res.status(404).json({
        status: "failed",
        message: "user image not found",
      });
    }

    // Set the appropriate content type for the image
    res.set('Content-Type', 'image/*');

    // Send the image data as response
    res.send(user.image);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch user image",
    });
  }
};
