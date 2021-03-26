
module.exports = { 
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('team_status',  
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
    ], {}), 
  down: (queryInterface) => queryInterface.bulkDelete('team_status', null, {}), 
}; 

