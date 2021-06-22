import { Router } from "express";
import messagesController from "../controllers/Messages";

import loginRequired from "../middlewares/loginRequired";

const routes = new Router();

routes.post("/chatmessages", messagesController.create);
routes.get("/chatmessages/:id", messagesController.showByUser);

export default routes;
