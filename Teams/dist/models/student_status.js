"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

 class student_status extends _sequelize.Model {
    static init(sequelize) {
        super.init(
            {
                description: {
                    type: _sequelize2.default.STRING(80),
                    defaultValue: "",
                    unique: {
                        msg: "Description already exists",
                    },
                    validate: {
                        len: {
                            args: [2, 80],
                            msg: "Description field must be between 2 and 80 characters",
                        },
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

    static associate(models) {
        this.hasMany(models.student, {foreignKey: "status_id"});
    }
} exports.default = student_status;