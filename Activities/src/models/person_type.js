import Sequelize, {Model} from "sequelize";

export default class person_type extends Model {
    static init(sequelize) {
        super.init(
            {
                description: {
                    type: Sequelize.STRING(80),
                    defaultValue: "",
                    unique: {
                        msg: "Description already exists",
                    },
                    validate: {
                        len: {
                            args: [2, 80],
                            msg: "Description field must be between 2 and 80 characters",
                        },
                    },
                },
            },
            {
                sequelize,
                freezeTableName: true,
            }
        );
        return this;
    }

    static associate(models) {
        this.hasMany(models.person, {foreignKey: 'type_id'});
    }
}