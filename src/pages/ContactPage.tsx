import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Contact Consulting Support
        </span>
        <h1 className="text-3xl font-extrabold text-white">Get in Touch with Our Team</h1>
        <p className="text-slate-400 text-sm">Have inquiries regarding institutional assessments, payment verification, or document intelligence?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact Info */}
        <div className="space-y-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Consulting Contact</h3>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-white block">Email Support</span>
                <span>support.personainsight@lpu.in</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-white block">Project Helpline</span>
                <span>+91 98765 43210</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-white block">Academic Center</span>
                <span>School of MSB, Lovely Professional University, Phagwara, Punjab</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-slate-900/80 p-8 rounded-2xl border border-slate-800">
          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Message Sent Successfully</h3>
              <p className="text-xs text-slate-400">Thank you for reaching out. Our industrial psychology project team will respond shortly.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                  placeholder="Payment Verification / Assessment Question"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                  placeholder="Describe your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
