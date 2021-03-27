const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;
const { SUBSCRIPTION_TYPE } = require("../helpers/constants");

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => /\S+@\S+\.\S+/.test(v),
      message: (props) => `${props.value} invalid email`,
    },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\(?\d{3}\)? ?-? ?\d{3} ?-? ?\d{3}$/;
      },
      message: "invalid number",
    },
  },
  subscription: {
    type: String,
    required: true,
    default: SUBSCRIPTION_TYPE.free,
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: "user",
  },
});

const Contact = mongoose.model("contact", contactSchema);
module.exports = Contact;
