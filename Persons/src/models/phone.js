import Sequelize, {Model} from "sequelize";
import person from "./person";

export default class phone extends Model {
    static init(sequelize) {
        super.init(
            {
                number: {
                    type: Sequelize.STRING(11),
                    defaultValue: "",
                    validate: {
                        len: {
                            args: [10, 11],
                            msg: "Number field must be between 10 and 11 characters",
                        },
                    },
                },
                is_whatsapp: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: 0,
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
        this.belongsTo(models.person, {foreignKey: "person_id", as: "person"});
    }
} 