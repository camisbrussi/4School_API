import { Router } from "express";
import addressController from "../controllers/Address";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/", loginRequired, addressController.indexCity);

export default router;
