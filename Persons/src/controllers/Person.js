import Person from "../models/person";
import logger from "../logger";

class PersonController {
  async store(req, res) {
    const { userlogged, iduserlogged } = req.headers;
    try {
      const { type, name, cpf, email, birth_date } = req.body;

      const newPerson = await Person.create({ type, name, cpf, email, birth_date });

      logger.info({
        level: "info",
        message: `Pessoa id: ${newPerson.id} login: ${newPerson.name} registrada com sucesso`,
        label: `Registrar, ${iduserlogged}, ${userlogged}`,
      });

      return res.json({ success: "Pessoa registrada com sucesso" });
    } catch (e) {
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Registrar, ${iduserlogged}, ${userlogged}`,
      });

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
    const { userlogged, iduserlogged } = req.headers;

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
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `${iduserlogged}, ${userlogged}`,
      });

      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) {
    const { userlogged, iduserlogged } = req.headers;

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

      const newData = await person.update(req.body);

      logger.info({
        level: "info",
        message: `Pessoa id: ${person.id}, nome: ${person.name}, cpf ${person.cpf}, email ${person.email}, data nascimento ${person.birth_date} - (nome: ${newData.name}, cpf ${newData.cpf}, email ${newData.email}, data nascimento ${newData.birth_date}})`,
        label: `Editar, ${iduserlogged}, ${userlogged}`,
      });

      return res.json({ success: "Editado com sucesso" });
    } catch (e) {
        logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Editar, ${iduserlogged}, ${userlogged}`,
      });
      
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    try {
      return res.json("Pessoa não pode ser inativa");
    } catch (e) {
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Deletar, ${iduserlogged}, ${userlogged}`,
      });
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new PersonController();
