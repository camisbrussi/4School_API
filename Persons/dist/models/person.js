"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

 class person extends _sequelize.Model {
    static init(sequelize) {
        super.init(
            {
                type_id: {
                    type: _sequelize2.default.INTEGER,
                    defaultValue: "",
                },
                name: {
                    type: _sequelize2.default.STRING(80),
                    defaultValue: "",
                    validate: {
                        len: {
                            args: [3, 80],
                            msg: "Nome deve ter entre 3 e 50 caracteres",
                        },
                    },
                },
                cpf: {
                    type: _sequelize2.default.STRING(11),
                    defaultValue: "",
                    validate: {
                        len: {
                            args: [11, 11],
                            msg: "CPF deve ter 11 caracteres",
                        },
                    },
                },
                email: {
                    type: _sequelize2.default.STRING(100),
                    defaultValue: "",
                    validate: {
                        isEmail: {
                            msg: "Digite um Email válido",
                        },
                    },
                },
                birth_date: {
                    type: _sequelize2.default.DATE,
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
        this.hasOne(models.teacher, {foreignKey: "person_id"});
        this.hasOne(models.responsible, {foreignKey: "person_id"});
        this.hasOne(models.student, {foreignKey: "person_id"});
        this.hasMany(models.phone, {foreignKey: "person_id"});

        this.belongsTo(models.person_type, {foreignKey: "type_id", as:"type"});
    }
} exports.default = person; 