import { Router } from "express";
import tokenController from "../controllers/Token";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.post("/", tokenController.store);
router.get("/validate", loginRequired, tokenController.validate);

export default router;
