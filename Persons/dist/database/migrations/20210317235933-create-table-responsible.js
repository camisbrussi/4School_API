"use strict";'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('responsible', {

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
          key: 'id'
        },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('responsible');
  }
};
