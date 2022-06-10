'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coin_markets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      coin_id: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      name: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      symbol: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      slug: {
        type: Sequelize.STRING,
        defaultValue: "",
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
    await queryInterface.dropTable('coin_markets');
  }
};