import Person from "../models/person";
import Logger from "../logger";

class PersonController {
  async store(req, res) {
    try {
      const { type, name, cpf, email, birth_date } = req.body;

      await Person.create({ type, name, cpf, email, birth_date });

      Logger.info({ success: "Pessoa registrada com sucesso" });
      return res.json({ success: "Pessoa registrada com sucesso" });
    } catch (e) {
      Logger.error(e.errors.map((err) => err.message));
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    const persons = await Person.findAll({
      attributes: ["id", "type", "name", "cpf", "email", "birth_date"],
      order: ["name"],
    });
    res.json(persons);
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ["Missing ID"],
        });
      }

      const person = await Person.findByPk(id);
      if (!person) {
        return res.status(400).json({
          errors: ["Person does not exist"],
        });
      }
      return res.json(person);
    } catch (e) {
      Logger.error(e.errors.map((err) => err.message));
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ["Missing ID"],
        });
      }

      const person = await Person.findByPk(id);
      if (!person) {
        return res.status(400).json({
          errors: ["Person does not exist"],
        });
      }

      await person.update(req.body);
      Logger.info({ success: "Pessoa editada com sucesso" });
      return res.json({ success: "Editado com sucesso" });
    } catch (e) {
      Logger.error(e.errors.map((err) => err.message));
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    try {
      return res.json("Pessoa não pode ser inativa");
    } catch (e) {
      Logger.error(e.errors.map((err) => err.message));
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new PersonController();
