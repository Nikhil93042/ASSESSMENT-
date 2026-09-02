import React, { useState } from 'react';
import { Search, Eye, CheckCircle2, Clock, ShieldCheck, Lock, RefreshCw, FileText, History } from 'lucide-react';
import { useAssessment } from '../../context/AssessmentContext';

interface AssessmentRecord {
  _id: string;
  assessmentId: string;
  participantId: string;
  participantName: string;
  email: string;
  category: string;
  status: string;
  isFinalized?: boolean;
  version?: string;
  recordHash?: string;
  oceanScores?: any;
  competencyScores?: any[];
  paymentStatus?: string;
  createdAt: string;
  finalizedAt?: string;
}

interface Props {
  assessments: AssessmentRecord[];
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

export const AdminAssessmentTable: React.FC<Props> = ({ assessments }) => {
  const { adminToken } = useAssessment();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'FINALIZED' | 'IN_PROGRESS'>('ALL');
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentRecord | null>(null);
  const [fullRecord, setFullRecord] = useState<any | null>(null);
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'responses' | 'integrity' | 'audit'>('overview');
  const [verifying, setVerifying] = useState(false);
  const [integrityResult, setIntegrityResult] = useState<any | null>(null);

  const filtered = assessments.filter(a => {
    const matchesSearch = 
      a.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.assessmentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' 
      ? true 
      : statusFilter === 'FINALIZED' 
      ? (a.status === 'FINALIZED' || a.status === 'completed' || a.isFinalized)
      : (a.status === 'IN_PROGRESS' || a.status === 'in_progress' || !a.isFinalized);
    return matchesSearch && matchesStatus;
  });

  const handleOpenRecord = async (ass: AssessmentRecord) => {
    setSelectedAssessment(ass);
    setLoadingRecord(true);
    setIntegrityResult(null);
    setActiveTab('overview');

    try {
      const res = await fetch(`${API_BASE}/api/admin/assessments/${ass.assessmentId}/record`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success && data.record) {
        setFullRecord(data.record);
        if (data.record.integrity) {
          setIntegrityResult(data.record.integrity);
        }
      }
    } catch (e) {
      console.error('Failed to fetch complete record:', e);
    } finally {
      setLoadingRecord(false);
    }
  };

  const handleVerifyIntegrity = async (assessmentId: string) => {
    setVerifying(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/integrity/verify/${assessmentId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setIntegrityResult(data);
      }
    } catch (e) {
      console.error('Failed integrity verification:', e);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white font-jakarta flex items-center gap-2">
            <span>Participant Assessments Database</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">Immutable v1.0</span>
          </h3>
          <p className="text-xs text-slate-400">Read-only historical assessment records protected by SHA-256 cryptographic hashes.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Name, Email, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0B132B] border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#0B132B] border border-slate-700 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusFilter === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All ({assessments.length})
            </button>
            <button
              onClick={() => setStatusFilter('FINALIZED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusFilter === 'FINALIZED' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Finalized ({assessments.filter(a => a.status === 'FINALIZED' || a.status === 'completed' || a.isFinalized).length})
            </button>
            <button
              onClick={() => setStatusFilter('IN_PROGRESS')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusFilter === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              In Progress ({assessments.filter(a => a.status === 'IN_PROGRESS' || a.status === 'in_progress').length})
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Assessment ID</th>
              <th className="py-3 px-4">Participant Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Status & Immutability</th>
              <th className="py-3 px-4">SHA-256 Fingerprint</th>
              <th className="py-3 px-4">OCEAN Scores</th>
              <th className="py-3 px-4 text-right">Historical Record</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-500 italic">
                  No assessment records found in MongoDB.
                </td>
              </tr>
            ) : (
              filtered.map((ass) => {
                const isFinalized = ass.status === 'FINALIZED' || ass.status === 'completed' || ass.isFinalized;
                return (
                  <tr key={ass._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-400">{ass.assessmentId}</td>
                    <td className="py-3.5 px-4 font-bold text-white font-jakarta">{ass.participantName}</td>
                    <td className="py-3.5 px-4 text-slate-300">{ass.email}</td>
                    <td className="py-3.5 px-4">
                      {isFinalized ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px]">
                          <Lock className="w-3 h-3 text-emerald-400" />
                          <span>FINALIZED & IMMUTABLE</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold text-[11px]">
                          <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                          <span>IN PROGRESS</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400">
                      {ass.recordHash ? (
                        <span className="text-emerald-400/90 font-mono" title={ass.recordHash}>
                          {ass.recordHash.substring(0, 12)}...
                        </span>
                      ) : (
                        <span className="text-slate-600">Pending finalization</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                      {ass.oceanScores ? (
                        <span>O:{ass.oceanScores.O}% C:{ass.oceanScores.C}% E:{ass.oceanScores.E}% A:{ass.oceanScores.A}% N:{ass.oceanScores.N}%</span>
                      ) : (
                        <span className="text-slate-500">Pending</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenRecord(ass)}
                        className="inline-flex items-center gap-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-400" />
                        <span>View Full Record</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Detailed Read-Only Historical Assessment Record Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-white font-jakarta">Complete Historical Record</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                    IMMUTABLE RECORD
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Assessment ID: <span className="font-mono text-sky-400 font-bold">{selectedAssessment.assessmentId}</span> • Version: <span className="text-purple-300 font-semibold">{selectedAssessment.version || 'v1.0'}</span>
                </p>
              </div>
              <button onClick={() => setSelectedAssessment(null)} className="text-slate-400 hover:text-white text-sm font-bold p-1">✕</button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 p-1 bg-[#0B132B] border border-slate-800 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-2 rounded-lg transition-all ${activeTab === 'overview' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Overview & Details
              </button>
              <button
                onClick={() => setActiveTab('responses')}
                className={`flex-1 py-2 rounded-lg transition-all ${activeTab === 'responses' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Question Audit (25 Items)
              </button>
              <button
                onClick={() => setActiveTab('integrity')}
                className={`flex-1 py-2 rounded-lg transition-all ${activeTab === 'integrity' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                SHA-256 Integrity
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`flex-1 py-2 rounded-lg transition-all ${activeTab === 'audit' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Append-Only Log
              </button>
            </div>

            {loadingRecord ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-sky-400" />
                <p className="text-xs">Loading canonical database record from MongoDB...</p>
              </div>
            ) : (
              <>
                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-6 text-xs">
                    
                    {/* Participant Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#0B132B] p-4 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-slate-400 block">Participant Name:</span>
                        <strong className="text-white text-sm font-jakarta">{fullRecord?.participant?.name || selectedAssessment.participantName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Email Address:</span>
                        <strong className="text-slate-200">{fullRecord?.participant?.email || selectedAssessment.email}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Category:</span>
                        <strong className="text-purple-300">{fullRecord?.participant?.category || selectedAssessment.category}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Consent Status:</span>
                        <strong className="text-emerald-400">{fullRecord?.participant?.consent !== false ? '✓ Granted' : 'Denied'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Finalized Date:</span>
                        <strong className="text-slate-300">{selectedAssessment.finalizedAt ? new Date(selectedAssessment.finalizedAt).toLocaleString() : 'In Progress'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Payment Status:</span>
                        <strong className="text-emerald-400">{fullRecord?.payment?.status || selectedAssessment.paymentStatus || 'UNPAID'}</strong>
                      </div>
                    </div>

                    {/* OCEAN Scores */}
                    {selectedAssessment.oceanScores && (
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold text-sky-400 uppercase tracking-wider">Calculated Big Five OCEAN Trait Percentages</h5>
                        <div className="grid grid-cols-5 gap-2 text-center">
                          <div className="p-3 bg-[#0B132B] rounded-xl border border-slate-800">
                            <span className="text-sky-400 font-bold block">Openness</span>
                            <span className="text-white font-mono font-extrabold text-sm">{selectedAssessment.oceanScores.O}%</span>
                          </div>
                          <div className="p-3 bg-[#0B132B] rounded-xl border border-slate-800">
                            <span className="text-purple-400 font-bold block">Conscientious</span>
                            <span className="text-white font-mono font-extrabold text-sm">{selectedAssessment.oceanScores.C}%</span>
                          </div>
                          <div className="p-3 bg-[#0B132B] rounded-xl border border-slate-800">
                            <span className="text-amber-400 font-bold block">Extraversion</span>
                            <span className="text-white font-mono font-extrabold text-sm">{selectedAssessment.oceanScores.E}%</span>
                          </div>
                          <div className="p-3 bg-[#0B132B] rounded-xl border border-slate-800">
                            <span className="text-emerald-400 font-bold block">Agreeable</span>
                            <span className="text-white font-mono font-extrabold text-sm">{selectedAssessment.oceanScores.A}%</span>
                          </div>
                          <div className="p-3 bg-[#0B132B] rounded-xl border border-slate-800">
                            <span className="text-rose-400 font-bold block">Emotional Stab.</span>
                            <span className="text-white font-mono font-extrabold text-sm">{selectedAssessment.oceanScores.N}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Immutability Banner */}
                    <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <strong className="block text-white font-jakarta">Finalized Immutable Record</strong>
                          <span className="text-[11px] opacity-90">This record is permanently locked in MongoDB. Answers and calculated scores cannot be altered or deleted.</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 2: 25 QUESTION RESPONSES AUDIT */}
                {activeTab === 'responses' && (
                  <div className="space-y-4 text-xs">
                    <h5 className="font-bold text-white font-jakarta flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span>Itemized Question Response Audit (25 Statements)</span>
                    </h5>

                    <div className="bg-[#0B132B] border border-slate-800 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] bg-slate-900/60">
                            <th className="py-2.5 px-3">Item #</th>
                            <th className="py-2.5 px-3">Dimension</th>
                            <th className="py-2.5 px-3">Selected Rating (1 to 7 Likert Scale)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {fullRecord?.assessment?.responses ? (
                            Object.entries(fullRecord.assessment.responses).map(([qId, rating]) => (
                              <tr key={qId} className="hover:bg-slate-900/40">
                                <td className="py-2 px-3 text-sky-400 font-bold">Item {qId}</td>
                                <td className="py-2 px-3 text-purple-300">HRM301 Statement {qId}</td>
                                <td className="py-2 px-3 text-emerald-400 font-extrabold">Rating: {String(rating)} / 7</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="text-center py-6 text-slate-500 italic">No responses recorded yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 3: SHA-256 INTEGRITY */}
                {activeTab === 'integrity' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-5 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-white font-jakarta flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-emerald-400" />
                          <span>Cryptographic SHA-256 Record Verification</span>
                        </h5>

                        <button
                          onClick={() => handleVerifyIntegrity(selectedAssessment.assessmentId)}
                          disabled={verifying}
                          className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
                          <span>{verifying ? 'Verifying...' : 'Re-verify Integrity'}</span>
                        </button>
                      </div>

                      {integrityResult && (
                        <div className={`p-4 rounded-xl border space-y-2 ${
                          integrityResult.isMatch 
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' 
                            : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                        }`}>
                          <div className="flex items-center gap-2 font-bold text-sm">
                            {integrityResult.isMatch ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <span>✓ RECORD INTEGRITY VERIFIED (NO TAMPERING DETECTED)</span>
                              </>
                            ) : (
                              <>
                                <span className="text-rose-400">⚠ RECORD INTEGRITY MISMATCH WARNING</span>
                              </>
                            )}
                          </div>

                          <div className="space-y-1 font-mono text-[11px] pt-1">
                            <div>Stored Hash: <span className="text-white font-bold">{integrityResult.storedHash}</span></div>
                            <div>Computed Hash: <span className="text-sky-300 font-bold">{integrityResult.computedHash}</span></div>
                            <div className="text-[10px] opacity-75">Verified at: {integrityResult.verifiedAt}</div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}

                {/* TAB 4: APPEND-ONLY AUDIT LOG */}
                {activeTab === 'audit' && (
                  <div className="space-y-4 text-xs">
                    <h5 className="font-bold text-white font-jakarta flex items-center gap-2">
                      <History className="w-4 h-4 text-sky-400" />
                      <span>Append-Only Chained Audit History Timeline</span>
                    </h5>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {fullRecord?.auditLogs && fullRecord.auditLogs.length > 0 ? (
                        fullRecord.auditLogs.map((log: any) => (
                          <div key={log.logId} className="p-3 rounded-xl bg-[#0B132B] border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between text-slate-300">
                              <strong className="text-sky-300 font-mono">{log.eventType}</strong>
                              <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-[11px] text-slate-400">{log.details}</p>
                            <div className="text-[9px] font-mono text-slate-500 truncate">
                              Hash: {log.recordHash}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-slate-500 italic">No audit logs generated yet.</div>
                      )}
                    </div>
                  </div>
                )}

              </>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedAssessment(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
              >
                Close Record
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
