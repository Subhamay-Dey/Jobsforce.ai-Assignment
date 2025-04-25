import { mockJobListings } from "../jobs/JobListing.js";
import AiDsaGenerate from "./AiDsaGenerate.js";
class AiInterview {
    static async getAiInterviewQuestions(req, res) {
        try {
            const { jobId } = req.params;
            const job = mockJobListings.find((job) => job.id === jobId);
            if (!job) {
                return res.status(404).json({ error: "Job not found" });
            }
            const jobInfo = {
                title: job.title,
                organization: job.organization,
                description: job.linkedin_org_description,
                seniority: job.seniority,
            };
            const questions = await AiDsaGenerate.generateQuestions(jobInfo);
            return res.json({
                job: jobInfo,
                questions
            });
        }
        catch (error) {
            console.error("Error generating AI interview questions:", error);
            res.status(500).json({
                error: "Failed to generate interview questions",
                details: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
}
export default AiInterview;
