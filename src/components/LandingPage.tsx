import React, { useState } from 'react';
import { QuizConfig } from '../types/quiz';
import { parseQuizJson } from '../utils/jsonParser';
import { downloadSampleTemplate, getGenAiPrompt } from '../utils/templateGenerator';
import { 
  Upload, 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  AlertCircle, 
  Play, 
  Sparkles,
  ClipboardPaste
} from 'lucide-react';

interface LandingPageProps {
  onStartTest: (config: QuizConfig) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartTest }) => {
  const [jsonText, setJsonText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');

  const processJson = (content: string) => {
    setErrorMessage(null);
    try {
      const config = parseQuizJson(content);
      onStartTest(config);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse JSON file');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        processJson(text);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read selected file.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          processJson(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePasteSubmit = () => {
    if (!jsonText.trim()) {
      setErrorMessage('Please paste or type JSON code before starting.');
      return;
    }
    processJson(jsonText);
  };

  const handleCopyGenAiPrompt = async () => {
    const promptText = getGenAiPrompt();
    try {
      await navigator.clipboard.writeText(promptText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Welcome Banner */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Ready to take your MCQ Test?
        </h2>
        <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
          Upload a test configuration JSON file or paste JSON directly to start an interactive timed test.
        </p>
      </div>

      {/* Main Upload / Input Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-4 px-6 text-center font-semibold text-sm sm:text-base flex items-center justify-center space-x-2 transition ${
              activeTab === 'upload'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Upload className="w-5 h-5" />
            <span>Upload JSON File</span>
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-4 px-6 text-center font-semibold text-sm sm:text-base flex items-center justify-center space-x-2 transition ${
              activeTab === 'paste'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ClipboardPaste className="w-5 h-5" />
            <span>Paste JSON Directly</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-lg flex items-start space-x-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">JSON Parsing Error</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {activeTab === 'upload' ? (
            /* Upload Dropzone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition cursor-pointer ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30'
              }`}
            >
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Upload JSON here
              </h3>
              <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
                Drag and drop your test JSON file here, or click to browse your computer
              </p>

              <label className="mt-6 inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition cursor-pointer">
                <FileCode className="w-5 h-5" />
                <span>Select JSON File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            /* Text Area Paste Input */
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Paste your Quiz JSON Content:
              </label>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder='{"title": "Sample Quiz", "marking": {"correct": 1, "incorrect": -0.25}, "time": 0.5, "questions": [...]}'
                rows={10}
                className="w-full p-4 font-mono text-xs sm:text-sm bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                onClick={handlePasteSubmit}
                className="mt-4 w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 flex items-center justify-center space-x-2 transition"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Test from Pasted JSON</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Utilities Options Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Download Example Template */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900">Example Template</h4>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm mb-4">
            Download a valid sample <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">pattern.json</code> template to inspect the structure or edit locally.
          </p>
          <button
            onClick={downloadSampleTemplate}
            className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium rounded-lg text-sm flex items-center justify-center space-x-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Example Template</span>
          </button>
        </div>

        {/* GenAI Prompt Option */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900">GenAI System Prompt</h4>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm mb-4">
            Copy a ready-made prompt to pass to ChatGPT, Gemini, or Claude to generate quizzes for you.
          </p>
          <button
            onClick={handleCopyGenAiPrompt}
            className={`w-full py-2.5 px-4 font-medium rounded-lg text-sm flex items-center justify-center space-x-2 border transition ${
              isCopied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy GenAI Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
