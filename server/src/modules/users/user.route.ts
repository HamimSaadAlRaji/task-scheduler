import { Router } from "express";
import * as controller from "./user.controller";
import { AuthorizeUser } from "../../middlewares/auth.middleware";

const router = Router();
router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);
router.post("/logout", AuthorizeUser, controller.logoutUser);
router.get("/:id/stats", controller.getUserStats);

export default router;
