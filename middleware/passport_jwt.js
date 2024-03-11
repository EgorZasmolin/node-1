const JwtStrategy = require("passport-jwt").Strategy;
const User = require("../models/user");
const logger = require("../logger/index");

require("dotenv").config();

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.jwtToken,
};

function passportFunction(passport) {
  passport.use(
    new JwtStrategy(options, function (jwt_payload, done) {
      User.findByEmail(jwt_payload.name, (err, user) => {
        if (err) return done(err, false);
        if (user) {
          logger.info("Token accepted successfully");
          return done(null, user);
        } else {
          logger.info("Token not accepted");
          return done(null, false);
        }
      });
    })
  );
}

module.exports = passportFunction;
