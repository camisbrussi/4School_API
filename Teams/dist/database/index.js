"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);
var _team = require('../models/team'); var _team2 = _interopRequireDefault(_team);
var _teacher = require('../models/teacher'); var _teacher2 = _interopRequireDefault(_teacher);
var _person = require('../models/person'); var _person2 = _interopRequireDefault(_person);
var _team_status = require('../models/team_status'); var _team_status2 = _interopRequireDefault(_team_status);


const models = [_team2.default, _teacher2.default, _team_status2.default, _person2.default];
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