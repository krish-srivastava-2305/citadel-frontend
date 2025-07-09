import { NextRequest, NextResponse } from "next/server";
import enrichedUserData from "@/sampleData/enrichedData";
import getRecommendation from "@/app/util/getRecommendation";
import { cosineSimilarity } from "@/app/util/cosineSimilarity";

// export const POST = async (req: NextRequest): Promise<NextResponse> => {
//     try {
//         const { userId } = await req.json();
//         if (!userId) {
//             return NextResponse.json(
//                 { error: "User ID is required" },
//                 { status: 400 }
//             );
//         }

//         const user = enrichedUserData.find((user) => user.id === userId);
//         if (!user) {
//             return NextResponse.json(
//                 { error: "User not found" },
//                 { status: 404 }
//             );
//         }

//         const seen_ids = user.seen_ids || [];
//         const chunk_text = user.chunkText || "default text";
//         const city = user.geographic.city || "default city";
//         seen_ids.push(String(userId));

//         const recommendations = await getRecommendation(chunk_text, city, seen_ids);

//         return NextResponse.json(
//             { recommendations },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Error fetching recommendations:", error);
//         return NextResponse.json(
//             { error: "Failed to fetch recommendations" },
//             { status: 500 }
//         );
//     }
// };


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
        const seen_ids: string[] = user.seen_ids || [];
        const city: string = user.geographic.city;
        seen_ids.push(String(userId));

        const filteredUsers = enrichedUserData.filter(
            (u) => u.geographic.city === city
                && !seen_ids.includes(String(u.id))
        );

        const recommendations: { id: string; name: string; similarityScore: number; }[] = [];
        let minimumScore: number = 1;
        let minimumScoreIndex: number = -1;

        filteredUsers.forEach((u) => {
            const similarityScore = cosineSimilarity(u.embeddings, user.embeddings);
            if (recommendations.length < 4) {
                recommendations.push({
                    id: String(u.id),
                    name: u.name,
                    similarityScore: similarityScore,
                });
                if (minimumScore > similarityScore) {
                    minimumScore = similarityScore;
                    minimumScoreIndex = recommendations.length - 1;
                }
            } else {
                if (similarityScore > minimumScore) {
                    recommendations[minimumScoreIndex] = {
                        id: String(u.id),
                        name: u.name,
                        similarityScore: similarityScore,
                    };
                    minimumScore = Math.min(...recommendations.map(r => r.similarityScore));
                    minimumScoreIndex = recommendations.findIndex(r => r.similarityScore === minimumScore);
                }
            }
        });

        return NextResponse.json(
            { recommendations: recommendations.map(r => ({ id: r.id })) },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching recommendations:", error);
        return NextResponse.json(
            { error: "Failed to fetch recommendations" },
            { status: 500 });
    }
}