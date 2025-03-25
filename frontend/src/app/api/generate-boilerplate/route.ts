import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { language, title, description, testCases } = await req.json();

    if (!language || !title || !description || !testCases) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `
      Generate a boilerplate function in ${language} for a coding problem.
      Problem Title: ${title}
      Description: ${description}
      Test Cases: ${JSON.stringify(testCases)}

      Ensure the function:
      - Matches the input/output structure from test cases.
      - Follows best practices in ${language}.
      - Includes a function signature with correct parameters.
      - Has a TODO comment for implementation with mentioning the current language
      - DOES NOT include the implementation.
      - Do not wrap the whole code in backticks.
      - Only return the function signature and necessary documentation.

      Return only the code.
    `;


    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({ boilerplate: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate boilerplate" }, { status: 500 });
  }
}