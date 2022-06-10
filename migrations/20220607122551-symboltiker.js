'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
    
      queryInterface.addColumn('symbol_tickers', 'symbol', {
        type: Sequelize.STRING,
     
        
      }),
      queryInterface.addColumn('symbol_tickers', 'status', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn('symbol_tickers', 'symbol'),queryInterface.removeColumn('symbol_tickers', 'status')])
  }
};