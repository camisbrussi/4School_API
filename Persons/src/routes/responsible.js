import { Router } from "express";
import responsibleController from "../controllers/Responsible";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/:id", loginRequired, responsibleController.show);
router.get("/", loginRequired, responsibleController.index);
router.post("/", loginRequired, responsibleController.store);
router.put("/:id", loginRequired, responsibleController.update);
router.delete("/:id", loginRequired, responsibleController.delete);

export default router;