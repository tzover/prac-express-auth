'use strict';

const express = require('express');
const User = require('../models/User');

const router = express.Router();

// ユーザー全件検索
router.get('/', async (req, res) => {
  // Sequelizeでユーザーを全件検索
  const users = await User.findAll();

  // レスポンスを返す
  res.json(users);
});

// ユーザー1件検索
router.get('/:username', async (req, res) => {
  // パスからユーザー名を取得
  const { username } = req.params;

  // ユーザーを1件検索
  const user = await User.findByPk(username);

  // レスポンスを返す
  res.json(user);
});

module.exports = router;
