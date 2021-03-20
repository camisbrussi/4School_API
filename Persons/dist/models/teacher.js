"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

 class teacher extends _sequelize.Model {
    static init(sequelize) {
        super.init(
            {
                person_id: {
                    type: _sequelize2.default.INTEGER,
                    defaultValue: "",
                },
                status_id: {
                    type: _sequelize2.default.INTEGER,
                    defaultValue: "",
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
        this.hasOne(models.person, {foreignKey: 'person_id'});
        this.hasOne(models.teacher_status, {foreignKey: 'status_id'});
    }
} exports.default = teacher; 