'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class symbol_ticker extends Model {
  static associate(models) {
     
    }
  }
  symbol_ticker.init({
    trading_pairs                : DataTypes.STRING,
    last_price                   :   DataTypes.DECIMAL,
    lowest_ask                   :    DataTypes.DECIMAL,
    price_change_percent_24h     :   DataTypes.DECIMAL,
    high:   DataTypes.DECIMAL,
    buy:    DataTypes.DECIMAL,
    sell:   DataTypes.DECIMAL,
    time:   DataTypes.DECIMAL,
    open:   DataTypes.DECIMAL,
    status: DataTypes.INTEGER,
  }, 
  {
    sequelize,
    modelName: 'symbol_ticker',
  });
  return symbol_ticker;
};