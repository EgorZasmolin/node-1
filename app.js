const express = require("express");
const favicon = require("express-favicon");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const session = require("express-session");
require("dotenv").config();
const userSession = require("./middleware/user_session");
const messages = require("./middleware/messages");
// const morgan = require("morgan");
const app = express();
const myRoutes = require("./routers/index_routers");
const port = "3000";
const logger = require("./logger/index");
// app.use(morgan("combined"));
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const passport = require("passport");
// const passportFunction = require("./middleware/passport_jwt");
const passportFunction = require("./middleware/passport_yandex");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "views")));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
passportFunction(passport);
app.use(
  "/css/bootstrap.css",
  express.static(
    path.join(
      __dirname,
      "public/css/bootstrap-5.3.2/dist/css/bootstrap.min.css"
    )
  )
);
app.use(
  "/js/bootstrap.js",
  express.static(
    path.join(__dirname, "public/css/bootstrap-5.3.2/dist/js/bootstrap.min.js")
  )
);

app.use(favicon(__dirname + "/public/favicon.ico"));

app.use(messages);
app.use(userSession);
app.use(myRoutes);

logger.info(`listen on port ${port}`);

app.listen(port, () => {
  console.log(`listen on port ${port}`);
});

app.get("env") == "production";
if (app.get("env") == "production") {
  app.use((req, res, err) => {
    res.status(err.status);
    res.sendFile(err.message);
  });
}
//ERROR HANDLER
app.use((req, res, next) => {
  const err = new Error("Could't get path");
  err.status = 404;
  next(err);
});

if (app.get("env") != "development") {
  app.use(function (err, req, res, next) {
    console.log(err.status, err.message);
    res.status = 404;
    link = "https://centralsib.com/media/gallery/kukushka.jpg";
    res.render("error.ejs", { title: "Error", err, link });
  });
} else {
  app.use(function (err, req, res, next) {
    console.log(app.get("env"), err.status, err.message);
    logger.error(`${app.get("env")} ${err.status} ${err.message}`);
  });
}
