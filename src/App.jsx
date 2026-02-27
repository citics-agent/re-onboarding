import React, { useState, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout.jsx';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { InputInfoScreen } from './components/screens/InputInfoScreen';
import { ModuleCard } from './components/screens/ModuleCard';
import { QuizCard } from './components/screens/QuizCard';
import { RoleSelection } from './components/screens/RoleSelection';
import { SuccessScreen } from './components/screens/SuccessScreen';
import modulesData from './data/modules.json';
import { submitData, fetchQuestions } from './services/api';
import { Loader2 } from 'lucide-react';

import QuestionBank from './data/questionBank.json';
import { getRandomQuestions } from './utils/quizHelpers';

// CẤU HÌNH: Số lượng câu hỏi muốn hiển thị mỗi Module
const QUESTIONS_PER_MODULE = 5;

// Steps Mapping (2 Modules):
// 0: Welcome
// 1: Input Info
// 2: Module 1
// 3: Quiz 1
// 4: Module 2
// 5: Quiz 2
// 6: Role Selection
// 7: Success
const TOTAL_APP_STEPS = 6; // Steps 1-6 (excluding Welcome/Success)

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeModules, setActiveModules] = useState([]);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [moduleScores, setModuleScores] = useState({});

  useEffect(() => {
    const initApp = async () => {
      const remoteBank = await fetchQuestions();
      const sourceBank = (remoteBank && Object.keys(remoteBank).length > 0)
        ? remoteBank
        : QuestionBank;

      const initialized = modulesData.map(module => {
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

  const handleStart = () => setStep(1);

  const handleInfoSubmit = (data) => {
    setUserData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleModuleComplete = () => {
    setStep(prev => prev + 1);
  };

  const handleQuizPass = async (score) => {
    // Step 3 -> Module 1 (Index 0), Step 5 -> Module 2 (Index 1)
    const moduleIndex = Math.floor((step - 2) / 2);
    const updatedScores = { ...moduleScores, [`module_${moduleIndex + 1}_score`]: score };
    setModuleScores(updatedScores);

    const isLastModule = moduleIndex === activeModules.length - 1;

    if (isLastModule) {
      // Skip RoleSelection — auto-submit and go to Success
      setIsLoading(true);
      const totalScore = Object.values(updatedScores).reduce((a, b) => a + b, 0);
      const totalQuestions = activeModules.reduce((acc, module) => acc + module.quiz.length, 0);
      const finalData = {
        ...userData,
        ...updatedScores,
        total_score: totalScore,
        timestamp: new Date().toISOString(),
        status: `Passed (${totalScore}/${totalQuestions})`
      };
      await submitData(finalData);
      setIsLoading(false);
      setStep(7); // Go directly to Success
    } else {
      setStep(prev => prev + 1); // Next module
    }
  };

  const handleQuizFail = () => {
    setStep(prev => prev - 1); // Go back to re-read the module
  };

  const handleRoleSelect = async (role) => {
    setIsLoading(true);
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

    await submitData(finalData);
    setIsLoading(false);
    setStep(7); // Success
  };

  const handleFinish = () => {
    // Deeplink to Citics Agent App. Fallback to App Store if app is not installed.
    const deepLink = 'citics://agent/register';
    const appStoreLink = 'https://apps.apple.com/app/citics-agent'; // Placeholder

    window.location = deepLink;
    setTimeout(() => {
      window.location = appStoreLink;
    }, 2000);
  };

  // Calculate global progress (steps 1-6)
  const globalProgress = step >= 1 && step <= 6 ? Math.round((step / 6) * 100) : 0;

  const renderContent = () => {
    if (isAppLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-700">
          <Loader2 className="w-12 h-12 text-citics-blue animate-spin mb-4" />
          <p className="animate-pulse font-medium">Đang tải dữ liệu...</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-citics-blue" />
          <p className="text-slate-700 font-medium">Đang lưu kết quả...</p>
        </div>
      );
    }

    switch (step) {
      case 0: return <WelcomeScreen onStart={handleStart} />;
      case 1: return <InputInfoScreen onNext={handleInfoSubmit} />;
      case 2: return <ModuleCard module={activeModules[0]} onStartQuiz={handleModuleComplete} />;
      case 3: return <QuizCard module={activeModules[0]} onPass={handleQuizPass} onFail={() => handleQuizFail()} />;
      case 4: return <ModuleCard module={activeModules[1]} onStartQuiz={handleModuleComplete} />;
      case 5: return <QuizCard module={activeModules[1]} onPass={handleQuizPass} onFail={() => handleQuizFail()} />;
      case 6: return <RoleSelection onSelect={handleRoleSelect} />;
      case 7: return <SuccessScreen onFinish={handleFinish} />;
      default: return <div>Unknown Step</div>;
    }
  };

  return (
    <AppLayout progress={globalProgress} showProgress={step >= 1 && step <= 6}>
      {renderContent()}
    </AppLayout>
  );
}

export default App;
