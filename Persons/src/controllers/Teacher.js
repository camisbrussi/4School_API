import dotenv from "dotenv";
import logger from "../logger";

require("dotenv").config();
dotenv.config();

import Teacher from "../models/teacher";
import TeacherStatus from "../models/teacher_status";
import Person from "../models/person";
import PersonType from "../models/person_type";
import Phone from "../models/phone";

class TeacherController {
  async store(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const { name, cpf, email, birth_date, phones, password } = req.body;
      const type_id = process.env.TEACHER_PERSON_TYPE;
      const status_id = process.env.TEACHER_STATUS_ACTIVE;

      const person = await Person.create({
        type_id,
        name,
        cpf,
        email,
        birth_date,
      });
      const person_id = person.id;
      await Teacher.create({ person_id, status_id, password });

      if (phones) {
        phones.map((v, k) => {
          let { number, is_whatsapp } = v;
          Phone.create({ person_id, number, is_whatsapp });
        });
      }

      logger.info({
        level: "info",
        message: `Professor id: ${person.id} nome: ${person.name} registrado com sucesso`,
        label: `Registrar, ${iduserlogged}, ${userlogged}`,
      });

      return res.json({ success: "Registrado com sucesso" });
    } catch (e) {
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Registrar, ${iduserlogged}, ${userlogged}`,
      });
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    try {
      const teachers = await Teacher.findAll({
        attributes: ["id"],
        include: [
          {
            model: Person,
            as: "person",
            attributes: ["id", "name", "cpf", "email", "birth_date"],
            include: [
              {
                model: PersonType,
                as: "type",
                attributes: ["id", "description"],
              },
              {
                model: Phone,
                as: "phones",
                attributes: ["id", "number", "is_whatsapp"],
              },
            ],
          },
          {
            model: TeacherStatus,
            as: "status",
            attributes: ["id", "description"],
          },
        ],
        order: ["status_id", [Person, "name", "asc"]],
      });

      res.json(teachers);
    } catch (e) {
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Listar, ${iduserlogged}, ${userlogged}`,
      });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ["Missing ID"],
        });
      }

      const teacher = await Teacher.findByPk(id, {
        attributes: ["id", "status_id"],
        include: [
          {
            model: Person,
            as: "person",
            attributes: ["id", "name", "cpf", "email", "birth_date"],
            include: [
              {
                model: PersonType,
                as: "type",
                attributes: ["id", "description"],
              },
              {
                model: Phone,
                as: "phones",
                attributes: ["id", "number", "is_whatsapp"],
              },
            ],
          },
          {
            model: TeacherStatus,
            as: "status",
            attributes: ["id", "description"],
          },
        ],
      });
      if (!teacher) {
        return res.status(400).json({
          errors: ["Teacher does not exist"],
        });
      }
      return res.json(teacher);
    } catch (e) {
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Buscar, ${iduserlogged}, ${userlogged}`,
      });
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ["Missing ID"],
        });
      }

      const teacher = await Teacher.findByPk(id);
      if (!teacher) {
        return res.status(400).json({
          errors: ["Teacher does not exist"],
        });
      }

      const person = await Person.findByPk(teacher.person_id);
      if (!person) {
        return res.status(400).json({
          errors: ["Person does not exist"],
        });
      }

      let {
        status_id,
        name,
        cpf,
        email,
        birth_date,
        phones,
        password,
        isActive,
      } = req.body;

      if (isActive !== undefined)
        status_id =
          isActive === true
            ? process.env.TEACHER_STATUS_ACTIVE
            : process.env.TEACHER_STATUS_INACTIVE;
      if (status_id) await teacher.update({ status_id });

      if (password) {
        await teacher.update({ password });
      }
      const newData = await person.update({ name, cpf, email, birth_date });

      await Phone.destroy({
        where: { person_id: person.id },
      });

      if (phones) {
        await phones.map((v, k) => {
          let { number, is_whatsapp } = v;
          Phone.create({ person_id: person.id, number, is_whatsapp });
        });
      }
      
      logger.info({
        level: "info",
        message: `Professor id: ${person.id}, nome: ${person.name}, cpf ${person.cpf}, email ${person.email}, data nascimento ${person.birth_date} - (nome: ${newData.name}, cpf ${newData.cpf}, email ${newData.email}, data nascimento ${newData.birth_date}})`,
        label: `Editar, ${iduserlogged}, ${userlogged}`,
      });

      return res.json({ success: "Editado com sucesso" });
    } catch (e) {
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Editar, ${iduserlogged}, ${userlogged}`,
      });
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ["Missing ID"],
        });
      }

      const teacher = await Teacher.findByPk(id);
      const person = await Person.findByPk(id);
      if (!teacher) {
        return res.status(400).json({
          errors: ["Teacher does not exist"],
        });
      }
      await teacher.update({ status_id: process.env.TEACHER_STATUS_INACTIVE });
      
      logger.info({
        level: "info",
        message: `Professor inativado com sucesso id: ${id}, nome ${person.name}`,
        label: `Deletar, ${iduserlogged}, ${userlogged}`,
      });
      
      return res.json("Teacher inactive");
    } catch (e) {
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Deletar, ${iduserlogged}, ${userlogged}`,
      });
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new TeacherController();
