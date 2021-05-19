import { Router } from "express";
import addressController from "../controllers/Address";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/:id", loginRequired, addressController.show);
router.get("/", loginRequired, addressController.indexCity);
//router.get("/filter/persons", loginRequired, personController.filter);
router.post("/", loginRequired, addressController.store);
//router.put("/:id", loginRequired, personController.update);
//router.delete("/:id", loginRequired, personController.delete);

export default router;
