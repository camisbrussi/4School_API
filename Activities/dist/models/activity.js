"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize); 


 class activity extends _sequelize.Model { 
  static init(sequelize) { 
    super.init( 
      { 
        status_id: { 
          type: _sequelize2.default.INTEGER, 
          defaultValue: "", 
        }, 
        name: { 
          type: _sequelize2.default.STRING(80), 
          defaultValue: "", 
          validate: { 
            len: { 
              args: [2, 255], 
              msg: "Name field must be between 3 and 80 characters", 
            }, 
          }, 
        }, 
        description: { 
          type: _sequelize2.default.TEXT, 
          defaultValue: " ",
        }, 
        start: { 
          type: _sequelize2.default.DATE, 
          defaultValue: "", 
        }, 
        end: { 
          type: _sequelize2.default.DATE, 
          defaultValue: "",  
        },
        generate_certificate:{ 
          type: _sequelize2.default.BOOLEAN,
          defaultValue: "", 
        },
        vacancies:{
          type: _sequelize2.default.INTEGER,
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
} exports.default = activity; 