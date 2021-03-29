const express = require("express");
const router = express.Router();

const validate = require("./validation");
const userController = require("../../../controllers/userController");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");

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
router.patch(
  "/avatars",
  [guard, upload.single("avatar"), validate.uploadAvatar],
  userController.avatars
);

module.exports = router;
