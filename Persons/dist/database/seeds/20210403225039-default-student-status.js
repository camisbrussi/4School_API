"use strict";'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('student_status',
      [
        {
          description: 'Ativo',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          description: 'Inativo',
          created_at: new Date(),
          updated_at: new Date()
        },
      ], {}
  ),
  down: (queryInterface) => queryInterface.bulkDelete('student_status', null, {})
};
