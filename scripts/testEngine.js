import { calculateOceanScores, calculateCompetencyScores, generateReportFromScores } from '../server/scoringEngine.js';
import { analyzeDocument } from '../server/documentAnalysisEngine.js';
import fs from 'fs';
import path from 'path';

console.log("====================================================");
console.log("RUNNING AUTOMATED UNIT & INTEGRATION TESTS");
console.log("====================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
  }
}

// ----------------------------------------------------
// TEST 1: All 7 Rating Scoring (Maximum Score 35 per dimension)
// ----------------------------------------------------
const maxResponses = {};
for (let i = 1; i <= 25; i++) maxResponses[i] = 7;

const maxScores = calculateOceanScores(maxResponses);
assert(maxScores.rawO === 35, `Max Raw Openness should be 35, got ${maxScores.rawO}`);
assert(maxScores.rawC === 35, `Max Raw Conscientiousness should be 35, got ${maxScores.rawC}`);
assert(maxScores.rawE === 35, `Max Raw Extraversion should be 35, got ${maxScores.rawE}`);
assert(maxScores.rawA === 35, `Max Raw Agreeableness should be 35, got ${maxScores.rawA}`);
assert(maxScores.rawN === 35, `Max Raw Emotional Stability should be 35, got ${maxScores.rawN}`);

assert(maxScores.O === 100, `Max Percentage Openness should be 100%, got ${maxScores.O}%`);
assert(maxScores.levelO === 'Very High', `Max Level Openness should be 'Very High', got '${maxScores.levelO}'`);

// ----------------------------------------------------
// TEST 2: All 1 Rating Scoring (Minimum Score 5 per dimension)
// ----------------------------------------------------
const minResponses = {};
for (let i = 1; i <= 25; i++) minResponses[i] = 1;

const minScores = calculateOceanScores(minResponses);
assert(minScores.rawO === 5, `Min Raw Openness should be 5, got ${minScores.rawO}`);
assert(minScores.O === 0, `Min Percentage Openness should be 0%, got ${minScores.O}%`);
assert(minScores.levelO === 'Very Low', `Min Level Openness should be 'Very Low', got '${minScores.levelO}'`);

// ----------------------------------------------------
// TEST 3: Report & Structured Recommendations Validation
// ----------------------------------------------------
const participant = { participantId: 'PAR-TEST', name: 'Test Participant', email: 'test@example.com' };
const compScores = calculateCompetencyScores(maxResponses);
const report = generateReportFromScores(participant, maxScores, compScores, 'PI-TEST');

assert(report.recommendations.length >= 3, `Should have 3-5 recommendations, got ${report.recommendations.length}`);

const rec = report.recommendations[0];
const hasRequiredKeys = rec.area && rec.currentInsight && rec.whyItMatters && rec.specificAction && rec.suggestedTimeframe && rec.expectedOutcome;
assert(Boolean(hasRequiredKeys), "Recommendation contains all required keys (area, currentInsight, whyItMatters, specificAction, suggestedTimeframe, expectedOutcome)");

// ----------------------------------------------------
// TEST 4: Product B Document Intelligence Test
// ----------------------------------------------------
async function testDocEngine() {
  const dummyCsvPath = path.resolve('test_sample.csv');
  const dummyContent = "Name,Department,Score,Status\nJohn,Sales,85,Completed\nJane,Engineering,92,Completed\n,Marketing,,Pending\n";
  fs.writeFileSync(dummyCsvPath, dummyContent);

  try {
    const analysis = await analyzeDocument(dummyCsvPath, 'test_sample.csv', 'text/csv');
    assert(analysis.qualityScore > 0 && analysis.qualityScore <= 100, `CSV Quality Score computed: ${analysis.qualityScore}/100`);
    assert(analysis.extractedMetadata.totalRows === 3, `Extracted 3 data rows, got ${analysis.extractedMetadata.totalRows}`);
    assert(analysis.recommendations.length > 0, "Generated Product B data quality recommendations");
  } catch (e) {
    assert(false, `CSV Analysis failed: ${e.message}`);
  } finally {
    if (fs.existsSync(dummyCsvPath)) fs.unlinkSync(dummyCsvPath);
  }

  console.log("\n====================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("====================================================\n");

  if (failed > 0) process.exit(1);
}

testDocEngine();
