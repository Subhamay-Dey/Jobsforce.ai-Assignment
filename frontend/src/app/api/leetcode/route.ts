import htmlToMd from "html-to-md";
import { JSDOM } from "jsdom";

function extractHTMLTestCases(html: string) {
  console.log("Extracting from HTML...");
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const testCases: { input: string; output: string }[] = [];
  const exampleBlocks = document.querySelectorAll(".example-block"); // Selecting all example divs

  exampleBlocks.forEach((block) => {
    const inputEl = block.querySelector(".example-io");
    const outputEl = block.querySelector(".example-io:last-of-type");

    if (inputEl && outputEl) {
      const input = inputEl.textContent?.replace("Input:", "").trim() || "";
      const output = outputEl.textContent?.replace("Output:", "").trim() || "";
      testCases.push({ input, output });
    }
  });

  console.log("HTML Extracted Test Cases:", testCases);
  return testCases;
}

function extractMarkdownTestCases(markdown: string) {
  console.log("Extracting from Markdown...");
  const testCases = [];
  const regex = /(?:\*\*Example \d+:?\*\*|\*\*Input:\*\*)\n*(?:```(?:\w+)?|<pre>)\n([\s\S]*?)(?:```|<\/pre>)/g;
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    const inputMatch = match[1].match(/Input:\s*(.*)/);
    const outputMatch = match[1].match(/Output:\s*(.*)/);

    if (inputMatch && outputMatch) {
      let input = inputMatch[1].trim();
      let output = outputMatch[1].trim();
      input = input.replace(/\\/g, "");
      output = output.replace(/\\/g, "");
      testCases.push({ input, output });
    }
  }

  console.log("Markdown Extracted Test Cases:", testCases);
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
      const htmlContent = data.data.question.content;

      // Try extracting from HTML
      let testCases = extractHTMLTestCases(htmlContent);

      // If no test cases found, fallback to Markdown
      if (testCases.length === 0) {
        const markdownContent = htmlToMd(htmlContent);
        testCases = extractMarkdownTestCases(markdownContent);
      }

      return Response.json({
        id: data.data.question.questionId,
        title: data.data.question.title,
        description: htmlContent,
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
