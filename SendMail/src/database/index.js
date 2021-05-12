import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import Registration from '../models/Registration';
import Event from '../models/Event'
import Customer from '../models/Customer';
import Registration_log from '../models/Registration_log'

const models = [Registration, Event, Customer,Registration_log];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));

Registration.associate(connection.models);
Event.associate(connection.models);
Customer.associate(connection.models);
Registration_log.associate(connection.models);

