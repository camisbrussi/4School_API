"use strict";module.exports = { 

  up: (queryInterface, Sequelize) => { 
    return queryInterface.createTable('team_status', {  

      id: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        autoIncrement: true, 
        primaryKey:true, 
      }, 

      description:{ 
        type: Sequelize.STRING(80), 
        allowNull: false, 
        unique: true, 
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

  down: (queryInterface) => {  
      return queryInterface.dropTable('team_status'); 
  } 
}; 