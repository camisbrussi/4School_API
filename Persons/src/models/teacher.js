import Sequelize, {Model} from "sequelize";

export default class teacher extends Model {
    static init(sequelize) {
        super.init(
            {
                person_id: {
                    type: Sequelize.INTEGER,
                    defaultValue: "",
                },
                status_id: {
                    type: Sequelize.INTEGER,
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
        
        this.hasOne(models.teacher_status, {foreignKey: 'status_id'});
    }
} 