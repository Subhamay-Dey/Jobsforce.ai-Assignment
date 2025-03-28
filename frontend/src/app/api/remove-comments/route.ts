// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//     try {
//         const { code, language } = await req.json();
//         if (!code || !language) {
//             return NextResponse.json({ error: "Code and language are required" }, { status: 400 });
//         }

//         let cleanedCode = code;

//         switch (language.toLowerCase()) {
//             case "javascript":
//             case "typescript":
//             case "java":
//             case "go":
//             case "rust":
//             case "cpp":
//             case "csharp":
//             case "swift":
//                 cleanedCode = cleanedCode
//                     .replace(/\/\/.*$/gm, "") // Remove single-line comments
//                     .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
//                     .replace(/^\s*\n/gm, "") // Remove empty lines
//                     .trim();
//                 break;

//             case "python":
//             case "ruby":
//                 cleanedCode = cleanedCode
//                     .replace(/#.*/g, "") // Remove single-line comments
//                     .replace(/(['"]){3}[\s\S]*?\1{3}/g, "") // Remove multi-line string comments
//                     .replace(/^\s*\n/gm, "") // Remove empty lines
//                     .trim();
//                 break;

//             default:
//                 return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
//         }

//         return NextResponse.json({ cleanedCode });
//     } catch (error) {
//         console.error("Error in removing comments:", error);
//         return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//     }
// }

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { code, language } = await req.json();
        if (!code || !language) {
            return NextResponse.json({ error: "Code and language are required" }, { status: 400 });
        }

        let cleanedCode = code;

        switch (language.toLowerCase()) {
            case "javascript":
            case "typescript":
            case "java":
            case "go":
            case "rust":
            case "cpp":
            case "csharp":
            case "swift":
                // Remove single-line (//) and multi-line (/* */) comments
                cleanedCode = cleanedCode
                    .replace(/\/\/.*$/gm, "") // Single-line comments
                    .replace(/\/\*[\s\S]*?\*\//g, "") // Multi-line comments
                    .replace(/^\s*\n/gm, "") // Remove empty lines
                    .trim();
                break;

            case "python":
            case "ruby":
                // Remove single-line (#) and multi-line (''' ''' or """ """) comments
                cleanedCode = cleanedCode
                    .replace(/#.*/g, "") // Single-line comments
                    .replace(/(['"]){3}[\s\S]*?\1{3}/g, "") // Multi-line comments
                    .replace(/^\s*\n/gm, "") // Remove empty lines
                    .trim();
                break;

            default:
                return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
        }

        return NextResponse.json({ cleanedCode });
    } catch (error) {
        console.error("Error in removing comments:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}