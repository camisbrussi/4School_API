import { Router } from "express";
import teamController from "../controllers/Team";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/:id", loginRequired, teamController.show);
router.get("/", loginRequired, teamController.index);
router.get("/students/:id", loginRequired, teamController.getStudents);
router.get("/filter/teams", loginRequired, teamController.filter);
router.get("/filterstudents/:id", loginRequired, teamController.filterStudents);
router.post("/", loginRequired, teamController.store);
router.post("/addstudents/:id", loginRequired, teamController.storeStudents);
router.put("/:id", loginRequired, teamController.update);
router.delete("/:id", loginRequired, teamController.delete);

export default router;
