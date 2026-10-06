export function getSampleQuizJson(): string {
  return JSON.stringify(
    {
      title: "Coordination Compounds - Class 12 NEET Test",
      totalQuestions: 2,
      marking: {
        correct: 4,
        incorrect: -1
      },
      time: 0.1667, // 10 mins
      questions: [
        {
          questionNumber: 1,
          questionString: "In the coordination compound [Co(NH<sub>3</sub>)<sub>6</sub>]Cl<sub>3</sub>, the <strong>coordination number</strong> of cobalt is:",
          options: [
            { optionNumber: 1, optionString: "3" },
            { optionNumber: 2, optionString: "6" },
            { optionNumber: 3, optionString: "9" },
            { optionNumber: 4, optionString: "4" }
          ],
          correctOptionNumber: 2
        },
        {
          questionNumber: 2,
          questionString: "The geometry of [Ni(CN)<sub>4</sub>]<sup>2−</sup> is generally:",
          options: [
            { optionNumber: 1, optionString: "Tetrahedral" },
            { optionNumber: 2, optionString: "Square planar" },
            { optionNumber: 3, optionString: "Octahedral" },
            { optionNumber: 4, optionString: "Trigonal planar" }
          ],
          correctOptionNumber: 2
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
    "correct": 4,
    "incorrect": -1
  },
  "time": 0.5,
  "questions": [
    {
      "questionNumber": 1,
      "questionString": "Write the question prompt here. You can use **Markdown** OR **HTML tags** like <sub>subscripts</sub>, <sup>superscripts</sup>, <strong>bold</strong>, <em>italics</em>, \`code\`, etc.",
      "options": [
        { "optionNumber": 1, "optionString": "Option A (e.g., NH<sub>3</sub> or Cl<sup>−</sup>)" },
        { "optionNumber": 2, "optionString": "Option B" },
        { "optionNumber": 3, "optionString": "Option C" },
        { "optionNumber": 4, "optionString": "Option D" }
      ],
      "correctOptionNumber": 1
    }
  ]
}

Please ensure:
1. Formatting: Use HTML tags (<sub>, <sup>, <strong>, <em>, <code>) OR Markdown syntax (**bold**, *italics*, \`code\`) inside "questionString" and "optionString" for chemical formulas, math, and rich text.
2. "time" is a number representing duration in hours (e.g., 0.1667 for 10 minutes, 0.5 for 30 minutes, 1 for 1 hour).
3. "marking" has "correct" (positive marks) and "incorrect" (negative penalty as a negative number or 0).
4. Each question must have 4 options numbered 1 to 4 and a "correctOptionNumber".
5. Ensure valid JSON syntax without trailing commas. Escaped newlines in strings must be \\n.

Topic: <Topic Name>
Detailed Description: <How questions you want to be is it exam related, depth or subtopics>
Difficulty Level: <Difficulty Level>
Number of Questions: <Number of Questions>
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
