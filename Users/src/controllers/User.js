import User from "../models/user";
import Logger from "../logger";

class UserController {
  async store(req, res) {
    try {
      const { name, login, password } = req.body;

      const status_id = 1;
      await User.create({
        name,
        login,
        password,
        status_id,
      });

      Logger.info({ success: "Usuário registrado com sucesso" });

      return res.json({ success: "Usuário registrado com sucesso" });
    } catch (e) {
      Logger.error(e.errors.map((err) => err.message));
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
  async index(req, res) {
    try {
      const users = await User.findAll({
        order: ["status_id"],
      });
      Logger.info({ success: "Usuário registrado com sucesso" });
      return res.json(users);
    } catch (e) {
      Logger.error(e.errors.map((err) => err.message));
      return res.json(null);
    }
  }

  async show(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      return res.json(user);
    } catch (e) {
      Logger.error(e.errors.map((err) => err.message));
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
      const user = await User.findByPk(id);

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
      Logger.info({ success: "Usuário registrado com sucesso" });
      return res.json({ success: "Usuário registrado com sucesso" });
    } catch (e) {
      Logger.error(e.errors.map((err) => err.message))
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

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(400).json({
          errors: ["User does not exist"],
        });
      }
      await user.update({ status_id: 2 });
      Logger.info({ success: "Usuário inativo" });
      return res.json({success: "Usuário inativo"});
    } catch (e) {
      Logger.error(e.errors.map((err) => err.message))
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new UserController();
