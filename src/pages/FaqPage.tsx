import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What methodology is used in the personality assessment?",
      a: "The assessment utilizes the Big Five Personality Inventory (OCEAN Model) — evaluating Openness to Experience, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability using 25 standardized Industrial Psychology survey items."
    },
    {
      q: "Is this assessment a clinical psychological diagnosis?",
      a: "No. This assessment is intended strictly for educational, self-awareness, developmental, and career counseling purposes as part of the HRM301 Industrial Psychology curriculum. It does not provide medical or psychiatric diagnoses."
    },
    {
      q: "How does the PhonePe UPI payment verification work?",
      a: "After completing your assessment, you scan the provided PhonePe QR code to transfer ₹49. Once paid, enter your 12-digit UPI transaction reference (UTR) on the portal. An administrator verifies the transaction reference in the backend to unlock your complete report."
    },
    {
      q: "Can I download my report as a PDF?",
      a: "Yes! Once your payment is verified by the admin, you can view and download your full consulting report as a formatted PDF matching academic standards (Times New Roman font 12 body / 14 headings)."
    },
    {
      q: "What is Product B (AI Document Intelligence)?",
      a: "Product B allows users and administrators to upload PDF documents or XLSX/CSV spreadsheets for automated structural profiling, data completeness auditing, Quality Scoring (/100), and personalized recommendations."
    },
    {
      q: "How are my assessment responses and personal data protected?",
      a: "We implement role-based access control, encrypted session authentication, and server-side data validation. Participant data is never shared with third parties."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl font-extrabold text-white">Got Questions? We Have Answers</h1>
        <p className="text-slate-400 text-sm">Everything you need to know about our assessment and document intelligence platform.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div 
            key={i}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full p-5 text-left font-bold text-white flex items-center justify-between gap-4 hover:text-sky-400 transition-colors"
            >
              <span className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-sky-400 flex-shrink-0" />
                {faq.q}
              </span>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openIndex === i ? 'rotate-180 text-sky-400' : ''}`} />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5 text-sm text-slate-300 border-t border-slate-800/50 pt-4 leading-relaxed bg-slate-950/40">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
