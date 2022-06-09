'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
    
      queryInterface.addColumn('symbols', 'created_date', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      }),
    
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn('symbols', 'created_date')])
  }
};


