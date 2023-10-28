import { auth } from "@clerk/nextjs";
import prismaDb from "./prismadb";

const DAY_IN_MS = 86400000;

export const checkSubscription = async () => {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    const userSubscription = await prismaDb.userSubscription.findUnique({
        where: {
            userId,
        },
        select: {
            stripeCurrentPeriodEnd: true,
            stripeSubscriptionId: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
    });

    if (!userSubscription) {
        return false;
    }

    const isValid =
        userSubscription.stripePriceId &&
        userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    return !!isValid;
}
