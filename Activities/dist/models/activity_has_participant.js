"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);


 class activity_has_participant extends _sequelize.Model {
    static init(sequelize) {
        super.init(
            {
                activity_id: {
                    type: _sequelize2.default.INTEGER,
                    defaultValue: "",
                },
                person_id: {
                    type: _sequelize2.default.INTEGER,
                    defaultValue: "",
                },
                registration_date: {
                    type: _sequelize2.default.DATE,
                    defaultValue: "",
                },
                number_tickets: {
                    type: _sequelize2.default.INTEGER,
                    defaultValue: "1",
                },
                participation_date: {
                    type: _sequelize2.default.DATE,
                    defaultValue: "",
                },
                number_participation: {
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

    static associate(models) {
        this.belongsTo(models.activity, {foreignKey: "activity_id", as:"activity"});
        this.belongsTo(models.person, {foreignKey: "person_id", as:"person"});
    }
} exports.default = activity_has_participant; 