const express = require("express");
const router = express.Router();

const validate = require("./validation.js");
const validateId = require("./validateId");
const contactController = require("../../../controllers/contactControllers");
const guard = require("../../../helpers/guard");

router.get("/", guard, contactController.listContacts);

router.post("/", guard, validate.createContact, contactController.addContact);

router.get("/:contactId", guard, validateId, contactController.getContactById);

router.delete(
  "/:contactId",
  guard,
  validateId,
  contactController.removeContact
);

router.patch(
  "/:contactId",
  guard,
  validateId,
  validate.updateContact,
  contactController.updateContact
);

module.exports = router;
