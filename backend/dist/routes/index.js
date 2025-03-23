import { Router } from "express";
import JobListing from "../controllers/JobListing.js";
import { AiInterview } from "../controllers/AiInterview.js";
const router = Router();
// Job Listing Route
router.get("/joblisting", JobListing.getJobListings);
// AI Interview Route
router.get("/ai-interview/:jobId", AiInterview.getAiInterviewQuestions);
export default router;
// Auth Route
// router.post("/auth/login", AuthController.login);
