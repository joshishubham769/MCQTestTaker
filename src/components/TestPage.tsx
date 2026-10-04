import React, { useState } from 'react';
import { QuizConfig, QuizAnswersMap, TestResultMetrics } from '../types/quiz';
import { useQuizTimer } from '../hooks/useQuizTimer';
import { calculateTestResults } from '../utils/scoring';
import { Header } from './Header';
import { QuestionCard } from './QuestionCard';
import { QuestionPalette } from './QuestionPalette';

interface TestPageProps {
  quizConfig: QuizConfig;
  onFinishTest: (metrics: TestResultMetrics, answersMap: QuizAnswersMap) => void;
}

export const TestPage: React.FC<TestPageProps> = ({ quizConfig, onFinishTest }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Initialize answers state map for all questions
  const [answersMap, setAnswersMap] = useState<QuizAnswersMap>(() => {
    const initialMap: QuizAnswersMap = {};
    quizConfig.questions.forEach((q) => {
      initialMap[q.questionNumber] = {
        selectedOptionNumber: null,
        savedOptionNumber: null,
        isSaved: false,
        isFlagged: false,
      };
    });
    return initialMap;
  });

  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Finish test callback helper
  const handleCompleteTest = () => {
    const metrics = calculateTestResults(quizConfig, answersMap, timeTakenSeconds);
    onFinishTest(metrics, answersMap);
  };

  // Timer hook
  const { formattedTime, timeTakenSeconds } = useQuizTimer({
    durationHours: quizConfig.time,
    onExpire: () => {
      handleCompleteTest();
    },
    isActive: true,
  });

  const currentQuestion = quizConfig.questions[currentIndex];
  const currentQuestionState = answersMap[currentQuestion.questionNumber] || {
    selectedOptionNumber: null,
    savedOptionNumber: null,
    isSaved: false,
    isFlagged: false,
  };

  // Option selection
  const handleSelectOption = (optNum: number) => {
    setAnswersMap((prev) => ({
      ...prev,
      [currentQuestion.questionNumber]: {
        ...prev[currentQuestion.questionNumber],
        selectedOptionNumber: optNum,
      },
    }));
  };

  // Save button handler
  const handleSaveAnswer = () => {
    setAnswersMap((prev) => {
      const qSt = prev[currentQuestion.questionNumber];
      if (qSt.selectedOptionNumber === null) return prev;
      return {
        ...prev,
        [currentQuestion.questionNumber]: {
          ...qSt,
          savedOptionNumber: qSt.selectedOptionNumber,
          isSaved: true,
        },
      };
    });
  };

  // Flag button handler
  const handleToggleFlag = () => {
    setAnswersMap((prev) => {
      const qSt = prev[currentQuestion.questionNumber];
      return {
        ...prev,
        [currentQuestion.questionNumber]: {
          ...qSt,
          isFlagged: !qSt.isFlagged,
        },
      };
    });
  };

  // Next button handler
  const handleNextQuestion = () => {
    if (currentIndex < quizConfig.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Test Page Top Header */}
      <Header
        view="TEST"
        quizTitle={quizConfig.title}
        formattedTime={formattedTime}
        onExit={() => setShowExitModal(true)}
        onSubmit={() => setShowSubmitModal(true)}
        onNext={handleNextQuestion}
        hasNextQuestion={currentIndex < quizConfig.questions.length - 1}
      />

      {/* Main Body Split Screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Question Card (Left 3 Columns) */}
        <div className="lg:col-span-3 h-[calc(100vh-8.5rem)] min-h-[500px]">
          <QuestionCard
            question={currentQuestion}
            totalQuestions={quizConfig.questions.length}
            questionState={currentQuestionState}
            onSelectOption={handleSelectOption}
            onSave={handleSaveAnswer}
            onToggleFlag={handleToggleFlag}
            onNext={handleNextQuestion}
            isLastQuestion={currentIndex === quizConfig.questions.length - 1}
          />
        </div>

        {/* Question Palette (Right 1 Column) */}
        <div className="lg:col-span-1 h-[calc(100vh-8.5rem)] min-h-[500px]">
          <QuestionPalette
            totalQuestions={quizConfig.questions.length}
            currentIndex={currentIndex}
            answersMap={answersMap}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />
        </div>
      </main>

      {/* Exit Modal Confirmation */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Exit Test & View Results?</h3>
            <p className="text-slate-600 text-sm mb-6">
              Exiting will finish your test session and generate your score results based on your currently saved answers.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition"
              >
                Continue Test
              </button>
              <button
                onClick={() => {
                  setShowExitModal(false);
                  handleCompleteTest();
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm transition"
              >
                Exit to Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Modal Confirmation */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Submit Quiz Test?</h3>
            <p className="text-slate-600 text-sm mb-6">
              Are you sure you want to submit your answers? You will immediately see your final score and detailed report.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition"
              >
                Back to Questions
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleCompleteTest();
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
