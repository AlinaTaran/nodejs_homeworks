const passport = require("passport");
require("../config/passport");
const { HTTP_CODE } = require("./constants");

const guard = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    const [, token] = req.get("Authorization").split(" ");
    if (!user || err || token !== user.token) {
      return res.status(HTTP_CODE.FORBIDDEN).json({
        status: "error",
        code: HTTP_CODE.FORBIDDEN,
        data: "FORBIDDEN",
        message: "Access is denied",
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = guard;
