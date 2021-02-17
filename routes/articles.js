const router = require('express').Router();
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');
const { celebrateCreateArticle, celebrateDeleteArticle } = require('../middlewares/celebrate');

router.get('/', getArticles);
router.post('/', celebrateCreateArticle, createArticle);
router.delete('/:id', celebrateDeleteArticle, deleteArticle);

module.exports = router;
