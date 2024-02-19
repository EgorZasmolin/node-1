const User = require("../models/user");
const validate = require("../middleware/validate");
const messanger = "https://kappa.lol/iSONv";
const logger = require("../logger/index");

exports.form = (req, res) => {
  logger.info("Пользователь зашёл на страницу логина");
  res.render("loginForm", { title: "Login", messanger: messanger });
};
exports.submit = (req, res, next) => {
  User.authentificate(req.body.loginForm, (error, data) => {
    if (error) {
      logger.error(`Произошла ошибка: ${error}`);
      return next(error);
    }
    if (!data) {
      res.error("Имя или пароль неверный");
      logger.error("Имя или пароль неверный");
      res.redirect("back");
    } else {
      req.session.userEmail = data.email;
      req.session.userName = data.name;
      logger.info("Пользователь вошёл в аккаунт");
      res.redirect("/");
    }
  });
};

exports.logout = (req, res, next) => {
  logger.info("Пользователь вышел");
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
