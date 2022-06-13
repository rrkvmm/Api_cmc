'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      symbol: {
        type: Sequelize.STRING
      },
      trade_id: {
        type: Sequelize.BIGINT,
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
      timestamp: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      type: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      status: {
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
    await queryInterface.dropTable('trades');
  }
};