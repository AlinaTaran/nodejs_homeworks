const express = require("express");
const router = express.Router();

const validate = require("./validation");
const userController = require("../../../controllers/userController");
const guard = require("../../../helpers/guard");

router.post(
  "/auth/registration",
  validate.registration,
  userController.registration
);
router.post("/auth/logIn", validate.logIn, userController.logIn);
router.post("/auth/logOut", guard, userController.logOut);
router.patch(
  "/",
  guard,
  validate.updateUserInfo,
  userController.updateUserInfo
);
router.get("/current", guard, userController.getCurrentUser);

module.exports = router;
