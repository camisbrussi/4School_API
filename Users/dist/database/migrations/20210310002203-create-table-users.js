"use strict";module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.createTable('user', { 
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
          model: 'user_status',
          key: 'id'
        },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
      },
      name:{
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      login:{
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true,
      },
      password_hash:{
        type: Sequelize.STRING(80),
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
    
      return queryInterface.dropTable('users');
     
  }
};
