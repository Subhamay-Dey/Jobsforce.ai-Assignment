import { NextResponse } from "next/server";

const JUDGE0_URL = process.env.JUDGE0_URL!
const RAPIDAPI_KEY = "f05a609a59msh363230c20bce9bap1fcc7ejsn164fab2f42b6";
export async function POST(req: Request) {
    try {
        const { code, language_id, test_cases } = await req.json();

        const submissionPromises = test_cases.map(async ({ input, expected_output }: { input: any; expected_output: any }) => {
            const response = await fetch(JUDGE0_URL, {
                method: "POST",
                headers: {
                    "x-rapidapi-key": RAPIDAPI_KEY,
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language_id,
                    source_code: Buffer.from(code).toString("base64"), // Encode to Base64
                    // stdin: Buffer.from(input).toString("base64"), // Encode input
                    // expected_output: Buffer.from(expected_output).toString("base64"), // Encode expected output
                }),
            });

            return response.json();
        });

        const submissionResults = await Promise.all(submissionPromises);
        const tokens = submissionResults.map((res) => res.token);

        const resultsPromises = tokens.map(async (tokens) => {
            const response = await fetch(`${JUDGE0_URL}/${tokens}?fields=*`, {
                method: "GET",
                headers: {
                    "x-rapidapi-key": RAPIDAPI_KEY,
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                },
            });

            return response.json();
        });

        const results = await Promise.all(resultsPromises);
        const passedCount = results.filter((res) => res.status.id === 3).length;

        return NextResponse.json({
            total: test_cases.length,
            passed: passedCount,
            results,
        });
    } catch (error) {
        console.error("Error in Judge0 API:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// import { NextResponse } from "next/server";

// const JUDGE0_URL = "http://localhost:2358/submissions"; // Use local Judge0 API

// export async function POST(req: Request) {
//     try {
//         const { code, language_id, test_cases } = await req.json();

//         const submissionPromises = test_cases.map(async ({ input, expected_output }: { input: string; expected_output: string }) => {
//             const response = await fetch(JUDGE0_URL, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     language_id,
//                     source_code: Buffer.from(code).toString("base64"),
//                     stdin: Buffer.from(input).toString("base64"),
//                     expected_output: Buffer.from(expected_output).toString("base64"),
//                 }),
//             });

//             return response.json();
//         });

//         const submissionResults = await Promise.all(submissionPromises);
//         const tokens = submissionResults.map((res) => res.token);

//         const resultsPromises = tokens.map(async (token) => {
//             const response = await fetch(`${JUDGE0_URL}/${token}?fields=*`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });

//             return response.json();
//         });

//         const results = await Promise.all(resultsPromises);
//         const passedCount = results.filter((res) => res.status.id === 3).length;

//         return NextResponse.json({
//             total: test_cases.length,
//             passed: passedCount,
//             results,
//         });
//     } catch (error) {
//         console.error("Error in Judge0 API:", error);
//         return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//     }
// }
