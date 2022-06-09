'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('symbols', 'symbol', {
        type: Sequelize.STRING,
        unique:true,
      }),
      queryInterface.addColumn('symbols', 'quantityPrecision', {
        type: Sequelize.DECIMAL,
        defaultValue:0,
      }),
      queryInterface.addColumn('symbols', 'pricePrecision', {
        type: Sequelize.DECIMAL,
        defaultValue:0,
      }),
      queryInterface.addColumn('symbols', 'baseAsset', {
        type: Sequelize.STRING,
        defaultValue:"",
      }),
      queryInterface.addColumn('symbols', 'quoteAsset', {
        type: Sequelize.STRING,
        defaultValue:"",
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('symbols', 'symbol'),
      queryInterface.removeColumn('symbols', 'quantityPrecision'),
      queryInterface.removeColumn('symbols', 'pricePrecision'),
      queryInterface.removeColumn('symbols', 'baseAsset'),
      queryInterface.removeColumn('symbols', 'quoteAsset'),
  
  ]
    
    )
  }
};
