"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _logger = require('../logger'); var _logger2 = _interopRequireDefault(_logger);
var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);
var _team = require('../models/team'); var _team2 = _interopRequireDefault(_team);
var _teacher = require('../models/teacher'); var _teacher2 = _interopRequireDefault(_teacher);
var _person = require('../models/person'); var _person2 = _interopRequireDefault(_person);
var _team_status = require('../models/team_status'); var _team_status2 = _interopRequireDefault(_team_status);
var _team_has_student = require('../models/team_has_student'); var _team_has_student2 = _interopRequireDefault(_team_has_student);
var _student = require('../models/student'); var _student2 = _interopRequireDefault(_student);
var _student_status = require('../models/student_status'); var _student_status2 = _interopRequireDefault(_student_status);
var _responsible = require('../models/responsible'); var _responsible2 = _interopRequireDefault(_responsible);

const models = [_team2.default, _teacher2.default, _team_status2.default, _person2.default, _team_has_student2.default, _student2.default, _student_status2.default, _responsible2.default];
const connection = new (0, _sequelize2.default)(_database2.default);
connectionDb();

async function connectionDb() {
  try {
    await connection.authenticate();
  } catch (error) {

    _logger2.default.error({
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