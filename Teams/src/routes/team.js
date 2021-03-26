import { Router } from "express";
import teamController from "../controllers/Team";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/:id", loginRequired, teamController.show);
router.get("/", loginRequired, teamController.index);
router.post("/", loginRequired, teamController.store);
router.put("/:id", loginRequired, teamController.update);
router.delete("/:id", loginRequired, teamController.delete);

export default router;
