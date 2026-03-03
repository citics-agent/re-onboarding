import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { useQuiz } from '../../hooks/useQuiz';
import { CheckCircle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export const QuizCard = ({ module, onPass, onFail, onBack }) => {
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
            <Card className="max-w-md w-full mx-auto text-center border-amber-200">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-amber-600 mb-2">Không có câu hỏi</h3>
                    <p className="text-slate-600 mb-4">Module này chưa có dữ liệu câu hỏi.</p>
                    <Button onClick={onPass} variant="outline" className="w-full">Bỏ qua</Button>
                </div>
            </Card>
        );
    }

    if (isSubmitted) {
        const allAnswers = module.quiz.map((q, i) => ({
            correct: answers[q.id] === q.correct
        }));

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full"
            >
                <Card className="max-w-md w-full mx-auto text-center overflow-hidden">
                    {/* Glow backdrop */}
                    <div className={clsx(
                        "absolute inset-0 blur-[80px] opacity-10 rounded-3xl pointer-events-none",
                        isPassed ? "bg-citics-blue" : "bg-red-500"
                    )} />

                    <div className="relative z-10">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="flex justify-center mb-4"
                        >
                            {isPassed ? (
                                <CheckCircle className="w-16 h-16 text-citics-blue drop-shadow-sm" />
                            ) : (
                                <XCircle className="w-16 h-16 text-red-500 drop-shadow-sm" />
                            )}
                        </motion.div>

                        {/* Result label */}
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className={clsx(
                                "text-xs font-bold uppercase tracking-widest mb-1",
                                isPassed ? "text-citics-blue" : "text-red-500"
                            )}>
                                {isPassed ? '✓ Đạt yêu cầu' : '✗ Chưa đạt'}
                            </div>

                            {/* Big score */}
                            <div className={clsx(
                                "text-7xl font-black mb-1 leading-none",
                                isPassed
                                    ? "text-citics-blue"
                                    : "text-red-500"
                            )}>
                                {score}<span className="text-3xl text-slate-300">/{totalQuestions}</span>
                            </div>
                            <p className="text-slate-500 font-medium text-sm mb-6">câu trả lời đúng</p>
                        </motion.div>

                        {/* Per-answer dot breakdown */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-center gap-2 mb-6"
                        >
                            {allAnswers.map((a, i) => (
                                <div
                                    key={i}
                                    title={`Câu ${i + 1}: ${a.correct ? 'Đúng' : 'Sai'}`}
                                    className={clsx(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border",
                                        a.correct
                                            ? "bg-citics-blue/5 border-citics-blue text-citics-blue"
                                            : "bg-red-50 border-red-500 text-red-600"
                                    )}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            {isPassed ? (
                                <Button onClick={() => onPass(score)} className="w-full">
                                    Tiếp tục →
                                </Button>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-xs text-slate-500 font-medium mb-3">Xem lại video và trả lời lại câu hỏi nhé!</p>
                                    <Button onClick={onFail} variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-50">
                                        Làm lại
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </div>
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
                    <div className="flex justify-between text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
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
                        className="text-lg md:text-xl font-black text-slate-900 mb-8 min-h-[60px]"
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
                                    ? "bg-citics-blue/5 border-citics-blue text-citics-blue shadow-sm"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                            )}
                        >
                            <div className="flex items-center gap-3 relative z-10">
                                <div className={clsx(
                                    "w-6 h-6 min-w-[1.5rem] min-h-[1.5rem] flex-shrink-0 rounded-full border flex items-center justify-center text-[10px] font-black transition-all",
                                    answers[currentQuestion.id] === idx
                                        ? "bg-citics-blue text-white border-citics-blue scale-110 shadow-sm"
                                        : "border-slate-300 text-slate-400 group-hover:border-slate-400"
                                )}>
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <span className="font-semibold">{option}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={onBack} className="w-1/3 text-slate-600 border-slate-200 hover:bg-slate-50 px-2 text-sm md:text-base">
                        Học lại
                    </Button>
                    <Button
                        onClick={nextQuestion}
                        disabled={answers[currentQuestion.id] === undefined}
                        className="w-2/3 px-2 text-sm md:text-base"
                    >
                        {currentQuestionIndex === totalQuestions - 1 ? 'Hoàn thành' : 'Tiếp theo'}
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
};
