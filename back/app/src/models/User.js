'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    password: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'user',
  },
);

module.exports = User;
