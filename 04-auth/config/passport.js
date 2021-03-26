const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const Users = require("../services/userService");

require("dotenv").config();
const JWT = process.env.JWT;

const params = {
  secretOrKey: JWT,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(params, async (payload, done) => {
    try {
      const user = await Users.findById(payload.id);
      if (!user) {
        return done(new Error("User not found"));
      }
      if (!user.token) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      done(err);
    }
  })
);
