import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { Lock, User, Key, ArrowRight, AlertCircle } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { adminLogin } = useAssessment();
  const [username, setUsername] = useState('Nikhil');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await adminLogin(username.trim(), password.trim());
    setLoading(false);

    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto text-sky-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white font-jakarta">Project Admin Portal</h2>
          <p className="text-xs text-slate-400">
            HRM301 Real-Time Analytics & Payment Verification
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-400" /> Admin Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-purple-400" /> Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg transition-all"
          >
            <span>{loading ? 'Authenticating...' : 'Login to Admin Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 text-center space-y-1">
          <div className="font-bold text-white uppercase tracking-wider text-[11px]">Initial Setup Credentials</div>
          <div className="flex items-center justify-center gap-4 text-xs font-mono pt-1">
            <span>Username: <strong className="text-sky-400">Nikhil</strong></span>
            <span>•</span>
            <span>Password: <strong className="text-purple-400">1626</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
};
