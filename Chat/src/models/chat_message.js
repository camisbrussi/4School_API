import Sequelize, { Model } from "sequelize"; 

export default class chat_message extends Model { 
  static init(sequelize) { 
    super.init( 
      { 
        text:{
          type: Sequelize.STRING(4000),
          defaultValue: ""
        },
        user_id: {
          type: Sequelize.INTEGER, 
          defaultValue: null,
         },
         person_id: { 
          type: Sequelize.INTEGER, 
          defaultValue: "", 
        }, 
      }, 
      { 
        sequelize, 
        freezeTableName: true
      } 
    ); 
    return this; 
  } 
  static associate(models){ 
    this.belongsTo(models.user, {foreignKey:"user_id", as:"user"});
    this.belongsTo(models.person, {foreignKey:"person_id", as:"person"});
  } 
} 