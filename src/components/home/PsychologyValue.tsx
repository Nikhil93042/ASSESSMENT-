import React from 'react';
import { Target, Users, ShieldAlert, Award, Compass, Sparkles } from 'lucide-react';

export const PsychologyValue: React.FC = () => {
  const benefits = [
    {
      title: "Self-Awareness & Growth",
      desc: "Gain objective awareness into personal behavioral habits, emotional regulation, and interpersonal style.",
      icon: Compass,
      color: "text-sky-400"
    },
    {
      title: "Career & Work Environment Fit",
      desc: "Identify organizational environments and job roles that align with your natural motivation and stress resilience.",
      icon: Target,
      color: "text-purple-400"
    },
    {
      title: "Leadership & Conflict Potential",
      desc: "Understand your assertiveness, initiative in leaderless settings, and approach to resolving team friction.",
      icon: Users,
      color: "text-amber-400"
    },
    {
      title: "Non-Clinical Educational Scope",
      desc: "Designed specifically for HRM301 Industrial Psychology research, focusing on workplace effectiveness.",
      icon: ShieldAlert,
      color: "text-emerald-400"
    }
  ];

  return (
    <section className="py-20 bg-[#0E172E] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Industrial Psychology Value</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-jakarta">
              Why Personality Assessment Matters in HRM
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Industrial and Organizational (I/O) Psychology leverages personality profiling to match talent with optimal roles, enhance leadership development, and foster psychological safety across workforces.
            </p>
            <div className="p-4 rounded-xl bg-[#131B2E] border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-sky-400" />
                <span>Academic Project Context (HRM301)</span>
              </div>
              <p className="text-slate-400">
                This service supports the coursework requirement for evaluating personality assessment reports, calculating Big Five OCEAN metrics, and documenting evidence of value creation.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all space-y-3">
                  <Icon className={`w-8 h-8 ${b.color}`} />
                  <h3 className="text-base font-bold text-white font-jakarta">{b.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
