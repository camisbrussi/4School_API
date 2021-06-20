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
              args: [3, 80],
              msg: "Nome deve ter entre 3 e 50 caracteres",
            },
          },
        },
        login: {
          type: Sequelize.STRING,
          defaultValue: "",
          unique: {
            msg: "Login já cadastrado",
          },
          validate: {
            len: {
              args: [2, 45],
              msg: "Login deve ter entre 3 e 50 caracteres",
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
              args: [6, 50],
              msg: "Senha deve ser entre 6 e 50 caracteres",
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
