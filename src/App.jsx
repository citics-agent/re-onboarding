import React, { useState, useEffect, useRef } from "react";
import { AppLayout } from "./components/layout/AppLayout.jsx";
import { WelcomeScreen } from "./components/screens/WelcomeScreen";
import { InputInfoScreen } from "./components/screens/InputInfoScreen";
import { ModuleCard } from "./components/screens/ModuleCard";
import { QuizCard } from "./components/screens/QuizCard";
import { RoleSelection } from "./components/screens/RoleSelection";
import { SuccessScreen } from "./components/screens/SuccessScreen";
import modulesData from "./data/modules.json";
import { submitData, fetchQuestions } from "./services/api";
import { Loader2 } from "lucide-react";
import { startReOnboard, submitReOnboard } from "./services/api";

import QuestionBank from "./data/questionBank.json";
import { getRandomQuestions } from "./utils/quizHelpers";

// CẤU HÌNH: Số lượng câu hỏi muốn hiển thị mỗi Module
const QUESTIONS_PER_MODULE = 5;

// Steps Mapping (1 Module):
// 0: Welcome
// 1: Input Info
// 2: Module 2
// 3: Quiz 2
// 4: Role Selection
// 5: Success
const TOTAL_APP_STEPS = 4; // Steps 1-4 (excluding Welcome/Success)

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeModules, setActiveModules] = useState([]);
  const [moduleScores, setModuleScores] = useState({});
  const [startTime, setStartTime] = useState(null);

  // Tracking document view time
  const [documentViewStartTime, setDocumentViewStartTime] = useState(null);
  const [documentViewDuration, setDocumentViewDuration] = useState(0);
  // Holds remote question bank fetched silently in the background
  const remoteBankRef = useRef(null);

  useEffect(() => {
    // Step 1: Immediately initialize with local fallback — no blocking
    const localModules = modulesData.map((module) => {
      const questions =
        QuestionBank[module.id] || QuestionBank[String(module.id)] || [];
      if (questions.length === 0) {
        console.warn(`No local questions found for Module ${module.id}`);
      }
      return {
        ...module,
        quiz: getRandomQuestions(questions, QUESTIONS_PER_MODULE),
      };
    });
    setActiveModules(localModules);

    // Step 2: Fetch remote questions in the background (fire-and-forget)
    const prefetchQuestions = async () => {
      const remoteBank = await fetchQuestions();
      if (remoteBank && Object.keys(remoteBank).length > 0) {
        remoteBankRef.current = remoteBank;
        console.log("[App] Remote question bank ready.");
      }
    };
    prefetchQuestions();
  }, []);

  // Upgrades activeModules to remote questions if the fetch has completed.
  // Called right before the first Quiz step to guarantee the latest question set.
  const upgradeToRemoteQuestions = () => {
    if (!remoteBankRef.current) return; // Remote not ready yet — keep local fallback
    const upgraded = modulesData.map((module) => {
      const questions =
        remoteBankRef.current[module.id] ||
        remoteBankRef.current[String(module.id)] ||
        [];
      return {
        ...module,
        quiz: getRandomQuestions(questions, QUESTIONS_PER_MODULE),
      };
    });
    setActiveModules(upgraded);
  };

  const handleStart = () => setStep(1);

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleInfoSubmit = async (data) => {
    // Gọi thêm API từ BE
    const startRes = await startReOnboard(data);
    const { sessionId = "" } = startRes || {};

    setUserData((prev) => ({ ...prev, ...data, sessionId }));
    // Upgrade to remote questions right before modules begin (if fetch has completed)
    upgradeToRemoteQuestions();
    setStartTime(Date.now());
    setDocumentViewStartTime(Date.now()); // Start document view timer
    setStep(2);
  };

  const handleModuleComplete = () => {
    if (documentViewStartTime) {
      const viewDurationSeconds = Math.floor(
        (Date.now() - documentViewStartTime) / 1000
      );
      setDocumentViewDuration((prev) => prev + viewDurationSeconds);
      setDocumentViewStartTime(null);
    }
    setStep((prev) => prev + 1);
  };

  const handleQuizPass = async (score) => {
    // Step 3 -> Module 1 (Index 0), Step 5 -> Module 2 (Index 1)
    const moduleIndex = Math.floor((step - 2) / 2);
    const updatedScores = {
      ...moduleScores,
      [`module_${moduleIndex + 1}_score`]: score,
    };
    setModuleScores(updatedScores);

    // Gọi thêm API từ BE
    await submitReOnboard({
      score,
      totalScore: QUESTIONS_PER_MODULE,
      sessionId: userData?.sessionId,
      extra: userData,
    });

    const isLastModule = moduleIndex === activeModules.length - 1;

    if (isLastModule) {
      setStep(4); // Go to RoleSelection
    } else {
      setStep((prev) => prev + 1); // Next module
    }
  };

  const [isRetry, setIsRetry] = React.useState(false);

  const handleQuizFail = () => {
    setIsRetry(true);
    // Reshuffle questions for the current module so the next attempt is fresh
    const moduleIndex = Math.floor((step - 2) / 2);
    const module = modulesData[moduleIndex];

    // Determine which bank to use (remote if ready, else local)
    const bank = remoteBankRef.current || QuestionBank;
    const questions = bank[module.id] || bank[String(module.id)] || [];

    if (questions.length > 0) {
      const updatedModules = [...activeModules];
      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        quiz: getRandomQuestions(questions, QUESTIONS_PER_MODULE),
      };
      setActiveModules(updatedModules);
    }

    setDocumentViewStartTime(Date.now()); // Restart document view timer for the retake
    setStep((prev) => prev - 1); // Go back to re-read the module
  };

  const handleRoleSelect = async (role) => {
    setIsLoading(true);
    const totalScore = Object.values(moduleScores).reduce((a, b) => a + b, 0);
    const totalQuestions = activeModules.reduce(
      (acc, module) => acc + module.quiz.length,
      0
    );

    const durationSeconds = startTime
      ? Math.floor((Date.now() - startTime) / 1000)
      : 0;
    const formattedDuration = `${String(Math.floor(durationSeconds / 60)).padStart(2, "0")}:${String(durationSeconds % 60).padStart(2, "0")}`;

    const gmt7Date = new Date(Date.now() + 7 * 3600 * 1000);
    const formattedTimestamp = gmt7Date
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    const finalData = {
      ...userData,
      ...moduleScores,
      total_score: totalScore,
      role,
      timestamp: formattedTimestamp,
      duration: formattedDuration,
      document_view_duration: `${Math.floor(documentViewDuration / 60)} phút ${documentViewDuration % 60} giây`,
      status: `Passed (${totalScore}/${totalQuestions})`,
    };

    await submitData(finalData);
    setIsLoading(false);
    setStep(5); // Success
  };

  const handleFinish = () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    window.location.href = isMobile
      ? "https://onelink.to/a5ekgf"
      : "https://agent.citics.vn/dang-nhap";
  };

  // Calculate global progress (steps 1-4)
  const globalProgress =
    step >= 1 && step <= 4 ? Math.round((step / 4) * 100) : 0;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-citics-blue" />
          <p className="text-slate-700 font-medium">Đang lưu kết quả...</p>
        </div>
      );
    }

    switch (step) {
      case 0:
        return <WelcomeScreen onStart={handleStart} />;
      case 1:
        return (
          <InputInfoScreen onNext={handleInfoSubmit} onBack={handleBack} />
        );
      case 2:
        return (
          <ModuleCard
            module={activeModules[0]}
            onStartQuiz={handleModuleComplete}
            onBack={handleBack}
            isRetry={isRetry}
          />
        );
      case 3:
        return (
          <QuizCard
            module={activeModules[0]}
            onPass={handleQuizPass}
            onFail={() => handleQuizFail()}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <RoleSelection onSelect={handleRoleSelect} onBack={handleBack} />
        );
      case 5:
        return <SuccessScreen onFinish={handleFinish} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <AppLayout progress={globalProgress} showProgress={step >= 1 && step <= 4}>
      {renderContent()}
    </AppLayout>
  );
}

export default App;
