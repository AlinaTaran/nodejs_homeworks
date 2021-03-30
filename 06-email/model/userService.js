const User = require("./schemas/users");

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findById = async (id) => {
  return await User.findOne({ _id: id });
};

const create = async ({
  email,
  password,
  subscription,
  name,
  avatarURL,
  verificationToken,
}) => {
  const user = new User({
    email,
    password,
    subscription,
    name,
    avatarURL,
    verificationToken,
  });
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateSubscriptionUser = async (id, subscription) => {
  return await User.updateOne({ _id: id }, { subscription });
};

const updateAvatar = async (id, avatarURL) => {
  return await User.updateOne({ _id: id }, { avatarURL });
};

const findByVerificationToken = async (verificationToken) => {
  return await User.findOne({ verificationToken });
};

const updateVerificationToken = async (id, verificationToken) => {
  return await User.findOneAndUpdate({ _id: id }, { verificationToken });
};

module.exports = {
  findByEmail,
  findById,
  create,
  updateToken,
  updateAvatar,
  updateSubscriptionUser,
  findByVerificationToken,
  updateVerificationToken,
};
