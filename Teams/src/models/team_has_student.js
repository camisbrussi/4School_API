import Sequelize, {Model} from "sequelize";


export default class team_has_student extends Model {
    static init(sequelize) {
        super.init(
            {
                student_id: {
                    type: Sequelize.INTEGER,
                    defaultValue: "",
                },
                team_id: {
                    type: Sequelize.INTEGER,
                    defaultValue: "",
                },
                start_date: {
                    type: Sequelize.DATE,
                    defaultValue: "",
                },
                end_date: {
                    type: Sequelize.DATE,
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
} 