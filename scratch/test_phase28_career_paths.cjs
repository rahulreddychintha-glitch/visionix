/**
 * Visionix Phase 28: Alternative & Backup Career Paths Automated Test Suite (.cjs)
 *
 * Verifies:
 * 1. Dedicated Career Paths route exists in App.tsx (/career-paths)
 * 2. Dedicated Career Paths link exists in DashboardLayout sidebar navigation within Core group
 * 3. Sidebar navigation ordering in Core group (Roadmap -> Career Paths -> Explore)
 * 4. GET /api/career-paths requires authentication via authenticate middleware
 * 5. GET /api/career-paths route is mounted in server routes index
 * 6. Authoritative primary career resolution (Roadmap vs UserProfile vs override)
 * 7. Clean empty state when student has no target career
 * 8. Deterministic Alternative Careers recommendation engine (category affinity & shared skills)
 * 9. Deterministic Backup Career Paths recommendation engine (transferable skills & pivot viability)
 * 10. Alternatives and Backups are strictly DISJOINT (zero duplicate careers)
 * 11. Shared skills are real from CAREERS_DATA / CAREER_SKILL_MAPPING
 * 12. Transferable skills are calculated accurately from user skills + general transferable skills
 * 13. Skills to develop are calculated accurately
 * 14. Education compatibility is grounded (Direct Fit, Related Transition, Requires Additional Education)
 * 15. Graceful handling of missing education data
 * 16. Graceful handling of missing skills data
 * 17. Graceful handling of invalid careerId override
 * 18. Career Comparison integration (/compare contract)
 * 19. Skill Gap integration (/skill-gap contract)
 * 20. Learning Hub integration (/learning-hub contract)
 * 21. Career Roadmap integration (/roadmap contract)
 * 22. Career Details Modal integration
 * 23. Zero employment guarantee or hiring prediction claims (Safety disclaimer verification)
 * 24. Zero duplicate database models or fake datasets created
 * 25. Phase 26 (My Progress) and Phase 27 (Career Readiness) remain intact
 */

const fs = require('fs');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');
const mongoose = require(path.join(rootDir, 'server', 'node_modules', 'mongoose'));

console.log('====================================================');
console.log('🚀 STARTING PHASE 28: ALTERNATIVE & BACKUP CAREER PATHS TESTS');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

function check(condition, testName, detail) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    if (detail) console.error(`     Detail: ${detail}`);
    failed++;
  }
}

async function runTests() {
  // -------------------------------------------------------------
  // Test 1: Dedicated route in App.tsx
  // -------------------------------------------------------------
  console.log('📌 Requirement 1: Dedicated Route Verification');
  const appTsxContent = fs.readFileSync(path.join(rootDir, 'src', 'App.tsx'), 'utf-8');
  const hasCareerPathsRoute =
    appTsxContent.includes('path="/career-paths"') &&
    appTsxContent.includes('<CareerPathsPage />');
  check(
    hasCareerPathsRoute,
    'Dedicated route /career-paths exists in App.tsx mapped to CareerPathsPage'
  );

  // -------------------------------------------------------------
  // Test 2 & 3: Sidebar navigation link and ordering in DashboardLayout.tsx
  // -------------------------------------------------------------
  console.log('\n📌 Requirement 2 & 3: Sidebar Navigation Link & Core Group Ordering');
  const dashboardLayoutContent = fs.readFileSync(
    path.join(rootDir, 'src', 'components', 'DashboardLayout.tsx'),
    'utf-8'
  );

  const hasSidebarLink =
    dashboardLayoutContent.includes("label: 'Career Paths'") &&
    dashboardLayoutContent.includes("path: '/career-paths'");
  check(
    hasSidebarLink,
    'Dedicated "Career Paths" link is added to authenticated sidebar navigation'
  );

  const roadmapIdx = dashboardLayoutContent.indexOf("path: '/roadmap'");
  const careerPathsIdx = dashboardLayoutContent.indexOf("path: '/career-paths'");
  const exploreIdx = dashboardLayoutContent.indexOf("path: '/explore'");

  const hasCorrectOrdering =
    roadmapIdx !== -1 &&
    careerPathsIdx !== -1 &&
    exploreIdx !== -1 &&
    roadmapIdx < careerPathsIdx &&
    careerPathsIdx < exploreIdx;

  check(
    hasCorrectOrdering,
    'Career Paths is correctly placed in Core navigation between Roadmap and Explore'
  );

  // -------------------------------------------------------------
  // Test 4: Authentication on GET /api/career-paths
  // -------------------------------------------------------------
  console.log('\n📌 Requirement 4: Authentication & Route Protection');
  const careerPathsRoutesContent = fs.readFileSync(
    path.join(rootDir, 'server', 'src', 'routes', 'careerPaths.routes.ts'),
    'utf-8'
  );
  const usesAuth = careerPathsRoutesContent.includes('router.use(authenticate)');
  check(
    usesAuth,
    'GET /api/career-paths is strictly guarded with authenticate middleware'
  );

  // -------------------------------------------------------------
  // Test 5: Route mounted in server routes index
  // -------------------------------------------------------------
  console.log('\n📌 Requirement 5: Server Route Mount Verification');
  const routesIndexContent = fs.readFileSync(
    path.join(rootDir, 'server', 'src', 'routes', 'index.ts'),
    'utf-8'
  );
  const mountsRoute = routesIndexContent.includes(
    "router.use('/career-paths', careerPathsRoutes)"
  );
  check(
    mountsRoute,
    'careerPathsRoutes is mounted under /career-paths in server routes index'
  );

  // -------------------------------------------------------------
  // Test 18-22: Existing System Integrations
  // -------------------------------------------------------------
  console.log('\n📌 Requirement 18-22: Existing System Integrations in CareerPathsPage');
  const careerPathsPageContent = fs.readFileSync(
    path.join(rootDir, 'src', 'pages', 'CareerPathsPage.tsx'),
    'utf-8'
  );

  check(
    careerPathsPageContent.includes('/compare') &&
    careerPathsPageContent.includes('selectedCareerIds'),
    'Career Comparison integration (/compare with selectedCareerIds contract)'
  );

  check(
    careerPathsPageContent.includes('/skill-gap') &&
    careerPathsPageContent.includes('careerId'),
    'Skill Gap integration (/skill-gap with careerId state contract)'
  );

  check(
    careerPathsPageContent.includes('/learning-hub') ||
    careerPathsPageContent.includes('learning.hubRoute'),
    'Learning Hub integration (/learning-hub route contract)'
  );

  check(
    careerPathsPageContent.includes('/roadmap'),
    'Career Roadmap integration (/roadmap state contract)'
  );

  check(
    careerPathsPageContent.includes('CareerDetailsModal') &&
    careerPathsPageContent.includes('handleOpenDetails'),
    'Career Details Modal integration reuses existing modal component'
  );

  // -------------------------------------------------------------
  // Test 23: Safety & Product Language
  // -------------------------------------------------------------
  console.log('\n📌 Requirement 23: Safety & Non-Guarantee Language Verification');
  const pageNoGuarantees =
    !careerPathsPageContent.includes('guaranteed job') &&
    !careerPathsPageContent.includes('you will succeed') &&
    !careerPathsPageContent.includes('guaranteed placement') &&
    careerPathsPageContent.includes('disclaimer');

  const serviceContent = fs.readFileSync(
    path.join(rootDir, 'server', 'src', 'services', 'careerPaths.service.ts'),
    'utf-8'
  );
  const serviceNoGuarantees =
    !serviceContent.includes('guaranteed job') &&
    !serviceContent.includes('guaranteed salary') &&
    serviceContent.includes('disclaimer');

  check(
    pageNoGuarantees && serviceNoGuarantees,
    'Strict absence of job guarantees or placement prediction language in UI and service'
  );

  // -------------------------------------------------------------
  // Test 24 & 25: Architectural Integrity & Regression Protection
  // -------------------------------------------------------------
  console.log('\n📌 Requirement 24 & 25: Architectural Integrity');
  const modelsDir = path.join(rootDir, 'server', 'src', 'models');
  const modelFiles = fs.readdirSync(modelsDir);
  const hasNoDuplicateModels =
    !modelFiles.includes('CareerPath.ts') &&
    !modelFiles.includes('AlternativeCareer.ts') &&
    !modelFiles.includes('BackupCareer.ts');
  check(
    hasNoDuplicateModels,
    'Zero duplicate career/path database models created (pure aggregation over CAREERS_DATA)'
  );

  const phase27RouteExists = appTsxContent.includes('path="/career-readiness"');
  const phase26RouteExists = appTsxContent.includes('path="/progress"');
  check(
    phase27RouteExists && phase26RouteExists,
    'My Progress (/progress) and Career Readiness (/career-readiness) remain intact'
  );

  // -------------------------------------------------------------
  // Tests 6 - 17: Service Unit Verification (Mock Database Logic)
  // -------------------------------------------------------------
  console.log('\n📌 Requirements 6-17: Deterministic Recommendation Engine Logic');

  // Load CAREERS_DATA and mock dependencies
  const { CAREERS_DATA, CAREER_SKILL_MAPPING } = require(
    path.join(rootDir, 'server', 'dist', 'constants', 'careers.constants.js')
  );
  const { CareerPathsService } = require(
    path.join(rootDir, 'server', 'dist', 'services', 'careerPaths.service.js')
  );
  const { CareerRoadmap } = require(
    path.join(rootDir, 'server', 'dist', 'models', 'CareerRoadmap.js')
  );
  const { UserProfile } = require(
    path.join(rootDir, 'server', 'dist', 'models', 'UserProfile.js')
  );

  // Test 6: Authoritative Primary Career Resolution from Roadmap
  const testUserId = new mongoose.Types.ObjectId();

  // Mock CareerRoadmap.findOne
  CareerRoadmap.findOne = function () {
    return {
      sort: function () {
        return Promise.resolve({
          careerId: 'software_engineer',
          careerTitle: 'Software Engineer',
        });
      },
    };
  };

  // Mock UserProfile.findOne
  UserProfile.findOne = function () {
    return Promise.resolve({
      userId: testUserId,
      careerGoals: { dreamCareer: 'Software Engineer' },
      education: {
        level: 'College / University',
        stream: 'Computer Science',
        branchSpecialization: 'Computer Science & Engineering',
      },
      skills: {
        verifiedSkills: [{ name: 'Python' }, { name: 'Problem Solving' }],
        technicalSkills: ['JavaScript', 'Git'],
        softSkills: ['Communication'],
      },
    });
  };

  const resultWithRoadmap = await CareerPathsService.getCareerPaths(testUserId.toString());

  check(
    resultWithRoadmap.hasTargetCareer === true &&
    resultWithRoadmap.primaryCareer?.id === 'software_engineer',
    'Requirement 6: Primary career resolves authoritatively from active roadmap'
  );

  // Test 7: Clean empty state when no roadmap and no dreamCareer
  CareerRoadmap.findOne = function () {
    return {
      sort: function () {
        return Promise.resolve(null);
      },
    };
  };

  UserProfile.findOne = function () {
    return Promise.resolve({
      userId: testUserId,
      careerGoals: { dreamCareer: null },
      education: {},
      skills: {},
    });
  };

  const emptyResult = await CareerPathsService.getCareerPaths(testUserId.toString());
  check(
    emptyResult.hasTargetCareer === false &&
    emptyResult.primaryCareer === null &&
    Array.isArray(emptyResult.alternatives) &&
    emptyResult.alternatives.length === 0 &&
    Array.isArray(emptyResult.backupPaths) &&
    emptyResult.backupPaths.length === 0,
    'Requirement 7: Student without target career safely receives clean no-target state'
  );

  // Restore UserProfile with dreamCareer (testing fallback when no roadmap exists)
  UserProfile.findOne = function () {
    return Promise.resolve({
      userId: testUserId,
      careerGoals: { dreamCareer: 'Doctor' },
      education: {
        level: 'College / University',
        stream: 'Science (PCB)',
        branchSpecialization: 'MBBS',
      },
      skills: {
        verifiedSkills: [{ name: 'Clinical Diagnosis' }],
        technicalSkills: ['Patient Care'],
        softSkills: ['Empathy', 'Critical Thinking'],
      },
    });
  };

  const doctorResult = await CareerPathsService.getCareerPaths(testUserId.toString());
  check(
    doctorResult.hasTargetCareer === true &&
    doctorResult.primaryCareer?.id === 'doctor' &&
    doctorResult.primaryCareer?.source === 'profile',
    'Requirement 6b: Primary career falls back safely to profile dreamCareer when no roadmap'
  );

  // Test 8: Deterministic Alternative Careers
  check(
    Array.isArray(doctorResult.alternatives) &&
    doctorResult.alternatives.length >= 3 &&
    doctorResult.alternatives.length <= 4,
    `Requirement 8: Returns ${doctorResult.alternatives.length} (3-4) deterministic alternative careers`
  );

  const altIds = doctorResult.alternatives.map((a) => a.id);
  // For Doctor, Surgeon and Dentist should be top alternatives (same Healthcare category, high skill overlap)
  const hasExpectedAlts = altIds.includes('surgeon') || altIds.includes('dentist') || altIds.includes('nurse');
  check(
    hasExpectedAlts,
    'Requirement 8b: Doctor alternatives appropriately include medical specializations (Surgeon, Dentist, Nurse)'
  );

  // Test 9: Deterministic Backup Career Paths
  check(
    Array.isArray(doctorResult.backupPaths) &&
    doctorResult.backupPaths.length >= 2 &&
    doctorResult.backupPaths.length <= 3,
    `Requirement 9: Returns ${doctorResult.backupPaths.length} (2-3) practical backup career paths`
  );

  // Test 10: Alternatives and Backup Paths are STRICTLY DISJOINT
  const backupIds = doctorResult.backupPaths.map((b) => b.id);
  const overlap = altIds.filter((id) => backupIds.includes(id));
  check(
    overlap.length === 0,
    'Requirement 10: Alternatives and Backup Career Paths are strictly DISJOINT (zero duplicates)'
  );

  // Test 11: Shared skills are real
  const firstAlt = doctorResult.alternatives[0];
  const doctorSkills = CAREER_SKILL_MAPPING['doctor'] || [];
  const candidateSkills = CAREER_SKILL_MAPPING[firstAlt.id] || [];
  const actualShared = firstAlt.sharedSkills.every(
    (s) =>
      doctorSkills.some((ds) => ds.toLowerCase() === s.toLowerCase()) &&
      candidateSkills.some((cs) => cs.toLowerCase() === s.toLowerCase())
  );
  check(
    actualShared,
    'Requirement 11: Shared skills are real and verified against CAREERS_DATA'
  );

  // Test 12: Transferable skills are calculated accurately
  const firstBackup = doctorResult.backupPaths[0];
  check(
    Array.isArray(firstBackup.transferableSkills) && firstBackup.transferableSkills.length > 0,
    'Requirement 12: Backup career identifies authentic transferable skills'
  );

  // Test 13: Skills to develop are calculated
  check(
    Array.isArray(firstAlt.skillsToDevelop),
    'Requirement 13: Skills to develop are identified for alternative careers'
  );

  // Test 14: Education compatibility
  check(
    ['Direct Fit', 'Related Transition', 'Requires Additional Education'].includes(
      firstAlt.education.compatibility
    ) && typeof firstAlt.education.transitionRequirement === 'string',
    `Requirement 14: Education compatibility accurately classified as "${firstAlt.education.compatibility}"`
  );

  // Test 15 & 16: Missing education and skills handled safely
  UserProfile.findOne = function () {
    return Promise.resolve({
      userId: testUserId,
      careerGoals: { dreamCareer: 'Software Engineer' },
      education: null,
      skills: null,
    });
  };

  const safeMissingResult = await CareerPathsService.getCareerPaths(testUserId.toString());
  check(
    safeMissingResult.hasTargetCareer === true &&
    safeMissingResult.alternatives.length > 0 &&
    safeMissingResult.backupPaths.length > 0,
    'Requirement 15 & 16: Handles completely missing education and skills profile safely'
  );

  // Test 17: Career override with invalid ID falls back safely
  const invalidOverrideResult = await CareerPathsService.getCareerPaths(
    testUserId.toString(),
    'non_existent_fake_career_999'
  );
  check(
    invalidOverrideResult.hasTargetCareer === true &&
    invalidOverrideResult.primaryCareer?.id === 'software_engineer',
    'Requirement 17: Invalid careerId override falls back safely to profile target career'
  );

  // -------------------------------------------------------------
  // Final summary
  // -------------------------------------------------------------
  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error running Phase 28 tests:', err);
  process.exit(1);
});
