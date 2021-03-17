"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize); 

 class activity_status extends _sequelize.Model { 
  static init(sequelize) { 
    super.init( 
      { 
        description: { 
          type: _sequelize2.default.STRING, 
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
} exports.default = activity_status; 

 

 

