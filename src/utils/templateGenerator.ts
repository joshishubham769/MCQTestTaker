export function getSampleQuizJson(): string {
  return JSON.stringify(
    {
      title: "General Knowledge Test",
      totalQuestions: 2,
      marking: {
        correct: 1,
        incorrect: -0.25
      },
      time: 0.1, // 0.1 hrs = 6 mins (convenient for testing)
      questions: [
        {
          questionNumber: 1,
          questionString: "What is the capital of France?",
          options: [
            { optionNumber: 1, optionString: "Paris" },
            { optionNumber: 2, optionString: "Delhi" },
            { optionNumber: 3, optionString: "New York" },
            { optionNumber: 4, optionString: "Chandigarh" }
          ],
          correctOptionNumber: 1
        },
        {
          questionNumber: 2,
          questionString: "Which city is currently considered the most populated city in the world by urban area?",
          options: [
            { optionNumber: 1, optionString: "Paris" },
            { optionNumber: 2, optionString: "Delhi" },
            { optionNumber: 3, optionString: "New York" },
            { optionNumber: 4, optionString: "Tokyo" }
          ],
          correctOptionNumber: 4
        }
      ]
    },
    null,
    2
  );
}

export function getGenAiPrompt(): string {
  return `Generate a valid JSON object for an MCQ test formatted strictly according to the following structure:

{
  "title": "Your Custom Quiz Title Here",
  "totalQuestions": 3,
  "marking": {
    "correct": 1,
    "incorrect": -0.25
  },
  "time": 0.5,
  "questions": [
    {
      "questionNumber": 1,
      "questionString": "Write the question prompt here",
      "options": [
        { "optionNumber": 1, "optionString": "Option A" },
        { "optionNumber": 2, "optionString": "Option B" },
        { "optionNumber": 3, "optionString": "Option C" },
        { "optionNumber": 4, "optionString": "Option D" }
      ],
      "correctOptionNumber": 1
    }
  ]
}

Please ensure:
1. "time" is a number representing duration in hours (e.g., 0.5 for 30 minutes, 1 for 1 hour).
2. "marking" has "correct" (positive marks) and "incorrect" (negative penalty as a negative number or 0).
3. Each question must have 4 options numbered 1 to 4 and a "correctOptionNumber".
4. Ensure valid JSON syntax without trailing commas.

Topic: <Topic Name>
Difficulty Level: <Difficulty Level>
Time: <Time>
Marking: <Marking>`;
}

export function downloadSampleTemplate(): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(getSampleQuizJson());
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "mcq_test_pattern.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
