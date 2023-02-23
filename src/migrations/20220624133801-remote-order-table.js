'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.dropTable('Orders'),

  down: (queryInterface, Sequelize) =>
    queryInterface.createTable('Orders', {
      transactionHash: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      chainId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      used: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      source: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
};
