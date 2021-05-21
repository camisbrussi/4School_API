import dotenv from "dotenv";
import logger from "../logger";

require("dotenv").config();
dotenv.config();

import Adress from "../models/adress";
import City from "../models/city";

class AdressController {
  async store(req, res) {
    const { userlogged, iduserlogged } = req.headers;

    try {
      const { person_id, city_id, address, number, complement, district, cep } = req.body;
      await Adress.create({ person_id, city_id, address, number, complement, district, cep });

      logger.info({
        level: "info",
        message: `Endereço ${number} (id_person: ${person_id} ) registrado com sucesso`,
        label: `Registro - ${userlogged}@${iduserlogged}`,
      });

      return res.json({ success: "Registrado com sucesso" });
    } catch (e) {
      console.log(e)
      logger.error({
        level: "error",
        message: e.errors.map((err) => err.message),
        label: `Registro - ${userlogged}@${iduserlogged}`,
      });
      
      return res.json({
        success: 'Erro ao registrar endereço',
        erros: e.errors.map((err) => err.message),
      });
    }
  }

  async indexCity(req, res) {
    try {
      const city = await City.findAll({ 
        attributes: ['id', 'description']
      });
      res.json(city);
    } catch (e) {
      console.log(e);
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

export default new AdressController();
