import logger from "../logger";
import Sequelize from "sequelize";
import databaseConfig from "../config/database";
import User from "../models/user";
import User_status from "../models/user_status";
import Person from "../models/person";
import PersonType from "../models/person_type";
import Phone from "../models/phone";
import Responsible from "../models/responsible";
import Teacher from "../models/teacher";
import TeacherStatus from "../models/teacher_status";
import logger from "../logger";

const models = [User, User_status, Person, PersonType, Phone, Responsible, Teacher, TeacherStatus];
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

models.forEach((model) => model.init(connection));
models.forEach(
  (model) => model.associate && model.associate(connection.models)
);
