"use strict";module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('user_status', 
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
      {
        description: 'Bloqueado',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('user_status', null, {}),
};