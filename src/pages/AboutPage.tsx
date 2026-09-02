import React from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { Brain, GraduationCap, ShieldCheck, Target, Users, BookOpen, Sparkles, ArrowRight, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveView } = useAssessment();

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <GraduationCap className="w-4 h-4 text-sky-400" />
          <span>HRM301 Industrial Psychology Project</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-jakarta">
          About Persona<span className="text-sky-400">Insight</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Understanding personality dynamics in industrial and organizational settings to enhance workplace performance, leadership development, and individual self-awareness.
        </p>
      </div>

      {/* Grid: Context & Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Purpose & Background */}
        <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-jakarta">Purpose & Academic Scope</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            This platform was built as part of an HRM301 Industrial Psychology project to demonstrate the practical application of psychometric assessment tools in organizational human resource management.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            It allows participants to complete a 25-item validated questionnaire, calculates OCEAN trait scores, generates detailed multidimensional reports, and models realistic revenue creation.
          </p>
        </div>

        {/* Big Five OCEAN Framework */}
        <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-jakarta">The Big Five Taxonomy</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The Five-Factor Model (OCEAN) evaluates Openness, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability. Unlike categorical typologies, it measures continuous trait dimensions backed by decades of psychological empirical research.
          </p>
        </div>

      </div>

      {/* 5 Key Application Pillars */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-8 space-y-6">
        <h3 className="text-xl font-bold text-white font-jakarta flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-400" />
          Key Applications in Industrial Psychology
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-sky-300 font-jakarta">Self-Awareness & Growth</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides objective insight into natural emotional tendencies, helping individuals leverage strengths and mitigate blind spots.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-purple-300 font-jakarta">Career Exploration</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aligns behavioral profiles with work environments, team structures, and professional role responsibilities.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-amber-300 font-jakarta">Leadership & Teamwork</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enhances interpersonal communication, situational leadership readiness, and constructive conflict resolution.
            </p>
          </div>
        </div>
      </div>

      {/* Non-Clinical Disclaimer Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="font-bold text-white flex items-center gap-2 text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Non-Clinical Academic Disclaimer</span>
        </div>
        <p className="leading-relaxed text-slate-400">
          This platform is designed exclusively for educational, self-development, and academic project evaluation purposes under the HRM301 curriculum. It does not provide psychiatric diagnoses, medical opinions, or clinical psychological evaluations.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={() => setActiveView('intake')}
          className="inline-flex items-center gap-2.5 bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl transition-all"
        >
          <span>Take the 25-Item Assessment</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
