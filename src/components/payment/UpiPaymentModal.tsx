import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { QrCodeDisplay } from './QrCodeDisplay';
import { UtrSubmissionForm } from './UtrSubmissionForm';
import { 
  Lock, Clock, CheckCircle2, ShieldCheck, 
  AlertCircle, Eye, QrCode, Landmark, RefreshCw
} from 'lucide-react';

export const UpiPaymentModal: React.FC = () => {
  const { paymentRecord, setActiveView, config, participant, assessmentId, checkUnlockedReport } = useAssessment();
  const [activeTab, setActiveTab] = useState<'upi' | 'bank'>('upi');
  const [checking, setChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);

  // Manual status check if requested by user
  const handleCheckStatus = async () => {
    setChecking(true);
    setCheckMessage(null);
    const isUnlocked = await checkUnlockedReport();
    setChecking(false);
    if (isUnlocked) {
      setCheckMessage('Payment Verified! Redirecting to full report...');
      setTimeout(() => setActiveView('report'), 600);
    } else {
      setCheckMessage('Payment status checked: UTR verification pending.');
    }
  };

  const handleSubmitted = () => {
    // Only after submitting UTR form, transition to detailed report page
    setActiveView('report');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>Payment Gateway Portal</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white font-jakarta">
          Unlock Detailed Personality Report
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Complete your ₹{config.reportPrice} payment to access the full 14-section psychometric report for <span className="font-semibold text-white">{participant?.name || 'Participant'}</span>.
        </p>
      </div>

      {/* Main Payment Card Container */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
        
        {/* Previous Payment Record Status Banner if available */}
        {paymentRecord && (
          <div className={`p-5 rounded-2xl border space-y-3 ${
            paymentRecord.status === 'VERIFIED'
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : paymentRecord.status === 'REJECTED'
              ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {paymentRecord.status === 'VERIFIED' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : paymentRecord.status === 'REJECTED' ? (
                  <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
                ) : (
                  <Clock className="w-6 h-6 text-amber-400 shrink-0 animate-pulse" />
                )}

                <div>
                  <h4 className="text-sm font-bold font-jakarta text-white">
                    {paymentRecord.status === 'VERIFIED'
                      ? 'Previous Payment Verified'
                      : paymentRecord.status === 'REJECTED'
                      ? 'Payment Rejected'
                      : 'Payment Submitted for Verification'}
                  </h4>
                  <p className="text-xs text-slate-300">
                    UTR Reference: <span className="font-mono font-semibold text-white">{paymentRecord.utr}</span> • Amount: ₹{paymentRecord.amount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveView('report')}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl shadow transition-all shrink-0"
                >
                  <Eye className="w-4 h-4" />
                  <span>Go to Report</span>
                </button>

                <button
                  onClick={handleCheckStatus}
                  disabled={checking}
                  className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
                  <span>{checking ? 'Checking...' : 'Refresh Status'}</span>
                </button>
              </div>
            </div>

            {checkMessage && (
              <div className="p-2.5 rounded-xl bg-slate-900/90 text-xs font-semibold text-sky-300 border border-sky-500/30">
                {checkMessage}
              </div>
            )}
          </div>
        )}

        {/* Payment Method Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[#0B132B] border border-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('upi')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'upi'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>UPI QR Code & Apps</span>
          </button>

          <button
            onClick={() => setActiveTab('bank')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bank'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Direct Bank Transfer</span>
          </button>
        </div>

        {/* TAB 1: UPI QR CODE (Scan PhonePe QR on Left + Submit UTR on Right) */}
        {activeTab === 'upi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: PhonePe QR Display */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Scan QR Code with PhonePe / Any UPI App (₹{config.reportPrice})</span>
              </div>
              
              <QrCodeDisplay
                upiId={config.upiId}
                upiName={config.upiName}
                amount={config.reportPrice}
              />
            </div>

            {/* Right: Submit 12-Digit UTR Number */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">2</span>
                <span>Enter 12-Digit UTR Reference Number</span>
              </div>

              <UtrSubmissionForm onSubmitted={handleSubmitted} />
            </div>

          </div>
        )}

        {/* TAB 2: DIRECT BANK TRANSFER */}
        {activeTab === 'bank' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 bg-[#0B132B] border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-base font-bold text-white font-jakarta flex items-center gap-2">
                <Landmark className="w-5 h-5 text-sky-400" />
                IMPS / NEFT Bank Account Transfer
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Account Holder Name:</span>
                  <strong className="text-white text-sm font-jakarta">{config.upiName}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Bank VPA Address:</span>
                  <strong className="text-sky-300 font-mono text-sm">{config.upiId}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Amount to Transfer:</span>
                  <strong className="text-emerald-400 font-mono text-sm">₹{config.reportPrice} INR</strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <UtrSubmissionForm onSubmitted={handleSubmitted} />
            </div>
          </div>
        )}

        {/* Security & Disclaimer Footer */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Secure Payment Portal • Transparent Academic Revenue Tracking (HRM301)</span>
        </div>

      </div>

    </div>
  );
};
