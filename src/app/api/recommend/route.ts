import { NextRequest, NextResponse } from "next/server";
import enrichedUserData from "@/sampleData/enrichedData";
import getRecommendation from "@/app/util/getRecommendation";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const { userId } = await req.json();
        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        const user = enrichedUserData.find((user) => user.id === userId);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const seen_ids = user.seen_ids || [];
        const chunk_text = user.chunkText || "default text";
        const city = user.geographic.city || "default city";
        seen_ids.push(String(userId));

        const recommendations = await getRecommendation(chunk_text, city, seen_ids);

        return NextResponse.json(
            { recommendations },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        return NextResponse.json(
            { error: "Failed to fetch recommendations" },
            { status: 500 }
        );
    }
};
