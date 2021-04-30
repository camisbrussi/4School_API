import User from "../models/user";
import logger from "../logger";

class UserController {
  async store(req, res) {
    const { userlogged, iduserlogged } = req.headers;
    try {
      let erros = [];
      const { name, login, password } = req.body;

      const user = await User.findOne({
        where: { login }
      });

      if (user) {
          erros.push("Login já cadastrado")
      }

      if (password.length < 5 || password.length > 50) {
        erros.push("Senha deve ser entre 6 e 50 caracteres")
      }

      if (erros.length) {
        return res.json({success: 'Erro ao registrar usuário', erros});
      }

      else {
      const status_id = 1;
      const newUser = await User.create({
        name,
        login,
        password,
        status_id,
      });

      logger.info({
        level: "Info",
        message: `Usuário ${newUser.login} (id: ${newUser.id})  registrado com sucesso`,
        label: `Registro - ${userlogged}@${iduserlogged}`,
      });

      return res.json({ success: "Usuário registrado com sucesso" });
     }
    }catch (e) {

      logger.error({
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
      const users = await User.findAll({
        order: ["status_id"],
      });

      return res.json(users);
    } catch (e) {
      logger.error({
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
      const user = await User.findByPk(req.params.id);

      return res.json(user);
    } catch (e) {
      logger.error({
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
      let erros = [];

      const { id } = req.params;

      if (!id) {
        logger.error({
          level: "error",
          message: ["Id Missing"],
          label: `Edição - ${userlogged}@${iduserlogged}`,
        });
        return res.status(400).json({
          errors: ["Id Missing"],
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        logger.error({
          level: "error",
          message: ["User does not exist"],
          label: `Edição - ${userlogged}@${iduserlogged}`,
        });
        return res.status(400).json({
          errors: ["User does not exist"],
        });
      }
      const { name, login, password, status_id } = req.body;

      const loginExists = await User.findOne({
        where: { login }
      });

    if(loginExists){
      if (loginExists && loginExists.login != user.login ) {
      erros.push("Login já cadastrado")
      }
  }

    if(password){
      if (password.length < 5 || password.length > 50) {
        console.log(password)
        erros.push("Senha deve ser entre 6 e 50 caracteres")
      }
    }

    if (erros.length) {
      return res.json({success: 'Erro ao editar usuário', erros});
    }
    else {
    let newData;

      if (password) newData = await user.update(req.body);
      else {
        newData = await user.update({
          status_id,
          name,
          login,
        });
      }

        logger.info({
          level: "info",
          message: `Usuário id: ${user.id}, login: ${user.login} editado com sucesso - (name: ${newData.name} - login: ${newData.login})`,
          label: `Edição - ${userlogged}@${iduserlogged}`,
        });
  
        return res.json({ success: "Usuário registrado com sucesso" });
      
      }
    } catch (e) {
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Edição - ${userlogged}@${iduserlogged}`,
      });
      console.log(error)
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

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(400).json({
          errors: ["User does not exist"],
        });
      }
      await user.update({ status_id: 2 });

      logger.info({
        level: "info",
        message: `Usuário inativado com sucesso id: ${user.id}, login ${user.login}`,
        label: `Inativação - ${userlogged}@${iduserlogged}`,
      });

      return res.json({ success: "Usuário inativo" });
    } catch (e) {
      logger.error({
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

export default new UserController();
