import React, { useState } from 'react';
import { PaymentRecord } from '../../types/assessment';
import { CheckCircle2, XCircle, Clock, Search, Filter } from 'lucide-react';

interface Props {
  transactions: PaymentRecord[];
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
}

export const TransactionTable: React.FC<Props> = ({ transactions, onVerify, onReject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('ALL');

  const filtered = transactions.filter(t => {
    const name = t.name || t.participantName || '';
    const email = t.email || '';
    const utr = t.utr || '';

    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      utr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white font-jakarta">Payment Verification Records</h3>
          <p className="text-xs text-slate-400">Documentary evidence of revenue collected for HRM301 assignment.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Name, Email, UTR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0B132B] border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 w-48 sm:w-60"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#0B132B] border border-slate-700 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusFilter === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All ({transactions.length})
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusFilter === 'PENDING' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('VERIFIED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusFilter === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Verified
            </button>
            <button
              onClick={() => setStatusFilter('REJECTED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusFilter === 'REJECTED' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Participant Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">UTR Ref Number</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-500 italic">
                  No payment transactions recorded yet.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const targetId = tx._id || tx.paymentId;
                return (
                  <tr key={targetId} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white font-jakarta">
                      {tx.name || tx.participantName || 'Participant'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{tx.email}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">₹{tx.amount}</td>
                    <td className="py-3.5 px-4 font-mono text-sky-300">{tx.utr}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {tx.submittedAt ? new Date(tx.submittedAt).toLocaleString() : (tx.date || 'Just now')}
                    </td>
                    <td className="py-3.5 px-4">
                      {tx.status === 'VERIFIED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : tx.status === 'REJECTED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {tx.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onVerify(targetId)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                          >
                            Verify Payment
                          </button>
                          <button
                            onClick={() => onReject(targetId)}
                            className="bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono">No action</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
