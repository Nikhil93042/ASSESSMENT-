import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, QrCode, Smartphone, Sparkles, CreditCard, ShieldCheck } from 'lucide-react';

interface Props {
  upiId: string;
  upiName: string;
  amount: number;
}

export const QrCodeDisplay: React.FC<Props> = ({ upiId, upiName, amount }) => {
  const [copied, setCopied] = useState(false);
  const [useUploadedQr, setUseUploadedQr] = useState(true);

  // Construct standard UPI deep link string format
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=PersonaInsight%20HRM301%20Report`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center space-y-5 shadow-xl">
      
      {/* Header Badge */}
      <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider bg-sky-500/10 border border-sky-500/30 px-3 py-1 rounded-full">
        <QrCode className="w-4 h-4 text-sky-400" />
        <span>PhonePe / UPI Scan & Pay</span>
      </div>

      {/* QR Code Container */}
      <div className="relative p-4 bg-white rounded-2xl shadow-2xl border-4 border-purple-500/30 group">
        {useUploadedQr ? (
          <div className="w-[200px] h-[200px] flex items-center justify-center overflow-hidden rounded-xl bg-white">
            <img 
              src="/payment_qr.jpg" 
              alt="PhonePe UPI QR Code" 
              className="w-full h-full object-contain"
              onError={() => setUseUploadedQr(false)} // Fallback to SVG QR if image fails
            />
          </div>
        ) : (
          <QRCodeSVG
            value={upiUrl}
            size={200}
            bgColor="#FFFFFF"
            fgColor="#0B132B"
            level="H"
            includeMargin={false}
          />
        )}
      </div>

      {/* Toggle between Uploaded PhonePe QR and Dynamic Generated QR */}
      <button
        type="button"
        onClick={() => setUseUploadedQr(!useUploadedQr)}
        className="text-[11px] text-purple-400 hover:text-purple-300 underline font-semibold transition-colors"
      >
        {useUploadedQr ? 'Switch to Dynamic Generated QR' : 'Switch to Official PhonePe QR Image'}
      </button>

      {/* Amount Display */}
      <div className="space-y-1 bg-slate-900/90 border border-slate-800 px-6 py-2.5 rounded-xl w-full">
        <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Amount Payable</div>
        <div className="text-3xl font-black text-white font-jakarta">₹{amount} INR</div>
      </div>

      {/* UPI ID Copy Box */}
      <div className="w-full space-y-2">
        <div className="text-xs text-slate-400 font-medium text-left">Or Copy UPI VPA Address:</div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-2">
          <span className="text-xs font-mono text-slate-200 truncate flex-1 text-left px-2">{upiId}</span>
          <button
            type="button"
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Instant Mobile Pay Deep-link buttons */}
      <div className="w-full pt-2 border-t border-slate-800/80 space-y-2">
        <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider text-left">
          Tap to Open App (Mobile):
        </div>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={upiUrl}
            className="flex items-center justify-center gap-1.5 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 text-xs font-bold py-2 rounded-xl transition-all"
          >
            <Smartphone className="w-3.5 h-3.5 text-purple-400" />
            <span>Open UPI App</span>
          </a>
          <a
            href={`phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR`}
            className="flex items-center justify-center gap-1.5 bg-sky-950/60 hover:bg-sky-900/80 border border-sky-500/40 text-sky-300 text-xs font-bold py-2 rounded-xl transition-all"
          >
            <CreditCard className="w-3.5 h-3.5 text-sky-400" />
            <span>PhonePe Direct</span>
          </a>
        </div>
      </div>

      {/* Payment Security Note */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 pt-1">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Verified Indian UPI QR Gateway</span>
      </div>

    </div>
  );
};
