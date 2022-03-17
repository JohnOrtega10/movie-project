const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Review = sequelize.define('review', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true
  },

  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  comment: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'active'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = { Review };
