'use strict';
module.exports = {
  
  async up (queryInterface, Sequelize) {
    return Promise.all([
    queryInterface.addColumn('symbol_tickers', 'trading_pairs', { type: Sequelize.STRING, unique: false, }),
    queryInterface.addColumn('symbol_tickers', 'last_price', { type: Sequelize.DECIMAL, }),
    queryInterface.addColumn('symbol_tickers', 'lowest_ask', { type: Sequelize.DECIMAL,  }),
    queryInterface.addColumn('symbol_tickers', 'price_change_percent_24h', { type: Sequelize.DECIMAL,  }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('symbol_tickers', 'trading_pairs'),
      queryInterface.removeColumn('symbol_tickers', 'last_price'),
      queryInterface.removeColumn('symbol_tickers', 'lowest_ask'),
      queryInterface.removeColumn('symbol_tickers', 'price_change_percent_24h'),
    ])
  }
};