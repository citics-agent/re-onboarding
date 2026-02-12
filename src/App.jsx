import React, { useState, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout.jsx';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { InputInfoScreen } from './components/screens/InputInfoScreen';
import { ModuleCard } from './components/screens/ModuleCard';
import { QuizCard } from './components/screens/QuizCard';
import { RoleSelection } from './components/screens/RoleSelection';
import { SuccessScreen } from './components/screens/SuccessScreen';
import modulesData from './data/modules.json';
import { submitData, fetchQuestions } from './services/api'; // Import fetchQuestions
import { Loader2 } from 'lucide-react';

import QuestionBank from './data/questionBank.json';
import { getRandomQuestions } from './utils/quizHelpers';

// CẤU HÌNH: Số lượng câu hỏi muốn hiển thị mỗi Module
const QUESTIONS_PER_MODULE = 3;

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeModules, setActiveModules] = useState([]);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Initialize Modules with dynamic questions
  useEffect(() => {
    const initApp = async () => {
      // 1. Fetch from Google Sheet
      const remoteBank = await fetchQuestions();

      // 2. Use Remote if available, otherwise Local Fallback
      const sourceBank = (remoteBank && Object.keys(remoteBank).length > 0)
        ? remoteBank
        : QuestionBank;

      // 3. Map questions to modules
      const initialized = modulesData.map(module => {
        // Handle ID mismatch (String vs Number)
        const questions = sourceBank[module.id] || sourceBank[String(module.id)] || [];

        if (questions.length === 0) {
          console.warn(`No questions found for Module ${module.id}`);
        }

        return {
          ...module,
          quiz: getRandomQuestions(questions, QUESTIONS_PER_MODULE)
        };
      });

      setActiveModules(initialized);
      setIsAppLoading(false);
    };

    initApp();
  }, []);

  // Steps Mapping:
  // 0: Welcome
  // 1: Input Info
  // 2: Module 1
  // 3: Quiz 1
  // ... (Module i -> Quiz i)
  // Last: Role Selection
  // Final: Success

  const handleStart = () => setStep(1);

  const [moduleScores, setModuleScores] = useState({});

  const handleInfoSubmit = (data) => {
    setUserData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleModuleComplete = () => {
    setStep(prev => prev + 1); // Go to Quiz
  };

  const handleQuizPass = (score) => {
    // Current mapping: 
    // Step 3 -> Module 1 (Index 0)
    // Step 5 -> Module 2 (Index 1)
    // Step 7 -> Module 3 (Index 2)
    const moduleIndex = Math.floor((step - 2) / 2);
    setModuleScores(prev => ({ ...prev, [`module_${moduleIndex + 1}_score`]: score }));
    setStep(prev => prev + 1);
  };

  const handleQuizFail = (moduleStepIndex) => {
    setStep(prev => prev - 1);
  };

  const handleRoleSelect = async (role) => {
    setIsLoading(true);
    // Calculate total score
    const totalScore = Object.values(moduleScores).reduce((a, b) => a + b, 0);
    const totalQuestions = activeModules.reduce((acc, module) => acc + module.quiz.length, 0);

    const finalData = {
      ...userData,
      ...moduleScores,
      total_score: totalScore,
      role,
      timestamp: new Date().toISOString(),
      status: `Passed (${totalScore}/${totalQuestions})`
    };

    // Attempt submission
    await submitData(finalData);

    setIsLoading(false);
    setStep(9); // Success
  };

  const handleFinish = () => {
    window.location.href = "https://zalo.me/g/example"; // Replace with real group
  };

  const renderContent = () => {
    // 1. App Loading (Fetching Questions)
    if (isAppLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <Loader2 className="w-12 h-12 text-citics-turquoise animate-spin mb-4" />
          <p className="animate-pulse">Đang tải dữ liệu...</p>
        </div>
      );
    }

    // 2. Submission Loading
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
          <Loader2 className="w-12 h-12 text-citics-turquoise animate-spin mb-4 text-citics-gold" />
          <p className="text-zinc-400">Đang lưu kết quả...</p>
        </div>
      );
    }

    switch (step) {
      case 0: return <WelcomeScreen onStart={handleStart} />;
      case 1: return <InputInfoScreen onNext={handleInfoSubmit} />;

      // Module 1 Flow
      case 2: return <ModuleCard module={activeModules[0]} onStartQuiz={handleModuleComplete} />;
      case 3: return <QuizCard module={activeModules[0]} onPass={handleQuizPass} onFail={() => handleQuizFail(3)} />;

      // Module 2 Flow
      case 4: return <ModuleCard module={activeModules[1]} onStartQuiz={handleModuleComplete} />;
      case 5: return <QuizCard module={activeModules[1]} onPass={handleQuizPass} onFail={() => handleQuizFail(5)} />;

      // Module 3 Flow
      case 6: return <ModuleCard module={activeModules[2]} onStartQuiz={handleModuleComplete} />;
      case 7: return <QuizCard module={activeModules[2]} onPass={handleQuizPass} onFail={() => handleQuizFail(7)} />;

      case 8: return <RoleSelection onSelect={handleRoleSelect} />;
      case 9: return <SuccessScreen onFinish={handleFinish} />;

      default: return <div>Unknown Step</div>;
    }
  };

  return (
    <AppLayout>
      {renderContent()}
    </AppLayout>
  );
}

export default App;
