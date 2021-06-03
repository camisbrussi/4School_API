import jwt from 'jsonwebtoken';
import User from '../models/user';
import Person from '../models/person';
import Teacher from '../models/teacher';
import Responsible from '../models/responsible';

class TokenController {
  async store(req, res) {
    const { login = '', password = '', type = '' } = req.body;

    if (!login || !password || !type) {
      return res.status(401).json({
        errors: ['Credenciais inválidas'],
      });
    }

    let user;
    let user_type = 0; //- Adm
    if (type == '1') {
      //- Administrador
      user = await User.findOne({ where: { login } });

      if (user == null || user.status_id === 2) {
        return res.status(401).json({
          errors: ['Credenciais inválidas'],
        });
      } else if (user.status_id === 3) {
        return res.status(401).json({
          errors: ['Usuário Bloqueado'],
        });
      }

      if (!(await user.passwordIsValid(password))) {
        return res.status(401).json({
          errors: ['Credenciais inválidas'],
        });
      }
    } else {
      user = await Person.findOne({ where: { cpf: login } });
      if (user == null) {
        return res.status(401).json({
          errors: ['Credenciais inválidas'],
        });
      }

      user_type = user.type_id;
      let person;
      if (user.type_id == process.env.TEACHER_PERSON_TYPE) {
        person = await Teacher.findOne({ where: { person_id: user.id } });
      } else if (user.type_id == process.env.RESPONSIBLE_PERSON_TYPE) {
        person = await Responsible.findOne({ where: { person_id: user.id } });
      }

      if (!(await person.passwordIsValid(password))) {
        return res.status(401).json({
          errors: ['Credenciais inválidas'],
        });
      }
    }

    const { id } = user; //- ID do Usuario ou da Pessoa
    const token = jwt.sign({ id, login }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    res.json({ token, user: { id, login, type: user_type } });
  }
  /*
    async validate(req, res) {
        return res.json({success: 'Token Válido'});
    }*/

  async validate(req, res) {
    const { authorization } = req.headers;

    const [, token] = authorization.split(' ');
    let user = '';
    let userId = '';
    let login = '';

    if (!token)
      return res
        .status(401)
        .json({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
      if (err)
        return res
          .status(500)
          .json({ auth: false, message: 'Failed to authenticate token.' });

      userId = decoded.id;
      login = decoded.login;
    });

    if (isNaN(login)) {
      user = await User.findByPk(userId);
      return res.json(user);
    } else {
      user = await Person.findByPk(userId);
      return res.json(user);
    }
  }
}

export default new TokenController();
