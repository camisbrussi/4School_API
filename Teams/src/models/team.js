import Sequelize, { Model } from "sequelize"; 


export default class team extends Model { 
  static init(sequelize) { 
    super.init( 
      { 
        teacher_id: {
          type: Sequelize.INTEGER, 
          defaultValue: "",
         },
        status_id: { 
          type: Sequelize.INTEGER, 
          defaultValue: "", 
        }, 
        name: { 
          type: Sequelize.STRING(80), 
          defaultValue: "", 
          validate: { 
            len: { 
              args: [3, 80],
              msg: "Name field must be between 3 and 80 characters", 
            }, 
          }, 
        }, 
        year: { 
          type: Sequelize.INTEGER, 
          defaultValue: " ",
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
    this.belongsTo(models.teacher, {foreignKey:"teacher_id", as:"teacher"});
    this.hasOne(models.team_status, { foreignKey: 'status_id'}) 
   
  } 
} 