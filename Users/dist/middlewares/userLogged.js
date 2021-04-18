"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _user = require('../models/user'); var _user2 = _interopRequireDefault(_user);

exports. default = async (req, res, next) => {
  const { userlogged } = req.headers;

  if(!userlogged){
    return res.status(401).json({
      errors: ['Necessário fazer login'],
    })
  }
  
  try{
    
    const user = await _user2.default.findOne({ where: { login: userlogged } });
    const { id }  = user;
    console.log(id)
    req.userId = id;
    console.log(userId)
    return next();
  } catch(e){
    console.log(e);
      return res.status(401).json({
      errors: ['Usuário inválido inválido'],
    })
  }

};