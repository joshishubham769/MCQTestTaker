import React from 'react';
import { Question, QuestionAnswerState } from '../types/quiz';
import { Flag, Save, ArrowRight, CheckCircle } from 'lucide-react';
import { RichText } from './RichText';

interface QuestionCardProps {
  question: Question;
  totalQuestions: number;
  questionState: QuestionAnswerState;
  onSelectOption: (optionNumber: number) => void;
  onSave: () => void;
  onToggleFlag: () => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  totalQuestions,
  questionState,
  onSelectOption,
  onSave,
  onToggleFlag,
  onNext,
  isLastQuestion,
}) => {
  const { selectedOptionNumber, savedOptionNumber, isSaved, isFlagged } = questionState;

  const hasUnsavedSelection = 
    selectedOptionNumber !== null && selectedOptionNumber !== savedOptionNumber;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Question Card Header (Top of card) */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs sm:text-sm font-bold rounded-full">
            Question {question.questionNumber} of {totalQuestions}
          </span>
          {isSaved && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Saved</span>
            </span>
          )}
        </div>

        {isFlagged && (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
            <span>🚩 Flagged</span>
          </span>
        )}
      </div>

      {/* Scrollable Question Content Body */}
      <div className="p-6 sm:p-8 overflow-y-auto flex-1 max-h-[calc(100vh-16rem)]">
        {/* Question String (Rendered with RichText Markdown support) */}
        <div className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed mb-6">
          <RichText content={question.questionString} />
        </div>

        {/* 4 Radio Buttons for Options */}
        <div className="space-y-3.5">
          {question.options.map((opt) => {
            const isSelected = selectedOptionNumber === opt.optionNumber;
            const isOptionSaved = savedOptionNumber === opt.optionNumber;

            return (
              <label
                key={opt.optionNumber}
                onClick={() => onSelectOption(opt.optionNumber)}
                className={`w-full p-4 rounded-xl border-2 flex items-center space-x-4 cursor-pointer transition ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {/* Radio Input */}
                <input
                  type="radio"
                  name={`question-${question.questionNumber}`}
                  value={opt.optionNumber}
                  checked={isSelected}
                  onChange={() => onSelectOption(opt.optionNumber)}
                  className="w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                />

                {/* Option Badge Number */}
                <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {String.fromCharCode(64 + opt.optionNumber)}
                </span>

                {/* Option Text (RichText) */}
                <div className="text-slate-800 font-medium text-sm sm:text-base flex-1 leading-normal">
                  <RichText content={opt.optionString} />
                </div>

                {isOptionSaved && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex-shrink-0">
                    Saved Answer
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Card Action Buttons Footer (Save, Flag, Next) */}
      <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-8 flex items-center justify-between flex-shrink-0 gap-2">
        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={selectedOptionNumber === null}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-sm transition ${
            selectedOptionNumber === null
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : hasUnsavedSelection
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-bounce-subtle'
              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
          }`}
          title="Save your selected answer"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>

        {/* Flag Button */}
        <button
          onClick={onToggleFlag}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 border transition ${
            isFlagged
              ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
          title={isFlagged ? 'Remove flag' : 'Flag this question'}
        >
          <Flag className={`w-4 h-4 ${isFlagged ? 'fill-current text-white' : 'text-slate-500'}`} />
          <span>{isFlagged ? 'Flagged 🚩' : 'Flag'}</span>
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 shadow-sm transition"
          title={isLastQuestion ? 'Go to last question' : 'Move to next question'}
        >
          <span>{isLastQuestion ? 'Review' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
