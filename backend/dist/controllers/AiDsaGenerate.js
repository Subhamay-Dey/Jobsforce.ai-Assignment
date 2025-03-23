import axios from "axios";
class AiDsaGenerate {
    static async generateQuestions(jobInfo) {
        try {
            const openAIResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
                model: "gpt-4-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI technical interviewer for software engineering positions."
                    },
                    {
                        role: "user",
                        content: `Generate 10 DSA LeetCode style questions for a ${jobInfo.seniority} ${jobInfo.title} position at ${jobInfo.organization}. 
                  Include 3 easy, 5 medium, and 2 hard questions. For each question, provide a title, difficulty, description, examples, and constraints.
                  The job description is: ${jobInfo.description}`
                    }
                ]
            }, {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
                    "Content-Type": "application/json"
                }
            });
            const generatedQuestions = openAIResponse.data.choices[0].message.content;
            console.log("Generated questions:", generatedQuestions);
            return JSON.parse(generatedQuestions);
        }
        catch (error) {
            console.error("Error calling AI API:", error);
            throw new Error("Failed to generate questions using AI API");
        }
    }
}
export default AiDsaGenerate;
