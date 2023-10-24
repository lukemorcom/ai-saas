import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAIApi from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

const openai = new OpenAIApi({apiKey: process.env.OPENAI_API_KEY});

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt, amount = 1, resolution = "256x256" } = body.values;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!process.env.OPENAI_API_KEY) {
            return new NextResponse("OpenAI Key not configured", { status: 500 });
        }
        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 422 });
        }
        if (!resolution) {
            return new NextResponse("Resolution is required", { status: 422 });
        }
        if (!amount) {
            return new NextResponse("Amount is required", { status: 422 });
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial) {
            return new NextResponse("Free trial limit reached", { status: 403 });
        }

        const response = await openai.images.generate({
            prompt,
            n: parseInt(amount, 10),
            size: resolution,
        });

        await increaseApiLimit();

        return NextResponse.json(response.data);
    } catch (err) {
        console.log("[IMAGE_ERROR]", err);

        return new NextResponse("Internal error", { status: 500 });
    }
}
