import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../server/config/db.js';
import { Admin, SystemConfig } from '../server/models/Schemas.js';

dotenv.config();

export async function createAdminAccount() {
  console.log('[ADMIN SEED] Initializing Admin Accounts...');
  
  const conn = await connectDB();
  if (!conn) {
    console.error('[ADMIN SEED FAIL] Cannot connect to MongoDB database.');
    return false;
  }

  try {
    const defaultAdmins = [
      { username: 'Nikhil', password: '1626', name: 'Nikhil', adminId: 'ADMIN-NIKHIL-101' },
      { username: 'admin', password: 'admin123', name: 'System Admin', adminId: 'ADMIN-SYS-102' }
    ];

    for (const item of defaultAdmins) {
      let admin = await Admin.findOne({ username: new RegExp(`^${item.username}$`, 'i') });
      if (!admin) {
        const passwordHash = await bcrypt.hash(item.password, 10);
        await Admin.create({
          adminId: item.adminId,
          name: item.name,
          username: item.username,
          passwordHash,
          role: 'admin',
          mustChangePassword: false,
        });
        console.log(`[ADMIN SEED SUCCESS] Created admin "${item.username}".`);
      }
    }

    // Initialize System Config if missing
    const existingConfig = await SystemConfig.findOne({ configId: 'main' });
    if (!existingConfig) {
      await SystemConfig.create({
        configId: 'main',
        reportPrice: Number(process.env.PAYMENT_AMOUNT) || 49,
        upiId: process.env.UPI_ID || 'hrm301.personainsight@upi',
        upiName: 'PersonaInsight HRM301 Project'
      });
    }

    return true;
  } catch (err) {
    console.error('[ADMIN SEED ERROR]:', err.message);
    return false;
  }
}

// Execute directly if run via CLI `node scripts/createAdmin.js`
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('createAdmin.js')) {
  createAdminAccount().then(() => {
    process.exit(0);
  });
}
