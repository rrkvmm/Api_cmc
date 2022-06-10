'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
    queryInterface.removeColumn('symbol_tickers', 'high', { type: Sequelize.DECIMAL }),
    queryInterface.removeColumn('symbol_tickers', 'buy', { type: Sequelize.DECIMAL }),
    queryInterface.removeColumn('symbol_tickers', 'sell', { type: Sequelize.DECIMAL}),
    queryInterface.removeColumn('symbol_tickers', 'open', { type: Sequelize.DECIMAL}),
    ]);
  },

  async down (queryInterface, Sequelize) 
  {
    return Promise.all([
      queryInterface.removeColumn('symbol_tickers', 'high', { type: Sequelize.DECIMAL }),
      queryInterface.removeColumn('symbol_tickers', 'buy', { type: Sequelize.DECIMAL }),
      queryInterface.removeColumn('symbol_tickers', 'sell', { type: Sequelize.DECIMAL}),
      queryInterface.removeColumn('symbol_tickers', 'open', { type: Sequelize.DECIMAL}),
  ])
  }
  };
