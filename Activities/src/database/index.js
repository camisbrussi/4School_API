import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Activity from '../models/activity'
import Activity_status from '../models/activity_status'

const models = [Activity, Activity_status];
const connection = new Sequelize(databaseConfig);

models.forEach(model => model.init(connection));
models.forEach(model => model.associate && model.associate(connection.models));