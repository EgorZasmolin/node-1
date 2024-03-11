const User = require("../models/user");
const validate = require("../middleware/validate");
const messanger = "https://kappa.lol/iSONv";
const logger = require("../logger/index");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.form = (req, res) => {
  logger.info("Пользователь зашёл на страницу логина");
  res.render("loginForm", { title: "Login", messanger: messanger });
};
exports.submit = (req, res, next) => {
  User.authentificate(req.body.loginForm, (error, data) => {
    if (error) {
      logger.error("Произошла ошибка: ${error}");
      return next(error);
    }
    if (!data) {
      logger.error("Имя или пароль неверный");
      return res.status(401).send("Имя или пароль неверный");
    } else {
      req.session.userEmail = data.email;
      req.session.userName = data.name;

      // генерация token
      const jwt_time = process.env.JWTTIME;
      const token = jwt.sign({ name: data.email }, process.env.JWTTOKEN, {
        expiresIn: jwt_time,
      });
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: jwt_time,
      });
      logger.info("Token login transferred successfully");

      return res.redirect("/");
    }
  });
};

exports.logout = (req, res, next) => {
  res.clearCookie("jwt");
  res.clearCookie("connect.sid");
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
