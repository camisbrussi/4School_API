import logger from "../logger";
import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Activity from '../models/activity'
import Activity_status from '../models/activity_status'
import ActivityHasParticipant from '../models/activity_has_participant'
import Person from '../models/person'
import PersonType from '../models/person_type'
import Phone from '../models/phone'

const models = [Activity, Activity_status, ActivityHasParticipant, Person, PersonType, Phone];
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