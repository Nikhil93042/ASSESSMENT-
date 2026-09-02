import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is the PersonaInsight personality assessment?",
      a: "It is an online psychometric instrument built around the Five-Factor Model (OCEAN) for an HRM301 Industrial Psychology project. It measures five broad personality dimensions to provide objective workplace self-awareness."
    },
    {
      q: "How long does the assessment take?",
      a: "The assessment consists of 25 structured Likert-scale questions and takes approximately 5 to 10 minutes to complete."
    },
    {
      q: "What is the OCEAN model?",
      a: "OCEAN stands for Openness to Experience, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability (inverse of Neuroticism). It is the most widely researched and empirically validated personality taxonomy in psychological science."
    },
    {
      q: "How is my personality score calculated?",
      a: "Each of the 25 questions belongs to one of the 5 OCEAN dimensions. Responses (1 to 5 scale) are aggregated and normalized into percentage trait scores (0% to 100%) and categorised into High, Moderate, or Low trait levels."
    },
    {
      q: "What does the ₹49 Detailed Report contain?",
      a: "The unlocked detailed report includes all 14 academic assignment required sections: Participant Information, Overall Profile, OCEAN Scores, Archetype Summary, Major Strengths, Leadership Potential, Communication Style, Decision-Making Style, Career Suitability, Learning Style, Stress/Coping Tendencies, Motivational Drivers, 3-5 Development Recommendations, and Disclaimers."
    },
    {
      q: "How do I pay using UPI QR Code?",
      a: "Click 'Unlock Detailed Report' after taking the assessment. Scan the generated QR code or copy the UPI ID (`hrm301.personainsight@upi`) in your payment app (Google Pay, PhonePe, Paytm, BHIM), pay ₹49, and enter your 12-digit UTR transaction number to submit for verification."
    },
    {
      q: "Is this a clinical psychological test?",
      a: "No. This tool is designed strictly for educational, research, and personal self-development purposes within an HRM301 Industrial Psychology academic curriculum. It is non-clinical and does not diagnose psychological conditions."
    },
    {
      q: "Can I download or print my detailed report?",
      a: "Yes! Once your payment is verified (or in Demo Mode), you can print or download the complete 14-section report formatted cleanly as a PDF document."
    }
  ];

  return (
    <section className="py-20 bg-[#0B132B] border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-jakarta">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-300 text-sm">
            Everything you need to know about the HRM301 personality assessment platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-[#131B2E] border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-white text-base hover:text-sky-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-sky-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
