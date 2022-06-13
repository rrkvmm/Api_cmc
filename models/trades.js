'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trades extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  trades.init({
    symbol: DataTypes.STRING,
    trade_id : DataTypes.BIGINT,
    base_volume : DataTypes.DECIMAL,
    quote_volume : DataTypes.DECIMAL,
    timestamp : DataTypes.STRING,
    type : DataTypes.STRING,
    status: DataTypes.INTEGER,
    price : DataTypes.DECIMAL,
  }, {
    sequelize,
    modelName: 'trades',
  });
  return trades;
};