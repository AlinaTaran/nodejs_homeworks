const Joi = require("joi");

const schemaAddContact = Joi.object({
  name: Joi.string().min(2).max(15).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\(?\d{3}\)? ?-? ?\d{3} ?-? ?\d{3}$/)
    .required(),
});

const schemaEditContact = Joi.object({
  name: Joi.string().min(2).max(15).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^\(?\d{3}\)? ?-? ?\d{3} ?-? ?\d{3}$/)
    .optional(),
}).min(1);

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: 400,
      message: `Filed: ${message.replace(/"/g, "")}`,
    });
  }
  next();
};

module.exports.addContact = (req, res, next) => {
  return validate(schemaAddContact, req.body, next);
};

module.exports.editContact = (req, res, next) => {
  return validate(schemaEditContact, req.body, next);
};
