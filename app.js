const { errors } = require('celebrate');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const limiter = require('./middlewares/limiter');
const users = require('./routes/users');
const articles = require('./routes/articles');
const NotFoundError = require('./errors/notfound-err');
const { createUser, login } = require('./controllers/users');
const { celebrateUser, celebrateLogin } = require('./middlewares/celebrate');

const auth = require('./middlewares/auth');

const app = express();

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect('mongodb://localhost:27017/news', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const { PORT = 3000 } = process.env;

const { requestLogger, errorLogger } = require('./middlewares/Logger');

app.use(cors());
app.use(requestLogger);

app.post('/signin', celebrateLogin, login);
app.post('/signup', celebrateUser, createUser);
app.use('/users', auth, users);
app.use('/articles', auth, articles);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен, порт : ${PORT}.`);
});
