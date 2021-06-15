import Sequelize, {Model} from "sequelize";

export default class person extends Model {
    static init(sequelize) {
        super.init(
            {
                type_id: {
                    type: Sequelize.INTEGER,
                    defaultValue: "",
                },
                name: {
                    type: Sequelize.STRING(80),
                    defaultValue: "",
                    validate: {
                        len: {
                            args: [3, 80],
                            msg: "Nome deve ter entre 3 e 80 caracteres",
                        },
                    },
                },
                cpf: {
                    type: Sequelize.STRING(11),
                    defaultValue: "",
                    validate: {
                        len: {
                            args: [11, 11],
                            msg: "Digite um número de CPF válido",
                        },
                    },
                },
                email: {
                    type: Sequelize.STRING(100),
                    defaultValue: "",
                    validate: {
                        isEmail: {
                            msg: "Digite um Email válido",
                        },
                    },
                },
                birth_date: {
                    type: Sequelize.DATE,
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
        // this.hasOne(models.teacher, {foreignKey: "person_id"});
        // this.hasOne(models.responsible, {foreignKey: "person_id"});
        // this.hasOne(models.student, {foreignKey: "person_id"});
        this.hasMany(models.phone, {foreignKey: "person_id"});
        // this.hasMany(models.activity_has_participant, {foreignKey: "person_id"});

        // this.belongsTo(models.person_type, {foreignKey: "type_id", as:"type"});
    }
} 