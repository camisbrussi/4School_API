import Sequelize, { Model } from "sequelize"; 


export default class activity extends Model { 
  static init(sequelize) { 
    super.init( 
      { 
        status_id: { 
          type: Sequelize.INTEGER, 
          defaultValue: "", 
        }, 
        name: { 
          type: Sequelize.STRING(80), 
          defaultValue: "", 
          validate: { 
            len: { 
              args: [2, 255], 
              msg: "Name field must be between 3 and 80 characters", 
            }, 
          }, 
        }, 
        description: { 
          type: Sequelize.TEXT, 
          defaultValue: "", 
          validate: { 
            len: { 
              args: [2, 255], 
              msg: "Login field must be between 3 and 65535 characters", 
            }, 
          }, 
        }, 
        start: { 
          type: Sequelize.DATE, 
          defaultValue: "", 
        }, 
        end: { 
          type: Sequelize.DATE, 
          defaultValue: "",  
        },
        generate_certificate:{ 
          type: Sequelize.BOOLEAN,
          defaultValue: "", 
        },
        vacancies:{
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
    this.hasOne(models.activity_status, { foreignKey: 'status_id'}) 
  } 
} 