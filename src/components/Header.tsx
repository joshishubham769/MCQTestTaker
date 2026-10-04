import React from 'react';
import { AppView } from '../types/quiz';
import { Clock, LogOut, CheckCircle2, ChevronRight, FileCheck } from 'lucide-react';

interface HeaderProps {
  view: AppView;
  quizTitle?: string;
  formattedTime?: string;
  onExit?: () => void;
  onSubmit?: () => void;
  onNext?: () => void;
  hasNextQuestion?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  view,
  quizTitle,
  formattedTime,
  onExit,
  onSubmit,
  onNext,
  hasNextQuestion = true,
}) => {
  if (view === 'LANDING' || view === 'RESULT') {
    return (
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
              <FileCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              MCQ Test Taker
            </h1>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Title in bold on left */}
        <div className="flex items-center min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate" title={quizTitle}>
            {quizTitle || 'MCQ Test'}
          </h1>
        </div>

        {/* Timer and Header Controls on right */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {/* Timer Display */}
          <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg text-indigo-700 font-mono text-sm sm:text-base font-bold">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 animate-pulse" />
            <span>{formattedTime || '00:00:00'}</span>
          </div>

          {/* Header Action Buttons */}
          {onNext && (
            <button
              onClick={onNext}
              disabled={!hasNextQuestion}
              className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Move to Next Question"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {onExit && (
            <button
              onClick={onExit}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
              title="Exit test & view results immediately"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit</span>
            </button>
          )}

          {onSubmit && (
            <button
              onClick={onSubmit}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
              title="Submit Test"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
