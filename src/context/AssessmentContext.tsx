import React, { createContext, useContext, useState, useEffect } from 'react';
import { ParticipantInfo, OceanScores, DetailedReportData, PaymentRecord, SystemConfig, CompetencyScore, AdminStats, ViewType } from '../types/assessment';
import { assessmentQuestions } from '../data/questions';
import { calculateOceanScores, generateReportData, calculateCompetencyScores } from '../utils/scoringEngine';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

interface AssessmentContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  participant: ParticipantInfo | null;
  setParticipant: (p: ParticipantInfo) => void;
  assessmentId: string | null;
  answers: Record<number, number>;
  saveStatus: 'saved' | 'saving' | 'error';
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (idx: number) => void;
  saveAnswer: (questionId: number, rating: number) => Promise<void>;
  oceanScores: OceanScores | null;
  competencyScores: CompetencyScore[];
  reportData: DetailedReportData | null;
  paymentRecord: PaymentRecord | null;
  config: SystemConfig;
  adminToken: string | null;
  adminUsername: string | null;
  adminMustChangePassword: boolean;
  adminStats: AdminStats | null;
  paymentsList: PaymentRecord[];
  participantsList: ParticipantInfo[];
  submitIntakeForm: (info: ParticipantInfo) => Promise<void>;
  submitAssessment: () => Promise<void>;
  submitPaymentVerification: (utr: string, name: string, email: string) => Promise<PaymentRecord>;
  adminLogin: (u: string, p: string) => Promise<{ success: boolean; message: string }>;
  adminLogout: () => void;
  adminUpdatePaymentStatus: (id: string, status: 'VERIFIED' | 'REJECTED') => Promise<void>;
  adminChangePassword: (cur: string, nw: string, newName?: string) => Promise<{ success: boolean; message: string }>;
  adminUpdateConfig: (newConfig: Partial<SystemConfig>) => Promise<void>;
  fetchAdminStats: () => Promise<void>;
  fetchAdminPayments: () => Promise<void>;
  resetAssessment: () => void;
  checkUnlockedReport: () => Promise<boolean>;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewType>('home');

  const [participant, setParticipant] = useState<ParticipantInfo | null>(() => {
    const saved = localStorage.getItem('pi_participant');
    return saved ? JSON.parse(saved) : null;
  });

  const [assessmentId, setAssessmentId] = useState<string | null>(() => {
    return localStorage.getItem('pi_assessment_id') || null;
  });

  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('pi_answers');
    return saved ? JSON.parse(saved) : {};
  });

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    const saved = localStorage.getItem('pi_question_index');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [oceanScores, setOceanScores] = useState<OceanScores | null>(() => {
    const saved = localStorage.getItem('pi_ocean_scores');
    return saved ? JSON.parse(saved) : null;
  });

  const [competencyScores, setCompetencyScores] = useState<CompetencyScore[]>(() => {
    const saved = localStorage.getItem('pi_competency_scores');
    return saved ? JSON.parse(saved) : [];
  });

  const [reportData, setReportData] = useState<DetailedReportData | null>(() => {
    const saved = localStorage.getItem('pi_report_data');
    return saved ? JSON.parse(saved) : null;
  });

  const [paymentRecord, setPaymentRecord] = useState<PaymentRecord | null>(() => {
    const saved = localStorage.getItem('pi_current_payment');
    return saved ? JSON.parse(saved) : null;
  });

  const [config, setConfig] = useState<SystemConfig>({
    reportPrice: 49,
    upiId: 'hrm301.personainsight@upi',
    upiName: 'PersonaInsight HRM301 Project',
  });

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => sessionStorage.getItem('pi_admin_token'));
  const [adminUsername, setAdminUsername] = useState<string | null>(() => sessionStorage.getItem('pi_admin_username'));
  const [adminMustChangePassword, setAdminMustChangePassword] = useState<boolean>(() => sessionStorage.getItem('pi_admin_must_change') === 'true');
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [paymentsList, setPaymentsList] = useState<PaymentRecord[]>([]);
  const [participantsList, setParticipantsList] = useState<ParticipantInfo[]>([]);

  // Sync to local storage
  useEffect(() => {
    if (participant) localStorage.setItem('pi_participant', JSON.stringify(participant));
    else localStorage.removeItem('pi_participant');
  }, [participant]);

  useEffect(() => {
    if (assessmentId) localStorage.setItem('pi_assessment_id', assessmentId);
    else localStorage.removeItem('pi_assessment_id');
  }, [assessmentId]);

  useEffect(() => {
    localStorage.setItem('pi_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('pi_question_index', currentQuestionIndex.toString());
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (oceanScores) localStorage.setItem('pi_ocean_scores', JSON.stringify(oceanScores));
  }, [oceanScores]);

  useEffect(() => {
    localStorage.setItem('pi_competency_scores', JSON.stringify(competencyScores));
  }, [competencyScores]);

  useEffect(() => {
    if (reportData) localStorage.setItem('pi_report_data', JSON.stringify(reportData));
  }, [reportData]);

  useEffect(() => {
    if (paymentRecord) localStorage.setItem('pi_current_payment', JSON.stringify(paymentRecord));
  }, [paymentRecord]);

  // Fetch Public Config
  useEffect(() => {
    fetch(`${API_BASE}/api/config`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.config) setConfig(data.config);
      })
      .catch(() => {});
  }, []);

  const saveAnswer = async (questionId: number, rating: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: rating }));
    setSaveStatus('saving');

    try {
      if (assessmentId) {
        await fetch(`${API_BASE}/api/assessments/autosave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessmentId,
            participantId: participant?.participantId,
            questionId,
            value: rating
          })
        });
      }
      setSaveStatus('saved');
    } catch (e) {
      setSaveStatus('error');
    }
  };

  const submitIntakeForm = async (info: ParticipantInfo) => {
    // Reset answers state and storage for clean new assessment session
    setAnswers({});
    setOceanScores(null);
    setCompetencyScores([]);
    setReportData(null);
    setPaymentRecord(null);
    localStorage.removeItem('pi_answers');
    localStorage.removeItem('pi_question_index');
    localStorage.removeItem('pi_ocean_scores');
    localStorage.removeItem('pi_competency_scores');
    localStorage.removeItem('pi_report_data');
    localStorage.removeItem('pi_current_payment');

    try {
      const res = await fetch(`${API_BASE}/api/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
      });
      const data = await res.json();
      
      const pInfo: ParticipantInfo = {
        ...info,
        participantId: data.participantId || `PAR-${Math.floor(100000 + Math.random() * 900000)}`
      };
      setParticipant(pInfo);

      const startRes = await fetch(`${API_BASE}/api/assessments/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: pInfo.participantId })
      });
      const startData = await startRes.json();
      setAssessmentId(startData.assessmentId || `PI-${Math.floor(100000 + Math.random() * 900000)}`);
      
      setCurrentQuestionIndex(0);
      setActiveView('assessment');
    } catch (e) {
      const fallbackPar: ParticipantInfo = {
        ...info,
        participantId: `PAR-${Math.floor(100000 + Math.random() * 900000)}`
      };
      setParticipant(fallbackPar);
      setAssessmentId(`PI-${Math.floor(100000 + Math.random() * 900000)}`);
      setCurrentQuestionIndex(0);
      setActiveView('assessment');
    }
  };

  const submitAssessment = async () => {
    if (!participant) return;
    const currentAssId = assessmentId || `PI-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const res = await fetch(`${API_BASE}/api/assessments/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: currentAssId,
          participantId: participant.participantId,
          responses: answers
        })
      });
      const data = await res.json();

      if (data.success) {
        setOceanScores(data.oceanScores);
        setCompetencyScores(data.competencyScores);
        const fullReport = generateReportData(participant, data.oceanScores, currentAssId, data.competencyScores);
        setReportData(fullReport);
      } else {
        const fallbackOcean = calculateOceanScores(answers);
        const fallbackComp = calculateCompetencyScores(answers);
        setOceanScores(fallbackOcean);
        setCompetencyScores(fallbackComp);
        const fullReport = generateReportData(participant, fallbackOcean, currentAssId, fallbackComp);
        setReportData(fullReport);
      }

      setActiveView('results');
    } catch (error) {
      const fallbackOcean = calculateOceanScores(answers);
      const fallbackComp = calculateCompetencyScores(answers);
      setOceanScores(fallbackOcean);
      setCompetencyScores(fallbackComp);
      const fullReport = generateReportData(participant, fallbackOcean, currentAssId, fallbackComp);
      setReportData(fullReport);
      setActiveView('results');
    }
  };

  const submitPaymentVerification = async (utr: string, name: string, email: string) => {
    const currentAssId = assessmentId || `PI-${Math.floor(100000 + Math.random() * 900000)}`;
    const currentParId = participant?.participantId || `PAR-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const res = await fetch(`${API_BASE}/api/payments/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: currentAssId,
          participantId: currentParId,
          name: name || participant?.name || 'Participant',
          email: email || participant?.email || 'user@example.com',
          utr,
          amount: config.reportPrice,
          productCode: 'FULL_REPORT'
        })
      });
      const data = await res.json();
      
      const record: PaymentRecord = data.success && data.payment ? data.payment : {
        paymentId: `PAY-${Math.floor(10000 + Math.random() * 90000)}`,
        assessmentId: currentAssId,
        participantId: currentParId,
        name: name || participant?.name || 'Participant',
        email: email || participant?.email || 'user@example.com',
        amount: config.reportPrice,
        utr,
        submittedAt: new Date().toISOString(),
        status: 'PENDING',
      };

      setPaymentRecord(record);
      setPaymentsList(prev => [record, ...prev.filter(p => p.paymentId !== record.paymentId)]);
      return record;
    } catch (error) {
      const fallbackRecord: PaymentRecord = {
        paymentId: `PAY-${Math.floor(10000 + Math.random() * 90000)}`,
        assessmentId: currentAssId,
        participantId: currentParId,
        name: name || participant?.name || 'Participant',
        email: email || participant?.email || 'user@example.com',
        amount: config.reportPrice,
        utr,
        submittedAt: new Date().toISOString(),
        status: 'PENDING',
      };
      setPaymentRecord(fallbackRecord);
      setPaymentsList(prev => [fallbackRecord, ...prev.filter(p => p.paymentId !== fallbackRecord.paymentId)]);
      return fallbackRecord;
    }
  };

  const checkUnlockedReport = async (): Promise<boolean> => {
    if (!assessmentId) return false;
    try {
      const res = await fetch(`${API_BASE}/api/reports/${assessmentId}`);
      const data = await res.json();
      if (data.success && data.unlocked) {
        if (data.report) setReportData(data.report);
        if (data.payment) setPaymentRecord(data.payment);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const adminLogin = async (u: string, p: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
      });
      const data = await res.json();

      if (data.success && data.token) {
        setAdminToken(data.token);
        setAdminUsername(data.admin.username);
        setAdminMustChangePassword(data.admin.mustChangePassword || false);
        sessionStorage.setItem('pi_admin_token', data.token);
        sessionStorage.setItem('pi_admin_username', data.admin.username);
        sessionStorage.setItem('pi_admin_must_change', data.admin.mustChangePassword ? 'true' : 'false');
        
        await fetchAdminStats();
        await fetchAdminPayments();
        return { success: true, message: 'Login successful' };
      }
      return { success: false, message: data.message || 'Invalid username or password' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Server connection error' };
    }
  };

  const adminLogout = () => {
    setAdminToken(null);
    setAdminUsername(null);
    setAdminMustChangePassword(false);
    sessionStorage.removeItem('pi_admin_token');
    sessionStorage.removeItem('pi_admin_username');
    sessionStorage.removeItem('pi_admin_must_change');
    setActiveView('home');
  };

  const fetchAdminStats = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success && data.stats) {
        setAdminStats(data.stats);
      }
    } catch (e) {}
  };

  const fetchAdminPayments = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/payments`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success && data.payments) {
        setPaymentsList(data.payments);
      }
    } catch (e) {}
  };

  const adminUpdatePaymentStatus = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
    if (!adminToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/payments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success && data.payment) {
        setPaymentsList(prev => prev.map(p => (p.paymentId === id || p._id === id) ? data.payment : p));
        if (paymentRecord && (paymentRecord.paymentId === id || paymentRecord._id === id)) {
          setPaymentRecord(data.payment);
        }
        await fetchAdminStats();
      }
    } catch (e) {}
  };

  const adminChangePassword = async (cur: string, nw: string, newName?: string) => {
    if (!adminToken) return { success: false, message: 'Not authenticated' };
    try {
      const res = await fetch(`${API_BASE}/api/admin/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ currentPassword: cur, newPassword: nw, newName })
      });
      const data = await res.json();
      if (data.success) {
        setAdminMustChangePassword(false);
        sessionStorage.setItem('pi_admin_must_change', 'false');
      }
      return data;
    } catch (e: any) {
      return { success: false, message: e.message || 'Server error' };
    }
  };

  const adminUpdateConfig = async (newConfig: Partial<SystemConfig>) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(newConfig)
      });
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
      }
    } catch (e) {}
  };

  const resetAssessment = () => {
    setParticipant(null);
    setAssessmentId(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setOceanScores(null);
    setCompetencyScores([]);
    setReportData(null);
    setPaymentRecord(null);
    localStorage.removeItem('pi_participant');
    localStorage.removeItem('pi_assessment_id');
    localStorage.removeItem('pi_answers');
    localStorage.removeItem('pi_question_index');
    localStorage.removeItem('pi_ocean_scores');
    localStorage.removeItem('pi_competency_scores');
    localStorage.removeItem('pi_report_data');
    localStorage.removeItem('pi_current_payment');
    setActiveView('home');
  };

  return (
    <AssessmentContext.Provider value={{
      activeView,
      setActiveView,
      participant,
      setParticipant,
      assessmentId,
      answers,
      saveStatus,
      currentQuestionIndex,
      setCurrentQuestionIndex,
      saveAnswer,
      oceanScores,
      competencyScores,
      reportData,
      paymentRecord,
      config,
      adminToken,
      adminUsername,
      adminMustChangePassword,
      adminStats,
      paymentsList,
      participantsList,
      submitIntakeForm,
      submitAssessment,
      submitPaymentVerification,
      adminLogin,
      adminLogout,
      adminUpdatePaymentStatus,
      adminChangePassword,
      adminUpdateConfig,
      fetchAdminStats,
      fetchAdminPayments,
      resetAssessment,
      checkUnlockedReport,
    }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
