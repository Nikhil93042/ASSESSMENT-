import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { Sparkles, ArrowRight, ShieldCheck, Award, Brain, CheckCircle2, TrendingUp, Users } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveView } = useAssessment();

  return (
    <div className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/80">
      
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-purple-600/20 via-sky-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -top-10 right-10 w-[300px] h-[300px] bg-indigo-600/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>HRM301 Industrial Psychology Academic Project</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-jakarta">
              Discover Your Personality. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-sky-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Understand Your Potential.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Measure your Big Five (OCEAN) personality traits using our 25-item industrial psychology assessment. Gain deep self-awareness into your leadership style, communication, stress coping tendencies, and career alignment.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setActiveView('intake')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-purple-600/25 transition-all hover:scale-102 active:scale-98"
              >
                <span>Start Assessment</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setActiveView('about');
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-base px-6 py-4 rounded-xl transition-colors"
              >
                <span>How It Works</span>
              </button>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>25 Validated Items</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Instant OCEAN Profile</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>14-Section Detailed Report</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Card glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600 to-sky-500 opacity-30 blur-lg" />

              <div className="relative bg-[#131B2E] border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
                
                {/* Header inside card */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">OCEAN Personality Model</h3>
                      <p className="text-xs text-slate-400">Psychometric Framework</p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-medium">
                    Validated Model
                  </span>
                </div>

                {/* Score Sample Bars */}
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-sky-300">Openness (O)</span>
                      <span className="text-white">88% (High)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-400 rounded-full w-[88%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-purple-300">Conscientiousness (C)</span>
                      <span className="text-white">82% (High)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full w-[82%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-amber-300">Extraversion (E)</span>
                      <span className="text-white">76% (High)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full w-[76%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-emerald-300">Agreeableness (A)</span>
                      <span className="text-white">70% (Moderate)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full w-[70%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-rose-300">Emotional Stability (N)</span>
                      <span className="text-white">85% (High)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 rounded-full w-[85%]" />
                    </div>
                  </div>
                </div>

                {/* Archetype Badge preview */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Sample Archetype</div>
                      <div className="text-[11px] text-slate-400">Transformational Leader</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-lg">
                    Detailed Report ₹49
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
