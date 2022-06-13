'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tickers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      base_id: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      quote_id: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      last_price: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      base_volume: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      quote_volume: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      isFrozen: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('tickers');
  }
};