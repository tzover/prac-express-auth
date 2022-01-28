'use strict';

const express = require('express');
require('express-async-errors');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet');
const expressJwt = require('express-jwt');

const ClientError = require('./errors/ClientError');
const indexRouter = require('./routes');
const articlesRouter = require('./routes/articles');
const usersRouter = require('./routes/users');

const originalFullUrl = require('./originalFullUrl');

const app = express();

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(originalFullUrl);

// 全てのリクエストでJWTを検証する;
app.use(
  expressJwt({
    secret: 'piyo',
    algorithms: ['HS256'],
  }).unless({
    // ただし、以下のURLはJWTを検証しない
    path: ['/api/signup', '/api/login'],
  })
);

app.use('/api', indexRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/users', usersRouter);

// エラーハンドラー
app.use((err, req, res, next) => {
  console.error(err);

  // 認証エラー
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: {
        statusCode: 401,
        message: 'ログインしてください。',
      },
    });
    return;
  }

  // 独自例外を発生させた場合の処理
  if (err instanceof ClientError) {
    res.status(err.statusCode);
    res.json({
      error: {
        statusCode: err.statusCode,
        message: err.message,
      },
    });
    return;
  }

  // 想定外のエラーの時の処理
  res.status(500);
  res.json({
    error: {
      statusCode: 500,
      message: '想定外のエラーが発生しました。',
    },
  });
});

module.exports = app;
