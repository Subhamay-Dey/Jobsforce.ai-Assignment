import { Router } from "express";
import JobListing from "../controllers/JobListing.js";
import { mockJobListings } from "../jobs/JobListing.js";
import axios from "axios";
const router = Router();
// Job Listing Route
router.get("/joblisting", JobListing.getJobListings);
// AI Interview Route
router.get("/ai-interview/:jobId", async (req, res) => {
    try {
        const { jobId } = req.params;
        console.log("Received jobId:", jobId);
        const job = mockJobListings.find((job) => job.id === jobId);
        console.log("JobId:", jobId);
        if (!job) {
            // console.log("Job not found for ID:", jobId);
            return res.status(404).json({ error: "Job not found" });
        }
        const jobInfo = {
            title: job.title,
            organization: job.organization,
            description: job.linkedin_org_description,
            seniority: job.seniority,
        };
        console.log("Job info:", jobInfo);
        // Call OpenAI API to generate questions
        const openAIResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an AI technical interviewer for software engineering positions.",
                },
                {
                    role: "user",
                    content: `Generate 10 LeetCode DSA questions for a ${jobInfo.seniority} ${jobInfo.title} position at ${jobInfo.organization}. 
                        Include 3 easy, 5 medium, and 2 hard questions. For each question, provide a title, difficulty, description, examples, and constraints.
                        The job description is: ${jobInfo.description}
                        INSTRUCTIONS: Do not change the name of the leetcode question, give the accurate title of the dsa question, and don't give leetcode premium questions, only the non-premium ones.
                        Format:
                        \`\`\`json
                        {
                          "questions": [
                            { "id": 1, "title": "Title", "difficulty": "easy", "description": "Desc", "examples": ["Ex1"], "constraints": ["C1"] },
                            { "id": 2, "title": "Title", "difficulty": "medium", "description": "Desc", "examples": ["Ex1"], "constraints": ["C1"] }
                          ]
                        }
                        \`\`\`
                        `,
                },
            ],
            temperature: 0.7,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_KEY}`,
                "Content-Type": "application/json",
            },
        });
        const responseText = openAIResponse.data.choices[0].message.content;
        const formattedResponse = responseText.match(/```json\n([\s\S]*?)\n```/)?.[1];
        if (!formattedResponse)
            throw new Error("Invalid AI response format");
        const generatedQuestions = JSON.parse(formattedResponse);
        return res.json({
            job: jobInfo,
            questions: generatedQuestions.questions,
        });
    }
    catch (error) {
        console.error("Error generating AI interview questions:", error);
        return res.status(500).json({
            error: "Failed to generate interview questions",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
export default router;
// import AuthController from "../controllers/AuthController.js";
// Auth Route
// router.post("/auth/login", AuthController.login);
