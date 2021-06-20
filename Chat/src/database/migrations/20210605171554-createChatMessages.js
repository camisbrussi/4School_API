module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.createTable('chat_message', { 
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey:true,
      },
      text:{
        type: Sequelize.STRING(4000),
        allowNull: false,
      },
      user_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references:  { 
          model: 'user', 
          key: 'id' 
        }, 
        onDelete: 'NO ACTION', 
        onUpdate: 'NO ACTION' 
      },
      person_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references:  { 
          model: 'person', 
          key: 'id' 
        }, 
        onDelete: 'NO ACTION', 
        onUpdate: 'NO ACTION' 
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
    
      return queryInterface.dropTable('chat_message');
  }
};
