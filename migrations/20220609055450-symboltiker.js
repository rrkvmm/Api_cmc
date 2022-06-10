'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
    queryInterface.removeColumn('symbol_tickers', 'symbol', { type: Sequelize.STRING, unique: false, }),
    queryInterface.removeColumn('symbol_tickers', 'last', { type: Sequelize.DECIMAL }),
    queryInterface.removeColumn('symbol_tickers', 'low', { type: Sequelize.DECIMAL}),
    queryInterface.removeColumn('symbol_tickers', 'rose', { type: Sequelize.DECIMAL}),
    ]);
  },

  async down (queryInterface, Sequelize) 
  {
    return Promise.all([
      queryInterface.removeColumn('symbol_tickers', 'symbol', { type: Sequelize.STRING, unique: false, }),
      queryInterface.removeColumn('symbol_tickers', 'last', { type: Sequelize.DECIMAL }),
      queryInterface.removeColumn('symbol_tickers', 'low', { type: Sequelize.DECIMAL}),
      queryInterface.removeColumn('symbol_tickers', 'rose', { type: Sequelize.DECIMAL}),
  ])
  }
  };