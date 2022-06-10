'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
    
      queryInterface.changeColumn('symbols', 'created_date', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        
      }),
    
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn('symbols', 'created_date')])
  }
};