const express = require("express");
const router = express.Router();
const parkController = require("../controllers/parkController");

router.get("/getParkImage/:id",parkController.getParkImage);




router
  .route("/")
  .get(parkController.getAllParks)
  .post(parkController.upload.single("image"),parkController.createOnePark);

router
  .route("/:id")
  .get(parkController.getOnePark)
  .patch(parkController.updateOnePark)
  .delete(parkController.deleteOnePark);

module.exports = router;