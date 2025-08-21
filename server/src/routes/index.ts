import { Router } from "express";
import taskRoutes from "../modules/tasks/task.route";
import userRoutes from "../modules/users/user.route";
import eventRoutes from "../modules/events/event.route";

export const router = Router();

router.use("/tasks", taskRoutes);
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
