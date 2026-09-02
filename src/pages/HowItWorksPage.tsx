import React from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { ClipboardList, Cpu, CreditCard, FileCheck2, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { setActiveView } = useAssessment();

  const steps = [
    {
      step: '01',
      title: 'Complete 25-Item Psychometric Questionnaire',
      desc: 'Answer 25 standardized Big Five personality items using a 1 to 7 Likert scale.',
      icon: ClipboardList,
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10'
    },
    {
      step: '02',
      title: 'Server-Side OCEAN & Competency Scoring Engine',
      desc: 'Our deterministic scoring backend computes raw OCEAN trait sums (5 to 35) and 6 workplace competencies.',
      icon: Cpu,
      color: 'text-sky-400 border-sky-500/30 bg-sky-500/10'
    },
    {
      step: '03',
      title: 'UPI Payment & Reference Verification',
      desc: 'Scan the PhonePe QR code, complete payment of ₹49, and submit your 12-digit UTR transaction ID for admin verification.',
      icon: CreditCard,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
    },
    {
      step: '04',
      title: 'Instant Report Unlock & PDF Download',
      desc: 'Access your full 15-section Industrial Psychology report with 3-5 personalized action recommendations and PDF export.',
      icon: FileCheck2,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Simple 4-Step Process
        </span>
        <h1 className="text-4xl font-extrabold text-white">How PersonaInsight Works</h1>
        <p className="text-slate-400 text-sm md:text-base">
          From psychometric assessment intake to verified PDF report download in under 5 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((item, i) => {
          const IconComp = item.icon;
          return (
            <div key={i} className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 space-y-4 relative">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${item.color}`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-slate-700 font-mono">{item.step}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-6">
        <button
          onClick={() => setActiveView('intake')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition-transform hover:scale-105"
        >
          <span>Start Your Assessment Now</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
