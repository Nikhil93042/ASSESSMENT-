import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { Brain, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useAssessment();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-sky-400" />
              <span className="text-base font-bold text-white">PersonaInsight</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Affordable Industrial Psychology Personality Assessment & AI Document Intelligence Platform. Developed for HRM301 Academic Standards.
            </p>
          </div>

          {/* Product A */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Product A: Personality</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveView('intake')} className="hover:text-white transition-colors">Take 25-Item Assessment</button></li>
              <li><button onClick={() => setActiveView('about')} className="hover:text-white transition-colors">About Big Five (OCEAN)</button></li>
              <li><button onClick={() => setActiveView('pricing')} className="hover:text-white transition-colors">Pricing & Report Plans</button></li>
              <li><button onClick={() => setActiveView('how-it-works')} className="hover:text-white transition-colors">How It Works</button></li>
            </ul>
          </div>

          {/* Product B & Academic */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Product B & Standards</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveView('analysis')} className="hover:text-white transition-colors">AI Document Intelligence</button></li>
              <li><button onClick={() => setActiveView('academic-project')} className="hover:text-white transition-colors">HRM301 Academic Page</button></li>
              <li><button onClick={() => setActiveView('faq')} className="hover:text-white transition-colors">Frequently Asked Questions</button></li>
              <li><button onClick={() => setActiveView('contact')} className="hover:text-white transition-colors">Contact Support</button></li>
            </ul>
          </div>

          {/* Legal & Admin */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveView('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => setActiveView('terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
              <li><button onClick={() => setActiveView('disclaimer')} className="hover:text-white transition-colors">Assessment Disclaimer</button></li>
              <li><button onClick={() => setActiveView('admin')} className="text-sky-400 hover:text-sky-300 transition-colors font-semibold">Admin Panel</button></li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Bar */}
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p><strong>Non-Clinical Notice:</strong> PersonaInsight is designed solely for self-development, career evaluation, and educational research as part of the HRM301 Industrial Psychology project. It does not provide clinical diagnosis or psychiatric certification.</p>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} PersonaInsight HRM301 Project. All rights reserved.</p>
          <p className="flex items-center gap-1">Designed for Industrial Psychology Excellence <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /></p>
        </div>

      </div>
    </footer>
  );
};
