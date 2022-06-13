'use strict';
module.exports = {
  
  async up (queryInterface, Sequelize) {
    return Promise.all([
    queryInterface.addColumn('trades', 'price', { type: Sequelize.DECIMAL, defaultValue: 0, }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('trades', 'price'),
   
     
    ])
  }
};