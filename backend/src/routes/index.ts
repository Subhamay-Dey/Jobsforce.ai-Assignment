import {Router} from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();

// Auth Route
router.post("/auth/login", AuthController.login);

export default router;