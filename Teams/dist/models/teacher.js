"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);


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
        this.hasMany(models.team, {foreignKey: "teacher_id"});
    }
} exports.default = teacher; 