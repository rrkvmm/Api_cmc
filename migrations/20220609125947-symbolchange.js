'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
    queryInterface.addColumn('symbol_tickers', 'base_currency', { type: Sequelize.STRING, }),
    queryInterface.addColumn('symbol_tickers', 'quote_currency', { type: Sequelize.STRING, }),
    queryInterface.addColumn('symbol_tickers', 'base_volume', { type: Sequelize.DECIMAL,  }),
    queryInterface.addColumn('symbol_tickers', 'highest_bid', { type: Sequelize.DECIMAL,  }),
    queryInterface.addColumn('symbol_tickers', 'highest_price_24h', { type: Sequelize.DECIMAL,  }),
    queryInterface.addColumn('symbol_tickers', 'lowest_price_24h', { type: Sequelize.DECIMAL,  }),
    ]);
  },
  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('symbol_tickers', 'base_currency', { type: Sequelize.STRING, }),
      queryInterface.addColumn('symbol_tickers', 'quote_currency', { type: Sequelize.STRING, }),
      queryInterface.addColumn('symbol_tickers', 'base_volume', { type: Sequelize.DECIMAL,  }),
      queryInterface.addColumn('symbol_tickers', 'highest_bid', { type: Sequelize.DECIMAL,  }),
      queryInterface.addColumn('symbol_tickers', 'highest_price_24h', { type: Sequelize.DECIMAL,  }),
      queryInterface.addColumn('symbol_tickers', 'lowest_price_24h', { type: Sequelize.DECIMAL,  }),
    ])
  }
};