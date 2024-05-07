const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");



router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(bookingController.createOneBooking);

router
  .route("/:id")
  .get(bookingController.getOneBooking)
  .patch(bookingController.updateOneBooking)
  .delete(bookingController.deleteOneBooking);

module.exports = router;