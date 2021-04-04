"use strict";'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'responsible',
        'password_hash',
        {
          type: Sequelize.STRING(80),
          allowNull: false,
          after: 'person_id'
        }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('responsible', 'password');
  }
};
