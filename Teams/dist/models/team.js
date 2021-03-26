"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize); 


 class team extends _sequelize.Model { 
  static init(sequelize) { 
    super.init( 
      { 
        teacher_id: {
          type: _sequelize2.default.INTEGER, 
          defaultValue: "",
         },
        status_id: { 
          type: _sequelize2.default.INTEGER, 
          defaultValue: "", 
        }, 
        name: { 
          type: _sequelize2.default.STRING(80), 
          defaultValue: "", 
          validate: { 
            len: { 
              args: [3, 80],
              msg: "Name field must be between 3 and 80 characters", 
            }, 
          }, 
        }, 
        year: { 
          type: _sequelize2.default.INTEGER, 
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
} exports.default = team; 