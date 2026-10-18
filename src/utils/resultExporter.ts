import { QuizConfig, QuizAnswersMap, TestResultMetrics } from '../types/quiz';
import { formatTimeTaken } from './scoring';

/**
 * Generates and downloads a rich, self-contained standalone HTML report of the test results.
 */
export function downloadResultAsHtml(
  quizConfig: QuizConfig,
  answersMap: QuizAnswersMap,
  metrics: TestResultMetrics
): void {
  const attemptDate = new Date().toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const sanitizedTitle = quizConfig.title.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_') || 'Quiz';

  // Helper to escape raw text if needed or format markdown bold/code
  const formatContent = (content: string): string => {
    if (!content) return '';
    // Format markdown bold **text** to <strong>text</strong>
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Format markdown italic *text* to <em>text</em>
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Format markdown inline code `code` to <code>code</code>
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    return formatted;
  };

  const questionsHtml = quizConfig.questions.map((q) => {
    const state = answersMap[q.questionNumber];
    const savedOpt = state ? state.savedOptionNumber : null;
    const isAttempted = savedOpt !== null;
    const isCorrect = isAttempted && savedOpt === q.correctOptionNumber;

    const statusBadge = isAttempted
      ? isCorrect
        ? `<span class="badge badge-success">&#10003; Correct (+${quizConfig.marking.correct} Marks)</span>`
        : `<span class="badge badge-danger">&#10007; Incorrect (${quizConfig.marking.incorrect} Marks)</span>`
      : `<span class="badge badge-neutral">Unattempted (0 Marks)</span>`;

    const optionsHtml = q.options.map((opt) => {
      const isUserChoice = savedOpt === opt.optionNumber;
      const isCorrectAnswer = q.correctOptionNumber === opt.optionNumber;

      let optionClass = 'option-neutral';
      let tagHtml = '';

      if (isUserChoice && isCorrectAnswer) {
        optionClass = 'option-correct';
        tagHtml = '<span class="tag tag-success">Your Answer (Correct)</span>';
      } else if (isUserChoice && !isCorrectAnswer) {
        optionClass = 'option-wrong';
        tagHtml = '<span class="tag tag-danger">Your Answer (Incorrect)</span>';
      } else if (!isUserChoice && isCorrectAnswer) {
        optionClass = 'option-target';
        tagHtml = '<span class="tag tag-success">Correct Answer</span>';
      }

      const letter = String.fromCharCode(64 + opt.optionNumber);

      return `
        <div class="option-item ${optionClass}">
          <div class="option-left">
            <span class="option-badge">${letter}</span>
            <div class="option-text">${formatContent(opt.optionString)}</div>
          </div>
          ${tagHtml}
        </div>
      `;
    }).join('');

    return `
      <div class="question-card print-avoid-break">
        <div class="question-header">
          <span class="q-number-pill">Question ${q.questionNumber}</span>
          ${statusBadge}
        </div>
        <div class="question-prompt">
          ${formatContent(q.questionString)}
        </div>
        <div class="options-list">
          ${optionsHtml}
        </div>
      </div>
    `;
  }).join('');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(quizConfig.title)} - Test Result</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
      padding: 24px 16px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    .print-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      background: #ffffff;
      padding: 12px 20px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .print-btn {
      background: #4f46e5;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.2s;
    }
    .print-btn:hover {
      background: #4338ca;
    }
    .banner-card {
      background: linear-gradient(135deg, #4f46e5 0%, #4338ca 50%, #6b21a8 100%);
      color: #ffffff;
      padding: 32px 24px;
      border-radius: 20px;
      text-align: center;
      margin-bottom: 24px;
      box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.3);
    }
    .banner-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 4px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .banner-title {
      font-size: 26px;
      font-weight: 800;
      margin-bottom: 8px;
      line-height: 1.3;
    }
    .banner-sub {
      color: #e0e7ff;
      font-size: 14px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 14px;
      margin-bottom: 32px;
    }
    .metric-card {
      background: #ffffff;
      padding: 16px;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .metric-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }
    .metric-val {
      font-size: 24px;
      font-weight: 900;
      line-height: 1.2;
    }
    .metric-sub {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 4px;
    }
    .val-score { color: #4f46e5; }
    .val-correct { color: #059669; }
    .val-wrong { color: #e11d48; }
    .val-acc { color: #7c3aed; }
    .val-time { color: #0284c7; }

    .section-title {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 16px;
      color: #0f172a;
    }
    .question-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 18px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .q-number-pill {
      background: #f1f5f9;
      color: #334155;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 8px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
    }
    .badge-success { background: #d1fae5; color: #065f46; }
    .badge-danger { background: #ffe4e6; color: #9f1239; }
    .badge-neutral { background: #f1f5f9; color: #475569; }

    .question-prompt {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 18px;
      line-height: 1.5;
    }
    .question-prompt img,
    .option-text img {
      max-width: 100%;
      height: auto;
      max-height: 350px;
      display: block;
      margin: 12px auto;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }
    .inline-code {
      background: #f1f5f9;
      color: #4f46e5;
      padding: 2px 6px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 13px;
      border: 1px solid #e2e8f0;
    }
    sub {
      font-size: 0.75em;
      position: relative;
      bottom: -0.2em;
      font-weight: 600;
    }
    sup {
      font-size: 0.75em;
      position: relative;
      top: -0.4em;
      font-weight: 600;
    }

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .option-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1.5px solid #e2e8f0;
      font-size: 14px;
      gap: 12px;
    }
    .option-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }
    .option-badge {
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      font-weight: 700;
      font-size: 12px;
      color: #334155;
      flex-shrink: 0;
    }
    .option-text {
      color: #1e293b;
      font-weight: 500;
      flex: 1;
    }

    .option-neutral {
      background: #f8fafc;
      border-color: #e2e8f0;
    }
    .option-correct {
      background: #ecfdf5;
      border-color: #10b981;
      color: #064e3b;
      font-weight: 600;
    }
    .option-wrong {
      background: #fff1f2;
      border-color: #f43f5e;
      color: #881337;
      font-weight: 600;
    }
    .option-target {
      background: #f0fdf4;
      border-color: #34d399;
      color: #065f46;
      font-weight: 600;
    }

    .tag {
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      flex-shrink: 0;
    }
    .tag-success { background: #059669; color: #ffffff; }
    .tag-danger { background: #e11d48; color: #ffffff; }

    .footer {
      text-align: center;
      color: #94a3b8;
      font-size: 12px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    @media print {
      body {
        background-color: #ffffff;
        padding: 0;
      }
      .print-bar {
        display: none !important;
      }
      .banner-card {
        box-shadow: none !important;
        border: 1px solid #cbd5e1;
        background: #312e81 !important;
        color: #ffffff !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .print-avoid-break {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      .question-card {
        box-shadow: none !important;
        border: 1px solid #cbd5e1 !important;
        margin-bottom: 14px;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="print-bar">
      <div>
        <strong>MCQTestTaker Report</strong> &bull; Generated on ${escapeHtml(attemptDate)}
      </div>
      <button class="print-btn" onclick="window.print()">
        &#128424; Print / Save as PDF
      </button>
    </div>

    <div class="banner-card">
      <span class="banner-badge">&#127942; Test Results</span>
      <h1 class="banner-title">${escapeHtml(quizConfig.title)}</h1>
      <p class="banner-sub">Attempt Completed &bull; ${escapeHtml(attemptDate)}</p>
    </div>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">&#127942; Total Score</div>
        <div class="metric-val val-score">${metrics.totalScore}</div>
        <div class="metric-sub">Out of ${metrics.maxPossibleScore}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">&#9201; Time Taken</div>
        <div class="metric-val val-time">${escapeHtml(formatTimeTaken(metrics.timeTakenSeconds))}</div>
        <div class="metric-sub">Limit: ${escapeHtml(formatTimeTaken(metrics.totalTimeSeconds))}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">&#10003; Correct</div>
        <div class="metric-val val-correct">${metrics.correctCount}</div>
        <div class="metric-sub">+${metrics.correctCount * quizConfig.marking.correct} Marks</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">&#10007; Incorrect</div>
        <div class="metric-val val-wrong">${metrics.incorrectCount}</div>
        <div class="metric-sub">${metrics.incorrectCount * quizConfig.marking.incorrect} Marks</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">&#127919; Accuracy</div>
        <div class="metric-val val-acc">${metrics.accuracyPercentage}%</div>
        <div class="metric-sub">${metrics.unattemptedCount} Unattempted</div>
      </div>
    </div>

    <h2 class="section-title">Detailed Question Review</h2>
    ${questionsHtml}

    <div class="footer">
      Generated with MCQTestTaker &bull; Self-Contained Test Engine
    </div>
  </div>
</body>
</html>`;

  // Trigger file download
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${sanitizedTitle}_Result.html`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Triggers native browser print dialog to print or save the current page as PDF.
 */
export function printResultPage(): void {
  window.print();
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
