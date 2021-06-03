import User from '../models/user';
import logger from '../logger';

class UserController {
  async store(req, res) {
    const { userlogged } = req.headers;
    const userLogged = JSON.parse(userlogged);
    try {
      let erros = [];
      const { name, login, password } = req.body;

      const status_id = 1;

      const userExists = await User.findOne({
        where: { login },
      });

      if (userExists) {
        erros.push('Login já existe');
      }

      if (erros.length) {
        return res.json({ success: 'Erro ao registrar usuário', erros });
      } else {
        const newUser = await User.create({
          name,
          login,
          password,
          status_id,
        });

        logger.info({
          level: 'Info',
          message: `Usuário ${newUser.login} (id: ${newUser.id})  registrado com sucesso`,
          label: `Registro - ${userLogged.login}@${userLogged.id}`,
        });

        return res.json({ success: 'Usuário registrado com sucesso' });
      }
    } catch (e) {
      console.log(e);
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Registro - ${userlogged.login}@${userLogged.id}`,
      });
      return res.json({
        success: 'Erro ao registrar usuário',
        erros: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    try {
      const users = await User.findAll({
        order: ['status_id'],
      });

      return res.json(users);
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Erro ao Listar Usuários`,
      });

      return res.json(null);
    }
  }

  async show(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      return res.json(user);
    } catch (e) {
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Busca Usuário`,
      });

      return res.json(null);
    }
  }

  async update(req, res) {
    const { userlogged } = req.headers;
    const userLogged = JSON.parse(userlogged);
    try {
      
      let erros = [];
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({
          errors: ['Id Missing'],
        });
      }
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(400).json({
          errors: ['User does not exist'],
        });
      }
      
      let {
        status_id,
        name, 
        login, 
        password, 
        isActive,
      } = req.body;

      const loginExists = await User.findOne({
        where: { login },
      });

      if (loginExists && login != user.login) {
        erros.push('Login já existe');
      }

      if (erros.length) {
        return res.json({ success: 'Erro ao registrar usuário', erros });
      } else {
        if (isActive !== undefined)
        status_id =
          isActive === true
            ? process.env.USER_STATUS_ACTIVE
            : process.env.USER_STATUS_INACTIVE;

        if (status_id) await user.update({ status_id });

        if (password) await user.update({ password });

        const newData = await user.update({
            name,
            login,
          });

        logger.info({
          level: 'info',
          message: `Usuário id: ${user.id}, login: ${user.login} editado com sucesso - (name: ${newData.name} - login: ${newData.login})`,
          label: `Edição - ${userLogged.login}@${userLogged.id}`,
        });

        return res.json({ success: 'Usuário registrado com sucesso' });
      }
    } catch (e) {
      console.log(e);
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Edição - ${userLogged.login}@${userLogged.id}`,
      });
      return res.json({
        success: 'Erro ao registrar usuário',
        erros: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    const { userlogged } = req.headers;
    const userLogged = JSON.parse(userlogged);
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Missing ID'],
        });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(400).json({
          errors: ['User does not exist'],
        });
      }
      await user.update({ status_id: 2 });

      logger.info({
        level: 'info',
        message: `Usuário inativado com sucesso id: ${user.id}, login ${user.login}`,
        label: `Inativação - ${userLogged.login}@${userLogged.id}`,
      });

      return res.json({ success: 'Usuário inativo' });
    } catch (e) {
      console.log(e);
      logger.error({
        level: 'error',
        message: e.errors.map((err) => err.message),
        label: `Inativação - ${userlogged.login}@${userLogged.id}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new UserController();
