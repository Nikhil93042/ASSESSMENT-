import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

import { connectDB, getDbStatus } from './config/db.js';
import { adminAuth } from './middleware/auth.js';
import { 
  User, Question, Assessment, Report, Payment, Product, DocumentAnalysis, Admin, SystemConfig, AuditLog 
} from './models/Schemas.js';
import { 
  HRM301_QUESTIONS, calculateOceanScores, calculateCompetencyScores, generateReportFromScores 
} from './scoringEngine.js';
import { analyzeDocument } from './documentAnalysisEngine.js';
import { createAdminAccount } from '../scripts/createAdmin.js';
import { 
  logAuditEvent, generateAssessmentRecordHash, verifyAssessmentIntegrity 
} from './auditIntegrity.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB max
});

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'personainsight_secure_jwt_secret_hrm301';

// Seed Database Questions, Products, Initial Sample Assessments & Payments
async function seedDatabase() {
  try {
    const qCount = await Question.countDocuments();
    if (qCount === 0) {
      console.log('[SEED] Seeding 25 HRM301 Big Five Assessment Questions...');
      await Question.insertMany(HRM301_QUESTIONS);
    }

    const pCount = await Product.countDocuments();
    if (pCount === 0) {
      console.log('[SEED] Seeding Product Pricing Tiers...');
      await Product.insertMany([
        {
          code: 'SNAPSHOT',
          title: 'Basic Personality Snapshot',
          price: 0,
          badge: 'Free Entry',
          description: 'Initial Big Five trait breakdown and overall summary score.',
          features: ['OCEAN Trait Percentages', 'Dominant Archetype Title', '3 Core Strengths'],
          active: true,
          isPopular: false
        },
        {
          code: 'FULL_REPORT',
          title: 'Comprehensive Personality & Industrial Psychology Report',
          price: 49,
          badge: 'Recommended for HRM301',
          description: 'Full 15-section academic consulting report with 3-5 personalized action recommendations.',
          features: ['All 10 Academic Outcome Modules', '3-5 Actionable Recommendations', 'PDF Download with Times New Roman 12/14', 'Leadership & Career Mapping'],
          active: true,
          isPopular: true
        },
        {
          code: 'PREMIUM_CONSULTING',
          title: 'Personality + Career & Leadership Suite',
          price: 199,
          badge: 'Executive Suite',
          description: 'Full report + AI Document Intelligence credits + 1-on-1 debrief template.',
          features: ['Full 15-Section Personality Report', '5 Document Intelligence Analyses', 'Career Competency Matrix', 'Priority Verification'],
          active: true,
          isPopular: false
        }
      ]);
    }

    const assCount = await Assessment.countDocuments();
    if (assCount === 0) {
      console.log('[SEED] Seeding Sample Participant Assessments for Live Analytics...');
      const sampleParticipants = [
        { participantId: 'PAR-756407', name: 'Raushan Kumar', email: 'raushan.kumar@lpu.in', category: 'Student' },
        { participantId: 'PAR-882310', name: 'Priya Sharma', email: 'priya.sharma@example.com', category: 'Corporate Professional' },
        { participantId: 'PAR-941205', name: 'Amit Patel', email: 'amit.patel@example.com', category: 'Manager / Leader' }
      ];

      for (const p of sampleParticipants) {
        await User.findOneAndUpdate({ participantId: p.participantId }, p, { upsert: true });
      }

      const sampleAssessments = [
        {
          assessmentId: 'PI-756407',
          participantId: 'PAR-756407',
          version: 'v1.0',
          status: 'FINALIZED',
          isFinalized: true,
          completionTime: new Date(),
          finalizedAt: new Date(),
          oceanScores: { O: 85, C: 90, E: 78, A: 82, N: 88, rawO: 30, rawC: 32, rawE: 28, rawA: 29, rawN: 31, levelO: 'High', levelC: 'Very High', levelE: 'High', levelA: 'High', levelN: 'Very High' },
          competencyScores: [
            { id: 'leadership', name: 'Leadership & Initiative', score: 85, level: 'Very Strong', description: 'Ability to step forward and lead.' },
            { id: 'communication', name: 'Communication & Expression', score: 80, level: 'Very Strong', description: 'Interpersonal clarity.' },
            { id: 'accountability', name: 'Dependability & Execution', score: 92, level: 'Very Strong', description: 'Reliability in meeting commitments.' }
          ]
        },
        {
          assessmentId: 'PI-882310',
          participantId: 'PAR-882310',
          version: 'v1.0',
          status: 'FINALIZED',
          isFinalized: true,
          completionTime: new Date(),
          finalizedAt: new Date(),
          oceanScores: { O: 72, C: 85, E: 65, A: 90, N: 75, rawO: 26, rawC: 30, rawE: 24, rawA: 32, rawN: 27, levelO: 'High', levelC: 'High', levelE: 'Moderate', levelA: 'Very High', levelN: 'High' },
          competencyScores: [
            { id: 'leadership', name: 'Leadership & Initiative', score: 70, level: 'Strong', description: 'Ability to step forward and lead.' },
            { id: 'communication', name: 'Communication & Expression', score: 88, level: 'Very Strong', description: 'Interpersonal clarity.' },
            { id: 'accountability', name: 'Dependability & Execution', score: 85, level: 'Very Strong', description: 'Reliability in meeting commitments.' }
          ]
        },
        {
          assessmentId: 'PI-941205',
          participantId: 'PAR-941205',
          version: 'v1.0',
          status: 'IN_PROGRESS',
          isFinalized: false,
          oceanScores: { O: 60, C: 65, E: 70, A: 68, N: 62, rawO: 23, rawC: 24, rawE: 26, rawA: 25, rawN: 23, levelO: 'Moderate', levelC: 'Moderate', levelE: 'High', levelA: 'Moderate', levelN: 'Moderate' }
        }
      ];

      for (const ass of sampleAssessments) {
        const p = sampleParticipants.find(sp => sp.participantId === ass.participantId);
        const recordHash = generateAssessmentRecordHash(ass, p, ass.oceanScores);
        await Assessment.findOneAndUpdate({ assessmentId: ass.assessmentId }, { ...ass, recordHash }, { upsert: true });

        // Log Seeding Audit Log
        await logAuditEvent({
          eventType: ass.status === 'FINALIZED' ? 'ASSESSMENT_FINALIZED' : 'ASSESSMENT_STARTED',
          assessmentId: ass.assessmentId,
          participantId: ass.participantId,
          actorId: 'SYSTEM_SEED',
          actorRole: 'SYSTEM',
          details: `Seeded ${ass.status} assessment record for ${p ? p.name : 'Participant'}`,
          metadata: { recordHash, status: ass.status }
        });
      }
    }

    const payCount = await Payment.countDocuments();
    if (payCount === 0) {
      console.log('[SEED] Seeding Sample Payment Records for UTR Verification...');
      const samplePayments = [
        {
          paymentId: 'PAY-756407',
          participantId: 'PAR-756407',
          assessmentId: 'PI-756407',
          productCode: 'FULL_REPORT',
          name: 'Raushan Kumar',
          email: 'raushan.kumar@lpu.in',
          amount: 49,
          utr: '435165399465',
          paymentMethod: 'UPI',
          status: 'PENDING',
          submittedAt: new Date()
        },
        {
          paymentId: 'PAY-882310',
          participantId: 'PAR-882310',
          assessmentId: 'PI-882310',
          productCode: 'FULL_REPORT',
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          amount: 49,
          utr: '329104829104',
          paymentMethod: 'UPI',
          status: 'VERIFIED',
          submittedAt: new Date(Date.now() - 3600000),
          verifiedAt: new Date(),
          verifiedBy: 'admin'
        }
      ];

      for (const pay of samplePayments) {
        await Payment.findOneAndUpdate({ paymentId: pay.paymentId }, pay, { upsert: true });
      }
    }
  } catch (err) {
    console.error('[SEED ERROR]:', err.message);
  }
}

// ----------------------------------------------------
// HEALTH & PUBLIC CONFIG ROUTE
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  return res.status(200).json({
    success: true,
    server: 'running',
    database: dbStatus.connected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/config', async (req, res) => {
  try {
    const config = await SystemConfig.findOne({ configId: 'main' });
    const products = await Product.find({ active: true });
    res.json({ 
      success: true, 
      config: config || { reportPrice: 49, upiId: 'hrm301.personainsight@upi', upiName: 'PersonaInsight HRM301 Project' },
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------
// PRODUCT A: QUESTIONS & ASSESSMENT PERSISTENCE ROUTES
// ----------------------------------------------------

// Get All Assessment Questions (From Database)
app.get('/api/questions', async (req, res) => {
  try {
    let questions = await Question.find({ active: true }).sort({ order: 1 });
    if (questions.length === 0) {
      questions = HRM301_QUESTIONS;
    }
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Register Participant & Store Immutable Intake Information
app.post('/api/participants', async (req, res) => {
  try {
    const { name, email, phone, gender, age, education, occupation, organization, category, consent } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and Email are required.' });
    }

    const participantId = `PAR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newUser = await User.create({
      participantId,
      name,
      email,
      phone: phone || '',
      gender: gender || '',
      age: age || '',
      education: education || '',
      occupation: occupation || '',
      organization: organization || '',
      category: category || 'Student',
      consent: consent !== false,
      consentTimestamp: new Date(),
    });

    await logAuditEvent({
      eventType: 'PARTICIPANT_REGISTERED',
      participantId,
      actorId: participantId,
      actorRole: 'USER',
      details: `Registered participant ${name} (${email})`,
      metadata: { category, consent: consent !== false }
    });

    res.status(201).json({ success: true, participantId, participant: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start Assessment Session (State: IN_PROGRESS)
app.post('/api/assessments/start', async (req, res) => {
  try {
    const { participantId } = req.body;
    if (!participantId) {
      return res.status(400).json({ success: false, message: 'Participant ID is required.' });
    }

    const assessmentId = `PI-${Math.floor(100000 + Math.random() * 900000)}`;
    const newAssessment = await Assessment.create({
      assessmentId,
      participantId,
      version: 'v1.0',
      startTime: new Date(),
      status: 'IN_PROGRESS',
      isFinalized: false,
      responses: {},
    });

    await logAuditEvent({
      eventType: 'ASSESSMENT_STARTED',
      assessmentId,
      participantId,
      actorId: participantId,
      actorRole: 'USER',
      details: `Started new assessment session ${assessmentId} (version v1.0)`,
      metadata: { version: 'v1.0' }
    });

    res.status(201).json({ success: true, assessmentId, assessment: newAssessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Autosave Response (Background Real-Time Persistence)
app.post('/api/assessments/autosave', async (req, res) => {
  try {
    const { assessmentId, participantId, questionId, value } = req.body;
    if (!assessmentId || questionId === undefined || value === undefined) {
      return res.status(400).json({ success: false, message: 'assessmentId, questionId, and value are required.' });
    }

    let assessment = await Assessment.findOne({ assessmentId });

    if (assessment && (assessment.status === 'FINALIZED' || assessment.isFinalized)) {
      return res.status(403).json({ 
        success: false, 
        message: 'FINALIZED assessment records are immutable and protected against response modification.' 
      });
    }

    if (!assessment) {
      assessment = new Assessment({
        assessmentId,
        participantId: participantId || 'PAR-GUEST',
        version: 'v1.0',
        startTime: new Date(),
        status: 'IN_PROGRESS',
        isFinalized: false,
        responses: {}
      });
    }

    const previousValue = assessment.responses.get(questionId.toString());
    assessment.responses.set(questionId.toString(), Number(value));
    assessment.status = 'IN_PROGRESS';
    await assessment.save();

    // Log Autosave Audit Event
    await logAuditEvent({
      eventType: previousValue !== undefined ? 'ANSWER_CHANGED' : 'ANSWER_SAVED',
      assessmentId,
      participantId: assessment.participantId,
      actorId: assessment.participantId,
      actorRole: 'USER',
      details: `Question ${questionId} set to rating ${value}`,
      metadata: { questionId, previousValue, newValue: value }
    });

    res.json({ success: true, message: 'Response autosaved to MongoDB.', assessmentId, questionId, value });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit Assessment Responses, Calculate Scores & Mark FINALIZED (Immutable)
app.post('/api/assessments/submit', async (req, res) => {
  try {
    const { assessmentId, participantId, responses } = req.body;
    if (!assessmentId || !responses) {
      return res.status(400).json({ success: false, message: 'Assessment ID and responses are required.' });
    }

    let assessment = await Assessment.findOne({ assessmentId });
    if (assessment && (assessment.status === 'FINALIZED' || assessment.isFinalized)) {
      return res.status(403).json({ 
        success: false, 
        message: 'This assessment has already been FINALIZED and is immutable.' 
      });
    }

    let participant = await User.findOne({ participantId });
    if (!participant) {
      participant = await User.create({
        participantId: participantId || `PAR-${Math.floor(100000 + Math.random() * 900000)}`,
        name: 'Participant',
        email: 'user@example.com'
      });
    }

    // Server-Side Deterministic Scoring
    const oceanScores = calculateOceanScores(responses);
    const competencyScores = calculateCompetencyScores(responses);
    const reportData = generateReportFromScores(participant, oceanScores, competencyScores, assessmentId);

    const finalizedAssessment = await Assessment.findOneAndUpdate(
      { assessmentId },
      {
        participantId: participant.participantId,
        responses,
        oceanScores,
        competencyScores,
        status: 'FINALIZED',
        isFinalized: true,
        version: 'v1.0',
        completionTime: new Date(),
        finalizedAt: new Date(),
        reportId: reportData.reportId,
      },
      { new: true, upsert: true }
    );

    // Generate SHA-256 Cryptographic Record Hash
    const recordHash = generateAssessmentRecordHash(finalizedAssessment, participant, oceanScores);
    finalizedAssessment.recordHash = recordHash;
    await finalizedAssessment.save();

    await Report.findOneAndUpdate(
      { reportId: reportData.reportId },
      {
        ...reportData,
        version: 'v1.0',
        reportHash: recordHash
      },
      { upsert: true, new: true }
    );

    // Log Finalization Audit Events
    await logAuditEvent({
      eventType: 'ASSESSMENT_SUBMITTED',
      assessmentId,
      participantId: participant.participantId,
      actorId: participant.participantId,
      actorRole: 'USER',
      details: 'Assessment responses submitted for final calculation',
      metadata: { questionCount: Object.keys(responses).length }
    });

    await logAuditEvent({
      eventType: 'ASSESSMENT_FINALIZED',
      assessmentId,
      participantId: participant.participantId,
      actorId: 'SYSTEM',
      actorRole: 'SYSTEM',
      details: `Assessment FINALIZED with record SHA-256 fingerprint ${recordHash.substring(0, 16)}...`,
      metadata: { recordHash, oceanScores }
    });

    res.json({
      success: true,
      message: 'Assessment calculated, FINALIZED, and saved permanently in MongoDB.',
      assessmentId,
      recordHash,
      status: 'FINALIZED',
      oceanScores,
      competencyScores,
      previewReport: {
        assessmentId,
        archetype: reportData.personalityType,
        overallProfile: reportData.overallProfile,
        majorStrengths: reportData.strengths,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Unlocked Report (Requires VERIFIED Payment Status)
app.get('/api/reports/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    
    // Check payment status
    const payment = await Payment.findOne({ assessmentId, status: 'VERIFIED' });
    const isUnlocked = Boolean(payment);

    const report = await Report.findOne({ assessmentId });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    if (!isUnlocked) {
      return res.json({ 
        success: true, 
        unlocked: false, 
        message: 'Payment verification is required to unlock full PDF & detailed report.',
        preview: {
          reportId: report.reportId,
          participantId: report.participantId,
          assessmentId: report.assessmentId,
          personalityType: report.personalityType,
          overallProfile: report.overallProfile,
          strengths: report.strengths,
        }
      });
    }

    res.json({ success: true, unlocked: true, report, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------
// PRODUCT B: AI DOCUMENT INTELLIGENCE ROUTES
// ----------------------------------------------------

// Upload & Analyze Document (PDF, XLSX, CSV)
app.post('/api/analysis/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file was uploaded.' });
    }

    const { originalname, path: filePath, mimetype } = req.file;

    const analysisResult = await analyzeDocument(filePath, originalname, mimetype);

    const savedDocAnalysis = await DocumentAnalysis.create(analysisResult);

    res.status(201).json({
      success: true,
      message: 'Document analyzed successfully',
      analysis: savedDocAnalysis
    });
  } catch (error) {
    console.error('[DOC ANALYSIS ERROR]:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Analysis History
app.get('/api/analysis/history', async (req, res) => {
  try {
    const history = await DocumentAnalysis.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------
// PAYMENTS & REVENUE SYSTEM
// ----------------------------------------------------

// Submit Payment (State: PENDING)
app.post('/api/payments/submit', async (req, res) => {
  try {
    const { assessmentId, participantId, name, email, utr, amount, productCode } = req.body;
    if (!utr || utr.trim().length < 6) {
      return res.status(400).json({ success: false, message: 'A valid transaction reference / UTR number is required.' });
    }

    const pId = participantId || `PAR-${Math.floor(100000 + Math.random() * 900000)}`;
    const aId = assessmentId || `PI-${Math.floor(100000 + Math.random() * 900000)}`;

    // Ensure User record exists
    await User.findOneAndUpdate(
      { participantId: pId },
      { name: name || 'Participant', email: email || 'user@example.com' },
      { upsert: true }
    );

    const paymentId = `PAY-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPayment = await Payment.create({
      paymentId,
      participantId: pId,
      assessmentId: aId,
      productCode: productCode || 'FULL_REPORT',
      name: name || 'Participant',
      email: email || 'user@example.com',
      amount: amount || 49,
      utr: utr.trim(),
      paymentMethod: 'UPI',
      status: 'PENDING',
      submittedAt: new Date(),
    });

    await logAuditEvent({
      eventType: 'PAYMENT_CREATED',
      assessmentId: aId,
      participantId: pId,
      actorId: pId,
      actorRole: 'USER',
      details: `Submitted payment ${paymentId} with UTR ${utr.trim()} for ₹${amount || 49}`,
      metadata: { paymentId, utr: utr.trim(), amount: amount || 49 }
    });

    res.status(201).json({ 
      success: true, 
      message: 'Payment submitted for verification. Admin approval is pending.',
      payment: newPayment 
    });
  } catch (error) {
    console.error('[PAYMENT ERROR]:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ----------------------------------------------------
// ADMIN AUTHENTICATION, DASHBOARD & IMMUTABLE RECORDS
// ----------------------------------------------------

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ username: new RegExp(`^${username.trim()}$`, 'i') });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password.trim(), admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { adminId: admin.adminId, username: admin.username, role: admin.role || 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name || 'Nikhil',
        username: admin.username,
        role: admin.role || 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Dashboard Summary & Analytics
const getDashboardStats = async (req, res) => {
  try {
    const totalParticipants = await User.countDocuments();
    const totalAssessments = await Assessment.countDocuments();
    const completedAssessments = await Assessment.countDocuments({ status: { $in: ['COMPLETED', 'FINALIZED'] } });
    const pendingAssessments = await Assessment.countDocuments({ status: { $in: ['DRAFT', 'IN_PROGRESS'] } });
    
    const pendingPayments = await Payment.countDocuments({ status: 'PENDING' });
    const verifiedPayments = await Payment.countDocuments({ status: 'VERIFIED' });
    const rejectedPayments = await Payment.countDocuments({ status: 'REJECTED' });

    const totalAnalyses = await DocumentAnalysis.countDocuments();

    // Calculate Verified Revenue
    const revenueAgg = await Payment.aggregate([
      { $match: { status: 'VERIFIED' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // Calculate Average OCEAN Scores
    const oceanAgg = await Assessment.aggregate([
      { $match: { status: { $in: ['COMPLETED', 'FINALIZED'] }, 'oceanScores.O': { $exists: true } } },
      {
        $group: {
          _id: null,
          avgO: { $avg: "$oceanScores.O" },
          avgC: { $avg: "$oceanScores.C" },
          avgE: { $avg: "$oceanScores.E" },
          avgA: { $avg: "$oceanScores.A" },
          avgN: { $avg: "$oceanScores.N" },
        }
      }
    ]);

    const averageOceanScores = oceanAgg.length > 0 ? {
      O: Math.round(oceanAgg[0].avgO || 0),
      C: Math.round(oceanAgg[0].avgC || 0),
      E: Math.round(oceanAgg[0].avgE || 0),
      A: Math.round(oceanAgg[0].avgA || 0),
      N: Math.round(oceanAgg[0].avgN || 0),
    } : { O: 78, C: 82, E: 74, A: 85, N: 76 };

    // HRM301 Performance Level Calculation
    let performanceLevel = "Foundation Level (Up to ₹500)";
    if (totalRevenue >= 1000) {
      performanceLevel = "Performer Level (₹1,000–₹5,000)";
    } else if (totalRevenue >= 501) {
      performanceLevel = "Emerging Performer (₹501–₹999)";
    }

    res.json({
      success: true,
      stats: {
        totalParticipants,
        totalAssessments,
        completedAssessments,
        pendingAssessments,
        totalAnalyses,
        pendingPayments,
        verifiedPayments,
        rejectedPayments,
        totalRevenue,
        paidReports: verifiedPayments,
        averageOceanScores,
        performanceLevel,
        revenueTarget: 5000,
        remainingTarget: Math.max(0, 5000 - totalRevenue)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

app.get('/api/admin/dashboard', adminAuth, getDashboardStats);
app.get('/api/admin/stats', adminAuth, getDashboardStats);

// Admin Assessments List (Populated with Cryptographic Integrity Proof)
app.get('/api/admin/assessments', adminAuth, async (req, res) => {
  try {
    const assessments = await Assessment.find().sort({ createdAt: -1 }).limit(100);
    const populated = await Promise.all(assessments.map(async (ass) => {
      const participant = await User.findOne({ participantId: ass.participantId });
      const payment = await Payment.findOne({ assessmentId: ass.assessmentId }).sort({ createdAt: -1 });

      return {
        _id: ass._id,
        assessmentId: ass.assessmentId,
        participantId: ass.participantId,
        participantName: participant ? participant.name : (payment ? payment.name : 'Participant'),
        email: participant ? participant.email : (payment ? payment.email : 'No email'),
        category: participant ? participant.category : 'Student',
        status: ass.status || (ass.isFinalized ? 'FINALIZED' : 'IN_PROGRESS'),
        isFinalized: Boolean(ass.isFinalized || ass.status === 'FINALIZED'),
        version: ass.version || 'v1.0',
        recordHash: ass.recordHash || '',
        oceanScores: ass.oceanScores,
        competencyScores: ass.competencyScores,
        paymentStatus: payment ? payment.status : 'UNPAID',
        createdAt: ass.createdAt,
        finalizedAt: ass.finalizedAt || ass.completionTime
      };
    }));

    res.json({ success: true, assessments: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Complete Read-Only Participant Record (Read-Only Inspection)
app.get('/api/admin/assessments/:id/record', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isMongoId ? { $or: [{ _id: id }, { assessmentId: id }] } : { assessmentId: id };

    const assessment = await Assessment.findOne(query);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment record not found.' });
    }

    const participant = await User.findOne({ participantId: assessment.participantId });
    const report = await Report.findOne({ assessmentId: assessment.assessmentId });
    const payment = await Payment.findOne({ assessmentId: assessment.assessmentId });
    const auditLogs = await AuditLog.find({ assessmentId: assessment.assessmentId }).sort({ createdAt: 1 });
    const integrity = await verifyAssessmentIntegrity(assessment.assessmentId);

    // Log admin inspection to audit trail
    await logAuditEvent({
      eventType: 'ADMIN_VIEWED_RECORD',
      assessmentId: assessment.assessmentId,
      participantId: assessment.participantId,
      actorId: req.admin.username,
      actorRole: 'ADMIN',
      details: `Admin ${req.admin.username} inspected full read-only assessment record`
    });

    res.json({
      success: true,
      record: {
        assessment,
        participant,
        report,
        payment,
        auditLogs,
        integrity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify Record Integrity SHA-256 Cryptographic Proof
app.get('/api/admin/integrity/verify/:assessmentId', adminAuth, async (req, res) => {
  try {
    const result = await verifyAssessmentIntegrity(req.params.assessmentId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Append-Only Audit History
app.get('/api/admin/audit/:assessmentId', adminAuth, async (req, res) => {
  try {
    const logs = await AuditLog.find({ assessmentId: req.params.assessmentId }).sort({ createdAt: 1 });
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Backend Backend Immutability Enforcement (Reject PUT/DELETE on Finalized Records)
app.put('/api/admin/assessments/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isMongoId ? { $or: [{ _id: id }, { assessmentId: id }] } : { assessmentId: id };

    const ass = await Assessment.findOne(query);
    if (ass && (ass.status === 'FINALIZED' || ass.isFinalized)) {
      await logAuditEvent({
        eventType: 'UNAUTHORIZED_MODIFICATION_ATTEMPT',
        assessmentId: ass.assessmentId,
        participantId: ass.participantId,
        actorId: req.admin.username,
        actorRole: 'ADMIN',
        details: `Rejected attempt by ${req.admin.username} to modify FINALIZED assessment record.`
      });
      return res.status(403).json({
        success: false,
        message: 'FINALIZED assessment records are immutable and protected against modification.'
      });
    }

    const updated = await Assessment.findOneAndUpdate(query, req.body, { new: true });
    res.json({ success: true, assessment: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/admin/assessments/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isMongoId ? { $or: [{ _id: id }, { assessmentId: id }] } : { assessmentId: id };

    const ass = await Assessment.findOne(query);
    if (ass && (ass.status === 'FINALIZED' || ass.isFinalized)) {
      await logAuditEvent({
        eventType: 'UNAUTHORIZED_DELETION_ATTEMPT',
        assessmentId: ass.assessmentId,
        participantId: ass.participantId,
        actorId: req.admin.username,
        actorRole: 'ADMIN',
        details: `Rejected attempt by ${req.admin.username} to delete FINALIZED assessment record.`
      });
      return res.status(403).json({
        success: false,
        message: 'FINALIZED assessment records are immutable and protected against deletion.'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Hard deletion of assessment data is prohibited by data governance rules.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Payments List
app.get('/api/admin/payments', adminAuth, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Verify or Reject Payment (Immutable Verification Logging)
app.put('/api/admin/payments/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be VERIFIED or REJECTED.' });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isMongoId ? { $or: [{ _id: id }, { paymentId: id }] } : { paymentId: id };

    const updatedPayment = await Payment.findOneAndUpdate(
      query,
      { status, notes: notes || '', verifiedAt: new Date(), verifiedBy: req.admin.username, isLocked: true },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    await logAuditEvent({
      eventType: status === 'VERIFIED' ? 'PAYMENT_VERIFIED' : 'PAYMENT_REJECTED',
      assessmentId: updatedPayment.assessmentId,
      participantId: updatedPayment.participantId,
      actorId: req.admin.username,
      actorRole: 'ADMIN',
      details: `Payment ${updatedPayment.paymentId} marked as ${status} by admin ${req.admin.username}`,
      metadata: { paymentId: updatedPayment.paymentId, utr: updatedPayment.utr, amount: updatedPayment.amount }
    });

    res.json({ success: true, payment: updatedPayment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Revenue Evidence Export (CSV Format)
app.get('/api/admin/revenue/export-evidence', adminAuth, async (req, res) => {
  try {
    const verifiedPayments = await Payment.find({ status: 'VERIFIED' }).sort({ verifiedAt: -1 });
    const totalRevenue = verifiedPayments.reduce((acc, p) => acc + p.amount, 0);

    let performanceLevel = "Foundation Level (Up to ₹500)";
    if (totalRevenue >= 1000) performanceLevel = "Performer Level (₹1,000–₹5,000)";
    else if (totalRevenue >= 501) performanceLevel = "Emerging Performer (₹501–₹999)";

    const csvHeader = "Payment ID,Assessment ID,Customer Name,Email,UTR Reference,Amount (INR),Payment Method,Submitted Date,Verified Date\n";
    const csvRows = verifiedPayments.map(p => 
      `"${p.paymentId}","${p.assessmentId}","${p.name}","${p.email}","${p.utr}",${p.amount},"${p.paymentMethod}","${p.submittedAt.toISOString()}","${p.verifiedAt ? p.verifiedAt.toISOString() : ''}"`
    ).join("\n");

    const csvSummary = `\n\nPROJECT REVENUE EVIDENCE SUMMARY\nTotal Verified Transactions,${verifiedPayments.length}\nTotal Verified Revenue (INR),₹${totalRevenue}\nAcademic Performance Level,${performanceLevel}\nGenerated Date,${new Date().toISOString()}\n`;

    await logAuditEvent({
      eventType: 'EXPORT_GENERATED',
      actorId: req.admin.username,
      actorRole: 'ADMIN',
      details: 'Exported official revenue evidence CSV report for university submission.'
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=HRM301_Revenue_Evidence_Report.csv');
    res.status(200).send(csvHeader + csvRows + csvSummary);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// FRONTEND SERVING
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

// Connect Database & Seed Data
connectDB().then(() => {
  createAdminAccount();
  seedDatabase();
  app.listen(PORT, () => {
    console.log(`[PersonaInsight Server] Running on http://localhost:${PORT}`);
  });
});
