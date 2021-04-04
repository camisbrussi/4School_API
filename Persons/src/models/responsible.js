import Sequelize, {Model} from "sequelize";
import person from "./person";
import bcryptjs from "bcryptjs";

export default class responsible extends Model {
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
        this.addHook("beforeSave", async (responsible) => {
            if (responsible.password) {
                responsible.password_hash = await bcryptjs.hash(responsible.password, 8);
            }
        });
        return this;
    }

    passwordIsValid(password) {
        return bcryptjs.compare(password, this.password_hash);
    }

    static associate(models) {
        this.belongsTo(models.person, {foreignKey:"person_id", as:"person"});
        this.hasMany(models.student, {foreignKey:"responsible_id", as:"student"})
    }
} 