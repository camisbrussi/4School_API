import Activity from "../models/activity";
import logger from "../logger";

class ActivityController {
  async store(req, res) {
    const { userlogged, iduserlogged } = req.headers;
    try {
      const {
        name,
        description,
        start,
        end,
        generate_certificate,
        vacancies,
      } = req.body;
      
      const status_id = 1;

      const newActivity = await Activity.create({
        name,
        description,
        start,
        end,
        generate_certificate,
        vacancies,
        status_id,
      });
      
      logger.info({
        level: "info",
        message: `Atividade ${newActivity.name} (id: ${newActivity.id} registrada com sucesso)`,
        label: `Registro - ${userlogged}@${iduserlogged}`,
      });

      return res.json({ success: "Atividade Registrada com sucesso" });
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
    const { userlogged, iduserlogged } = req.headers;
    const activities = await Activity.findAll({
      attributes: ["id", "name", "start", "end", "status_id"],
      order: ["status_id", ["start", "desc"], ["name", "asc"]],
    });
    res.json(activities);
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

      const activity = await Activity.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ["Activity does not exist"],
        });
      }

      return res.json(activity);
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

      const activity = await Activity.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ["Activity does not exist"],
        });
      }

      const newActivity = await activity.update(req.body);

      logger.info({
        level: "info",
        message: `Atividade id: ${activity.id}, nome: ${activity.name}, inicio ${activity.start}, fim ${activity.end}, vagas ${activity.vacancies}, certificado ${activity.generate_certificate} - (nome: ${newActivity.name}, inicio ${newActivity.start}, fim ${newActivity.end}, vagas ${newActivity.vacancies}, certificado ${newActivity.generate_certificate})`,
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

      const activity = await Activity.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ["Atividade não existe"],
        });
      }
      await activity.update({ status_id: 2 });
      
      logger.info({
        level: "info",
        message: `Atividade inativada com sucesso ${activity.name}`,
        label: `Inativação - ${userlogged}@${iduserlogged}`,
      });

      return res.json({ success: "Atividade inativa" });
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

export default new ActivityController();
