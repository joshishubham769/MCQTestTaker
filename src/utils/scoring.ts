import { QuizConfig, QuizAnswersMap, TestResultMetrics } from '../types/quiz';

export function calculateTestResults(
  config: QuizConfig,
  answersMap: QuizAnswersMap,
  timeTakenSeconds: number
): TestResultMetrics {
  const totalQuestions = config.questions.length;
  let correctCount = 0;
  let incorrectCount = 0;
  let attemptedCount = 0;

  config.questions.forEach((q) => {
    const qState = answersMap[q.questionNumber];
    const savedAns = qState ? qState.savedOptionNumber : null;

    if (savedAns !== null) {
      attemptedCount++;
      if (savedAns === q.correctOptionNumber) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }
  });

  const unattemptedCount = totalQuestions - attemptedCount;
  const correctMark = config.marking.correct;
  const incorrectMark = config.marking.incorrect;

  // Formula: (Correct * PositiveMark) + (Incorrect * NegativePenalty)
  const totalScore = (correctCount * correctMark) + (incorrectCount * incorrectMark);
  const maxPossibleScore = totalQuestions * correctMark;
  
  const accuracyPercentage = attemptedCount > 0 
    ? Math.round((correctCount / attemptedCount) * 100) 
    : 0;

  const totalTimeSeconds = Math.round(config.time * 3600);

  return {
    totalQuestions,
    attemptedCount,
    correctCount,
    incorrectCount,
    unattemptedCount,
    totalScore: Number(totalScore.toFixed(2)),
    maxPossibleScore: Number(maxPossibleScore.toFixed(2)),
    accuracyPercentage,
    timeTakenSeconds: Math.min(timeTakenSeconds, totalTimeSeconds),
    totalTimeSeconds,
  };
}

export function formatTimeTaken(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} sec${seconds === 1 ? '' : 's'}`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) {
    return `${mins} min${mins === 1 ? '' : 's'} ${secs} sec${secs === 1 ? '' : 's'}`;
  }
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs} hr${hrs === 1 ? '' : 's'} ${remMins} min${remMins === 1 ? '' : 's'}`;
}
