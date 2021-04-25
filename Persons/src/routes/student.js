import { Router } from "express";
import studentController from "../controllers/Student";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/:id", loginRequired, studentController.show);
router.get("/", loginRequired, studentController.index);
router.get("/responsible/:responsible_id", loginRequired, studentController.indexResponsible);
router.get("/filter/students", loginRequired, studentController.indexFilter);
router.post("/", loginRequired, studentController.store);
router.put("/:id", loginRequired, studentController.update);
router.delete("/:id", loginRequired, studentController.delete);

export default router;