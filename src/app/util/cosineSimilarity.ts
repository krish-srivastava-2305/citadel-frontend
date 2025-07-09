export const cosineSimilarity = (vec1: number[], vec2: number[]): number => {
    if (vec1.length !== vec2.length) {
        throw new Error("Vectors must be of the same length");
    }

    const dotProduct = vec1.reduce((sum, value, index) => sum + value * vec2[index], 0);
    const magnitudeVec1 = Math.sqrt(vec1.reduce((sum, value) => sum + value * value, 0));
    const magnitudeVec2 = Math.sqrt(vec2.reduce((sum, value) => sum + value * value, 0));

    if (magnitudeVec1 === 0 || magnitudeVec2 === 0) {
        return 0;
    }

    return dotProduct / (magnitudeVec1 * magnitudeVec2);
}