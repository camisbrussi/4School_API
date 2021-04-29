"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _person = require('./person'); var _person2 = _interopRequireDefault(_person);

 class student extends _sequelize.Model {
    static init(sequelize) {
        super.init(
            {},
            {
                sequelize,
                freezeTableName: true
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.person, {foreignKey:"person_id", as:"person"});
        this.belongsTo(models.responsible, {foreignKey:"responsible_id", as:"responsible"});
        this.belongsTo(models.student_status, {foreignKey:"status_id", as:"status"});
    }
} exports.default = student;