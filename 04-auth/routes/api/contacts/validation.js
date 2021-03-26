const Joi = require("joi");

const schemaAddContact = Joi.object({
  name: Joi.string().min(2).max(15).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\(?\d{3}\)? ?-? ?\d{3} ?-? ?\d{3}$/)
    .required(),
  subscription: Joi.string().required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
  phone: Joi.string()
    .pattern(/^\(?\d{3}\)? ?-? ?\d{3} ?-? ?\d{3}$/)
    .optional(),
  subscription: Joi.string(),
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

module.exports.createContact = (req, res, next) => {
  return validate(schemaAddContact, req.body, next);
};

module.exports.updateContact = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};
