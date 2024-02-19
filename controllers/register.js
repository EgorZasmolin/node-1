const logger = require("../logger/index");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.form = (req, res) => {
  logger.info("Пользователь зашёл на страницу регистрации");
  res.render("registerForm", { title: "Register" });
};

exports.submit = (req, res, next) => {
  User.findByEmail(req.body.email, (error, user) => {
    if (error) {
      logger.error(`Произошла ошибка: ${error}`);
      return next(error);
    }
    if (user) {
      logger.error("Такой пользователь в базе уже существует");
      res.error("Такой пользователь в базе уже существует");
      res.redirect("/");
    } else {
      User.create(req.body, (err) => {
        if (err) return next(err);
        req.session.userEmail = req.body.email;
        req.session.userName = req.body.name;
        logger.info("Создался новый пользователь");
        res.redirect("/");
      });
      //генерация JWT
      const token = jwt.sign(
        { name: req.body.name },
        process.env.JWTTOKENSECRET,
        {
          expiresIn: 60 * 60,
        }
      );
      logger.info("Токен подготовлен : " + token);
    }
  });
};
