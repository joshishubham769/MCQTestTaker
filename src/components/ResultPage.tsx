import React, { useEffect } from 'react';
import { QuizConfig, QuizAnswersMap, TestResultMetrics } from '../types/quiz';
import { formatTimeTaken } from '../utils/scoring';
import confetti from 'canvas-confetti';
import { RichText } from './RichText';
import { 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Target, 
  RotateCcw, 
  HelpCircle,
  Award
} from 'lucide-react';

interface ResultPageProps {
  quizConfig: QuizConfig;
  answersMap: QuizAnswersMap;
  metrics: TestResultMetrics;
  onReset: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  quizConfig,
  answersMap,
  metrics,
  onReset,
}) => {
  // Fire celebratory confetti if user scored above 50%
  useEffect(() => {
    if (metrics.accuracyPercentage >= 50 || metrics.correctCount > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [metrics]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Quiz Attempt Results Banner */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 sm:p-10 text-white text-center relative">
          <div className="inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20">
            <Award className="w-10 h-10 text-amber-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Test Attempt Completed!
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base mt-2 font-medium">
            {quizConfig.title}
          </p>
        </div>

        {/* Performance Metrics Tags Dashboard Grid */}
        <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200 grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Total Score */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
            <div className="flex items-center space-x-1 text-slate-500 text-xs font-semibold uppercase mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Total Score</span>
            </div>
            <span className="text-2xl font-black text-indigo-600">
              {metrics.totalScore}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Out of {metrics.maxPossibleScore}
            </span>
          </div>

          {/* Attempted Time */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
            <div className="flex items-center space-x-1 text-slate-500 text-xs font-semibold uppercase mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Time Taken</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-slate-800">
              {formatTimeTaken(metrics.timeTakenSeconds)}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Limit: {formatTimeTaken(metrics.totalTimeSeconds)}
            </span>
          </div>

          {/* Correct Answers */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
            <div className="flex items-center space-x-1 text-slate-500 text-xs font-semibold uppercase mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Correct</span>
            </div>
            <span className="text-2xl font-black text-emerald-600">
              {metrics.correctCount}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              +{metrics.correctCount * quizConfig.marking.correct} marks
            </span>
          </div>

          {/* Incorrect Answers */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
            <div className="flex items-center space-x-1 text-slate-500 text-xs font-semibold uppercase mb-1">
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Incorrect</span>
            </div>
            <span className="text-2xl font-black text-rose-600">
              {metrics.incorrectCount}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {metrics.incorrectCount * quizConfig.marking.incorrect} marks
            </span>
          </div>

          {/* Accuracy % */}
          <div className="col-span-2 md:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
            <div className="flex items-center space-x-1 text-slate-500 text-xs font-semibold uppercase mb-1">
              <Target className="w-3.5 h-3.5 text-purple-500" />
              <span>Accuracy</span>
            </div>
            <span className="text-2xl font-black text-purple-600">
              {metrics.accuracyPercentage}%
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {metrics.unattemptedCount} unattempted
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 sm:p-6 bg-white flex justify-center">
          <button
            onClick={onReset}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Take Another Test</span>
          </button>
        </div>
      </div>

      {/* Detailed Question Review List */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <span>Detailed Question Review</span>
        </h3>

        {/* Scrollable Questions List Container */}
        <div className="space-y-6">
          {quizConfig.questions.map((q) => {
            const state = answersMap[q.questionNumber];
            const savedOpt = state ? state.savedOptionNumber : null;
            const isAttempted = savedOpt !== null;
            const isCorrect = isAttempted && savedOpt === q.correctOptionNumber;

            return (
              <div
                key={q.questionNumber}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Question Review Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg">
                      Question {q.questionNumber}
                    </span>
                    {isAttempted ? (
                      isCorrect ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Incorrect</span>
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-slate-200 text-slate-700 text-xs font-semibold rounded-full">
                        <span>Unattempted</span>
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold text-slate-500">
                    {isCorrect
                      ? `+${quizConfig.marking.correct} Marks`
                      : isAttempted
                      ? `${quizConfig.marking.incorrect} Marks`
                      : '0 Marks'}
                  </span>
                </div>

                {/* Question Prompt (RichText) */}
                <div className="text-base sm:text-lg font-bold text-slate-800 leading-snug mb-4">
                  <RichText content={q.questionString} />
                </div>

                {/* Options Review Grid */}
                <div className="space-y-2.5">
                  {q.options.map((opt) => {
                    const isUserChoice = savedOpt === opt.optionNumber;
                    const isCorrectAnswer = q.correctOptionNumber === opt.optionNumber;

                    let optionStyle = 'bg-slate-50 border-slate-200 text-slate-700';

                    if (isUserChoice && isCorrectAnswer) {
                      optionStyle = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold';
                    } else if (isUserChoice && !isCorrectAnswer) {
                      optionStyle = 'bg-rose-100 border-2 border-rose-500 text-rose-950 font-bold';
                    } else if (!isUserChoice && isCorrectAnswer) {
                      optionStyle = 'bg-emerald-50 border-2 border-emerald-400 text-emerald-900 font-semibold';
                    }

                    return (
                      <div
                        key={opt.optionNumber}
                        className={`p-3.5 rounded-xl border flex items-center justify-between text-sm transition ${optionStyle}`}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <span className="w-6 h-6 rounded-md bg-white/80 text-slate-800 text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-xs border border-slate-200">
                            {String.fromCharCode(64 + opt.optionNumber)}
                          </span>
                          <div className="leading-snug flex-1">
                            <RichText content={opt.optionString} />
                          </div>
                        </div>

                        {/* Status Label Badges */}
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          {isUserChoice && (
                            <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded ${
                              isCorrectAnswer 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-rose-600 text-white'
                            }`}>
                              Your Answer
                            </span>
                          )}
                          {!isUserChoice && isCorrectAnswer && (
                            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
