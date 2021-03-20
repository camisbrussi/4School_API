"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _person = require('./person'); var _person2 = _interopRequireDefault(_person);

 class phone extends _sequelize.Model {
    static init(sequelize) {
        super.init(
            {
                number: {
                    type: _sequelize2.default.STRING(11),
                    defaultValue: "",
                    validate: {
                        len: {
                            args: [10, 11],
                            msg: "Number field must be between 10 and 11 characters",
                        },
                    },
                },
                is_whatsapp: {
                    type: _sequelize2.default.BOOLEAN,
                    defaultValue: 0,
                }
            },
            {
                sequelize,
                freezeTableName: true
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.person, {foreignKey: "person_id", as: "person"});
    }
} exports.default = phone; 