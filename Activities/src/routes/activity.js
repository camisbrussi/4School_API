import { Router } from "express";
import activityController from "../controllers/Activity";

import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/:id", loginRequired, activityController.show);
router.get("/", loginRequired, activityController.index);
router.get("/participants/:id", loginRequired, activityController.showParticipants);
router.get("/participants/teachers/:id", loginRequired, activityController.showParticipantsTeachers);
router.get("/subscriptions/:person_id", loginRequired, activityController.showParticipantSubscriptions);
router.get("/filter/subscriptions/:person_id", loginRequired, activityController.filterSubscriptions);
router.get("/vacanciesavailable/:id", loginRequired, activityController.vacanciesAvailable);
router.post("/", loginRequired, activityController.store);
router.post("/addparticipants/:id", loginRequired, activityController.storeParticipants);
router.put("/:id", loginRequired, activityController.update);
router.put("/confirmsubscription/:id", loginRequired, activityController.confirmSubscription);
router.delete("/:id", loginRequired, activityController.delete);
router.delete("/subscription/:subscriptionId", loginRequired, activityController.deleteSubscription);


export default router;
