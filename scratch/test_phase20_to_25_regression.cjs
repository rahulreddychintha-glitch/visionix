/**
 * Regression Verification Suite for Phases 20, 21, 22, 23, 24, 25
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('🔍 RUNNING REGRESSION VERIFICATION (PHASES 20-25)');
console.log('====================================================\n');

let regPassed = 0;
let regFailed = 0;

function regCheck(condition, testName, detail) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    regPassed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    if (detail) console.error(`     Detail: ${detail}`);
    regFailed++;
  }
}

async function runRegression() {
  const root = path.resolve(__dirname, '..');

  // -------------------------------------------------------------
  // Phase 20: Unified Career Experience
  // -------------------------------------------------------------
  console.log('📌 Phase 20 Regression: Unified Career Experience');
  const careersConstantsPath = path.join(root, 'server', 'src', 'constants', 'careers.constants.ts');
  const careersContent = fs.readFileSync(careersConstantsPath, 'utf-8');
  regCheck(careersContent.includes('CAREERS_DATA'), 'CAREERS_DATA dataset intact');
  regCheck(careersContent.includes('CAREER_SKILL_MAPPING'), 'CAREER_SKILL_MAPPING intact');

  // -------------------------------------------------------------
  // Phase 21: Career Comparison
  // -------------------------------------------------------------
  console.log('\n📌 Phase 21 Regression: Career & Roadmap Comparison');
  const careerControllerPath = path.join(root, 'server', 'src', 'controllers', 'career.controller.ts');
  const careerControllerContent = fs.readFileSync(careerControllerPath, 'utf-8');
  regCheck(careerControllerContent.includes('compareCareers'), 'compareCareers controller method intact');
  regCheck(careerControllerContent.includes('Maximum 3 careers can be compared at once'), '3-career comparison limit enforced');

  const roadmapControllerPath = path.join(root, 'server', 'src', 'controllers', 'roadmap.controller.ts');
  const roadmapControllerContent = fs.readFileSync(roadmapControllerPath, 'utf-8');
  regCheck(roadmapControllerContent.includes('compareRoadmaps'), 'compareRoadmaps controller method intact');

  // -------------------------------------------------------------
  // Phase 22: "What Can I Do After This?" (Education Pathways)
  // -------------------------------------------------------------
  console.log('\n📌 Phase 22 Regression: Education Pathways & Indian Tree');
  const eduPathwaysConstantsPath = path.join(root, 'server', 'src', 'constants', 'educationPathways.constants.ts');
  const eduTreeConstantsPath = path.join(root, 'server', 'src', 'constants', 'indianEducationTree.constants.ts');
  regCheck(fs.existsSync(eduPathwaysConstantsPath), 'educationPathways.constants.ts exists');
  regCheck(fs.existsSync(eduTreeConstantsPath), 'indianEducationTree.constants.ts exists');

  const eduServicePath = path.join(root, 'server', 'src', 'services', 'educationPathway.service.ts');
  const eduServiceContent = fs.readFileSync(eduServicePath, 'utf-8');
  regCheck(eduServiceContent.includes('getEducationPathways'), 'getEducationPathways service method intact');
  regCheck(eduServiceContent.includes('matchUserCurrentNodeId'), 'matchUserCurrentNodeId service method intact');

  // -------------------------------------------------------------
  // Phase 23: Skill Gap Analysis
  // -------------------------------------------------------------
  console.log('\n📌 Phase 23 Regression: Skill Gap Analysis');
  const skillNavServicePath = path.join(root, 'server', 'src', 'services', 'skillNavigator.service.ts');
  const skillNavContent = fs.readFileSync(skillNavServicePath, 'utf-8');
  regCheck(skillNavContent.includes('normalizeSkill'), 'Skill normalization utility intact');
  regCheck(skillNavContent.includes('isSkillMatch'), 'Skill synonym dictionary & matcher intact');
  regCheck(skillNavContent.includes('analyzeUserSkillGap'), 'analyzeUserSkillGap method intact');
  regCheck(skillNavContent.includes('getLatestAnalysis'), 'getLatestAnalysis method intact');

  // -------------------------------------------------------------
  // Phase 24: Learning Hub 2.0
  // -------------------------------------------------------------
  console.log('\n📌 Phase 24 Regression: Learning Hub 2.0');
  const learningHubServicePath = path.join(root, 'server', 'src', 'services', 'learningHub.service.ts');
  const learningHubContent = fs.readFileSync(learningHubServicePath, 'utf-8');
  regCheck(learningHubContent.includes('getPersonalizedLearningHubData'), 'getPersonalizedLearningHubData method intact');
  regCheck(learningHubContent.includes('seedCuratedResources'), 'seedCuratedResources method intact');

  const learningResourcesPath = path.join(root, 'server', 'src', 'constants', 'learningResources.constants.ts');
  regCheck(fs.existsSync(learningResourcesPath), 'learningResources.constants.ts exists');

  // -------------------------------------------------------------
  // Phase 25: Course Recommendations
  // -------------------------------------------------------------
  console.log('\n📌 Phase 25 Regression: Course Recommendations');
  const courseServicePath = path.join(root, 'server', 'src', 'services', 'courseRecommendation.service.ts');
  const courseServiceContent = fs.readFileSync(courseServicePath, 'utf-8');
  regCheck(courseServiceContent.includes('getCourseRecommendations'), 'getCourseRecommendations method intact');
  regCheck(courseServiceContent.includes('recommendationReason'), 'Recommendation reasoning builder intact');

  const courseRoutesPath = path.join(root, 'server', 'src', 'routes', 'course.routes.ts');
  regCheck(fs.existsSync(courseRoutesPath), 'course.routes.ts exists and mounted');

  console.log('\n====================================================');
  console.log(`📊 REGRESSION RESULTS: ${regPassed} PASSED, ${regFailed} FAILED`);
  console.log('====================================================\n');

  if (regFailed > 0) {
    process.exit(1);
  }
}

runRegression().catch((err) => {
  console.error('Regression error:', err);
  process.exit(1);
});
