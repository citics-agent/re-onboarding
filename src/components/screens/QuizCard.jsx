import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { useQuiz } from '../../hooks/useQuiz';
import { CheckCircle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export const QuizCard = ({ module, onPass, onFail }) => {
    const {
        currentQuestion,
        currentQuestionIndex,
        totalQuestions,
        answers,
        selectAnswer,
        nextQuestion,
        isSubmitted,
        isPassed,
        score
    } = useQuiz(module.quiz);

    // SAFETY CHECK: If no questions are available
    if (!currentQuestion) {
        return (
            <Card className="max-w-md w-full mx-auto text-center border-citics-amber/50">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-citics-amber mb-2">Không có câu hỏi</h3>
                    <p className="text-white/60 mb-4">Module này chưa có dữ liệu câu hỏi.</p>
                    <Button onClick={onPass} variant="outline" className="w-full">Bỏ qua</Button>
                </div>
            </Card>
        );
    }

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full"
            >
                <Card className="max-w-md w-full mx-auto text-center border-white/20">
                    <div className="flex justify-center mb-6">
                        {isPassed ? (
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: "spring" }}
                            >
                                <CheckCircle className="w-20 h-20 text-citics-turquoise drop-shadow-[0_0_15px_rgba(17,218,239,0.5)]" />
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                            >
                                <XCircle className="w-20 h-20 text-citics-amber drop-shadow-[0_0_15px_rgba(255,191,1,0.5)]" />
                            </motion.div>
                        )}
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">
                        {isPassed ? 'Chúc mừng!' : 'Chưa đạt yêu cầu'}
                    </h2>

                    <p className="text-citics-lavender/80 mb-8 text-lg">
                        Bạn đã trả lời đúng <span className={clsx("font-bold text-2xl mx-1", isPassed ? "text-citics-turquoise" : "text-citics-amber")}>{score}/{totalQuestions}</span> câu.
                    </p>

                    {isPassed ? (
                        <Button onClick={() => onPass(score)} className="w-full shadow-lg shadow-citics-turquoise/20">Tiếp tục</Button>
                    ) : (
                        <Button onClick={onFail} variant="outline" className="w-full border-citics-amber text-citics-amber hover:bg-citics-amber hover:text-citics-blue">Học lại</Button>
                    )}
                </Card>
            </motion.div>
        );
    }

    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            <Card className="max-w-md w-full mx-auto">
                <div className="mb-6">
                    <div className="flex justify-between text-xs text-citics-lavender/60 mb-2 font-medium uppercase tracking-wider">
                        <span>Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}</span>
                        <span>{module.title}</span>
                    </div>
                    <ProgressBar progress={progress} />
                </div>

                <AnimatePresence mode='wait'>
                    <motion.h3
                        key={currentQuestion.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-lg md:text-xl font-bold text-white mb-8 min-h-[60px]"
                    >
                        {currentQuestion.question}
                    </motion.h3>
                </AnimatePresence>

                <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((option, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => selectAnswer(currentQuestion.id, idx)}
                            className={clsx(
                                "p-4 rounded-xl border cursor-pointer transition-all duration-200 relative overflow-hidden group",
                                answers[currentQuestion.id] === idx
                                    ? "bg-citics-turquoise/20 border-citics-turquoise text-white shadow-[0_0_15px_rgba(17,218,239,0.2)]"
                                    : "bg-citics-blue/30 border-white/10 text-citics-lavender/80 hover:bg-white/5 hover:border-white/30"
                            )}
                        >
                            <div className="flex items-center gap-3 relative z-10">
                                <div className={clsx(
                                    "w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition-colors",
                                    answers[currentQuestion.id] === idx
                                        ? "bg-citics-turquoise border-citics-turquoise text-citics-blue"
                                        : "border-white/30 text-white/50 group-hover:border-white/50"
                                )}>
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <span className="font-medium">{option}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <Button
                    onClick={nextQuestion}
                    disabled={answers[currentQuestion.id] === undefined}
                    className="w-full"
                >
                    {currentQuestionIndex === totalQuestions - 1 ? 'Hoàn thành' : 'Tiếp theo'}
                </Button>
            </Card>
        </motion.div>
    );
};
