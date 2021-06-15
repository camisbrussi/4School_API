import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import message from '../models/message';
import person from '../models/person';
import phone from '../models/phone';

const models = [message, person, phone];


const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
models.forEach(model => model.associate && model.associate(connection.models));
// message.associate(connection.models);


