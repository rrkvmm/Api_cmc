'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class symbols extends Model {
    static associate(models) {
      // define association here
    }
  }
  symbols.init({
    symbol: 
    {
      type    : DataTypes.STRING,
      unique  : { args:true, msg: 'Symbol already in use!' }
    },
    quantityPrecision: DataTypes.DECIMAL,
    pricePrecision: DataTypes.DECIMAL,
    baseAsset: DataTypes.STRING,
    quoteAsset: DataTypes.STRING,
    created_date: DataTypes.DATE,
  }, 
  {
    sequelize,
    modelName: 'symbols',
    hooks : {
      beforeCreate : (record, options) => {
          record.dataValues.created_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/g, '');
          record.dataValues.created_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/g, '');
      },
      beforeUpdate : (record, options) => {
          record.dataValues.created_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/g, '');
      }
  }
  },
  
  
  );
  return symbols;
};