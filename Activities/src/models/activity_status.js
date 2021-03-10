import Sequelize, { Model } from "sequelize"; 

export default class activity_status extends Model { 
  static init(sequelize) { 
    super.init( 
      { 
        description: { 
          type: Sequelize.STRING, 
          defaultValue: "", 
          unique: { 
            msg: "Description already exists", 
          }, 
        }, 
      }, 
      { 
        sequelize,
        freezeTableName: true, 
      } 
    ); 
    return this; 
  } 
} 

 

 

