"use server"
import { Pinecone, IndexModel } from "@pinecone-database/pinecone"

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || "" });
const indexName = process.env.PINECONE_INDEX_NAME;
const indexHost = process.env.PINECONE_INDEX_HOST;

const getRecommendation = async (chunk_text: string, city: string, seen_ids: string[]) => {
    try {
        const ns = pc.Index(indexName ?? "citadel-checks-index", indexHost).namespace(`city-${city}`);

        const response = await ns.searchRecords({
            query: {
                topK: 8,
                inputs: { text: chunk_text },
                filter: {
                    "user_id": { "$nin": seen_ids }
                }
            },
            fields: ['chunk_text', 'category'],
            rerank: {
                model: 'bge-reranker-v2-m3',
                rankFields: ['chunk_text'],
                topN: 4,
            },
        });


        return response.result.hits.map((hit) => ({
            id: hit._id,
        }));

    } catch (error) {
        console.error("Error fetching recommendations:", error);
        throw error;
    }
}

export default getRecommendation;
