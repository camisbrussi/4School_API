"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('user', 
    [
      {
        status_id: 1,
        name: 'Administrador do sistema',
        login: 'admin',
        password_hash: '$2a$08$tWkkGcFUvSVzDeVhIi1zgeLvOeD3GLCDl9wXwuTlExIEFPTIziPDa',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status_id: 2,
        name: 'Inativo',
        login: 'inactive',
        password_hash: '$2a$08$tWkkGcFUvSVzDeVhIi1zgeLvOeD3GLCDl9wXwuTlExIEFPTIziPDa',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status_id: 3,
        name: 'Bloqueado',
        login: 'block',
        password_hash: '$2a$08$tWkkGcFUvSVzDeVhIi1zgeLvOeD3GLCDl9wXwuTlExIEFPTIziPDa',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};