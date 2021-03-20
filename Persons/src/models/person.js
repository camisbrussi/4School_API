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
                            msg: "Name field must be between 3 and 80 characters",
                        },
                    },
                },
                cpf: {
                    type: Sequelize.STRING(11),
                    defaultValue: "",
                    validate: {
                        len: {
                            args: [11, 11],
                            msg: "CPF field must be 11 characters",
                        },
                    },
                },
                email: {
                    type: Sequelize.STRING(100),
                    defaultValue: "",
                    validate: {
                        len: {
                            args: [5, 100],
                            msg: "E-mail field must be between 5 and 100 characters",
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
        this.hasOne(models.teacher, {foreignKey: "person_id"});

        this.belongsTo(models.person_type, {foreignKey: "type_id", as:"type"});
    }
} 