import Sequelize, {Model} from "sequelize";


export default class activity_has_participant extends Model {
    static init(sequelize) {
        super.init(
            {
                activity_id: {
                    type: Sequelize.INTEGER,
                    defaultValue: "",
                },
                person_id: {
                    type: Sequelize.INTEGER,
                    defaultValue: "",
                },
                registration_date: {
                    type: Sequelize.DATE,
                    defaultValue: "",
                },
                number_tickets: {
                    type: Sequelize.INTEGER,
                    defaultValue: "1",
                },
                participation_date: {
                    type: Sequelize.DATE,
                    defaultValue: "",
                },
                number_participation: {
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
        this.belongsTo(models.activity, {foreignKey: "activity_id", as:"activity"});
        this.belongsTo(models.person, {foreignKey: "person_id", as:"person"});
    }
} 