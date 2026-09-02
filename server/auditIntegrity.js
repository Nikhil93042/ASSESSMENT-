import crypto from 'crypto';
import { AuditLog, Assessment, User, Report, Payment } from './models/Schemas.js';

// Canonical SHA-256 Hash Generator
export function calculateSHA256(data) {
  const canonicalString = typeof data === 'string' ? data : JSON.stringify(data, Object.keys(data).sort());
  return crypto.createHash('sha256').update(canonicalString).digest('hex');
}

// Append-Only Chained Audit Log Function
export async function logAuditEvent({ eventType, assessmentId = '', participantId = '', actorId = 'SYSTEM', actorRole = 'SYSTEM', details = '', metadata = {} }) {
  try {
    // Get last audit log entry for chained hash verification
    const lastLog = await AuditLog.findOne().sort({ createdAt: -1 });
    const previousHash = lastLog ? lastLog.recordHash : '0000000000000000000000000000000000000000000000000000000000000000';

    const timestamp = new Date();
    const auditId = `AUD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const canonicalContent = `${previousHash}|${eventType}|${assessmentId}|${participantId}|${actorId}|${timestamp.toISOString()}|${JSON.stringify(metadata)}`;
    const recordHash = calculateSHA256(canonicalContent);

    const newAudit = await AuditLog.create({
      logId: auditId,
      eventType,
      assessmentId,
      participantId,
      actorId,
      actorRole,
      details,
      metadata,
      previousHash,
      recordHash,
      timestamp,
    });

    console.log(`[AUDIT LOGGED] ${eventType} for Assessment ${assessmentId} by ${actorId} (Hash: ${recordHash.substring(0, 12)}...)`);
    return newAudit;
  } catch (err) {
    console.error('[AUDIT LOG ERROR]:', err.message);
    return null;
  }
}

// Generate Canonical Assessment Record Hash for Finalized Immutability
export function generateAssessmentRecordHash(assessment, participant, oceanScores) {
  const payload = {
    assessmentId: assessment.assessmentId,
    participantId: assessment.participantId,
    email: participant ? participant.email : '',
    version: assessment.version || 'v1.0',
    startTime: assessment.startTime ? new Date(assessment.startTime).toISOString() : '',
    completionTime: assessment.completionTime ? new Date(assessment.completionTime).toISOString() : '',
    scores: oceanScores || assessment.oceanScores || {},
    responses: assessment.responses ? Object.fromEntries(assessment.responses) : {}
  };

  return calculateSHA256(payload);
}

// Verify Integrity of a Finalized Assessment Record against Stored Hash
export async function verifyAssessmentIntegrity(assessmentId) {
  try {
    const assessment = await Assessment.findOne({ assessmentId });
    if (!assessment) {
      return { success: false, message: 'Assessment record not found.' };
    }

    const participant = await User.findOne({ participantId: assessment.participantId });
    const computedHash = generateAssessmentRecordHash(assessment, participant, assessment.oceanScores);

    const storedHash = assessment.recordHash || computedHash;
    const isMatch = storedHash === computedHash;

    // Log the integrity verification action to Audit Log
    await logAuditEvent({
      eventType: 'INTEGRITY_CHECK_PERFORMED',
      assessmentId,
      participantId: assessment.participantId,
      actorRole: 'ADMIN',
      details: `Integrity check result: ${isMatch ? 'PASSED (Match)' : 'WARNING (Mismatch Detected)'}`,
      metadata: { storedHash, computedHash, isMatch }
    });

    return {
      success: true,
      assessmentId,
      isMatch,
      status: isMatch ? 'VERIFIED' : 'TAMPERED',
      storedHash,
      computedHash,
      verifiedAt: new Date().toISOString()
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
