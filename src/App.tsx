import { useState } from 'react';
import { AppView, QuizConfig, QuizAnswersMap, TestResultMetrics } from './types/quiz';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { TestPage } from './components/TestPage';
import { ResultPage } from './components/ResultPage';

export function App() {
  const [view, setView] = useState<AppView>('LANDING');
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [answersMap, setAnswersMap] = useState<QuizAnswersMap>({});
  const [resultsMetrics, setResultsMetrics] = useState<TestResultMetrics | null>(null);

  // Triggered from LandingPage on uploading/pasting valid JSON
  const handleStartTest = (config: QuizConfig) => {
    setQuizConfig(config);
    setView('TEST');
  };

  // Triggered from TestPage on submit, exit, or time expiry
  const handleFinishTest = (metrics: TestResultMetrics, answers: QuizAnswersMap) => {
    setResultsMetrics(metrics);
    setAnswersMap(answers);
    setView('RESULT');
  };

  // Reset back to LandingPage
  const handleReset = () => {
    setQuizConfig(null);
    setAnswersMap({});
    setResultsMetrics(null);
    setView('LANDING');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header for Landing and Result Views */}
      {(view === 'LANDING' || view === 'RESULT') && <Header view={view} />}

      {/* Main View Router */}
      <div className="flex-1">
        {view === 'LANDING' && <LandingPage onStartTest={handleStartTest} />}

        {view === 'TEST' && quizConfig && (
          <TestPage quizConfig={quizConfig} onFinishTest={handleFinishTest} />
        )}

        {view === 'RESULT' && quizConfig && resultsMetrics && (
          <ResultPage
            quizConfig={quizConfig}
            answersMap={answersMap}
            metrics={resultsMetrics}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default App;
