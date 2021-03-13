import Sequelize, { Model } from "sequelize";
import bcryptjs from "bcryptjs";

export default class user extends Model {
  static init(sequelize) {
    super.init(
      {
        status_id: {
          type: Sequelize.INTEGER,
          defaultValue: "",
        },
        name: {
          type: Sequelize.STRING,
          defaultValue: "",
          validate: {
            len: {
              args: [2, 45],
              msg: "Name field must be between 3 and 45 characters",
            },
          },
        },
        login: {
          type: Sequelize.STRING,
          defaultValue: "",
          unique: {
            msg: "Login already exists",
          },
          validate: {
            len: {
              args: [2, 45],
              msg: "Login field must be between 3 and 255 characters",
            },
          },
        },
        password_hash: {
          type: Sequelize.STRING,
          defaultValue: "",
        },
        password: {
          type: Sequelize.VIRTUAL,
          defaultValue: "",
          validate: {
            len: {
              args: [6, 45],
              msg: "Password must be between 6 and 50 characters",
            },
          },
        },
      },
      {
        sequelize,
        freezeTableName: true,
      }
    );
    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcryptjs.hash(user.password, 8);
      }
    });
    return this;
  }
  passwordIsValid(password) {
    return bcryptjs.compare(password, this.password_hash);
  }

  static associate(models){
    this.hasOne(models.user_status, { foreignKey: 'status_id'})
  }
}
