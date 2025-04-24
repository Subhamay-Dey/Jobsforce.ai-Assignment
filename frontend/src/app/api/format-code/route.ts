import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: "Missing code or language" }, { status: 400 });
    }

    // Call OpenAI to reformat the code
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `You are an expert code formatter. Format the given ${language} code into a structured program while preserving its logic.` },
        { role: "user", content: `Format the following ${language} code:\n${code}` },
      ],
      temperature: 0,
    });

    const formattedCode = aiResponse.choices?.[0]?.message?.content?.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim() ?? "";

    if (!formattedCode) {
      return NextResponse.json({ error: "Failed to format code" }, { status: 500 });
    }

    return NextResponse.json({ formattedCode }, { status: 200 });
  } catch (error) {
    console.error("Error formatting code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
