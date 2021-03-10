
module.exports = { 
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('activity_status',  
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
  down: (queryInterface) => queryInterface.bulkDelete('activity_status', null, {}), 
}; 

