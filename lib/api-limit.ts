import { auth } from "@clerk/nextjs";
import prismaDb from "./prismadb";
import { MAX_FREE_COUNT } from "@/constants";

export const increaseApiLimit = async () => {
    const { userId } = auth();

    if (!userId) return;

    const userApiLimit = await prismaDb.userApiLimit.findUnique({where: {userId}});
    if (userApiLimit) {
        await prismaDb.userApiLimit.update({
            where: { userId },
            data: { count: userApiLimit.count + 1 },
        });
    } else {
        await prismaDb.userApiLimit.create({
            data: { userId, count: 1 },
        });
    }
}

export const checkApiLimit = async () => {
    const { userId } = auth();

    if (!userId) return false;

    const userApiLimit = await prismaDb.userApiLimit.findUnique({where: {userId}});
    if (userApiLimit) {
        if (userApiLimit.count >= MAX_FREE_COUNT) {
            return false;
        }
    }
    return true;
}

export const getApiLimitCount = async () => {
    const { userId } = auth();

    if (!userId) return 0;

    const userApiLimit = await prismaDb.userApiLimit.findUnique({where: {userId}});
    if (userApiLimit) {
        return userApiLimit.count;
    }
    return 0;
}
