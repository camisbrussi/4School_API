import Activity from "../models/activity";
import Logger from "../logger";

class ActivityController {
  async store(req, res) {
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

      await Activity.create({
        name,
        description,
        start,
        end,
        generate_certificate,
        vacancies,
        status_id,
      });
      Logger.info({ success: "Atividade registrada com sucesso" });
      return res.json({ success: "Atividade Registrada com sucesso" });
    } catch (e) {
      Logger.error(e.errors.map((err) => err.message));
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async index(req, res) {
    const activities = await Activity.findAll({
      attributes: ["id", "name", "start", "end", "status_id"],
      order: ["status_id", ["start", "desc"], ["name", "asc"]],
    });
    res.json(activities);
  }

  async show(req, res) {
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

      const activity = await Activity.findByPk(id);
      if (!activity) {
        return res.status(400).json({
          errors: ["Activity does not exist"],
        });
      }

      await activity.update(req.body);
      Logger.info({ success: "Atividade editada com sucesso" });
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
      Logger.info({ success: "Atividade inativa" });
      return res.json({ success: "Atividade inativa" });
    } catch (e) {
      Logger.error(e.errors.map((err) => err.message));
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new ActivityController();
