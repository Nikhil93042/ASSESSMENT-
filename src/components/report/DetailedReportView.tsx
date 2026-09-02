import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { OceanRadarChart } from '../results/OceanRadarChart';
import { 
  Printer, ArrowLeft, Brain, CheckCircle2, Award, Zap, ShieldCheck
} from 'lucide-react';

export const DetailedReportView: React.FC = () => {
  const { reportData, setActiveView, oceanScores, competencyScores } = useAssessment();

  if (!reportData || !oceanScores) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">No report available. Please complete the assessment and payment verification first.</p>
        <button onClick={() => setActiveView('intake')} className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl font-bold">
          Start Assessment
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const compsToUse = reportData.competencyProfile || competencyScores || [];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-10">
      
      {/* Top Action Bar (Hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden bg-[#131B2E] border border-slate-800 p-4 rounded-2xl">
        <button
          onClick={() => setActiveView('results')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 px-4 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Wrapper */}
      <div id="printable-report" className="space-y-8 bg-[#131B2E] border border-slate-800 rounded-3xl p-6 sm:p-12 text-slate-100 shadow-2xl print:bg-white print:text-slate-900 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b border-slate-800 print:border-slate-300 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center print:bg-purple-100">
                <Brain className="w-6 h-6 text-sky-400 print:text-purple-700" />
              </div>
              <span className="text-2xl font-black font-jakarta tracking-tight text-white print:text-slate-900">
                Persona<span className="text-sky-400 print:text-purple-600">Insight</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 print:text-slate-600 font-medium">
              Detailed Industrial Psychology Assessment & Competency Report
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400 print:text-slate-600 space-y-1">
            <div>Report ID: <span className="font-mono font-bold text-white print:text-slate-900">{reportData.reportId || reportData.assessmentId}</span></div>
            <div>Date Generated: <span className="font-semibold text-slate-200 print:text-slate-800">{new Date(reportData.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
            <div className="text-[11px] text-purple-400 print:text-purple-700 font-bold">HRM301 Academic Project</div>
          </div>
        </div>

        {/* SECTION 1: Participant Information */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 print:text-purple-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 print:bg-purple-100 print:text-purple-800 flex items-center justify-center text-[11px]">1</span>
            Participant Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#0B132B] print:bg-slate-50 border border-slate-800 print:border-slate-200 p-4 rounded-2xl text-xs">
            <div>
              <span className="text-slate-400 print:text-slate-500 block">Full Name</span>
              <strong className="text-white print:text-slate-900 text-sm font-jakarta">{reportData.participantInfo?.name || 'Participant'}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 block">Email Address</span>
              <strong className="text-white print:text-slate-900">{reportData.participantInfo?.email}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 block">Category</span>
              <strong className="text-purple-300 print:text-purple-700">{reportData.participantInfo?.category || 'Student'}</strong>
            </div>
          </div>
        </section>

        {/* SECTION 2: Overall Personality Profile */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 print:text-purple-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 print:bg-purple-100 print:text-purple-800 flex items-center justify-center text-[11px]">2</span>
            Overall Personality Profile
          </h3>
          <div className="p-5 rounded-2xl bg-[#0B132B] print:bg-slate-50 border border-slate-800 print:border-slate-200 text-sm text-slate-200 print:text-slate-800 leading-relaxed space-y-2">
            <p>{reportData.overallProfile}</p>
          </div>
        </section>

        {/* SECTION 3: OCEAN Personality Scores */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 print:text-purple-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 print:bg-purple-100 print:text-purple-800 flex items-center justify-center text-[11px]">3</span>
            OCEAN Personality Scores
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-[#0B132B] print:bg-slate-50 border border-slate-800 print:border-slate-200 p-4 rounded-2xl">
              <OceanRadarChart scores={reportData.oceanScores} />
            </div>

            <div className="space-y-3">
              {reportData.traitDetails.map((t) => (
                <div key={t.category} className="p-3.5 rounded-xl bg-[#0B132B] print:bg-slate-50 border border-slate-800 print:border-slate-200 space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-white print:text-slate-900">{t.title}</span>
                    <span className="text-purple-400 print:text-purple-700 font-mono">{t.score}% ({t.level})</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 print:bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${t.score}%`, backgroundColor: t.color }} />
                  </div>
                  <p className="text-[11px] text-slate-400 print:text-slate-600">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: Personality Type Summary */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 print:text-purple-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 print:bg-purple-100 print:text-purple-800 flex items-center justify-center text-[11px]">4</span>
            Personality Type Summary
          </h3>
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 print:bg-purple-50 border border-purple-500/30 print:border-purple-200 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold bg-purple-500/20 text-purple-300 print:bg-purple-200 print:text-purple-900 px-3 py-1 rounded-full uppercase">
                {reportData.archetype?.badge || 'Strategic Operator'}
              </span>
              <h4 className="text-lg font-bold text-white print:text-slate-900 font-jakarta">{reportData.archetype?.title}</h4>
            </div>
            <p className="text-xs font-semibold text-sky-300 print:text-purple-700">{reportData.archetype?.tagline}</p>
            <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">{reportData.archetype?.summary}</p>
          </div>
        </section>

        {/* SECTION 5: Major Strengths */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 print:text-purple-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 print:bg-purple-100 print:text-purple-800 flex items-center justify-center text-[11px]">5</span>
            Major Strengths
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reportData.majorStrengths?.map((str, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#0B132B] print:bg-slate-50 border border-slate-800 print:border-slate-200 flex items-start gap-3 text-xs text-slate-200 print:text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-600 shrink-0 mt-0.5" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: Leadership Potential */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 print:text-purple-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 print:bg-purple-100 print:text-purple-800 flex items-center justify-center text-[11px]">6</span>
            Leadership Potential
          </h3>
          <div className="p-5 rounded-2xl bg-[#0B132B] print:bg-slate-50 border border-slate-800 print:border-slate-200 space-y-3 text-xs">
            <div>
              <span className="font-bold text-white print:text-slate-900 block mb-1">Primary Leadership Style:</span>
              <p className="text-slate-300 print:text-slate-700 leading-relaxed">{reportData.leadershipPotential?.style}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800 print:border-slate-200">
              <div>
                <strong className="text-emerald-400 print:text-emerald-700 block mb-1">Key Leadership Assets:</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-300 print:text-slate-700">
                  {reportData.leadershipPotential?.strengths?.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div>
                <strong className="text-amber-400 print:text-amber-700 block mb-1">Leadership Growth Areas:</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-300 print:text-slate-700">
                  {reportData.leadershipPotential?.growthAreas?.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: Communication Style */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 print:text-purple-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 print:bg-purple-100 print:text-purple-800 flex items-center justify-center text-[11px]">7</span>
            Communication Style
          </h3>
          <div className="p-5 rounded-2xl bg-[#0B132B] print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs space-y-3">
            <p className="text-slate-200 print:text-slate-800 leading-relaxed">{reportData.communicationStyle?.description}</p>
            <div className="pt-2 border-t border-slate-800 print:border-slate-200">
              <span className="font-bold text-sky-300 print:text-purple-700 block mb-1.5">Actionable Interpersonal Tips:</span>
              <ul className="space-y-1.5 text-slate-300 print:text-slate-700">
                {reportData.communicationStyle?.tips?.map((tip, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 print:bg-purple-600" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 8: Decision-Making Style */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 print:text-purple-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 print:bg-purple-100 print:text-purple-800 flex items-center justify-center text-[11px]">8</span>
            Decision-Making Style
          </h3>
          <div className="p-5 rounded-2xl bg-[#0B132B] print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs space-y-3">
            <p className="text-slate-200 print:text-slate-800 font-semibold">{reportData.decisionMakingStyle?.approach}</p>
            <div className="flex flex-wrap gap-2">
              {reportData.decisionMakingStyle?.characteristics?.map((c, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-slate-800 print:bg-slate-200 text-slate-300 print:text-slate-800 text-[11px]">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 9: Career Suitability */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 print:text-purple-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 print:bg-purple-100 print:text-purple-800 flex items-center justify-center text-[11px]">9</span>
            Career Suitability
          </h3>
          <div className="p-5 rounded-2xl bg-[#0B132B] print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <strong className="text-purple-300 print:text-purple-700 block mb-1.5">Recommended Work Environments:</strong>
                <ul className="space-y-1 text-slate-300 print:text-slate-700 list-disc list-inside">
                  {reportData.careerSuitability?.bestFitEnvironments?.map((env, i) => <li key={i}>{env}</li>)}
                </ul>
              </div>
              <div>
                <strong className="text-sky-300 print:text-purple-700 block mb-1.5">High-Match Role Examples:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {reportData.careerSuitability?.topRoles?.map((role, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 print:bg-purple-100 print:text-purple-800 font-semibold text-[11px]">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-slate-400 print:text-slate-600 italic border-t border-slate-800 print:border-slate-200 pt-2">
              Note: {reportData.careerSuitability?.workStyleNotes}
            </p>
          </div>
        </section>

        {/* SECTION 10: Learning Style */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 print:text-purple-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 print:bg-purple-100 print:text-purple-800 flex items-center justify-center text-[11px]">10</span>
            Learning Style
          </h3>
          <div className="p-5 rounded-2xl bg-[#0B132B] print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs space-y-2">
            <p className="text-white print:text-slate-900 font-bold">Preferred Mode: {reportData.learningStyle?.preferredMode}</p>
            <ul className="space-y-1 text-slate-300 print:text-slate-700 list-disc list-inside">
              {reportData.learningStyle?.tips?.map((tip, idx) => <li key={idx}>{tip}</li>)}
            </ul>
          </div>
        </section>

        {/* SECTION 11: Stress and Coping Tendencies */}
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 print:text-purple-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 print:bg-purple-100 print:text-purple-800 flex items-center justify-center text-[11px]">11</span>
            Stress and Coping Tendencies
          </h3>
          <div className="p-5 rounded-2xl bg-[#0B132B] print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white print:text-slate-900">Resilience Rating:</span>
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 print:bg-emerald-100 print:text-emerald-800 font-bold">
                {reportData.stressAndCoping?.resilienceRating}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <strong className="text-rose-400 print:text-rose-700 block mb-1">Potential Stress Triggers:</strong>
                <ul className="space-y-1 text-slate-300 print:text-slate-700 list-disc list-inside">
                  {reportData.stressAndCoping?.triggers?.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
              <div>
                <strong className="text-emerald-400 print:text-emerald-700 block mb-1">Recommended Coping Strategies:</strong>
                <ul className="space-y-1 text-slate-300 print:text-slate-700 list-disc list-inside">
                  {reportData.stressAndCoping?.copingStrategies?.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 12: Competency Profile Indicators */}
        {compsToUse.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 print:text-purple-700 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 print:bg-purple-100 print:text-purple-800 flex items-center justify-center text-[11px]">12</span>
              Workplace Competency Profile Indicators
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {compsToUse.map((comp) => (
                <div key={comp.id} className="p-3.5 rounded-xl bg-[#0B132B] print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-white print:text-slate-900">{comp.name}</span>
                    <span className="text-sky-300 print:text-purple-700 font-mono">{comp.score}% ({comp.level})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 print:text-slate-600">{comp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 13: 3-5 Personalized Development Recommendations */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 print:text-purple-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 print:bg-purple-100 print:text-purple-800 flex items-center justify-center text-[11px]">13</span>
            Personalized Development Recommendations (3–5 Steps)
          </h3>
          <div className="space-y-3">
            {reportData.developmentRecommendations?.map((rec) => (
              <div key={rec.id} className="p-4 rounded-2xl bg-[#0B132B] print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white print:text-slate-900 font-jakarta text-sm">{rec.id}. {rec.title}</h4>
                  <span className="px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-300 print:bg-purple-100 print:text-purple-800 font-semibold text-[10px]">
                    {rec.focusArea}
                  </span>
                </div>
                <p className="text-slate-300 print:text-slate-700 leading-relaxed">{rec.description}</p>
                <div className="p-2.5 rounded-xl bg-slate-900/80 print:bg-purple-50 text-sky-300 print:text-purple-900 font-semibold text-[11px]">
                  <strong>Actionable Step: </strong>{rec.actionableStep}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 14: Summary & Academic Disclaimer */}
        <section className="space-y-4 pt-4 border-t border-slate-800 print:border-slate-300">
          <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 print:text-purple-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 print:bg-purple-100 print:text-purple-800 flex items-center justify-center text-[11px]">14</span>
            Summary & Non-Clinical Disclaimer
          </h3>
          <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
            {reportData.summary}
          </p>

          <div className="p-4 rounded-xl bg-rose-950/30 print:bg-slate-100 border border-rose-500/30 print:border-slate-300 text-[11px] text-slate-300 print:text-slate-600 space-y-1">
            <strong className="text-rose-400 print:text-slate-800 block">Non-Clinical Educational Disclaimer:</strong>
            <p>{reportData.disclaimer}</p>
          </div>
        </section>

      </div>

    </div>
  );
};
