'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

class Article extends Model {}

Article.init(
  {
    username: DataTypes.STRING,
    title: DataTypes.STRING,
    text: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'article',
  },
);

module.exports = Article;
