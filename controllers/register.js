const logger = require("../logger/index");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.form = (req, res) => {
  res.render("registerForm", { title: "Register" });
};

exports.submit = (req, res, next) => {
  User.findByEmail(req.body.email, (error, user) => {
    if (error) {
      logger.error("Произошла ошибка: ${error}");
      return next(error);
    }
    if (user) {
      logger.error("Такой пользователь в базе уже существует");
      return res.status(400).send("Такой пользователь в базе уже существует");
    } else {
      User.create(req.body, (err) => {
        if (err) return next(err);
        req.session.userEmail = req.body.email;
        req.session.userName = req.body.name;
        logger.info("Создался новый пользователь");
        // генерация JWT
        const jwt_time = process.env.jwtTime;
        const token = jwt.sign({ name: req.body.email }, process.env.JWTTOKEN, {
          expiresIn: jwt_time,
        });
        // создание куки
        res.cookie("jwt", token, { httpOnly: true, maxAge: jwt_time });
        logger.info("First token login transferred successfully");
        res.redirect("/");
      });
    }
  });
};
