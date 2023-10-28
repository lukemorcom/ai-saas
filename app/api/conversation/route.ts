import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAIApi from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAIApi({apiKey: process.env.OPENAI_API_KEY});

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

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro) {
            return new NextResponse("Free trial limit reached", { status: 403 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages
        });

        await increaseApiLimit();

        return NextResponse.json(response.choices[0].message)
    } catch (err) {
        console.log("[CONVERSATION_ERROR]", err);

        return new NextResponse("Internal error", { status: 500 });
    }
}
