/**
 * Shuffles an array and returns a subset of specified size.
 * @param {Array} array - The source array.
 * @param {number} count - Number of items to select.
 * @returns {Array} - The randomized subset.
 */
export const getRandomQuestions = (array, count) => {
    if (!array || array.length === 0) return [];

    // Create a copy to not mutate the original
    const shuffled = [...array].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, count);
};
