import htmlToMd from "html-to-md";

function extractTestCases(markdown: string) {
  console.log("Raw Markdown Content:\n", markdown); // Log full markdown output

  const testCases = [];
  const regex = /\*\*Example \d+:?\*\*\n*```([\s\S]*?)```/g; // Match example code blocks
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    console.log("Extracted Raw Test Case Block:\n", match[1]); // Log extracted example content

    const inputMatch = match[1].match(/Input:\s*(.*)/);
    const outputMatch = match[1].match(/Output:\s*(.*)/);

    if (inputMatch && outputMatch) {
      const input = inputMatch[1].trim();
      const output = outputMatch[1].trim();
      testCases.push({ input, output });
      console.log("Parsed Test Case:", { input, output });
    }
  }

  console.log("Final Extracted Test Cases:", testCases);
  return testCases;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const questionName = searchParams.get("questionName");
  
    if (!questionName) {
      return Response.json({ error: "Question name is required" }, { status: 400 });
    }
  
    const titleSlug = questionName.toLowerCase().replace(/\s+/g, "-");
    const url = "https://leetcode.com/graphql";
    
    const query = `
      query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          title
          content
          difficulty
        }
      }
    `;
  
    const payload = { query, variables: { titleSlug } };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (data?.data?.question) {

        const markdown = htmlToMd(data.data.question.content);
        const testCases = extractTestCases(markdown);

        return Response.json({
          id: data.data.question.questionId,
          title: data.data.question.title,
          description: data.data.question.content,
          difficulty: data.data.question.difficulty,
          testCases,
        });
      } else {
        return Response.json({ error: "Question not found" }, { status: 404 });
      }
    } catch (error) {
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }