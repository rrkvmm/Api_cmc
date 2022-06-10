'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coin_market extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  coin_market.init({
    coin_id: DataTypes.BIGINT,
    name: DataTypes.STRING,
    symbol: DataTypes.STRING,
    slug: DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'coin_market',
  });
  return coin_market;
};