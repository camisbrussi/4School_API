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
              args: [2, 45],
              msg: "Name field must be between 3 and 45 characters",
            },
          },
        },
        login: {
          type: _sequelize2.default.STRING,
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
          type: _sequelize2.default.STRING,
          defaultValue: "",
        },
        password: {
          type: _sequelize2.default.VIRTUAL,
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
