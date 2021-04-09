"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _person = require('../models/person'); var _person2 = _interopRequireDefault(_person);
var _logger = require('../logger'); var _logger2 = _interopRequireDefault(_logger);

class PersonController {
  async store(req, res) {
    try {
      const { type, name, cpf, email, birth_date } = req.body;

      await _person2.default.create({ type, name, cpf, email, birth_date });

      _logger2.default.info({ success: "Pessoa registrada com sucesso" });
      return res.json({ success: "Pessoa registrada com sucesso" });
    } catch (e) {
      _logger2.default.error(e.errors.map((err) => err.message));
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    const persons = await _person2.default.findAll({
      attributes: ["id", "type", "name", "cpf", "email", "birth_date"],
      order: ["name"],
    });
    res.json(persons);
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ["Missing ID"],
        });
      }

      const person = await _person2.default.findByPk(id);
      if (!person) {
        return res.status(400).json({
          errors: ["Person does not exist"],
        });
      }
      return res.json(person);
    } catch (e) {
      _logger2.default.error(e.errors.map((err) => err.message));
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ["Missing ID"],
        });
      }

      const person = await _person2.default.findByPk(id);
      if (!person) {
        return res.status(400).json({
          errors: ["Person does not exist"],
        });
      }

      await person.update(req.body);
      _logger2.default.info({ success: "Pessoa editada com sucesso" });
      return res.json({ success: "Editado com sucesso" });
    } catch (e) {
      _logger2.default.error(e.errors.map((err) => err.message));
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    try {
      return res.json("Pessoa não pode ser inativa");
    } catch (e) {
      _logger2.default.error(e.errors.map((err) => err.message));
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

exports. default = new PersonController();
