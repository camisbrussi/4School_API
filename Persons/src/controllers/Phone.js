import dotenv from "dotenv";
import logger from "../logger";

require("dotenv").config();
dotenv.config();

import Phone from "../models/phone";

class PhoneController {
  async store(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const { person_id, number, is_whatsapp } = req.body;
      await Phone.create({ person_id, number, is_whatsapp });

      logger.info({
        level: "info",
        message: `Telefone ${number} (id_person: ${person_id} ) registrado com sucesso`,
        label: `Registro - ${userlogged}@${iduserlogged}`,
      });

      return res.json({ success: "Registrado com sucesso" });
    } catch (e) {
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
    try {
      const phones = await Phone.findAll();
      res.json(phones);
    } catch (e) {
    }
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

      const phone = await Phone.findByPk(id);
      if (!phone) {
        return res.status(400).json({
          errors: ["Phone does not exist"],
        });
      }
      return res.json(phone);
    } catch (e) {
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Busca - ${userlogged}@${iduserlogged}`,
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

      const phone = await Phone.findByPk(id);
      if (!phone) {
        return res.status(400).json({
          errors: ["Phone does not exist"],
        });
      }

      const { number, is_whatsapp } = req.body;
      const newData = await phone.update({ number, is_whatsapp });

      logger.info({
        level: "info",
        message: `Número id_pessoa: ${id}, número: ${phone.number}, whatsapp ${phone.is_whatsapp}, (número: ${newData.number}, whatsapp ${newData.is_whatsapp}})`,
        label: `Edição - ${userlogged}@${iduserlogged}`,
      });

      return res.json({ success: "Editado com sucesso" });
    } catch (e) {
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Edição - ${userlogged}@${iduserlogged}`,
      });
      
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

      const phone = await Phone.findByPk(id);
      if (!phone) {
        return res.status(400).json({
          errors: ["Phone does not exist"],
        });
      }
      await phone.destroy();

      logger.info({
        level: "info",
        message: `Telefone excluído com sucesso id_pessoa: ${id}, número: ${phone.number},`,
        label: `Exclusão - ${userlogged}@${iduserlogged}`,
      });

      return res.json("Phone deleted");
    } catch (e) {
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Exclusão, ${iduserlogged}, ${userlogged}`,
      });
      
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new PhoneController();
