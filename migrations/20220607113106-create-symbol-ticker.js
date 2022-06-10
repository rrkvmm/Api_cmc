'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('symbol_tickers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      symbol: {
        type: Sequelize.STRING
      },
      high: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      last: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      low: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      buy: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      sell: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      rose: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      time: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      open: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('symbol_tickers');
  }
};