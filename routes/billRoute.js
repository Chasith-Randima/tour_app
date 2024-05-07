const express = require("express");
const router = express.Router();
const billController = require("../controllers/billController");



router
  .route("/")
  .get(billController.getAllBills)
  .post(billController.createOneBill);

router
  .route("/:id")
  .get(billController.getOneBill)
  .patch(billController.updateOneBill)
  .delete(billController.deleteOneBill);

module.exports = router;