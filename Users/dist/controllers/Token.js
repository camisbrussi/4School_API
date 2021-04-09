"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _user = require('../models/user'); var _user2 = _interopRequireDefault(_user);

class TokenController {
  async store(req, res) {
  
    const { login = "", password = "" } = req.body;

    if (!login || !password) {
      return res.status(401).json({
        errors: ["Credenciais inválidas"],
      });
    }
    const user = await _user2.default.findOne({ where: { login } });

    if (!login || user.status_id === 2 || user.status_id === 3) {
      return res.status(401).json({
        errors: ["Credenciais inválidas"],
      });
    }

    if (!(await user.passwordIsValid(password))) {
      return res.status(401).json({
        errors: ["Credenciais inválidas"],
      });
    }

    if (user.id_status === 3) {
      return res.status(401).json({
        errors: ["Usuário Bloqueado"],
      });
    }

    const { id } = user;
    const token = _jsonwebtoken2.default.sign({ id, login }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    res.json({ token, user: { id, login } });
  }

  async validate(req, res) {
    return res.json({success:'Token Válido'});
  }
}

exports. default = new TokenController();
