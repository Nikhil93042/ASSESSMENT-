export type ViewType = 
  | 'home' 
  | 'about' 
  | 'pricing' 
  | 'how-it-works' 
  | 'faq' 
  | 'contact' 
  | 'privacy' 
  | 'terms' 
  | 'disclaimer' 
  | 'academic-project' 
  | 'intake' 
  | 'assessment' 
  | 'results' 
  | 'payment' 
  | 'report' 
  | 'analysis' 
  | 'admin';

export type OceanCategory = 'O' | 'C' | 'E' | 'A' | 'N';

export interface Question {
  id: number;
  text: string;
  category: OceanCategory;
  categoryName: string;
  isReversed?: boolean;
}

export interface ParticipantInfo {
  participantId?: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  age?: string;
  education?: string;
  occupation?: string;
  organization?: string;
  category: 'Student' | 'Corporate Professional' | 'Manager / Leader' | 'Academic Researcher' | 'Personal Development';
  consent: boolean;
  consentTimestamp?: string;
  timestamp?: string;
}

export interface OceanScores {
  O: number; // Percentage 0-100
  C: number;
  E: number;
  A: number;
  N: number; // Emotional Stability %
  rawO?: number;
  rawC?: number;
  rawE?: number;
  rawA?: number;
  rawN?: number;
}

export interface CompetencyScore {
  id: string;
  name: string;
  score: number; // 0-100
  level: 'Developing' | 'Emerging' | 'Strong' | 'Very Strong';
  description: string;
}

export interface TraitScoreDetail {
  category: OceanCategory;
  title: string;
  score: number; // 0-100
  level: 'High' | 'Moderate' | 'Low';
  description: string;
  color: string;
}

export interface DevelopmentRecommendation {
  id?: number;
  area?: string;
  currentInsight?: string;
  whyItMatters?: string;
  specificAction?: string;
  suggestedTimeframe?: string;
  expectedOutcome?: string;
  title?: string;
  description?: string;
  actionableStep?: string;
  focusArea?: string;
}

export interface DetailedReportData {
  reportId?: string;
  assessmentId: string;
  participantInfo: ParticipantInfo;
  oceanScores: OceanScores;
  traitDetails: TraitScoreDetail[];
  archetype: {
    title: string;
    tagline: string;
    summary: string;
    badge: string;
  };
  overallProfile: string;
  majorStrengths: string[];
  leadershipPotential: {
    style: string;
    strengths: string[];
    growthAreas: string[];
  };
  communicationStyle: {
    description: string;
    tips: string[];
  };
  decisionMakingStyle: {
    approach: string;
    characteristics: string[];
  };
  careerSuitability: {
    bestFitEnvironments: string[];
    topRoles: string[];
    workStyleNotes: string;
  };
  learningStyle: {
    preferredMode: string;
    tips: string[];
  };
  stressAndCoping: {
    triggers: string[];
    copingStrategies: string[];
    resilienceRating: string;
  };
  motivationalDrivers: string[];
  competencyProfile: CompetencyScore[];
  developmentRecommendations: DevelopmentRecommendation[];
  summary: string;
  disclaimer: string;
  createdAt: string;
}

export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface PaymentRecord {
  _id?: string;
  paymentId: string;
  assessmentId: string;
  participantId?: string;
  participantName?: string;
  name: string;
  email: string;
  amount: number;
  utr: string;
  date?: string;
  submittedAt?: string;
  status: PaymentStatus;
}

export interface AuditLogEntry {
  logId: string;
  eventType: string;
  assessmentId?: string;
  participantId?: string;
  actorId?: string;
  actorRole?: string;
  details?: string;
  previousHash?: string;
  recordHash: string;
  timestamp: string;
}

export interface AssessmentRecord {
  _id: string;
  assessmentId: string;
  participantId: string;
  participantName: string;
  email: string;
  category: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'SUBMITTED' | 'PROCESSING' | 'COMPLETED' | 'FINALIZED';
  isFinalized: boolean;
  version: string;
  recordHash: string;
  oceanScores?: OceanScores;
  competencyScores?: CompetencyScore[];
  paymentStatus: string;
  createdAt: string;
  finalizedAt?: string;
}

export interface SystemConfig {
  reportPrice: number;
  upiId: string;
  upiName: string;
}

export interface AdminStats {
  totalParticipants: number;
  totalAssessments: number;
  completedAssessments: number;
  pendingAssessments?: number;
  paidReports: number;
  pendingPayments: number;
  verifiedPayments: number;
  rejectedPayments: number;
  totalRevenue: number;
  averageOceanScores?: {
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
  };
}
