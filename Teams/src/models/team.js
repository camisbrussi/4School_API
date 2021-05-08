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
              msg: "Nome deve ter entre 3 e 80 caracteres", 
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
    this.belongsTo(models.team_status, {foreignKey:"status_id", as:"status"});
    // this.hasOne(models.team_status, { foreignKey: 'status_id'})

      this.hasMany(models.team_has_student, {foreignKey: "team_id"});
  } 
} 