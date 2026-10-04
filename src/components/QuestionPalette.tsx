import React from 'react';
import { QuizAnswersMap } from '../types/quiz';

interface QuestionPaletteProps {
  totalQuestions: number;
  currentIndex: number;
  answersMap: QuizAnswersMap;
  onSelectQuestion: (index: number) => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  totalQuestions,
  currentIndex,
  answersMap,
  onSelectQuestion,
}) => {
  const questionArray = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  // Compute status metrics for header badge
  let attemptedCount = 0;
  let flaggedCount = 0;

  Object.values(answersMap).forEach((st) => {
    if (st.isSaved && st.savedOptionNumber !== null) attemptedCount++;
    if (st.isFlagged) flaggedCount++;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Palette Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3.5 flex items-center justify-between flex-shrink-0">
        <h3 className="font-bold text-slate-800 text-sm sm:text-base">
          Question Palette
        </h3>
        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full" title="Attempted">
            {attemptedCount}/{totalQuestions}
          </span>
          {flaggedCount > 0 && (
            <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full" title="Flagged">
              🚩 {flaggedCount}
            </span>
          )}
        </div>
      </div>

      {/* Legend Bar */}
      <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-around text-[11px] font-medium text-slate-600 flex-shrink-0">
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 rounded bg-amber-300 border border-amber-400 inline-block"></span>
          <span>Attempted</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 rounded bg-white border border-slate-300 inline-block"></span>
          <span>Unattempted</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>🚩 Flagged</span>
        </div>
      </div>

      {/* Miniaturized Scrollable Questions Grid */}
      <div className="p-4 overflow-y-auto flex-1 max-h-[calc(100vh-20rem)]">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {questionArray.map((qNum, idx) => {
            const state = answersMap[qNum] || {
              selectedOptionNumber: null,
              savedOptionNumber: null,
              isSaved: false,
              isFlagged: false,
            };

            const isCurrent = currentIndex === idx;
            const isAttempted = state.isSaved && state.savedOptionNumber !== null;
            const isFlagged = state.isFlagged;

            // Background styling per prompt requirement: Attempted becomes YELLOW
            let bgStyle = 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300';
            if (isAttempted) {
              bgStyle = 'bg-amber-300 text-amber-950 font-bold border-amber-400 shadow-xs';
            }

            return (
              <button
                key={qNum}
                onClick={() => onSelectQuestion(idx)}
                className={`relative py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold border transition flex flex-col items-center justify-center ${bgStyle} ${
                  isCurrent ? 'ring-2 ring-indigo-600 ring-offset-1 z-10 scale-[1.03]' : ''
                }`}
                title={`Jump to Question ${qNum} ${isAttempted ? '(Attempted)' : ''} ${isFlagged ? '(Flagged)' : ''}`}
              >
                <div className="flex items-center space-x-1">
                  <span>Q{qNum}</span>
                  {isFlagged && <span className="text-xs">🚩</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
