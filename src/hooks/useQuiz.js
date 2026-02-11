import { useState } from 'react';

export const useQuiz = (questions) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: optionIndex }
    const [isSubmitted, setIsSubmitted] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const selectAnswer = (questionId, optionIndex) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const nextQuestion = () => {
        if (!isLastQuestion) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsSubmitted(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setIsSubmitted(false);
    };

    const calculateScore = () => {
        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correct) {
                correctCount++;
            }
        });
        return correctCount;
    };

    const score = isSubmitted ? calculateScore() : 0;
    const isPassed = score === questions.length; // 3/3 requirement

    return {
        currentQuestionIndex,
        currentQuestion,
        isLastQuestion,
        answers,
        selectAnswer,
        nextQuestion,
        resetQuiz,
        isSubmitted,
        score,
        isPassed,
        totalQuestions: questions.length
    };
};
