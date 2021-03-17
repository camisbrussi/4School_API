"use strict";
module.exports = { 
  up: (queryInterface, Sequelize) => { 
    return queryInterface.createTable('activity', {  
      id: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        autoIncrement: true, 
        primaryKey:true, 
      }, 
      status_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        references:  { 
          model: 'activity_status', 
          key: 'id' 
        }, 
        onDelete: 'NO ACTION', 
        onUpdate: 'NO ACTION' 
      }, 
      name:{ 
        type: Sequelize.STRING(80), 
        allowNull: false, 
      }, 
      description:{ 
        type: Sequelize.TEXT, 
        allowNull: true, 
      }, 
      start:{ 
        type: Sequelize.DATE, 
        allowNull: false, 
      }, 
      end:{ 
        type: Sequelize.DATE, 
        allowNull: false, 
      },
      generate_certificate:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      vacancies:{
        type: Sequelize.INTEGER,
        allowNull: true,
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
      return queryInterface.dropTable('activity'); 
  } 
}; 
