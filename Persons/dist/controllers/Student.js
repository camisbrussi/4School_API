"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _logger = require('../logger'); var _logger2 = _interopRequireDefault(_logger);

require("dotenv").config();
_dotenv2.default.config();

var _student = require('../models/student'); var _student2 = _interopRequireDefault(_student);
var _student_status = require('../models/student_status'); var _student_status2 = _interopRequireDefault(_student_status);
var _responsible = require('../models/responsible'); var _responsible2 = _interopRequireDefault(_responsible);
var _person = require('../models/person'); var _person2 = _interopRequireDefault(_person);
var _person_type = require('../models/person_type'); var _person_type2 = _interopRequireDefault(_person_type);
var _phone = require('../models/phone'); var _phone2 = _interopRequireDefault(_phone);
var _sequelize = require('sequelize');

class StudentController {
  async store(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const { responsible_id, name, cpf, email, birth_date, phones } = req.body;
      const type_id = process.env.STUDENT_PERSON_TYPE;
      const status_id = process.env.STUDENT_STATUS_ACTIVE;

      const person = await _person2.default.create({
        type_id,
        name,
        cpf,
        email,
        birth_date,
      });
      const person_id = person.id;
      await _student2.default.create({ person_id, responsible_id, status_id });

      if (phones) {
        phones.map((v, k) => {
          let { number, is_whatsapp } = v;
          _phone2.default.create({ person_id, number, is_whatsapp });
        });
      }
      
      _logger2.default.info({
        level: "info",
        message: `Estudante id: ${person_id} nome: ${name} registrado com sucesso`,
        label: `Registrar, ${iduserlogged}, ${userlogged}`,
      });

      return res.json({ success: "Registrado com sucesso" });
    } catch (e) {
      _logger2.default.error({
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
    const { userlogged, iduserlogged } = req.headers;

    try {
      const students = await _student2.default.findAll({
        attributes: ["id"],
        include: [
          {
            model: _person2.default,
            as: "person",
            attributes: ["id", "name", "cpf", "email", "birth_date"],
            include: [
              {
                model: _person_type2.default,
                as: "type",
                attributes: ["id", "description"],
              },
              {
                model: _phone2.default,
                as: "phones",
                attributes: ["id", "number", "is_whatsapp"],
              },
            ],
          },
          {
            model: _responsible2.default,
            as: "responsible",
            attributes: ["id"],
            include: [
              {
                model: _person2.default,
                as: "person",
                attributes: ["id", "name", "cpf", "email", "birth_date"],
                include: [
                  {
                    model: _person_type2.default,
                    as: "type",
                    attributes: ["id", "description"],
                  },
                  {
                    model: _phone2.default,
                    as: "phones",
                    attributes: ["id", "number", "is_whatsapp"],
                  },
                ],
              },
            ],
          },
          {
            model: _student_status2.default,
            as: "status",
            attributes: ["id", "description"],
          },
        ],
        order: ["status_id", [_person2.default, "name", "asc"]],
      });

      res.json(students);
    } catch (e) {
      _logger2.default.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Listar, ${iduserlogged}, ${userlogged}`,
      });
    }
  }

  async indexResponsible(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const { responsible_id } = req.params;
      if (!responsible_id) {
        return res.status(400).json({
          errors: ["Missing Responsible ID"],
        });
      }

      const students = await _student2.default.findAll({
        attributes: ["id"],
        where: { responsible_id },
        include: [
          {
            model: _person2.default,
            as: "person",
            attributes: ["id", "name", "cpf", "email", "birth_date"],
            include: [
              {
                model: _person_type2.default,
                as: "type",
                attributes: ["id", "description"],
              },
              {
                model: _phone2.default,
                as: "phones",
                attributes: ["id", "number", "is_whatsapp"],
              },
            ],
          },
          {
            model: _responsible2.default,
            as: "responsible",
            attributes: ["id"],
            include: [
              {
                model: _person2.default,
                as: "person",
                attributes: ["id", "name", "cpf", "email", "birth_date"],
                include: [
                  {
                    model: _person_type2.default,
                    as: "type",
                    attributes: ["id", "description"],
                  },
                  {
                    model: _phone2.default,
                    as: "phones",
                    attributes: ["id", "number", "is_whatsapp"],
                  },
                ],
              },
            ],
          },
          {
            model: _student_status2.default,
            as: "status",
            attributes: ["id", "description"],
          },
        ],
        order: ["status_id", [_person2.default, "name", "asc"]],
      });

      res.json(students);
    } catch (e) {
      _logger2.default.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Buscar, ${iduserlogged}, ${userlogged}`,
      });
    }
  }

  async indexFilter(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      let {status_id, name, cpf, yearBirth} = req.query;

      let whereStudent = {};
      let whereStudentPerson = {};

      if (status_id)
        whereStudent.status_id = status_id;

      if (name)
        whereStudentPerson.name = {[_sequelize.Op.substring] : name};
      if (cpf)
        whereStudentPerson.cpf = cpf;
      if (yearBirth)
        whereStudentPerson.birth_date = {[_sequelize.Op.between] : [yearBirth+"-01-01", yearBirth+"-12-31"]}

      const students = await _student2.default.findAll({
        attributes: ["id"],
        where: whereStudent,
        include: [
          {
            model: _person2.default,
            as: "person",
            attributes: ["id", "name", "cpf", "email", "birth_date"],
            where: whereStudentPerson,
            include: [
              {
                model: _person_type2.default,
                as: "type",
                attributes: ["id", "description"],
              },
              {
                model: _phone2.default,
                as: "phones",
                attributes: ["id", "number", "is_whatsapp"],
              },
            ],
          },
          {
            model: _responsible2.default,
            as: "responsible",
            attributes: ["id"],
            include: [
              {
                model: _person2.default,
                as: "person",
                attributes: ["id", "name", "cpf", "email", "birth_date"],
                include: [
                  {
                    model: _person_type2.default,
                    as: "type",
                    attributes: ["id", "description"],
                  },
                  {
                    model: _phone2.default,
                    as: "phones",
                    attributes: ["id", "number", "is_whatsapp"],
                  },
                ],
              },
            ],
          },
          {
            model: _student_status2.default,
            as: "status",
            attributes: ["id", "description"],
          },
        ],
        order: ["status_id", [_person2.default, "name", "asc"]],
      });

      res.json(students);
    } catch (e) {
      _logger2.default.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Buscar, ${iduserlogged}, ${userlogged}`,
      });
    }
  }

  async show(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ["Missing ID"],
        });
      }

      const student = await _student2.default.findByPk(id, {
        attributes: ["id"],
        include: [
          {
            model: _person2.default,
            as: "person",
            attributes: ["id", "name", "cpf", "email", "birth_date"],
            include: [
              {
                model: _person_type2.default,
                as: "type",
                attributes: ["id", "description"],
              },
              {
                model: _phone2.default,
                as: "phones",
                attributes: ["id", "number", "is_whatsapp"],
              },
            ],
          },
          {
            model: _responsible2.default,
            as: "responsible",
            attributes: ["id"],
            include: [
              {
                model: _person2.default,
                as: "person",
                attributes: ["id", "name", "cpf", "email", "birth_date"],
                include: [
                  {
                    model: _person_type2.default,
                    as: "type",
                    attributes: ["id", "description"],
                  },
                  {
                    model: _phone2.default,
                    as: "phones",
                    attributes: ["id", "number", "is_whatsapp"],
                  },
                ],
              },
            ],
          },
          {
            model: _student_status2.default,
            as: "status",
            attributes: ["id", "description"],
          },
        ],
      });
      if (!student) {
        return res.status(400).json({
          errors: ["Student does not exist"],
        });
      }
      return res.json(student);
    } catch (e) {
      _logger2.default.error({
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

      const student = await _student2.default.findByPk(id);
      if (!student) {
        return res.status(400).json({
          errors: ["Student does not exist"],
        });
      }

      const person = await _person2.default.findByPk(student.person_id);
      if (!person) {
        Logger.error(e.errors.map((err) => err.message));
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
        isActive,
      } = req.body;
      const newData = await person.update({ name, cpf, email, birth_date });

      if (isActive !== undefined)
        status_id =
          isActive === true
            ? process.env.STUDENT_STATUS_ACTIVE
            : process.env.STUDENT_STATUS_INACTIVE;
      if (status_id) await student.update({ status_id });

      await _phone2.default.destroy({
        where: { person_id: person.id },
      });

      if (phones) {
        await phones.map((v, k) => {
          let { number, is_whatsapp } = v;
          _phone2.default.create({ person_id: person.id, number, is_whatsapp });
        });
      }

    _logger2.default.info({
        level: "info",
        message: `Estudante id: ${person.id}, nome: ${person.name}, cpf ${person.cpf}, email ${person.email}, data nascimento ${person.birth_date} - (nome: ${newData.name}, cpf ${newData.cpf}, email ${newData.email}, data nascimento ${newData.birth_date}})`,
        label: `Editar, ${iduserlogged}, ${userlogged}`,
      });

      return res.json({ success: "Editado com sucesso" });
    } catch (e) {
      _logger2.default.error({
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

      const student = await _student2.default.findByPk(id);
      const person = await _person2.default.findByPk(id);
      if (!student) {
        return res.status(400).json({
          errors: ["Student does not exist"],
        });
      }
      await student.update({ status_id: process.env.STUDENT_STATUS_INACTIVE });
      
      _logger2.default.info({
        level: "info",
        message: `Estudante inativado com sucesso id: ${id}, nome: ${person.name}`,
        label: `Deletar, ${iduserlogged}, ${userlogged}`,
      });
      
      return res.json("Student inactive");
    } catch (e) {
      _logger2.default.error({
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

exports. default = new StudentController();
