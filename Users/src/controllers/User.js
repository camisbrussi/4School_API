import User from "../models/user";

class UserController {
  async store(req, res) {
    try {
      const { name, login, password } = req.body;
      console.log(name, login, password)

      const status_id = 1;
      await User.create({
        name,
        login, 
        password,
        status_id
      });
      
      return res.json({success:'Registrado com sucesso'});
    } catch (e) {
      console.log(e)
      return res.status(400).json({
        
        errors: e.errors.map((err) => err.message),
      });
    }
  }
  async index(req, res) {
    try {
      const users = await User.findAll();
      return res.json(users);
    } catch (e) {
      return res.json(null);
    }
  }

  async show(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      const { id, login } = user;
      return res.json({ id, login });
    } catch (e) {
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
      const userUpdated = await user.update(req.body);
      return res.json(userUpdated);
    } catch (e) {
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
      await user.update({status_id: 2});
      return res.json('User inactive');
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new UserController();