import { Router } from "express";
import teacherController from "../controllers/Teacher";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/:id", loginRequired, teacherController.show);
router.get("/", loginRequired, teacherController.index);
router.post("/", loginRequired, teacherController.store);
router.put("/:id", loginRequired, teacherController.update);
router.delete("/:id", loginRequired, teacherController.delete);

export default router;