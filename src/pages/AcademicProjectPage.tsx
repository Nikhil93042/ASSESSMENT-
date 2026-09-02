import React from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { BookOpen, CheckCircle2, Award, FileText, ArrowRight, ShieldAlert, Sparkles, DollarSign } from 'lucide-react';

export const AcademicProjectPage: React.FC = () => {
  const { setActiveView } = useAssessment();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-100 font-sans">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-[#0B132B] p-8 md:p-10 rounded-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Academic Project Specification
          </span>
          <span className="text-slate-400 text-xs font-mono">HRM301 Industrial Psychology</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Industrial Psychology Personality Assessment & Consulting Framework
        </h1>
        
        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
          This platform operates as an affordable Industrial Psychology consulting service developed according to the academic guidelines of the HRM301 course. It delivers psychometric evaluation based on the Big Five Personality Inventory (OCEAN Model) with automated revenue evidence tracking and academic PDF compliance.
        </p>

        <div className="pt-2 flex flex-wrap gap-4">
          <button
            onClick={() => setActiveView('intake')}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-102"
          >
            <span>Launch Personality Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Section 1: Academic Objectives & Mode Selection */}
      <div className="bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <BookOpen className="w-6 h-6 text-sky-400" />
          <h2 className="text-xl font-bold text-white">1. Designing the Assessment Mode (5 Marks)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 bg-slate-950 p-5 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider">Assessment Objectives</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Provide students and corporate employees with objective self-awareness across Big Five (OCEAN) dimensions.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Identify leadership initiative, decision-making composure, and stress-coping mechanisms under workload pressure.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Deliver 3–5 personalized, actionable developmental recommendations for career readiness.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 bg-slate-950 p-5 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Mode Selection & Justification</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Selected Mode:</strong> Online Interactive Web Platform & Digital Survey Engine.<br /><br />
              <strong>Justification:</strong> Digital delivery ensures 100% server-side scoring accuracy, instant report generation, high participant scalability across academic batches, and seamless UPI payment evidence collection without manual record-keeping errors.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Implementation Plan */}
      <div className="bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">2. Assessment Implementation Plan (5 Marks)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase">Target Participants</h3>
            <p className="text-xs text-slate-200">
              University students preparing for campus placements, early-career professionals, managerial candidates, and corporate teams seeking organizational development.
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase">Importance</h3>
            <p className="text-xs text-slate-200">
              Helps individuals understand their natural behavioral tendencies, preventing career-role misalignment and improving workplace collaboration.
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase">Scope</h3>
            <p className="text-xs text-slate-200">
              Covers 10 core industrial outcomes including leadership, communication, stress resilience, career suitability, and motivational drivers.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: 10 Report Outcomes */}
      <div className="bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <Award className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">3. Evaluation of Personality Assessment Reports (10 Marks)</h2>
        </div>

        <p className="text-xs text-slate-300">
          The generated consulting reports comprehensively cover all required outcome modules:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            '1. Overall Personality Profile',
            '2. Personality Type Summary',
            '3. Major Strengths',
            '4. Leadership Potential',
            '5. Communication Style',
            '6. Decision-Making Style',
            '7. Career Suitability',
            '8. Learning Style',
            '9. Stress & Coping Tendencies',
            '10. Motivational Drivers',
            '11. Summary & Action Plan',
            '12. 3–5 Personalized Recommendations'
          ].map((item, i) => (
            <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-medium text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Revenue Model & Evidence */}
      <div className="bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <DollarSign className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">4. Revenue Generation & Evidence (10 Marks)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Up to ₹500</span>
            <div className="text-lg font-bold text-slate-200">Foundation Level</div>
            <span className="text-xs text-slate-400">Awarded Marks: 5</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-amber-500/30 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase">₹501 – ₹999</span>
            <div className="text-lg font-bold text-amber-300">Emerging Performer</div>
            <span className="text-xs text-slate-400">Awarded Marks: 7</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-emerald-500/30 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase">₹1,000 – ₹5,000</span>
            <div className="text-lg font-bold text-emerald-300">Performer Level</div>
            <span className="text-xs text-slate-400">Awarded Marks: 10</span>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          * Documentary evidence of verified payments can be exported by administrators directly from the Admin Dashboard in CSV/PDF format, containing valid transaction reference IDs (UTRs), timestamps, and total verified revenue.
        </p>
      </div>

      {/* Section 5: Academic Report Formatting Guidelines */}
      <div className="bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <FileText className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">5. Written Report & PDF Guidelines</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-white block">Font & Formatting Compliance</span>
            <ul className="space-y-1 text-slate-400">
              <li>• Body Font: <strong>Times New Roman 12pt</strong></li>
              <li>• Heading Font: <strong>Times New Roman 14pt (Bold)</strong></li>
              <li>• Format: MS-Word / PDF Upload</li>
            </ul>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-white block">Annexure First Page Cover</span>
            <ul className="space-y-1 text-slate-400">
              <li>• Course Title & Code: HRM301 Industrial Psychology</li>
              <li>• Evaluation Rubric Annexure attached to front of final submission.</li>
              <li>• Signed student declaration of original work.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Non-Clinical Disclaimer */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
        <span>
          <strong>Academic Disclaimer:</strong> This platform is designed solely for self-development and academic learning under the HRM301 curriculum. It does not provide clinical psychological diagnosis or medical certifications.
        </span>
      </div>

    </div>
  );
};
