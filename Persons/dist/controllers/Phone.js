"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _logger = require('../logger'); var _logger2 = _interopRequireDefault(_logger);

require("dotenv").config();
_dotenv2.default.config();

var _phone = require('../models/phone'); var _phone2 = _interopRequireDefault(_phone);

class PhoneController {
  async store(req, res) {
    try {
      const { person_id, number, is_whatsapp } = req.body;
      await _phone2.default.create({ person_id, number, is_whatsapp });

      _logger2.default.info({ success: "Telefone registrado com sucesso" });
      return res.json({ success: "Registrado com sucesso" });
    } catch (e) {
      _logger2.default.error(e.errors.map((err) => err.message));
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    try {
      const phones = await _phone2.default.findAll();
      res.json(phones);
    } catch (e) {
      _logger2.default.error(e.errors.map((err) => err.message));
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

      const phone = await _phone2.default.findByPk(id);
      if (!phone) {
        return res.status(400).json({
          errors: ["Phone does not exist"],
        });
      }
      return res.json(phone);
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

      const phone = await _phone2.default.findByPk(id);
      if (!phone) {
        return res.status(400).json({
          errors: ["Phone does not exist"],
        });
      }

      const { number, is_whatsapp } = req.body;
      await phone.update({ number, is_whatsapp });

      return res.json({ success: "Editado com sucesso" });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ["Missing ID"],
        });
      }

      const phone = await _phone2.default.findByPk(id);
      if (!phone) {
        return res.status(400).json({
          errors: ["Phone does not exist"],
        });
      }
      await phone.destroy();
      return res.json("Phone deleted");
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

exports. default = new PhoneController();
