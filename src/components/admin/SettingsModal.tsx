import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { Settings, Save, ShieldCheck, Key, User, Check, AlertCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({ onClose }) => {
  const { config, adminUpdateConfig, adminChangePassword, adminUsername } = useAssessment();

  const [price, setPrice] = useState(config.reportPrice);
  const [upiId, setUpiId] = useState(config.upiId);
  const [upiName, setUpiName] = useState(config.upiName);

  // Security Credentials State
  const [newUsername, setNewUsername] = useState(adminUsername || 'Nikhil');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminUpdateConfig({
      reportPrice: Number(price),
      upiId: upiId.trim(),
      upiName: upiName.trim(),
    });
    setMessage({ type: 'success', text: 'Pricing & UPI settings updated in MongoDB.' });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    const res = await adminChangePassword(currentPassword, newPassword, newUsername.trim());
    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-white font-bold font-jakarta text-lg">
            <Settings className="w-5 h-5 text-sky-400" />
            <span>Admin Settings & Security</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm font-bold">✕</button>
        </div>

        {message && (
          <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Section 1: Payment & Pricing Settings */}
        <form onSubmit={handleSaveConfig} className="space-y-4 text-xs border-b border-slate-800 pb-6">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
            <span>Payment & Gateway Settings</span>
          </h4>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase tracking-wider">Report Price (INR ₹)</label>
            <input
              type="number"
              required
              min={1}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase tracking-wider">UPI VPA Address</label>
            <input
              type="text"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase tracking-wider">UPI Account Payee Name</label>
            <input
              type="text"
              required
              value={upiName}
              onChange={(e) => setUpiName(e.target.value)}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Pricing & UPI Config</span>
          </button>
        </form>

        {/* Section 2: Admin Password & Name Security */}
        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
            <Key className="w-4 h-4 text-purple-400" />
            <span>Change Admin Name & Password</span>
          </h4>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase tracking-wider">Admin Name</label>
            <input
              type="text"
              required
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase tracking-wider">Current Password</label>
            <input
              type="password"
              required
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase tracking-wider">New Password (Min 8 chars)</label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase tracking-wider">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl shadow-md transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Update Admin Password</span>
          </button>
        </form>

      </div>
    </div>
  );
};
