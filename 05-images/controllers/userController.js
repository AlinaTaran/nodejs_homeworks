const fs = require("fs").promises;
const path = require("path");
const Jimp = require("jimp");
const jwt = require("jsonwebtoken");
const Users = require("../model/userService");
const { HTTP_CODE } = require("../helpers/constants");

const createFolderIsExist = require("../helpers/create-dir");

require("dotenv").config();
const JWT = process.env.JWT;

const registration = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
      return next({
        status: HTTP_CODE.CONFLICT,
        message: "This email is already use",
      });
    }
    const newUser = await Users.create(req.body);
    return res.status(HTTP_CODE.CREATED).json({
      status: "success",
      code: HTTP_CODE.CREATED,
      data: {
        email: newUser.email,
        name: newUser.name,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (e) {
    next(e);
  }
};

const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    if (!user || !user.validPassword(password)) {
      return res.status(HTTP_CODE.UNAUTHORIZED).json({
        status: "error",
        code: HTTP_CODE.UNAUTHORIZED,
        data: "UNAUTHORIZED",
        message: "Invalid credentials",
      });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, JWT, { expiresIn: "2h" });
    await Users.updateToken(id, token);
    return res.status(HTTP_CODE.OK).json({
      status: "success",
      code: HTTP_CODE.OK,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const logOut = async (req, res, next) => {
  try {
    const { id } = req.user;
    await Users.updateToken(id, null);
    return res.status(HTTP_CODE.NO_CONTENT).json({});
  } catch (e) {
    next(e);
  }
};

const updateUserInfo = async (req, res, next) => {
  const { id } = req.user;
  const { subscription } = req.body;

  try {
    const user = await Users.updateSubscriptionUser(id, subscription);
    return res.status(HTTP_CODE.OK).json({
      status: "success",
      code: HTTP_CODE.OK,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const getCurrentUser = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await Users.findById(id);
    return res.status(HTTP_CODE.OK).json({
      status: "success",
      code: HTTP_CODE.OK,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const saveAvatarToStatic = async (req) => {
  const id = req.user.id;
  const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
  const pathFile = req.file.path;
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`;
  const img = await Jimp.read(pathFile);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);
  await createFolderIsExist(path.join(AVATARS_OF_USERS, id));
  await fs.rename(pathFile, path.join(AVATARS_OF_USERS, id, newNameAvatar));
  const avatarUrl = path.normalize(path.join(id, newNameAvatar));
  try {
    await fs.unlink(
      path.join(process.cwd(), AVATARS_OF_USERS, req.user.avatarUrl)
    );
  } catch (e) {
    console.log(e.message);
  }
  return avatarUrl;
};

const avatars = async (req, res, next) => {
  try {
    const id = String(req.user._id);
    const avatarUrl = await saveAvatarToStatic(req);
    await Users.updateAvatar(id, avatarUrl);
    return res.json({
      status: "success",
      code: HTTP_CODE.OK,
      data: {
        avatarUrl,
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  registration,
  logIn,
  logOut,
  updateUserInfo,
  getCurrentUser,
  avatars,
};
