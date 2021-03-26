"use strict";
module.exports = { 
  up: (queryInterface, Sequelize) => { 
    return queryInterface.createTable('team', {  
      id: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        autoIncrement: true, 
        primaryKey:true, 
      }, 
      teacher_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        references:  { 
          model: 'teacher', 
          key: 'id' 
        }, 
        onDelete: 'NO ACTION', 
        onUpdate: 'NO ACTION' 
      },
      status_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        references:  { 
          model: 'team_status', 
          key: 'id' 
        }, 
        onDelete: 'NO ACTION', 
        onUpdate: 'NO ACTION' 
      }, 
      name:{ 
        type: Sequelize.STRING(80), 
        allowNull: false, 
      }, 
      year:{ 
        type: Sequelize.INTEGER, 
        allowNull: false, 
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
      return queryInterface.dropTable('team'); 
  } 
}; 
