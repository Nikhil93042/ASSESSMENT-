import React, { useEffect } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { OceanRadarChart } from './OceanRadarChart';
import { 
  Sparkles, Lock, ArrowRight, CheckCircle2, Award, Zap, 
  ShieldAlert, BookOpen, HeartHandshake, TrendingUp, Compass, Target
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BasicResultsView: React.FC = () => {
  const { reportData, oceanScores, competencyScores, setActiveView, participant, config } = useAssessment();

  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  if (!reportData || !oceanScores) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">No assessment data found. Please complete the assessment first.</p>
        <button onClick={() => setActiveView('intake')} className="mt-4 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold">
          Start Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-12">
      
      {/* Motivational Post-Completion Banner */}
      <div className="bg-gradient-to-r from-purple-900/80 via-slate-900 to-indigo-950 border border-purple-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          <span>Assessment Complete!</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-jakarta">
          Great Job, {participant?.name}!
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          You've taken the first step toward understanding your core psychological strengths, leadership potential, and workplace competency indicators. Your responses have been processed through the Big Five OCEAN scoring engine.
        </p>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-purple-300">
          <span>Assessment ID: <strong className="font-mono text-sky-400">{reportData.assessmentId}</strong></span>
          <span>•</span>
          <span>Archetype: <strong className="text-white">{reportData.archetype.title}</strong></span>
        </div>
      </div>

      {/* Grid: Radar Chart + OCEAN Trait Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Radar Chart */}
        <div className="lg:col-span-6 bg-[#131B2E] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white font-jakarta flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              Calculated OCEAN Trait Profile
            </h3>
            <span className="text-xs text-slate-400">Score 0 - 100%</span>
          </div>
          <OceanRadarChart scores={oceanScores} />
        </div>

        {/* Right: Score Progress Bars */}
        <div className="lg:col-span-6 space-y-3">
          {reportData.traitDetails.map((trait) => (
            <div key={trait.category} className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-white font-jakarta text-sm">{trait.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-300">
                    {trait.level}
                  </span>
                  <span style={{ color: trait.color }} className="font-mono text-base font-extrabold">
                    {trait.score}%
                  </span>
                </div>
              </div>
              
              <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${trait.score}%`, backgroundColor: trait.color }}
                />
              </div>

              <p className="text-[11px] text-slate-400">
                {trait.description}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Competency Profile Summary */}
      {competencyScores && competencyScores.length > 0 && (
        <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white font-jakarta flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                Workplace Competency Indicators (0–100 Scale)
              </h3>
              <p className="text-xs text-slate-400">Calculated from item responses for professional self-development.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {competencyScores.map((comp) => (
              <div key={comp.id} className="p-4 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-white font-jakarta">{comp.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    comp.level === 'Very Strong' ? 'bg-emerald-500/20 text-emerald-300' :
                    comp.level === 'Strong' ? 'bg-purple-500/20 text-purple-300' :
                    comp.level === 'Emerging' ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {comp.level}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-2 flex-1 bg-slate-900 rounded-full overflow-hidden mr-3">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-sky-400 rounded-full" style={{ width: `${comp.score}%` }} />
                  </div>
                  <span className="font-mono text-xs font-bold text-sky-300">{comp.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unlock Detailed Report Call-To-Action Banner */}
      <div className="relative bg-gradient-to-r from-purple-900/90 via-slate-900 to-indigo-950 border-2 border-purple-500/60 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          
          <div className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Full 13-Section Detailed Personality Report</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white font-jakarta">
              Unlock Your Complete Personalized Personality Report
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Access the complete breakdown of Communication Style, Decision-Making, Career Alignment, Learning Style, Stress & Coping Tendencies, Motivational Drivers, Competencies, 3–5 Actionable Recommendations, and downloadable PDF report.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300 pt-2">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Career Suitability</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Stress Resilience</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3-5 Recommendations</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Download PDF</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="text-center">
              <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Report Price</span>
              <span className="text-4xl font-extrabold text-white font-jakarta">₹{config.reportPrice}</span>
              <span className="text-xs text-slate-400 block">UPI Transfer</span>
            </div>

            <button
              onClick={() => setActiveView('payment')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-base px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
            >
              <Lock className="w-5 h-5" />
              <span>Unlock Detailed Report (₹{config.reportPrice})</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
