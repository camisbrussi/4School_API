"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _Person = require('../controllers/Person'); var _Person2 = _interopRequireDefault(_Person);
var _person = require('./person'); var _person2 = _interopRequireDefault(_person);

 class teacher extends _sequelize.Model {
    static init(sequelize) {
        super.init(
            {
                /*person_id: {
                    type: Sequelize.INTEGER,
                    defaultValue: ""
                },
                status_id: {
                    type: Sequelize.INTEGER,
                    defaultValue: "",
                }*/
            },
            {
                sequelize,
                freezeTableName: true
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.person, {foreignKey:"person_id", as:"person"});
        this.belongsTo(models.teacher_status, {foreignKey:"status_id", as:"status"});
    }
} exports.default = teacher; 