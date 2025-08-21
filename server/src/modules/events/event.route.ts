import { Router } from "express";
import * as eventController from "./event.controller";
const router = Router();

router.get("/", eventController.getAllEvents);
router.post("/create-event", eventController.createEvent);
router.delete("/:id", eventController.deleteEvent);
router.put("/:id", eventController.updateEvent);

export default router;
