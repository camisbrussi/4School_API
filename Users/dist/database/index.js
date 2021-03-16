"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);
var _user = require('../models/user'); var _user2 = _interopRequireDefault(_user);
var _user_status = require('../models/user_status'); var _user_status2 = _interopRequireDefault(_user_status);


const models = [_user2.default, _user_status2.default];
const connection = new (0, _sequelize2.default)(_database2.default);

models.forEach(model => model.init(connection));
models.forEach(model => model.associate && model.associate(connection.models));