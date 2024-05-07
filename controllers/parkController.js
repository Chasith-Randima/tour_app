const Park = require("../models/parkModel");

const multer = require('multer');

// Define storage for multer
const storage = multer.memoryStorage();

// Initialize multer upload with storage options
exports.upload = multer({ storage: storage });

exports.createOnePark = async (req, res, next) => {
  try {
    let parkData = req.body;
    // Check if request content type is JSON
    // if (req.is('application/json')) {
    //   parkData = req.body; // If JSON, use req.body directly
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
      parkData.image = req.file.buffer; // Save image data in buffer format
    }

    // Create park with parsed data
    const park = await Park.create(parkData);

    res.status(200).json({
      status: "success",
      message: "Park created successfully..",
      park,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to create park",
    });
  }
};

exports.getAllParks = async (req, res, next) => {
  try {
    let query = Park.find();

    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["sort", "page", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);
    query = Park.find(queryObj);

    // Sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const parks = await query;

    res.status(200).json({
      status: "success",
      message: `${parks.length} parks found..`,
      results: parks.length,
      parks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch parks data",
    });
  }
};

exports.getOnePark = async (req, res, next) => {
  try {
    const park = await Park.findById(req.params.id);
    // const park = await Park.findById(req.params.id).populate("bookings");

    if (!park) {
      return res.status(404).json({
        status: "failed",
        message: "No park found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Found the document...",
      park,
      devices: park.devices,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch park data",
    });
  }
};

// exports.createOnePark = async (req, res, next) => {
//   try {
//     req.body.createdAt = req.requestTime;

//     const park = await Park.create(req.body);

//     res.status(200).json({
//       status: "success",
//       message: "Park created successfully..",
//       park,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       status: "failed",
//       message: "Failed to create park",
//     });
//   }
// };

exports.updateOnePark = async (req, res, next) => {
  try {
    const park = await Park.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!park) {
      return res.status(404).json({
        status: "failed",
        message: "No document found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Park updated successfully..",
      park,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to update park",
    });
  }
};

exports.deleteOnePark = async (req, res, next) => {
  try {
    const park = await Park.findByIdAndDelete(req.params.id);

    if (!park) {
      return res.status(404).json({
        status: "failed",
        message: "No park found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Park deleted successfully..",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to delete park",
    });
  }
};

exports.parkNameId = async (req, res, next) => {
  try {
    const doc = await Park.find({}, { parkName: 1, _id: 1 });

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
      message: "Failed to fetch park data",
    });
  }
};


exports.getParkImage = async (req, res, next) => {
  try {
    // Find the park by ID
    const park = await Park.findById(req.params.id);

    // If park not found or park does not have an image, return 404
    if (!park || !park.image) {
      return res.status(404).json({
        status: "failed",
        message: "Park image not found",
      });
    }

    // Set the appropriate content type for the image
    res.set('Content-Type', 'image/*');

    // Send the image data as response
    res.send(park.image);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch park image",
    });
  }
};



// exports.getParkImage = async (parkId) => {
//   try {
//     // Find the park by ID
//     const park = await Park.findById(parkId);

//     // If park is not found or it doesn't have an image, return null
//     if (!park || !park.image) {
//       return null;
//     }

//     // Convert image data to base64 format
//     const base64Image = park.image.toString('base64');

//     // Construct data URL for displaying the image
//     const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

//     // Return the image data URL
//     return imageDataUrl;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };
