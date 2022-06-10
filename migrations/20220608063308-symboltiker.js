'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
    queryInterface.removeColumn('symbol_tickers', 'symbol', { type: Sequelize.STRING, unique: true, }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn('symbol_tickers', 'symbol')])
  }
};