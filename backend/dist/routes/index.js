import { Router } from "express";
import RegisterController from "../controllers/Register.js";
const router = Router();
router.post("/auth/register", RegisterController.register);
export default router;
