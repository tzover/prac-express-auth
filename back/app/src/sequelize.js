'use strict';

const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodejs_db', 'root', 'yt', {
  host: 'mysql',
  dialect: 'mysql',
  define: {
    // データベース側の列名をスネークケース(アンダースコア区切り)にする
    underscored: true,
  },
});

module.exports = sequelize;
