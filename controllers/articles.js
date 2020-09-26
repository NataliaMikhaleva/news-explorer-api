const Article = require('../models/article');
const NotFoundError = require('../errors/notfound-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getArticles = ((req, res, next) => {
  Article.find({})
    .then((articles) => {
      if (!articles.length) {
        throw new NotFoundError('Статьи отсутствуют');
      }
      res.send({ data: articles });
    })
    .catch(next);
});

module.exports.createArticle = ((req, res, next) => {
  const owner = req.user._id;
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => {
      res.send({ data: article });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // можно улучшить
        next(new NotFoundError('Невалидные данные'));
        return;
      }
      next(err);
    });
});

module.exports.deleteArticle = ((req, res, next) => {
  Article.findById(req.params.id)
    .then((article) => {
      if (article === null) {
        throw new NotFoundError('Статья отсутствует');
      }
      if (String(article.owner) !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалять статьи других пользователей');
      } else {
        article.remove().then((deletedArticle) => res.send(deletedArticle));
      }
    })
    .catch(next);
});
