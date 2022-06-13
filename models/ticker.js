'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ticker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ticker.init({
    base_id      : DataTypes.BIGINT,
    quote_id     : DataTypes.BIGINT,
    last_price   : DataTypes.DECIMAL,
    base_volume  : DataTypes.DECIMAL,
    quote_volume : DataTypes.DECIMAL,
    isFrozen     : DataTypes.INTEGER,
    symbol       : DataTypes.STRING,
    status       : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ticker',
  });
  return ticker;
};