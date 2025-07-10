import { NextRequest, NextResponse } from "next/server";
import enrichedUserData from "@/sampleData/enrichedData";
import getRecommendation from "@/app/util/getRecommendation";
import { cosineSimilarity } from "@/app/util/cosineSimilarity";

/*
    The two approaches to fetching recommendations are as follows:
    1. **Using getRecommendation function**:
    - This approach utilizes Pinecone's vector database to fetch recommendations based on the user's chunk text, city, and seen IDs.
    - It is more efficient for large datasets as it leverages vector similarity search.
    - It allows for dynamic and personalized recommendations based on the user's context.
    - It is suitable for larger datasets and when vector databases are available.
    - Faster for larger datasets due to the use of vector databases.
    - Slower for smaller datasets as it involves querying a vector database, which may have some overhead.

    2. **Using inbuilt cosine similarity calculations**:
    - This approach filters users based on the same city and calculates cosine similarity scores between the embeddings of the user and other users in the same city.
    - It is more manual and requires iterating through the dataset to find recommendations.
    - It may be less efficient for larger datasets as it involves calculating similarity scores for each user in the city.
    - It is more suitable for smaller datasets or when vector databases are not available.
    - Faster for smaller datasets, but less efficient for larger datasets.
*/

/*
    This is a POST request handler for fetching recommendations based on user data.
    It expects a JSON body
        - userId: string - The ID of the user for whom recommendations are being requested.
        - seen_ids: string[] - An array of IDs that the user has already seen.
    
    The handler performs the following steps:
        - Parses the request body to extract userId and seen_ids.
        - Validates that userId is provided; if not, returns a 400 error.
        - Searches for the user in the enrichedUserData array using the provided userId.
        - If the user is not found, returns a 404 error.
        - Retrieves the user's city from their geographic data.
        - Retrieves the user's chunk text, or uses a default value if not available.
        - Adds the userId to the seen_ids array.
        - Calls getRecommendation with the user's chunk text, city, and seen_ids to get recommendations.

    Returns:
    - A JSON response containing an array of recommended user IDs, or an error message if something goes wrong.
    - If successful, returns a 200 status with the recommendations.
    - If an error occurs, returns a 500 status with an error message.

    Note: The commented out code is an alternative implementation that uses inbuilt cosine similarity calculations and filtering logic.
*/

// Comment the following code block and uncomment the one below to use the inbuilt cosine similarity calculations approach

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const { userId, seen_ids } = await req.json();
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
        const chunk_text = user.chunkText || "default text";
        const city = user.geographic.city || "default city";

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



/*
    This is a POST request handler for fetching recommendations based on user data.
    It expects a JSON body
        - userId: string - The ID of the user for whom recommendations are being requested.
        - seen_ids: string[] - An array of IDs that the user has already seen.

    The handler performs the following steps:
        - Parses the request body to extract userId and seen_ids.
        - Validates that userId is provided; if not, returns a 400 error.
        - Searches for the user in the enrichedUserData array using the provided userId.
        - If the user is not found, returns a 404 error.
        - Retrieves the user's city from their geographic data.
        - Adds the userId to the seen_ids array.
        - Filters the enrichedUserData array to find users in the same city who have not been seen yet.
        - Calculates the cosine similarity score between the embeddings of the user and other users in the same city.
    9. Collects the top 4 recommendations based on the similarity score.

    Returns:
    - A JSON response containing an array of recommended user IDs, or an error message if something goes wrong.
    - If successful, returns a 200 status with the recommendations.
*/





// Uncomment the following code block to use the inbuilt cosine similarity calculations approach

// export const POST = async (req: NextRequest): Promise<NextResponse> => {
//     try {
//         const { userId, seen_ids } = await req.json();
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
//         const city: string = user.geographic.city;
//         seen_ids.push(String(userId));

//         const filteredUsers = enrichedUserData.filter(
//             (u) => u.geographic.city === city
//                 && !seen_ids.includes(String(u.id))
//         );

//         const recommendations: { id: string; name: string; similarityScore: number; }[] = [];
//         let minimumScore: number = 1;
//         let minimumScoreIndex: number = -1;

//         filteredUsers.forEach((u) => {
//             const similarityScore = cosineSimilarity(u.embeddings, user.embeddings);
//             if (recommendations.length < 4) {
//                 recommendations.push({
//                     id: String(u.id),
//                     name: u.name,
//                     similarityScore: similarityScore,
//                 });
//                 if (minimumScore > similarityScore) {
//                     minimumScore = similarityScore;
//                     minimumScoreIndex = recommendations.length - 1;
//                 }
//             } else {
//                 if (similarityScore > minimumScore) {
//                     recommendations[minimumScoreIndex] = {
//                         id: String(u.id),
//                         name: u.name,
//                         similarityScore: similarityScore,
//                     };
//                     minimumScore = Math.min(...recommendations.map(r => r.similarityScore));
//                     minimumScoreIndex = recommendations.findIndex(r => r.similarityScore === minimumScore);
//                 }
//             }
//         });

//         return NextResponse.json(
//             { recommendations: recommendations.map(r => (r.id)) },
//             { status: 200 }
//         );

//     } catch (error) {
//         console.error("Error fetching recommendations:", error);
//         return NextResponse.json(
//             { error: "Failed to fetch recommendations" },
//             { status: 500 });
//     }
// }