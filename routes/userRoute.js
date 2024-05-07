const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController")

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/authCheck", authController.protect, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "working..",
  });
});

router.get("/getUserImage/:id",userController.getUserImage);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createOneUser);

router
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.upload.single("image"),userController.updateOneUser)
  .delete(userController.deleteOneUser);


module.exports = router;