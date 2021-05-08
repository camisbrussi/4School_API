"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

 class user extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        status_id: {
          type: _sequelize2.default.INTEGER,
          defaultValue: "",
        },
        name: {
          type: _sequelize2.default.STRING,
          defaultValue: "",
          validate: {
            len: {
              args: [3, 80],
              msg: "Nome deve ter entre 3 e 50 caracteres",
            },
          },
        },
        login: {
          type: _sequelize2.default.STRING,
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
          type: _sequelize2.default.STRING,
          defaultValue: "",
        },
        password: {
          type: _sequelize2.default.VIRTUAL,
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
        user.password_hash = await _bcryptjs2.default.hash(user.password, 8);
      }
    });
    return this;
  }
  passwordIsValid(password) {
    return _bcryptjs2.default.compare(password, this.password_hash);
  }

  static associate(models){
    this.hasOne(models.user_status, { foreignKey: 'status_id'})
  }
} exports.default = user;
