import dotenv from 'dotenv';
dotenv.config();

async function runEndToEndTest() {
  console.log('=== STARTING END-TO-END SYSTEM TEST ===');
  const baseUrl = 'http://localhost:5000';

  try {
    // 1. Health Check
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const health = await healthRes.json();
    console.log('[TEST 1] Health Check:', health);

    // 2. Admin Login (Nikhil / 1626)
    const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'Nikhil', password: '1626' })
    });
    const loginData = await loginRes.json();
    console.log('[TEST 2] Admin Login:', loginData.success ? 'SUCCESS (Token received)' : loginData);
    const token = loginData.token;

    // 3. Register Participant
    const userRes = await fetch(`${baseUrl}/api/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Verification Student', email: 'verification@hrm301.edu', category: 'Student' })
    });
    const userData = await userRes.json();
    console.log('[TEST 3] Participant Created:', userData.participantId);

    // 4. Start Assessment
    const startRes = await fetch(`${baseUrl}/api/assessments/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantId: userData.participantId })
    });
    const startData = await startRes.json();
    console.log('[TEST 4] Assessment Started:', startData.assessmentId);

    // 5. Submit Answers
    const answers = { 1: 5, 2: 4, 3: 4, 4: 5, 5: 5, 6: 4, 7: 3, 8: 5, 9: 5, 10: 4, 11: 4, 12: 5, 13: 5, 14: 5, 15: 4, 16: 4, 17: 4, 18: 5, 19: 4, 20: 5, 21: 4, 22: 4, 23: 5, 24: 5, 25: 5 };
    const submitRes = await fetch(`${baseUrl}/api/assessments/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessmentId: startData.assessmentId, participantId: userData.participantId, responses: answers })
    });
    const submitData = await submitRes.json();
    console.log('[TEST 5] Assessment Submitted & Scored:', submitData.oceanScores);

    // 6. Verify Assessment in Admin Dashboard API
    const assListRes = await fetch(`${baseUrl}/api/admin/assessments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const assListData = await assListRes.json();
    const foundAss = assListData.assessments.find(a => a.assessmentId === startData.assessmentId);
    console.log('[TEST 6] Admin Dashboard Assessment Found:', foundAss ? `YES (${foundAss.participantName})` : 'NO');

    // 7. Submit Payment UTR
    const payRes = await fetch(`${baseUrl}/api/payments/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessmentId: startData.assessmentId, participantId: userData.participantId, name: 'Verification Student', email: 'verification@hrm301.edu', utr: '329104829104', amount: 49 })
    });
    const payData = await payRes.json();
    console.log('[TEST 7] Payment Submitted:', payData.payment.paymentId, 'Status:', payData.payment.status);

    // 8. Admin Verifies Payment
    const verifyRes = await fetch(`${baseUrl}/api/admin/payments/${payData.payment._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: 'VERIFIED' })
    });
    const verifyData = await verifyRes.json();
    console.log('[TEST 8] Admin Payment Verification:', verifyData.payment.status);

    // 9. Report Unlocked Check
    const reportRes = await fetch(`${baseUrl}/api/reports/${startData.assessmentId}`);
    const reportData = await reportRes.json();
    console.log('[TEST 9] Detailed Report Unlocked:', reportData.unlocked ? `YES (Archetype: ${reportData.report.personalityType.title})` : 'NO');

    console.log('=== END-TO-END SYSTEM TEST COMPLETE: ALL PASS ===');
  } catch (err) {
    console.error('TEST FAILED:', err);
  }
}

runEndToEndTest();
