import { Router } from "express";
import taskRoutes from "../modules/tasks/task.route";
import userRoutes from "../modules/users/user.route";

export const router = Router();

router.use("/tasks", taskRoutes);
router.use("/users", userRoutes);
