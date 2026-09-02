import React from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { Check, ShieldCheck, Zap, Star, ArrowRight } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { setActiveView, config } = useAssessment();

  const plans = [
    {
      name: 'Basic Snapshot',
      price: '₹0',
      period: 'Free Entry',
      badge: 'Free',
      description: 'Quick Big Five profile overview for initial self-awareness.',
      features: [
        'OCEAN 5-Trait Percentages',
        'Personality Archetype Title',
        '3 Core Strengths',
        'Instant Browser Result'
      ],
      cta: 'Start Free Assessment',
      highlighted: false,
      productCode: 'SNAPSHOT'
    },
    {
      name: 'Full Academic & Consulting Report',
      price: `₹${config?.reportPrice || 49}`,
      period: 'One-Time',
      badge: 'Most Popular',
      description: 'Complete 15-section Industrial Psychology report with PDF download.',
      features: [
        'All 10 Academic Outcome Modules',
        '3–5 Actionable Recommendations',
        'Leadership & Communication Style',
        'Career Suitability & Work Style',
        'Downloadable Consulting PDF Report',
        'Times New Roman 12/14 Formatting'
      ],
      cta: 'Unlock Full Report',
      highlighted: true,
      productCode: 'FULL_REPORT'
    },
    {
      name: 'Executive & Document Intelligence',
      price: '₹199',
      period: 'One-Time',
      badge: 'Complete Suite',
      description: 'Personality Report + Product B AI Document Intelligence Credits.',
      features: [
        'Full 15-Section Personality Report',
        '5 AI Document Quality Analyses (PDF/XLSX/CSV)',
        'Data Quality Score (/100) & Column Audit',
        '1-on-1 Consulting Debrief Framework',
        'Priority Payment Verification'
      ],
      cta: 'Get Complete Suite',
      highlighted: false,
      productCode: 'PREMIUM_CONSULTING'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Affordable Consulting Pricing
        </span>
        <h1 className="text-4xl font-extrabold text-white">Transparent, Student-Friendly Pricing</h1>
        <p className="text-slate-400 text-sm md:text-base">
          Get institutional-grade Industrial Psychology evaluation at a fraction of standard consulting costs.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div 
            key={idx}
            className={`rounded-3xl p-8 space-y-6 flex flex-col justify-between transition-all ${
              plan.highlighted 
                ? 'bg-gradient-to-b from-indigo-900/60 to-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-105' 
                : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  plan.highlighted ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {plan.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-xs text-slate-400">/ {plan.period}</span>
              </div>

              <ul className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-indigo-400' : 'text-emerald-400'}`} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setActiveView('intake')}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                plan.highlighted 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              <span>{plan.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Security & Verification Guarantee */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-white text-sm">Verified UPI Payment Process</h4>
            <p className="text-slate-400">Scan PhonePe QR → Enter 12-digit UTR → Instant Admin Verification & Report Unlock.</p>
          </div>
        </div>
        <button
          onClick={() => setActiveView('academic-project')}
          className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
        >
          View Revenue Model Standards
        </button>
      </div>

    </div>
  );
};
