import axios from "axios";

interface Question {
    id: number;
    title: string;
    difficulty: string;
    description: string;
    examples: string[];
    constraints: string[];
    solution?: string;
  }

class AiDsaGenerate {
    static async generateQuestions(jobInfo: any): Promise<Question[]> {
        try {
          
          const openAIResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
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
                  The job description is: ${jobInfo.description}

                  Include 3 easy, 5 medium, and 2 hard questions. Format:
                  \`\`\`json
                  {
                    "questions": [
                      { "id": 1, "title": "Title", "difficulty": "easy", "description": "Desc", "examples": ["Ex1"], "constraints": ["C1"] },
                      { "id": 2, "title": "Title", "difficulty": "medium", "description": "Desc", "examples": ["Ex1"], "constraints": ["C1"] }
                    ]
                  }
                  \`\`\`
                  `
                }
              ],
              temperature: 0.7
            },
            {
              headers: {
                "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
                "Content-Type": "application/json"
              }
            }
          );

        const responseText = openAIResponse.data.choices[0].message.content;
        const formattedResponse = responseText.match(/```json\n([\s\S]*?)\n```/)?.[1]; // Extract JSON content
        if (!formattedResponse) throw new Error("Invalid AI response format");
    
        const generatedQuestions = JSON.parse(formattedResponse);
        return generatedQuestions.questions;
    
        } catch (error) {
          console.error("Error calling AI API:", error);
          throw new Error("Failed to generate questions using AI API");
        }
      }
}

export default AiDsaGenerate;