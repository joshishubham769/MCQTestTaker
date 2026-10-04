export interface Option {
  optionNumber: number;
  optionString: string;
}

export interface Question {
  questionNumber: number;
  questionString: string;
  options: Option[];
  correctOptionNumber: number;
}

export interface MarkingScheme {
  correct: number;
  incorrect: number;
}

export interface QuizConfig {
  title: string;
  totalQuestions?: number;
  marking: MarkingScheme;
  time: number; // Duration in hours (e.g. 0.5 = 30 mins, 3 = 3 hrs)
  questions: Question[];
}

export interface QuestionAnswerState {
  selectedOptionNumber: number | null; // Currently picked radio option
  savedOptionNumber: number | null;    // Saved option upon clicking "Save"
  isSaved: boolean;                    // Marked true on clicking "Save"
  isFlagged: boolean;                  // Toggled on clicking "Flag"
}

export type QuizAnswersMap = Record<number, QuestionAnswerState>;

export interface TestResultMetrics {
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  totalScore: number;
  maxPossibleScore: number;
  accuracyPercentage: number;
  timeTakenSeconds: number;
  totalTimeSeconds: number;
}

export type AppView = 'LANDING' | 'TEST' | 'RESULT';
