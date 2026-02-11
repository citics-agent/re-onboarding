import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout.jsx';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { InputInfoScreen } from './components/screens/InputInfoScreen';
import { ModuleCard } from './components/screens/ModuleCard';
import { QuizCard } from './components/screens/QuizCard';
import { RoleSelection } from './components/screens/RoleSelection';
import { SuccessScreen } from './components/screens/SuccessScreen';
import modulesData from './data/modules.json';
import { submitData } from './services/api';
import { Loader2 } from 'lucide-react';

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Steps Mapping:
  // 0: Welcome
  // 1: Input Info
  // 2: Module 1
  // 3: Quiz 1
  // ... (Module i -> Quiz i)
  // Last: Role Selection
  // Final: Success

  const handleStart = () => setStep(1);

  const handleInfoSubmit = (data) => {
    setUserData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleModuleComplete = () => {
    setStep(prev => prev + 1); // Go to Quiz
  };

  const handleQuizPass = () => {
    setStep(prev => prev + 1); // Go to next Module or Role
  };

  const handleQuizFail = (moduleStepIndex) => {
    // Return to the module that corresponds to this quiz
    setStep(prev => prev - 1);
  };

  const handleRoleSelect = async (role) => {
    setIsLoading(true);
    const finalData = {
      ...userData,
      role,
      timestamp: new Date().toISOString(),
      status: 'Completed'
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
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
          <Loader2 className="w-12 h-12 text-citics-gold animate-spin mb-4" />
          <p className="text-zinc-400">Đang lưu kết quả...</p>
        </div>
      );
    }

    switch (step) {
      case 0: return <WelcomeScreen onStart={handleStart} />;
      case 1: return <InputInfoScreen onNext={handleInfoSubmit} />;

      // Module 1 Flow
      case 2: return <ModuleCard module={modulesData[0]} onStartQuiz={handleModuleComplete} />;
      case 3: return <QuizCard module={modulesData[0]} onPass={handleQuizPass} onFail={() => handleQuizFail(3)} />;

      // Module 2 Flow
      case 4: return <ModuleCard module={modulesData[1]} onStartQuiz={handleModuleComplete} />;
      case 5: return <QuizCard module={modulesData[1]} onPass={handleQuizPass} onFail={() => handleQuizFail(5)} />;

      // Module 3 Flow
      case 6: return <ModuleCard module={modulesData[2]} onStartQuiz={handleModuleComplete} />;
      case 7: return <QuizCard module={modulesData[2]} onPass={handleQuizPass} onFail={() => handleQuizFail(7)} />;

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
