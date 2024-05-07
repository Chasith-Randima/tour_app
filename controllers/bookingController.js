const Booking = require("../models/bookingModel");

exports.getAllBookings = async (req, res, next) => {
  try {
    let query = Booking.find();

    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["sort", "page", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);
    query = Booking.find(queryObj);

    // Sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const bookings = await query;

    res.status(200).json({
      status: "success",
      message: `${bookings.length} bookings found..`,
      results: bookings.length,
      bookings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch bookings data",
    });
  }
};

exports.getOneBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        status: "failed",
        message: "No booking found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Found the booking...",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch booking data",
    });
  }
};

exports.createOneBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);

    res.status(200).json({
      status: "success",
      message: "Booking created successfully..",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to create booking",
    });
  }
};

exports.updateOneBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!booking) {
      return res.status(404).json({
        status: "failed",
        message: "No document found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Booking updated successfully..",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to update booking",
    });
  }
};

exports.deleteOneBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        status: "failed",
        message: "No booking found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Booking deleted successfully..",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to delete booking",
    });
  }
};

exports.bookingNameId = async (req, res, next) => {
  try {
    const doc = await Booking.find({}, { bookingName: 1, _id: 1 });

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
      message: "Failed to fetch booking data",
    });
  }
};
