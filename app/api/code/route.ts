import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAIApi from "openai";

const openai = new OpenAIApi({apiKey: process.env.OPENAI_API_KEY});
const instructionMessage = {
    role: "system",
    content: "You are a code generator. Answer only in markdown code snippets. Use code comments where appropriate."
};

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!process.env.OPENAI_API_KEY) {
            return new NextResponse("OpenAI Key not configured", { status: 500 });
        }
        if (!messages) {
            return new NextResponse("Messages are requird", { status: 422 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]
        });

        return NextResponse.json(response.choices[0].message)
    } catch (err) {
        console.log("[CONVERSATION_ERROR]", err);

        return new NextResponse("Internal error", { status: 500 });
    }
}
