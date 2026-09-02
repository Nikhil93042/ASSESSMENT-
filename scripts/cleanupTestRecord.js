import dotenv from 'dotenv';
import { connectDB } from '../server/config/db.js';
import { User, Assessment, Report, Payment } from '../server/models/Schemas.js';

dotenv.config();

async function cleanupTestRecords() {
  await connectDB();
  await User.deleteMany({ email: 'verification@hrm301.edu' });
  await Assessment.deleteMany({ participantId: 'PAR-585740' });
  await Report.deleteMany({ participantId: 'PAR-585740' });
  await Payment.deleteMany({ email: 'verification@hrm301.edu' });
  console.log('[CLEANUP SUCCESS] Test participant record removed.');
  process.exit(0);
}

cleanupTestRecords();
