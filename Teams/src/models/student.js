import Sequelize, {Model} from "sequelize";
import person from "./person";

export default class student extends Model {
    static init(sequelize) {
        super.init(
            {},
            {
                sequelize,
                freezeTableName: true
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.person, {foreignKey:"person_id", as:"person"});
        this.belongsTo(models.responsible, {foreignKey:"responsible_id", as:"responsible"});
        this.belongsTo(models.student_status, {foreignKey:"status_id", as:"status"});

        this.hasMany(models.team_has_student, {foreignKey:"student_id"});
    }
}