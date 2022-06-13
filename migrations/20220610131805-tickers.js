'use strict';
module.exports = {
  
  async up (queryInterface, Sequelize) {
    return Promise.all([
    queryInterface.addColumn('tickers', 'symbol', { type: Sequelize.STRING, unique: false, }),
    queryInterface.addColumn('tickers', 'status', { type: Sequelize.INTEGER,  defaultValue: 0, }),
    
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('tickers', 'symbol'),
      queryInterface.removeColumn('tickers', 'status'),
     
    ])
  }
};