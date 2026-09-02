import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { ClipboardList, BarChart, Lock, Rocket, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { setActiveView } = useAssessment();

  const steps = [
    {
      step: '01',
      title: 'Take the Assessment',
      desc: 'Answer 25 non-clinical personality questions evaluated on a 5-point Likert scale (5-10 minutes).',
      icon: ClipboardList,
      color: 'from-sky-500 to-blue-600',
    },
    {
      step: '02',
      title: 'Get Your Profile',
      desc: 'Instantly view your calculated OCEAN trait percentages and interactive radar chart profile.',
      icon: BarChart,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      step: '03',
      title: 'Unlock Detailed Insights',
      desc: 'Complete the seamless ₹49 UPI payment & UTR submission to verify access to your full 14-section report.',
      icon: Lock,
      color: 'from-amber-500 to-orange-600',
    },
    {
      step: '04',
      title: 'Understand & Develop',
      desc: 'Access personalized recommendations, career fit, leadership style, and downloadable PDF report.',
      icon: Rocket,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#0B132B] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-jakarta">
            How PersonaInsight Works
          </h2>
          <p className="text-slate-300 text-base">
            From initial survey response to in-depth development planning, our platform delivers an intuitive experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="relative bg-[#131B2E] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between group hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-700 group-hover:text-slate-500 transition-colors">
                      {s.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-jakarta mb-2">
                    {s.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                    <ArrowRight className="w-6 h-6 text-slate-700" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setActiveView('intake')}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-600/20"
          >
            <span>Begin Your Assessment Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
