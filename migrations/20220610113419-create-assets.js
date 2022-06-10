'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      unified_cryptoasset_id: {
        type: Sequelize.INTEGER
      },
      can_withdraw: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      can_deposit: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      min_withdraw: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      max_withdraw: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      maker_fee: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      taker_fee: {
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
    await queryInterface.dropTable('assets');
  }
};