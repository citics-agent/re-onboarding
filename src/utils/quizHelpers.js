/**
 * Shuffles an array using Knuth–Fisher–Yates algorithm (unbiased, uniform).
 * Then returns a subset of specified size.
 * @param {Array} array - The source array.
 * @param {number} count - Number of items to select.
 * @returns {Array} - The randomized subset.
 */
export const getRandomQuestions = (array, count) => {
    if (!array || array.length === 0) return [];

    // Fisher-Yates shuffle for the questions themselves
    const shuffledQuestions = [...array];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }

    // Pick subset
    const selected = shuffledQuestions.slice(0, count);

    // Shuffle options within each selected question
    return selected.map(q => {
        const question = JSON.parse(JSON.stringify(q)); // Deep clone
        const originalCorrectOption = question.options[question.correct];

        // Shuffle options
        const shuffledOptions = [...question.options];
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }

        // Find new index of the correct option
        const newCorrectIndex = shuffledOptions.indexOf(originalCorrectOption);

        return {
            ...question,
            options: shuffledOptions,
            correct: newCorrectIndex
        };
    });
};

