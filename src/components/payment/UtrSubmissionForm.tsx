import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { CheckCircle2, AlertCircle, Send, Hash, User, Mail, Sparkles } from 'lucide-react';

interface Props {
  onSubmitted: () => void;
}

export const UtrSubmissionForm: React.FC<Props> = ({ onSubmitted }) => {
  const { participant, config, submitPaymentVerification } = useAssessment();

  const [utr, setUtr] = useState('');
  const [name, setName] = useState(participant?.name || '');
  const [email, setEmail] = useState(participant?.email || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utr.trim();

    if (!cleanUtr || cleanUtr.length < 8) {
      setError('Please enter a valid 12-digit UTR / Transaction reference number.');
      return;
    }
    if (!name.trim() || !email.trim()) {
      setError('Please provide your name and email for verification.');
      return;
    }

    setError(null);
    submitPaymentVerification(cleanUtr, name, email);
    onSubmitted();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6 space-y-5">
      
      <div className="border-b border-slate-800 pb-3">
        <h4 className="text-base font-bold text-white font-jakarta flex items-center gap-2">
          <Send className="w-4 h-4 text-purple-400" />
          Submit Payment Confirmation Details
        </h4>
        <p className="text-xs text-slate-400">
          After completing the ₹{config.reportPrice} UPI transfer, enter your 12-digit UTR/Txn number below.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-sky-400" /> Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#131B2E] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-sky-400" /> Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#131B2E] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
        />
      </div>

      {/* UTR / Transaction ID */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-purple-400" />
          12-Digit UTR / Transaction Ref No <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          required
          maxLength={18}
          placeholder="e.g. 329104829104"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          className="w-full bg-[#131B2E] border border-slate-700 rounded-xl px-3.5 py-3 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
        />
        <p className="text-[11px] text-slate-500">Find this UTR number in your UPI app payment history receipt.</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-purple-600/25 transition-all"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>Submit Payment for Verification</span>
      </button>

    </form>
  );
};
