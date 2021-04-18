"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);
var _activity = require('../models/activity'); var _activity2 = _interopRequireDefault(_activity);
var _activity_status = require('../models/activity_status'); var _activity_status2 = _interopRequireDefault(_activity_status);

const models = [_activity2.default, _activity_status2.default];
const connection = new (0, _sequelize2.default)(_database2.default);
connectionDb();

async function connectionDb() {
  try {
    await connection.authenticate();
  } catch (error) {

    logger.error({
      level: 'error',
      message: error,
      label: `erro de conexão com o banco`
    });

    return res.status(400).json({
      errors: e.errors.map((err) => err.message),
    });
  }
}

models.forEach(model => model.init(connection));
models.forEach(model => model.associate && model.associate(connection.models));