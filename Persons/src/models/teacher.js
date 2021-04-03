import Sequelize, {Model} from "sequelize";
import person from "./person";
import bcryptjs from "bcryptjs";

export default class teacher extends Model {
    static init(sequelize) {
        super.init(
            {
                password_hash: {
                    type: Sequelize.STRING(80),
                    defaultValue: ""
                },
                password: {
                    type: Sequelize.VIRTUAL,
                    defaultValue: "",
                    validate: {
                        len: {
                            args: [6, 50],
                            msg: "Password must be between 6 and 50 characters",
                        },
                    },
                }
            },
            {
                sequelize,
                freezeTableName: true
            }
        );
        this.addHook("beforeSave", async (teacher) => {
            if (teacher.password) {
                teacher.password_hash = await bcryptjs.hash(teacher.password, 8);
            }
        });
        return this;
    }

    passwordIsValid(password) {
        return bcryptjs.compare(password, this.password_hash);
    }

    static associate(models) {
        this.belongsTo(models.person, {foreignKey:"person_id", as:"person"});
        this.belongsTo(models.teacher_status, {foreignKey:"status_id", as:"status"});
    }
} 