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
        return Response.json({
          id: data.data.question.questionId,
          title: data.data.question.title,
          description: data.data.question.content,
          difficulty: data.data.question.difficulty,
        });
      } else {
        return Response.json({ error: "Question not found" }, { status: 404 });
      }
    } catch (error) {
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }