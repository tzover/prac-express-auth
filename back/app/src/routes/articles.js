'use strict';

const express = require('express');
const { Op } = require('sequelize');
const Article = require('../models/Article');
const ClientError = require('../errors/ClientError');

const router = express.Router();

router
  .route('/')
  // 記事の複数件検索
  .get(async (req, res) => {
    // 検索結果が存在しない場合は、空文字を検索条件にする
    const criteria = req.query.criteria || '';

    // Sequelizeを使って記事を検索する
    const articles = await Article.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${criteria}%`,
            },
          },
          {
            text: {
              [Op.like]: `%${criteria}%`,
            },
          },
        ],
      },
      order: [['id', 'DESC']],
    });

    // レスポンスを返す
    res.json(articles);
  })
  .post(async (req, res) => {
    // 記事の登録処理

    // リクエストボディからタイトルと本文を取得
    const { title, text } = req.body;
    // JWTからユーザー名を取得
    const { username } = req.user;

    // Sequelizeを使って記事を登録
    const article = await Article.create({ username, title, text });

    // レスポンスを返す
    res.status(201);
    res.location(`${req.originalFullUrl}/${article.id}`);
    res.json(article);
  });

router
  .route('/:id')
  .get(async (req, res) => {
    // パスからIDを取得
    const id = Number(req.params.id);

    // Sequelizeを利用して記事を1件検索
    const article = await Article.findByPk(id);

    // レスポンスを返す
    res.json(article);
  })
  .put(async (req, res) => {
    // パスからIDを取得
    const id = Number(req.params.id);
    // リクエストボディからタイトルと本文を取得
    const { title, text } = req.body;
    // JWTからユーザー名を取得
    const { username } = req.user;

    // Sequelizeを利用してすでに存在する記事を取得
    let article = await Article.findByPk(id);

    // 記事が存在しない場合はエラー
    if (article == null) {
      throw new ClientError(`ID ${id}の投稿が見つかりません。`, 404);
    }
    // 記事のユーザー名とJWTのユーザー名が異なる場合はエラー
    if (username !== article.username) {
      throw new ClientError(
        `ID ${id}の投稿者ではないので更新できません。`,
        403
      );
    }

    // Sequelizeを利用して記事を更新
    article = await Article.update(
      { id, username, title, text },
      {
        where: {
          id,
        },
      }
    );

    // レスポンスを返す
    res.json(article);
  })
  .delete(async (req, res) => {
    // パスからIDを取得
    const id = Number(req.params.id);
    // JWTからユーザー名を取得
    const { username } = req.user;

    // Sequelizeを利用してすでに存在する記事を取得
    const article = await Article.findByPk(id);

    // 記事が存在しない場合はエラー
    if (article == null) {
      throw new ClientError(`ID ${id}の投稿が見つかりません。`, 404);
    }
    // 記事のユーザー名とJWTのユーザー名が異なる場合はエラー
    if (username !== article.username) {
      throw new ClientError(
        `ID ${id}の投稿者ではないので削除できません。`,
        403
      );
    }

    // Sequelizeを利用して記事を削除
    await Article.destroy({
      where: {
        id,
      },
    });

    // レスポンスを返す
    res.status(204);
    res.end();
  });

module.exports = router;
