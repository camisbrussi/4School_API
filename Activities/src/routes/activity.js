import { Router } from "express";
import activityController from "../controllers/Activity";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/:id", activityController.show);
router.get("/", activityController.index);
router.post("/", activityController.store);
router.put("/:id",activityController.update);
router.delete("/:id", activityController.delete);

export default router;
