const YandexStrategy = require("passport-yandex").Strategy;
const User = require("../models/user");
const logger = require("../logger/index");
require("dotenv").config();

function passportFunction(passport) {
  passport.serializeUser(function (user, done) {
    const newUser = {};
    (newUser.id = user.id),
      (newUser.email = user.emails[0].value),
      (newUser.name = user.displayName),
      (newUser.age = user.birthday ? date.now() - user.birthday : 0),
      done(null, newUser);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });

  passport.use(
    new YandexStrategy(
      {
        clientID: process.env.YANDEX_CLIENT_ID,
        clientSecret: process.env.YANDEX_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/yandex/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
          // To keep the example simple, the user's Yandex profile is returned
          // to represent the logged-in user.  In a typical application, you would
          // want to associate the Yandex account with a user record in your
          // database, and return that user instead.
          logger.info(
            "получили профиль от яндекса" +
              profile.name.familyName +
              profile.name.givenName
          );
          return done(null, profile);
        });
      }
    )
  );
}
// const options = {
//   jwtFromRequest: cookieExtractor,
//   secretOrKey: process.env.jwtToken,
// };

// function passportFunction(passport) {
//   passport.use();
// }

module.exports = passportFunction;
