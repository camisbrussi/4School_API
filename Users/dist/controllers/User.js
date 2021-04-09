"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _user = require('../models/user'); var _user2 = _interopRequireDefault(_user);
var _logger = require('../logger'); var _logger2 = _interopRequireDefault(_logger);

class UserController {
  async store(req, res) {
    try {
      const { name, login, password } = req.body;

      const status_id = 1;
      await _user2.default.create({
        name,
        login,
        password,
        status_id,
      });

      _logger2.default.info({ success: "Usuário registrado com sucesso" });

      return res.json({ success: "Usuário registrado com sucesso" });
    } catch (e) {
      _logger2.default.error(e.errors.map((err) => err.message));
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
  async index(req, res) {
    try {
      const users = await _user2.default.findAll({
        order: ["status_id"],
      });
      _logger2.default.info({ success: "Usuário registrado com sucesso" });
      return res.json(users);
    } catch (e) {
      _logger2.default.error(e.errors.map((err) => err.message));
      return res.json(null);
    }
  }

  async show(req, res) {
    try {
      const user = await _user2.default.findByPk(req.params.id);
      return res.json(user);
    } catch (e) {
      _logger2.default.error(e.errors.map((err) => err.message));
      return res.json(null);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ["User does not exist"],
        });
      }
      const user = await _user2.default.findByPk(id);

      if (!user) {
        return res.status(400).json({
          errors: ["User does not exist"],
        });
      }

      const { name, login, password, status_id } = req.body;

      if (password) await user.update(req.body);
      else {
        await user.update({
          status_id,
          name,
          login,
        });
      }
      _logger2.default.info({ success: "Usuário registrado com sucesso" });
      return res.json({ success: "Usuário registrado com sucesso" });
    } catch (e) {
      _logger2.default.error(e.errors.map((err) => err.message))
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

      const user = await _user2.default.findByPk(id);
      if (!user) {
        return res.status(400).json({
          errors: ["User does not exist"],
        });
      }
      await user.update({ status_id: 2 });
      _logger2.default.info({ success: "Usuário inativo" });
      return res.json({success: "Usuário inativo"});
    } catch (e) {
      _logger2.default.error(e.errors.map((err) => err.message))
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

exports. default = new UserController();
