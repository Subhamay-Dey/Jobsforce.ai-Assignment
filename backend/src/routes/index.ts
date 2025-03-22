import {Router} from "express";
import AuthController from "../controllers/AuthController.js";
import JobListing from "../controllers/JobListing.js";

const router = Router();

// Auth Route
// router.post("/auth/login", AuthController.login);

// Job Listing Route
router.get("/joblisting", JobListing.getJobListings);

export default router;