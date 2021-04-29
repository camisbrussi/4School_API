"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _user = require('../models/user'); var _user2 = _interopRequireDefault(_user);
var _logger = require('../logger'); var _logger2 = _interopRequireDefault(_logger);

class UserController {
  async store(req, res) {
    const { userlogged, iduserlogged } = req.headers;
    try {
      const { name, login, password } = req.body;

      const user = await _user2.default.findOne({
        where: { login }
      });

      if (user) {
        return res.status(400).json({
          error: ["Login já cadastrado"],
        });
      }

      const status_id = 1;
      const newUser = await _user2.default.create({
        name,
        login,
        password,
        status_id,
      });

      _logger2.default.info({
        level: "Info",
        message: `Usuário ${newUser.login} (id: ${newUser.id})  registrado com sucesso`,
        label: `Registro - ${userlogged}@${iduserlogged}`,
      });

      return res.json({ success: "Usuário registrado com sucesso" });
    } catch (e) {

      _logger2.default.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Registro - ${userlogged}@${iduserlogged}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    const { userlogged, iduserlogged } = req.headers;
    try {
      const users = await _user2.default.findAll({
        order: ["status_id"],
      });

      return res.json(users);
    } catch (e) {
      _logger2.default.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Listar - ${userlogged}@${iduserlogged}`,
      });

      return res.json(null);
    }
  }

  async show(req, res) {
    const { userlogged, iduserlogged } = req.headers;
    try {
      const user = await _user2.default.findByPk(req.params.id);

      return res.json(user);
    } catch (e) {
      _logger2.default.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Busca - ${userlogged}@${iduserlogged}`,
      });

      return res.json(null);
    }
  }

  async update(req, res) {
    const { userlogged, iduserlogged } = req.headers;
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

      let newData;

      if (password) newData = await user.update(req.body);
      else {
        newData = await user.update({
          status_id,
          name,
          login,
        });
      }

      _logger2.default.info({
        level: "info",
        message: `Usuário id: ${user.id}, login: ${user.login} editado com sucesso - (name: ${newData.name} - login: ${newData.login})`,
        label: `Edição - ${userlogged}@${iduserlogged}`,
      });

      return res.json({ success: "Usuário registrado com sucesso" });
    } catch (e) {
      _logger2.default.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Edição - ${userlogged}@${iduserlogged}`,
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

      const user = await _user2.default.findByPk(id);
      if (!user) {
        return res.status(400).json({
          errors: ["User does not exist"],
        });
      }
      await user.update({ status_id: 2 });

      _logger2.default.info({
        level: "info",
        message: `Usuário inativado com sucesso id: ${user.id}, login ${user.login}`,
        label: `Inativação - ${userlogged}@${iduserlogged}`,
      });

      return res.json({ success: "Usuário inativo" });
    } catch (e) {
      _logger2.default.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Inativação - ${userlogged}@${iduserlogged}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

exports. default = new UserController();
