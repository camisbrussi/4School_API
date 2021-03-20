import Sequelize, {Model} from "sequelize";
import Person from "../controllers/Person";
import person from "./person";

export default class teacher extends Model {
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
} 