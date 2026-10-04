import { QuizConfig, Question, Option } from '../types/quiz';

/**
 * Normalizes and sanitizes raw JSON string or object into a strict QuizConfig
 */
export function parseQuizJson(rawInput: string): QuizConfig {
  let parsed: any;
  
  // 1. Attempt standard JSON parse first
  try {
    parsed = JSON.parse(rawInput);
  } catch (err) {
    // 2. Fallback: attempt lightweight auto-repair for common JSON format bugs (e.g. missing commas between lines)
    const sanitized = sanitizeJsonString(rawInput);
    try {
      parsed = JSON.parse(sanitized);
    } catch (secondErr: any) {
      throw new Error(`Invalid JSON format: ${secondErr.message || 'Please check syntax'}`);
    }
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Root JSON must be an object containing quiz properties');
  }

  // Validate Title
  const title = typeof parsed.title === 'string' && parsed.title.trim().length > 0 
    ? parsed.title.trim() 
    : 'Untitled MCQ Test';

  // Validate Marking Scheme
  const markingObj = parsed.marking || {};
  const correctMark = typeof markingObj.correct === 'number' ? markingObj.correct : 1;
  const incorrectMark = typeof markingObj.incorrect === 'number' ? markingObj.incorrect : 0;

  // Validate Time (in hours)
  const timeHours = typeof parsed.time === 'number' && parsed.time > 0 ? parsed.time : 1;

  // Validate Questions
  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('JSON must contain a "questions" array with at least 1 question');
  }

  const sanitizedQuestions: Question[] = parsed.questions.map((q: any, index: number) => {
    const qNum = typeof q.questionNumber === 'number' ? q.questionNumber : index + 1;
    const qString = typeof q.questionString === 'string' ? q.questionString : `Question ${index + 1}`;

    if (!Array.isArray(q.options) || q.options.length === 0) {
      throw new Error(`Question ${qNum} is missing valid "options" array`);
    }

    const sanitizedOptions: Option[] = q.options.map((opt: any, optIndex: number) => {
      // Handle typo fallback like "optionNumer" alongside "optionNumber"
      const optNum = typeof opt.optionNumber === 'number' 
        ? opt.optionNumber 
        : (typeof opt.optionNumer === 'number' ? opt.optionNumer : optIndex + 1);

      const optStr = typeof opt.optionString === 'string' 
        ? opt.optionString 
        : (typeof opt.optionText === 'string' ? opt.optionText : `Option ${optIndex + 1}`);

      return {
        optionNumber: optNum,
        optionString: optStr,
      };
    });

    const correctOpt = typeof q.correctOptionNumber === 'number' 
      ? q.correctOptionNumber 
      : (typeof q.correctOption === 'number' ? q.correctOption : 1);

    return {
      questionNumber: index + 1, // Enforce clean 1-based sequential indexing
      questionString: qString,
      options: sanitizedOptions,
      correctOptionNumber: correctOpt,
    };
  });

  return {
    title,
    totalQuestions: sanitizedQuestions.length,
    marking: {
      correct: correctMark,
      incorrect: incorrectMark,
    },
    time: timeHours,
    questions: sanitizedQuestions,
  };
}

/**
 * Auto-corrects common hand-written JSON errors such as missing commas between fields
 */
function sanitizeJsonString(jsonStr: string): string {
  // Add missing comma between string property and next key
  let cleaned = jsonStr.replace(/"\s*\n\s*"/g, '",\n"');
  // Add missing comma between number/boolean property and next key
  cleaned = cleaned.replace(/(\d+)\s*\n\s*"/g, '$1,\n"');
  cleaned = cleaned.replace(/(true|false)\s*\n\s*"/g, '$1,\n"');
  // Add missing comma between closing brace/bracket and next key
  cleaned = cleaned.replace(/([\ rulemaking}]+)\s*\n\s*"/g, '$1,\n"');
  return cleaned;
}
