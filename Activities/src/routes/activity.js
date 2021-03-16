import { Router } from "express";
import activityController from "../controllers/Activity";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/:id", loginRequired, activityController.show);
router.get("/", loginRequired, activityController.index);
router.post("/", loginRequired, activityController.store);
router.put("/:id", loginRequired, activityController.update);
router.delete("/:id", loginRequired, activityController.delete);

export default router;
