import mongoose from 'mongoose';

// 1. User / Participant Schema (Complete Immutable Record Support)
const UserSchema = new mongoose.Schema({
  participantId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, default: '' },
  gender: { type: String, default: '' },
  age: { type: String, default: '' },
  education: { type: String, default: '' },
  occupation: { type: String, default: '' },
  organization: { type: String, default: '' },
  category: { type: String, default: 'Student' },
  consent: { type: Boolean, default: true },
  consentTimestamp: { type: Date, default: Date.now },
  role: { type: String, default: 'user' },
}, { timestamps: true });

// 2. Question Schema (Database-driven 25 HRM301 Questions)
const QuestionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  text: { type: String, required: true },
  dimension: { type: String, enum: ['E', 'A', 'N', 'C', 'O'], required: true },
  dimensionName: { type: String, required: true },
  reverse: { type: Boolean, default: false },
  order: { type: Number, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

// 3. Assessment Schema (Support for States, Autosave, Versioning, Immutability & SHA-256 Record Hash)
const AssessmentSchema = new mongoose.Schema({
  assessmentId: { type: String, required: true, unique: true, index: true },
  participantId: { type: String, required: true, index: true },
  version: { type: String, default: 'v1.0' },
  startTime: { type: Date, default: Date.now },
  completionTime: { type: Date },
  finalizedAt: { type: Date },
  responses: { type: Map, of: Number, default: {} },
  oceanScores: {
    O: Number,
    C: Number,
    E: Number,
    A: Number,
    N: Number,
    rawO: Number,
    rawC: Number,
    rawE: Number,
    rawA: Number,
    rawN: Number,
    levelO: String,
    levelC: String,
    levelE: String,
    levelA: String,
    levelN: String,
  },
  competencyScores: [{
    id: String,
    name: String,
    score: Number,
    level: String,
    description: String,
  }],
  status: { 
    type: String, 
    enum: ['DRAFT', 'IN_PROGRESS', 'SUBMITTED', 'PROCESSING', 'COMPLETED', 'FINALIZED'], 
    default: 'IN_PROGRESS', 
    index: true 
  },
  isFinalized: { type: Boolean, default: false, index: true },
  recordHash: { type: String }, // Cryptographic SHA-256 Fingerprint
  reportId: { type: String },
}, { timestamps: true });

// 4. Detailed Report Schema (Versioned & Immutable Snapshot)
const ReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true, index: true },
  participantId: { type: String, required: true, index: true },
  assessmentId: { type: String, required: true, index: true },
  version: { type: String, default: 'v1.0' },
  overallProfile: String,
  personalityType: {
    title: String,
    tagline: String,
    summary: String,
    badge: String,
  },
  strengths: [String],
  leadership: mongoose.Schema.Types.Mixed,
  communication: mongoose.Schema.Types.Mixed,
  decisionMaking: mongoose.Schema.Types.Mixed,
  careerSuitability: mongoose.Schema.Types.Mixed,
  learningStyle: mongoose.Schema.Types.Mixed,
  stressAndCoping: mongoose.Schema.Types.Mixed,
  motivationalDrivers: [String],
  competencyProfile: Array,
  recommendations: [{
    area: String,
    currentInsight: String,
    whyItMatters: String,
    specificAction: String,
    suggestedTimeframe: String,
    expectedOutcome: String,
  }],
  summary: String,
  disclaimer: String,
  reportHash: String,
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// 5. Payment Schema (Immutable Revenue Evidence)
const PaymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true, index: true },
  participantId: { type: String, required: true, index: true },
  assessmentId: { type: String, required: true, index: true },
  productCode: { type: String, default: 'FULL_REPORT' },
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  utr: { type: String, required: true, index: true },
  paymentMethod: { type: String, default: 'UPI' },
  status: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING', index: true },
  submittedAt: { type: Date, default: Date.now },
  verifiedAt: Date,
  verifiedBy: String,
  notes: String,
  isLocked: { type: Boolean, default: false }
}, { timestamps: true });

// 6. Product Schema
const ProductSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  badge: { type: String, default: '' },
  description: { type: String, required: true },
  features: [{ type: String }],
  active: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

// 7. Document Analysis Schema (Product B)
const DocumentAnalysisSchema = new mongoose.Schema({
  analysisId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, default: 'ANONYMOUS' },
  fileName: { type: String, required: true },
  fileType: { type: String, enum: ['PDF', 'XLSX', 'CSV'], required: true },
  fileSize: { type: Number, required: true },
  qualityScore: { type: Number, required: true },
  scoreBreakdown: {
    completeness: Number,
    accuracy: Number,
    structure: Number,
    clarity: Number,
    dataQuality: Number,
    formatting: Number,
    actionability: Number
  },
  summary: { type: String, required: true },
  strengths: [{ type: String }],
  problems: [{ type: String }],
  priorityIssues: [{ type: String }],
  recommendations: [{
    area: String,
    currentInsight: String,
    whyItMatters: String,
    specificAction: String,
    suggestedTimeframe: String,
    expectedOutcome: String
  }],
  extractedMetadata: mongoose.Schema.Types.Mixed,
  tableStats: mongoose.Schema.Types.Mixed,
  columnAnalysis: mongoose.Schema.Types.Mixed,
  status: { type: String, enum: ['PROCESSING', 'COMPLETED', 'FAILED'], default: 'COMPLETED' },
}, { timestamps: true });

// 8. Admin Schema
const AdminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  name: { type: String, default: 'Nikhil' },
  username: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'admin' },
  mustChangePassword: { type: Boolean, default: true },
}, { timestamps: true });

// 9. System Config Schema
const SystemConfigSchema = new mongoose.Schema({
  configId: { type: String, default: 'main', index: true },
  reportPrice: { type: Number, default: 49 },
  basicPrice: { type: Number, default: 0 },
  premiumPrice: { type: Number, default: 199 },
  upiId: { type: String, default: 'hrm301.personainsight@upi' },
  upiName: { type: String, default: 'PersonaInsight HRM301 Project' },
  revenueTarget: { type: Number, default: 5000 },
}, { timestamps: true });

// 10. Append-Only Cryptographic Audit Log Schema
const AuditLogSchema = new mongoose.Schema({
  logId: { type: String, required: true, unique: true, index: true },
  eventType: { type: String, required: true, index: true },
  assessmentId: { type: String, index: true },
  participantId: { type: String, index: true },
  actorId: { type: String, default: 'SYSTEM' },
  actorRole: { type: String, default: 'SYSTEM' },
  details: { type: String },
  metadata: mongoose.Schema.Types.Mixed,
  previousHash: { type: String, default: '0000000000000000000000000000000000000000000000000000000000000000' },
  recordHash: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);
export const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);
export const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);
export const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const DocumentAnalysis = mongoose.models.DocumentAnalysis || mongoose.model('DocumentAnalysis', DocumentAnalysisSchema);
export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export const SystemConfig = mongoose.models.SystemConfig || mongoose.model('SystemConfig', SystemConfigSchema);
export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
