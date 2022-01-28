'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const sequelize = require('../sequelize');
const User = require('../models/User');
const ClientError = require('../errors/ClientError');
const router = express.Router();

// ユーザー登録処理
router.post('/signup', async (req, res) => {
  // リクエストボディからユーザー名とパスワードを取得
  const { username, password } = req.body;

  // トランザクション開始
  await sequelize.transaction(async transaction => {
    // ユーザー名でユーザーを検索
    const existsUser = await User.findByPk(username, { transaction });

    // すでに存在するユーザーの場合は409エラーにする
    if (existsUser != null) {
      throw new ClientError(`ユーザー名「${username}」は既に存在します。`, 409);
    }

    // パスワードの値からハッシュ値を生成する
    const hash = await bcrypt.hash(password, 10);

    // データベースにユーザーを登録する
    await User.create({ username, password: hash }, { transaction });
  });

  // レスポンスを返す
  res.status(201);
  res.location(`${req.originalFullUrl}/${username}`);
  res.end();
});

// ログイン処理
router.post('/login', async (req, res) => {
  // リクエストボディからユーザー名とパスワードを取得
  const { username, password } = req.body;

  // ユーザーをユーザー名で検索
  const user = await User.findByPk(username);
  if (user == null) {
    throw new ClientError('IDもしくはパスワードが間違っています。', 400);
  }

  // ハッシュ値を比較
  const result = await bcrypt.compare(password, user.password);
  if (result === false) {
    throw new ClientError('IDもしくはパスワードが間違っています。', 400);
  }

  // ユーザー名を入れたJWTを生成する
  const jwt = jsonwebtoken.sign({ username }, 'piyo', {
    expiresIn: '1h',
  });

  // レスポンスを返す
  res.json({
    accessToken: jwt,
    username: user.username,
  });
});

module.exports = router;
