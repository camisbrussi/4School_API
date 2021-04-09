import jwt from "jsonwebtoken";
import User from "../models/user";

class TokenController {
  async store(req, res) {
  
    const { login = "", password = "" } = req.body;

    if (!login || !password) {
      return res.status(401).json({
        errors: ["Credenciais inválidas"],
      });
    }
    const user = await User.findOne({ where: { login } });

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
    const token = jwt.sign({ id, login }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    res.json({ token, user: { id, login } });
  }

  async validate(req, res) {
    return res.json({success:'Token Válido'});
  }
}

export default new TokenController();
