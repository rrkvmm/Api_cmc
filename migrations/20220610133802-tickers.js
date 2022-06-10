'use strict';
module.exports = {
  
  async up (queryInterface, Sequelize) {
    return Promise.all([
    queryInterface.changeColumn('tickers', 'base_id', {    type: Sequelize.BIGINT,
      defaultValue: 0,allowNull: true, }),
    queryInterface.changeColumn('tickers', 'quote_id', {   type: Sequelize.BIGINT,
      defaultValue: 0,allowNull: true, }),
    queryInterface.changeColumn('tickers', 'last_price', {  type: Sequelize.DECIMAL,
      defaultValue: 0,allowNull: true, }),
    queryInterface.changeColumn('tickers', 'base_volume', {  type: Sequelize.DECIMAL,
      defaultValue: 0,allowNull: true, }),
    queryInterface.changeColumn('tickers', 'quote_volume', {   type: Sequelize.DECIMAL,
      defaultValue: 0,allowNull: true,}),
    queryInterface.changeColumn('tickers', 'isFrozen', {  type: Sequelize.INTEGER,
      defaultValue: 0, allowNull: true, }),
    
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('tickers', 'base_id'),
      queryInterface.removeColumn('tickers', 'quote_id'),
      queryInterface.removeColumn('tickers', 'last_price'),
      queryInterface.removeColumn('tickers', 'base_volume'),
      queryInterface.removeColumn('tickers', 'quote_volume'),
      queryInterface.removeColumn('tickers', 'isFrozen'),
    ])
  }
};