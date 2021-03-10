import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../models/user'
import User_status from '../models/user_status'


const models = [User, User_status];
const connection = new Sequelize(databaseConfig);

models.forEach(model => model.init(connection));
models.forEach(model => model.associate && model.associate(connection.models));