import Sequelize, {Model} from "sequelize";


export default class activity extends Model {
    static init(sequelize) {
        super.init(
            {
                status_id: {
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
                description: {
                    type: Sequelize.TEXT,
                    defaultValue: " ",
                },
                start: {
                    type: Sequelize.DATE,
                    defaultValue: "",
                },
                end: {
                    type: Sequelize.DATE,
                    defaultValue: "",
                },
                generate_certificate: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: "",
                },
                vacancies: {
                    type: Sequelize.INTEGER,
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
        this.belongsTo(models.activity_status, {foreignKey: "status_id", as:"status"});
        // this.hasOne(models.activity_status, {foreignKey: 'status_id'})

        this.hasMany(models.activity_has_participant, {foreignKey: "activity_id"});
    }
} 