const Entry = require("../models/entry");
const logger = require("../logger/index");

exports.list = (req, res, next) => {
  Entry.selectAll((err, entries) => {
    if (err) return next(err);

    const userData = req.user;
    logger.info("Пользователь зашёл на страницу постов");
    res.render("entries", { title: "Посты", entries: entries, user: userData });
  });
};

exports.form = (req, res) => {
  res.render("post", { title: "Создание поста" });
};

exports.submit = (req, res, next) => {
  try {
    const username = req.user ? req.user.name : null;
    const data = req.body.entry;

    const entry = {
      username: username,
      title: data.title,
      content: data.content,
    };

    Entry.create(entry);
    logger.info("Пользователь создал новый пост");
    res.redirect("/posts");
  } catch (err) {
    logger.error(`Произошла ошибка: ${err}`);
    return next(err);
  }
};

exports.delete = async (req, res, next) => {
  const entryId = req.params.id;

  Entry.delete(entryId, async (err) => {
    if (err) {
      logger.error(`Произошла ошибка: ${err}`);
      return next(err);
    }
    logger.info("Пользователь удалил пост");
    await res.redirect("/posts");
  });
};

exports.updateForm = (req, res) => {
  const entryId = req.params.id;
  Entry.getEntryById(entryId, async (err, entry) => {
    if (err) {
      logger.error(`Произошла ошибка: ${err}`);
      return res.redirect("posts");
    }
    logger.info("Пользователь зашёл на страницу обновления поста");
    await res.render("update", { title: "Изменение поста", entry: entry });
  });
};

exports.updateSubmit = async (req, res, next) => {
  const entryId = req.params.id;
  const newData = {
    title: req.body.entry.title,
    content: req.body.entry.content,
  };

  Entry.update(entryId, newData, (err) => {
    if (err) {
      logger.error(`Произошла ошибка: ${err}`);
      return next(err);
    }
  });
  logger.info("Пользователь изменил пост");
  await res.redirect("/posts");
};
