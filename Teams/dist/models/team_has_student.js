"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);


 class team_has_student extends _sequelize.Model {
    static init(sequelize) {
        super.init(
            {
                student_id: {
                    type: _sequelize2.default.INTEGER,
                    defaultValue: "",
                },
                team_id: {
                    type: _sequelize2.default.INTEGER,
                    defaultValue: "",
                },
                start_date: {
                    type: _sequelize2.default.DATE,
                    defaultValue: "",
                },
                end_date: {
                    type: _sequelize2.default.DATE,
                    defaultValue: null,
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
        this.belongsTo(models.student, {foreignKey:"student_id", as:"student"});
        this.belongsTo(models.team, {foreignKey:"team_id", as:"team"});
    }
} exports.default = team_has_student; 