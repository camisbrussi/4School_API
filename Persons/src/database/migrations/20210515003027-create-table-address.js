'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('address', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      person_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'person',
          key: 'id',
        },
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'city',
          key: 'id',
        },
      },
      address: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      number: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      complement: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      district: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      cep: {
        type: Sequelize.STRING(8),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('address');
  },
};
