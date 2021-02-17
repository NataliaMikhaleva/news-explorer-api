const { celebrate, Joi } = require('celebrate');
const { default: validator } = require('validator');
Joi.objectId = require('joi-objectid')(Joi);
const BadRequest = require('../errors/badrequest-err');

const validatorURL = (link) => {
  if (!validator.isURL(link)) {
    throw new BadRequest('urlIsNotValid');
  }
  return link;
};

const celebrateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const celebrateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

const celebrateCreateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validatorURL),
    image: Joi.string().required().custom(validatorURL),
  }),
});

const celebrateDeleteArticle = celebrate({
  params: Joi.object().keys({
    id: Joi.objectId(),
  }),
});

module.exports = {
  celebrateUser, celebrateLogin, celebrateCreateArticle, celebrateDeleteArticle,
};
