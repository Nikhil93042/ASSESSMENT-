import React from 'react';
import { ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

export const LegalPages: React.FC<{ type: 'privacy' | 'terms' | 'disclaimer' }> = ({ type }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-200">
      
      {type === 'privacy' && (
        <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
          </div>
          
          <div className="space-y-4 text-xs leading-relaxed text-slate-300">
            <p><strong>1. Data Collection:</strong> PersonaInsight collects participant names, email addresses, category selections, and 25-item psychometric assessment responses solely to generate Big Five personality profiles and academic consulting reports.</p>
            <p><strong>2. Server-Side Processing:</strong> Assessment responses and uploaded documents (Product B) are scored and profiled server-side. We do not sell, license, or share your data with external advertisers.</p>
            <p><strong>3. Payment Information:</strong> Payment reference numbers (UTRs) submitted for PhonePe UPI verification are stored securely to validate transactions and calculate verified revenue statistics.</p>
            <p><strong>4. Data Security:</strong> Industry-standard HTTPS encryption and role-based admin authentication protect participant records from unauthorized access.</p>
          </div>
        </div>
      )}

      {type === 'terms' && (
        <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <FileText className="w-6 h-6 text-sky-400" />
            <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
          </div>
          
          <div className="space-y-4 text-xs leading-relaxed text-slate-300">
            <p><strong>1. Service Scope:</strong> PersonaInsight provides psychometric assessment scoring, personality consulting reports, and document quality intelligence services as part of the HRM301 Industrial Psychology curriculum.</p>
            <p><strong>2. Verified Payments:</strong> Detailed PDF reports are unlocked upon backend verification of valid UPI transaction IDs (UTRs). Unverified or invalid transaction numbers will be rejected by administrators.</p>
            <p><strong>3. Use Rights:</strong> Generated PDF reports are for personal development, academic research, and organizational self-awareness.</p>
          </div>
        </div>
      )}

      {type === 'disclaimer' && (
        <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white">Assessment Disclaimer</h1>
          </div>
          
          <div className="space-y-4 text-xs leading-relaxed text-slate-300">
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200">
              <strong>Non-Clinical Notice:</strong> This personality assessment is intended strictly for educational, self-awareness, personal development, and workplace consulting purposes. It does NOT constitute a clinical psychological diagnosis, psychiatric evaluation, or medical advice.
            </div>
            <p>The Big Five (OCEAN) scoring model provides self-reported behavioral insights. Results should be interpreted as general tendencies rather than rigid psychological traits.</p>
          </div>
        </div>
      )}

    </div>
  );
};
