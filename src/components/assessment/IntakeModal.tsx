import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { User, Mail, Phone, Briefcase, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { ParticipantInfo } from '../../types/assessment';

export const IntakeModal: React.FC = () => {
  const { submitIntakeForm, participant } = useAssessment();

  const [formData, setFormData] = useState<ParticipantInfo>({
    name: participant?.name || '',
    email: participant?.email || '',
    phone: participant?.phone || '',
    category: participant?.category || 'Student',
    consent: true,
    timestamp: new Date().toISOString(),
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!formData.consent) {
      setError('You must agree to the academic consent guidelines before starting.');
      return;
    }
    setError(null);
    submitIntakeForm(formData);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Participant Identification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-jakarta">
            Start Your Personality Assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Please fill in your details to begin the 25-item HRM301 Industrial Psychology assessment.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-sky-400" />
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aarav Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-400" />
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. aarav.sharma@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
            />
          </div>

          {/* Phone Number (Optional) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              Phone Number <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              type="tel"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
            />
          </div>

          {/* Participant Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              Participant Category <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
            >
              <option value="Student">Student (University / Academic)</option>
              <option value="Corporate Professional">Corporate Professional</option>
              <option value="Manager / Leader">Manager / Leader</option>
              <option value="Academic Researcher">Academic Researcher</option>
              <option value="Personal Development">Personal Development</option>
            </select>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                className="mt-1 w-4 h-4 rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I agree to participate in this HRM301 Industrial Psychology assessment for educational research and self-development. I acknowledge this test is non-clinical.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white font-bold text-base py-4 rounded-xl shadow-xl shadow-purple-600/25 transition-all"
          >
            <span>Proceed to Questionnaire (25 Items)</span>
            <ArrowRight className="w-5 h-5" />
          </button>

        </form>

      </div>
    </div>
  );
};
