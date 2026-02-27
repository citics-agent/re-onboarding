/**
 * Shuffles an array using Knuth–Fisher–Yates algorithm (unbiased, uniform).
 * Then returns a subset of specified size.
 * @param {Array} array - The source array.
 * @param {number} count - Number of items to select.
 * @returns {Array} - The randomized subset.
 */
export const getRandomQuestions = (array, count) => {
    if (!array || array.length === 0) return [];

    // Fisher-Yates shuffle — O(n), truly uniform distribution
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
};
