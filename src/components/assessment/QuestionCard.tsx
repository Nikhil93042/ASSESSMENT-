import React, { useState, useEffect } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { assessmentQuestions } from '../../data/questions';
import { ArrowLeft, ArrowRight, CheckCircle, Save, Sparkles, HeartHandshake, AlertCircle, RefreshCw } from 'lucide-react';

export const QuestionCard: React.FC = () => {
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    saveStatus,
    saveAnswer,
    submitAssessment,
  } = useAssessment();

  const [motivationalMessage, setMotivationalMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentQ = assessmentQuestions[currentQuestionIndex];
  const totalQ = assessmentQuestions.length;
  
  // Strictly derive checked state from answers[currentQ.id]
  const currentAnswer = answers[currentQ.id];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQ) * 100);

  // Clear error message whenever question changes
  useEffect(() => {
    setErrorMsg(null);
  }, [currentQuestionIndex]);

  // Motivational triggers at milestones
  useEffect(() => {
    const messages: Record<number, string> = {
      4: "🌟 Great start! Keep going — your responses are building your unique profile.",
      9: "💡 One section completed! Answer honestly; there are no right or wrong personality answers.",
      14: "✨ Halfway there! Your honest responses create more meaningful workplace insights.",
      19: "🚀 You're doing great. Just a few more questions to finalize your OCEAN scores.",
      24: "🎯 Final question! Your personalized profile and competency report are almost ready."
    };

    if (messages[currentQuestionIndex]) {
      setMotivationalMessage(messages[currentQuestionIndex]);
    } else {
      setMotivationalMessage(null);
    }
  }, [currentQuestionIndex]);

  const likertOptions = [
    { value: 1, label: '1 - Not Like Me', sub: 'Does not describe me at all' },
    { value: 2, label: '2 - Very Slightly Like Me', sub: 'Rarely describes me' },
    { value: 3, label: '3 - Slightly Like Me', sub: 'Occasionally true' },
    { value: 4, label: '4 - Somewhat Like Me', sub: 'Neutral / Moderately true' },
    { value: 5, label: '5 - Mostly Like Me', sub: 'Frequently true for me' },
    { value: 6, label: '6 - Strongly Like Me', sub: 'Very characteristic of me' },
    { value: 7, label: '7 - Exactly Like Me', sub: 'Completely describes me' },
  ];

  // Save answer for current question ID with real-time autosave
  const handleSelectRating = (val: number) => {
    setErrorMsg(null);
    saveAnswer(currentQ.id, val);
  };

  const handleNextQuestion = () => {
    // Validation: Require an answer for the current question before moving next
    if (answers[currentQ.id] === undefined || answers[currentQ.id] === null) {
      setErrorMsg('Please select an answer before continuing.');
      return;
    }
    setErrorMsg(null);
    if (currentQuestionIndex < totalQ - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    if (answers[currentQ.id] === undefined || answers[currentQ.id] === null) {
      setErrorMsg('Please select an answer before continuing.');
      return;
    }
    submitAssessment();
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 space-y-6">
      
      {/* Top Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Item {currentQuestionIndex + 1} of {totalQ}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Live Real-Time Database Autosave Indicator */}
            <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800">
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw className="w-3 h-3 text-sky-400 animate-spin" />
                  <span className="text-sky-300">Saving to DB...</span>
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Save className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300">Auto-Saved to DB</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-300">Cached Locally</span>
                </>
              )}
            </div>

            <span className="text-sky-400 font-extrabold">{progressPercent}% Completed</span>
          </div>
        </div>

        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Motivational Banner */}
      {motivationalMessage && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 via-slate-900 to-sky-950/60 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-3 animate-fade-in shadow-lg">
          <HeartHandshake className="w-5 h-5 text-sky-400 shrink-0" />
          <span>{motivationalMessage}</span>
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
        
        {/* Category Tag */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-widest text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full">
            {currentQ.categoryName}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            {currentAnswer !== undefined && currentAnswer !== null ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> Selected ({currentAnswer})
              </span>
            ) : (
              <span className="text-slate-500 italic">No option selected</span>
            )}
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white font-jakarta leading-snug">
            "{currentQ.text}"
          </h3>
          <p className="text-xs text-slate-400">
            Select a rating from 1 (Not Like Me) to 7 (Exactly Like Me), then click <strong className="text-white">Next Question</strong> below.
          </p>
        </div>

        {/* Error Validation Banner if Next clicked without selecting */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1 to 7 Quick Select Controlled Buttons for Desktop */}
        <div className="hidden sm:grid grid-cols-7 gap-2 pt-2">
          {likertOptions.map((opt) => {
            const isChecked = answers[currentQ.id] === opt.value;
            return (
              <label
                key={opt.value}
                className={`py-3.5 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  isChecked
                    ? 'bg-gradient-to-b from-purple-600 via-indigo-600 to-purple-700 border-purple-400 text-white shadow-xl shadow-purple-500/40 scale-105 ring-2 ring-purple-400 font-extrabold'
                    : 'bg-[#0B132B] border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  value={opt.value}
                  checked={isChecked}
                  onChange={() => handleSelectRating(opt.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                  isChecked ? 'border-white bg-white text-purple-700 font-bold' : 'border-slate-600 bg-slate-900'
                }`}>
                  {isChecked ? '✓' : ''}
                </div>
                <span className="text-lg font-black">{opt.value}</span>
                <span className="text-[9px] leading-tight opacity-80">{opt.label.split(' - ')[1]}</span>
              </label>
            );
          })}
        </div>

        {/* Full List Choices for Mobile / Detailed View */}
        <div className="sm:hidden space-y-2 pt-2">
          {likertOptions.map((opt) => {
            const isChecked = answers[currentQ.id] === opt.value;
            return (
              <label
                key={opt.value}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
                  isChecked
                    ? 'bg-purple-900/80 border-purple-400 text-white shadow-lg ring-1 ring-purple-400 font-extrabold'
                    : 'bg-[#0B132B] border-slate-800 text-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  value={opt.value}
                  checked={isChecked}
                  onChange={() => handleSelectRating(opt.value)}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isChecked ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {opt.value}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className="text-[10px] text-slate-400">{opt.sub}</div>
                  </div>
                </div>
                {isChecked ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 bg-slate-900" />
                )}
              </label>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
          
          <button
            type="button"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${
              currentQuestionIndex === 0
                ? 'opacity-30 cursor-not-allowed text-slate-600 bg-slate-900 border border-slate-800'
                : 'text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Question</span>
          </button>

          {currentQuestionIndex < totalQ - 1 ? (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="flex items-center gap-2.5 px-7 py-3 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 transition-all shadow-lg shadow-sky-500/20 hover:scale-105"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/30 transition-all hover:scale-105"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Submit & View Results</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
