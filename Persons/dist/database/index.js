"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);
var _person = require('../models/person'); var _person2 = _interopRequireDefault(_person);
var _person_type = require('../models/person_type'); var _person_type2 = _interopRequireDefault(_person_type);
var _teacher = require('../models/teacher'); var _teacher2 = _interopRequireDefault(_teacher);
var _teacher_status = require('../models/teacher_status'); var _teacher_status2 = _interopRequireDefault(_teacher_status);
var _phone = require('../models/phone'); var _phone2 = _interopRequireDefault(_phone);

const models = [_person2.default, _person_type2.default, _teacher2.default, _teacher_status2.default, _phone2.default];
const connection = new (0, _sequelize2.default)(_database2.default);

models.forEach(model => model.init(connection));
models.forEach(model => model.associate && model.associate(connection.models));