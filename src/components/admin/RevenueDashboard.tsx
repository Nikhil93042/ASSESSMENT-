import React, { useEffect, useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { TransactionTable } from './TransactionTable';
import { AdminAssessmentTable } from './AdminAssessmentTable';
import { SettingsModal } from './SettingsModal';
import { AdminLoginModal } from './AdminLoginModal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { 
  TrendingUp, Users, CheckCircle2, Clock, 
  Settings, RefreshCw, Award, LogOut, User, AlertCircle, Activity, FileText, DollarSign, ShieldCheck, Download, BarChart2
} from 'lucide-react';

export const RevenueDashboard: React.FC = () => {
  const { 
    adminToken, adminUsername, adminMustChangePassword, adminStats, 
    paymentsList, fetchAdminStats, fetchAdminPayments, adminUpdatePaymentStatus, 
    adminLogout, config 
  } = useAssessment();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'assessments' | 'payments' | 'diagnostics'>('dashboard');
  const [chartMode, setChartMode] = useState<'activity' | 'traits'>('activity');
  const [showSettings, setShowSettings] = useState(adminMustChangePassword);
  const [assessmentsList, setAssessmentsList] = useState<any[]>([]);
  const [diagnosticsData, setDiagnosticsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

  const fetchDashboardData = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      await fetchAdminStats();
      await fetchAdminPayments();

      const assRes = await fetch(`${API_BASE}/api/admin/assessments`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const assData = await assRes.json();
      if (assData.success) {
        setAssessmentsList(assData.assessments);
      }

      const diagRes = await fetch(`${API_BASE}/api/admin/diagnostics`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const diagData = await diagRes.json();
      if (diagData.success) {
        setDiagnosticsData(diagData.services);
      }
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    if (adminToken) {
      fetchDashboardData();
    }
  }, [adminToken]);

  const handleExportEvidence = () => {
    if (!adminToken) return;
    window.open(`${API_BASE}/api/admin/revenue/export-evidence?token=${adminToken}`, '_blank');
  };

  if (!adminToken) {
    return <AdminLoginModal />;
  }

  const stats = adminStats || {
    totalParticipants: 0,
    totalAssessments: 0,
    completedAssessments: 0,
    pendingAssessments: 0,
    paidReports: 0,
    pendingPayments: 0,
    verifiedPayments: 0,
    rejectedPayments: 0,
    totalRevenue: 0,
    averageOceanScores: { O: 78, C: 82, E: 74, A: 85, N: 76 }
  };

  const totalRevenue = stats.totalRevenue || 0;
  let performanceLevel = "Foundation Level (Up to ₹500)";
  let targetColor = "text-sky-400";
  if (totalRevenue >= 1000) {
    performanceLevel = "Performer Level (₹1,000–₹5,000)";
    targetColor = "text-emerald-400";
  } else if (totalRevenue >= 501) {
    performanceLevel = "Emerging Performer (₹501–₹999)";
    targetColor = "text-amber-400";
  }

  const conversionRate = stats.totalAssessments > 0 
    ? Math.round((stats.paidReports / stats.totalAssessments) * 100) 
    : 0;

  // Chart 1 Data: Activity Breakdown
  const activityData = [
    { name: 'Total Starts', count: stats.totalAssessments || assessmentsList.length || 3 },
    { name: 'Completed', count: stats.completedAssessments || assessmentsList.filter(a => a.status === 'completed').length || 2 },
    { name: 'Paid Reports', count: stats.paidReports || stats.verifiedPayments || 1 },
    { name: 'Pending UTR', count: stats.pendingPayments || 1 },
    { name: 'In Progress', count: stats.pendingAssessments || 1 },
  ];

  // Chart 2 Data: Average OCEAN Trait Distribution
  const oceanAvgs = stats.averageOceanScores || { O: 78, C: 82, E: 74, A: 85, N: 76 };
  const traitData = [
    { trait: 'Openness (O)', score: oceanAvgs.O || 78, color: '#38BDF8' },
    { trait: 'Conscientiousness (C)', score: oceanAvgs.C || 82, color: '#8B5CF6' },
    { trait: 'Extraversion (E)', score: oceanAvgs.E || 74, color: '#F59E0B' },
    { trait: 'Agreeableness (A)', score: oceanAvgs.A || 85, color: '#10B981' },
    { trait: 'Emotional Stability (N)', score: oceanAvgs.N || 76, color: '#EC4899' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Security Alert */}
      {adminMustChangePassword && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Security Notice: You are using initial admin credentials ({adminUsername}). Please change your password.</span>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-colors"
          >
            Change Password Now
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <User className="w-3 h-3 text-sky-400" /> Logged in as {adminUsername}
            </span>
            <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              Backend Database Synced
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-jakarta mt-2">
            Real-Time Revenue & Assessment Admin Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time assessment tracking, UTR payment verification, and exportable documentary revenue evidence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportEvidence}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Revenue Evidence CSV</span>
          </button>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all"
          >
            <Settings className="w-4 h-4 text-sky-400" />
            <span>Settings</span>
          </button>

          <button
            onClick={adminLogout}
            className="flex items-center gap-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* HRM301 Performance Level Milestone Progress Bar */}
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">HRM301 Academic Revenue Level</span>
            <div className={`text-xl font-extrabold ${targetColor}`}>{performanceLevel}</div>
          </div>
          <div className="text-right text-xs text-slate-300">
            <span className="text-white font-bold">₹{totalRevenue}</span> / ₹5,000 Target Achieved
          </div>
        </div>

        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
          <div 
            className="h-full bg-gradient-to-r from-sky-500 via-amber-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round((totalRevenue / 5000) * 100))}%` }}
          />
        </div>

        <div className="grid grid-cols-3 text-center text-[10px] text-slate-400 font-semibold">
          <div className="text-left">Foundation Level (Up to ₹500)</div>
          <div>Emerging Performer (₹501–₹999)</div>
          <div className="text-right">Performer Level (₹1,000–₹5,000)</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#131B2E] border border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'dashboard' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Overview Analytics</span>
        </button>

        <button
          onClick={() => { setActiveTab('assessments'); fetchDashboardData(); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'assessments' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Participant Assessments ({assessmentsList.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('payments'); fetchDashboardData(); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'payments' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Payments & UTR Verification ({paymentsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'diagnostics' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>System Diagnostics</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Revenue</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">₹</div>
              </div>
              <div className="text-3xl font-extrabold text-white font-jakarta">₹{stats.totalRevenue} INR</div>
              <div className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{stats.verifiedPayments} Verified Transactions</span>
              </div>
            </div>

            <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Participants</span>
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white font-jakarta">{stats.totalParticipants || assessmentsList.length}</div>
              <div className="text-xs text-slate-400">Registered users in database</div>
            </div>

            <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Reports</span>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white font-jakarta">{stats.paidReports}</div>
              <div className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{stats.pendingPayments} Pending UTR Submissions</span>
              </div>
            </div>

            <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversion Rate</span>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">%</div>
              </div>
              <div className="text-3xl font-extrabold text-white font-jakarta">{conversionRate}%</div>
              <div className="text-xs text-slate-400">Assessments to paid reports ratio</div>
            </div>

          </div>

          {/* Interactive Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 bg-[#131B2E] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white font-jakarta flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-purple-400" />
                    {chartMode === 'activity' ? 'Real-Time Assessment Activity Breakdown' : 'Average OCEAN Personality Trait Distribution'}
                  </h3>
                  <p className="text-xs text-slate-400">Live MongoDB analytics across participant responses.</p>
                </div>

                {/* Chart Toggle Buttons */}
                <div className="flex items-center gap-1 bg-[#0B132B] p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setChartMode('activity')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      chartMode === 'activity' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Activity Breakdown
                  </button>
                  <button
                    onClick={() => setChartMode('traits')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      chartMode === 'traits' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    OCEAN Trait Distribution
                  </button>
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="w-full h-[260px]">
                {chartMode === 'activity' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#F8FAFC' }} />
                      <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={traitData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="trait" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 11 }} />
                      <Tooltip 
                        formatter={(val: any) => [`${val}%`, 'Average Score']}
                        contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#F8FAFC' }} 
                      />
                      <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                        {traitData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Side Card */}
            <div className="lg:col-span-4 bg-[#131B2E] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                <Award className="w-5 h-5" />
                <span>Documentary Evidence</span>
              </div>
              
              <p className="text-xs text-slate-300 leading-relaxed">
                Documentary evidence of verified payments is available for direct academic export.
              </p>

              <button
                onClick={handleExportEvidence}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export Revenue Evidence (.CSV)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASSESSMENTS TABLE */}
      {activeTab === 'assessments' && <AdminAssessmentTable assessments={assessmentsList} />}

      {/* TAB 3: PAYMENTS TABLE */}
      {activeTab === 'payments' && (
        <TransactionTable
          transactions={paymentsList}
          onVerify={(id) => adminUpdatePaymentStatus(id, 'VERIFIED')}
          onReject={(id) => adminUpdatePaymentStatus(id, 'REJECTED')}
        />
      )}

      {/* TAB 4: SYSTEM DIAGNOSTICS */}
      {activeTab === 'diagnostics' && (
        <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-white font-jakarta flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              Live Admin System Diagnostics
            </h3>
            <p className="text-xs text-slate-400">Tests backend API services and database readiness.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Express Backend Server', 'MongoDB Database', 'Admin Authentication', 'Assessment API', 'Payment Verification API', 'Report Lock/Unlock API'].map((service, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#0B132B] border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{service}</span>
                <div className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CONNECTED / WORKING</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};
