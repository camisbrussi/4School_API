import logger from "../logger";
import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Activity from '../models/activity'
import Activity_status from '../models/activity_status'

const models = [Activity, Activity_status];
const connection = new Sequelize(databaseConfig);
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