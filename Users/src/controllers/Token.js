import jwt from "jsonwebtoken";
import User from "../models/user";

class TokenController {
  async store(req, res) {
    const { login = "", password = "" } = req.body;

    if (!login || !password) {
      return res.status(401).json({
        errors: ["Invalid credentials"],
      });
    }
    const user = await User.findOne({ where: { login } });

    if (!login || login.id_status === 2) {
      return res.status(401).json({
        errors: ["Invalid credentials"],
      });
    }

    if (!(await user.passwordIsValid(password))) {
      return res.status(401).json({
        errors: ["Invalid credentials"],
      });
    }

    if (user.id_status === 3) {
      return res.status(401).json({
        errors: ["User blocked"],
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
