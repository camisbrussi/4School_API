import { Router } from "express";
import personController from "../controllers/Person";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/:id", loginRequired, personController.show);
router.get("/", loginRequired, personController.index);
router.get("/filter/persons", loginRequired, personController.filter);
router.post("/", loginRequired, personController.store);
router.put("/:id", loginRequired, personController.update);
router.delete("/:id", loginRequired, personController.delete);

export default router;
