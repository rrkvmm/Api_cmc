'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
    
      queryInterface.addColumn('symbols', 'basename', {
        type: Sequelize.STRING,
        defaultValue: "",
        
      }),
      queryInterface.addColumn('symbols', 'quotename', {
        type: Sequelize.STRING,
        defaultValue: "",
        
      }),
      queryInterface.addColumn('symbols', 'base_id', {
        type: Sequelize.INTGER,
        defaultValue: 0,
        
      }),
      queryInterface.addColumn('symbols', 'quote_id', {
        type: Sequelize.INTGER,
        defaultValue: 0,
        
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn('symbols', 'created_date')])
  }
};