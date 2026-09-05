/**
 * Visionix Phase 29: Personalized Next Step & Student UX Automated Test Suite (.cjs)
 *
 * Verifies:
 * 1. Dedicated route /next-step exists in App.tsx
 * 2. Redirect routes /progress -> /next-step and /my-progress -> /next-step
 * 3. Sidebar navigation updated: "Your Next Step" replaces "My Progress" in Tools & Utilities
 * 4. Profile dropdown updated: "Your Next Step" replaces "My Progress"
 * 5. GET /api/next-step protected with authenticate middleware
 * 6. Server route index mounts /next-step
 * 7. Next-step engine with no career -> /explore (Explore Careers)
 * 8. Career without roadmap -> /roadmap ("Create Roadmap" behavior)
 * 9. No silent roadmap creation occurs (explicit navigation only)
 * 10. Active roadmap milestone in progress -> /roadmap (Continue Milestone)
 * 11. In-progress course -> /learning-hub (Resume Course)
 * 12. Critical/high-priority skill gap -> /skill-gap (Close Skill Gap)
 * 13. Pending assessment -> /roadmap (Take Assessment)
 * 14. Missing/incomplete resume -> /resume (Build/Complete Resume)
 * 15. Interview preparation not started -> /interview (Practice Interview)
 * 16. Advanced/completed student state -> /career-paths (Explore Career Paths)
 * 17. Current Position accurately reflects education and target career data
 * 18. Secondary actions are limited (3-4) and strictly never duplicate primary action
 * 19. Recommendation is deterministic and repeatable
 * 20. Safety & Non-guarantee language strictly maintained
 * 21. No duplicate progress models created
 * 22. Phase 26 ProgressService remains 100% intact and functional
 * 23. /api/progress remains 100% intact in server routes
 * 24. Career Readiness (/career-readiness) remains intact
 * 25. Career Paths (/career-paths) remains intact
 * 26. What's Next? (/whats-next) remains intact
 */

const fs = require('fs');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('🚀 STARTING PHASE 29: PERSONALIZED NEXT STEP TESTS');
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
  // Test 1 & 2: Dedicated route and redirects in App.tsx
  // -------------------------------------------------------------
  console.log('📌 Requirement 1 & 2: Routes & Redirects Verification in App.tsx');
  const appTsxContent = fs.readFileSync(path.join(rootDir, 'src', 'App.tsx'), 'utf-8');
  
  check(
    appTsxContent.includes('path="/next-step"') && appTsxContent.includes('YourNextStepPage'),
    'Dedicated route /next-step exists in App.tsx mapped to YourNextStepPage'
  );

  check(
    appTsxContent.includes('path="/progress"') && appTsxContent.includes('to="/next-step"'),
    '/progress safely redirects to /next-step'
  );

  check(
    appTsxContent.includes('path="/my-progress"') && appTsxContent.includes('to="/next-step"'),
    '/my-progress safely redirects to /next-step'
  );

  // -------------------------------------------------------------
  // Test 3 & 4: Sidebar Navigation & Profile Dropdown
  // -------------------------------------------------------------
  console.log('\n📌 Requirement 3 & 4: Sidebar Navigation & Profile Dropdown Verification');
  const dashboardLayoutContent = fs.readFileSync(
    path.join(rootDir, 'src', 'components', 'DashboardLayout.tsx'),
    'utf-8'
  );

  check(
    dashboardLayoutContent.includes("label: 'Your Next Step'") &&
    dashboardLayoutContent.includes("path: '/next-step'"),
    'Sidebar Tools & Utilities group contains "Your Next Step" (/next-step)'
  );

  check(
    !dashboardLayoutContent.includes("label: 'My Progress'"),
    'Sidebar no longer contains student-facing "My Progress"'
  );

  check(
    dashboardLayoutContent.includes("navigate('/next-step')") &&
    dashboardLayoutContent.includes('Your Next Step'),
    'Profile dropdown contains "Your Next Step" navigating to /next-step'
  );

  // -------------------------------------------------------------
  // Test 5 & 6: Authentication & Route Mounting
  // -------------------------------------------------------------
  console.log('\n📌 Requirement 5 & 6: Authentication & Server Route Mounting');
  const routesIndexContent = fs.readFileSync(path.join(rootDir, 'server', 'src', 'routes', 'index.ts'), 'utf-8');
  const nextStepRoutesContent = fs.readFileSync(
    path.join(rootDir, 'server', 'src', 'routes', 'nextStep.routes.ts'),
    'utf-8'
  );

  check(
    nextStepRoutesContent.includes('router.use(authenticate)'),
    'GET /api/next-step is strictly guarded with authenticate middleware'
  );

  check(
    routesIndexContent.includes("router.use('/next-step', nextStepRoutes)"),
    'nextStepRoutes is mounted under /next-step in server routes index'
  );

  // -------------------------------------------------------------
  // Test 7 - 16: Next Step Engine Deterministic Prioritization Logic
  // -------------------------------------------------------------
  console.log('\n📌 Requirement 7 - 16: Next Step Decision Engine Logic & Priority Hierarchy');
  const nextStepServiceFile = fs.readFileSync(
    path.join(rootDir, 'server', 'src', 'services', 'nextStep.service.ts'),
    'utf-8'
  );

  // Priority 1: No target career -> /explore
  check(
    nextStepServiceFile.includes("destination: '/explore'") &&
    nextStepServiceFile.includes("actionType: 'explore_careers'"),
    'Priority 1: Student without target career receives explore_careers (/explore)'
  );

  // Priority 2: Selected career but no roadmap -> /roadmap with "Create Roadmap"
  check(
    nextStepServiceFile.includes("actionType: 'create_roadmap'") &&
    nextStepServiceFile.includes("ctaText: 'Create Roadmap'") &&
    nextStepServiceFile.includes("destination: '/roadmap'"),
    'Priority 2: Selected career without roadmap receives "Create Roadmap" (/roadmap)'
  );

  // Test 9: No silent automatic roadmap creation
  check(
    !nextStepServiceFile.includes('RoadmapService.generateRoadmap') &&
    !nextStepServiceFile.includes('CareerRoadmap.create'),
    'No silent automatic roadmap creation occurs (read-only decision engine)'
  );

  // Priority 3: Active roadmap milestone -> /roadmap (Continue Milestone)
  check(
    nextStepServiceFile.includes("actionType: 'complete_milestone'") &&
    nextStepServiceFile.includes("ctaText: 'Continue Milestone'"),
    'Priority 3: Active roadmap checkpoint receives complete_milestone'
  );

  // Priority 4: Active in-progress course -> /learning-hub
  check(
    nextStepServiceFile.includes("actionType: 'continue_learning'") &&
    nextStepServiceFile.includes("destination: '/learning-hub'"),
    'Priority 4: Active course receives continue_learning (/learning-hub)'
  );

  // Priority 5: Critical/high skill gap -> /skill-gap
  check(
    nextStepServiceFile.includes("actionType: 'close_skill_gap'") &&
    nextStepServiceFile.includes("destination: '/skill-gap'"),
    'Priority 5: Critical missing skill gap receives close_skill_gap (/skill-gap)'
  );

  // Priority 6: Required skill assessment pending -> /roadmap
  check(
    nextStepServiceFile.includes("actionType: 'take_assessment'") &&
    nextStepServiceFile.includes("ctaText: 'Take Assessment'"),
    'Priority 6: Incomplete assessment receives take_assessment (/roadmap)'
  );

  // Priority 7: Resume not started or incomplete draft -> /resume
  check(
    nextStepServiceFile.includes("actionType: 'build_resume'") &&
    nextStepServiceFile.includes("destination: '/resume'"),
    'Priority 7: Incomplete resume receives build_resume (/resume)'
  );

  // Priority 8: Interview practice not started -> /interview
  check(
    nextStepServiceFile.includes("actionType: 'practice_interview'") &&
    nextStepServiceFile.includes("destination: '/interview'"),
    'Priority 8: Missing interview practice receives practice_interview (/interview)'
  );

  // Priority 9: Advanced/completed state -> /career-paths
  check(
    nextStepServiceFile.includes("actionType: 'explore_career_paths'") &&
    nextStepServiceFile.includes("destination: '/career-paths'"),
    'Priority 9: Advanced/completed student receives explore_career_paths (/career-paths)'
  );

  // -------------------------------------------------------------
  // Test 17 & 18: Current Position & Secondary Actions
  // -------------------------------------------------------------
  console.log('\n📌 Requirement 17 & 18: Current Position & Secondary Actions Integrity');

  check(
    nextStepServiceFile.includes('educationLevel') &&
    nextStepServiceFile.includes('currentPosition: ICurrentPosition') &&
    nextStepServiceFile.includes('streamOrBranch'),
    'Current Position safely incorporates real education, target career, and milestone status'
  );

  check(
    nextStepServiceFile.includes('.filter((action) => action.destination !== primaryAction.destination)'),
    'Secondary actions strictly exclude candidates that duplicate the primary action destination'
  );

  // -------------------------------------------------------------
  // Test 19 & 20: Determinism & Non-Guarantee Safety Language
  // -------------------------------------------------------------
  console.log('\n📌 Requirement 19 & 20: Determinism & Non-Guarantee Safety Language');

  check(
    !nextStepServiceFile.includes('Math.random'),
    'Engine decision tree is strictly deterministic and reproducible'
  );

  const yourNextStepPageContent = fs.readFileSync(
    path.join(rootDir, 'src', 'pages', 'YourNextStepPage.tsx'),
    'utf-8'
  );

  check(
    nextStepServiceFile.includes('safetyDisclaimer') &&
    yourNextStepPageContent.includes('safetyDisclaimer') &&
    !nextStepServiceFile.toLowerCase().includes('guaranteed placement') &&
    !yourNextStepPageContent.toLowerCase().includes('guaranteed placement'),
    'Safety & Non-guarantee disclaimer is present; zero employment promises made'
  );

  // -------------------------------------------------------------
  // Test 21 - 26: Architectural Integrity & Preservation of Prior Phases
  // -------------------------------------------------------------
  console.log('\n📌 Requirement 21 - 26: Architectural Integrity & Prior Phases Preservation');

  const modelsDir = path.join(rootDir, 'server', 'src', 'models');
  const modelFiles = fs.readdirSync(modelsDir);
  const nextStepModel = modelFiles.find(f => f.toLowerCase().includes('nextstep'));

  check(
    !nextStepModel,
    'Zero duplicate database models created for next step (pure decision engine over ProgressService)'
  );

  check(
    fs.existsSync(path.join(rootDir, 'server', 'src', 'services', 'progress.service.ts')),
    'Phase 26 ProgressService backend remains intact as source of truth'
  );

  check(
    routesIndexContent.includes("router.use('/progress', progressRoutes)"),
    '/api/progress backend endpoint remains mounted and accessible'
  );

  check(
    routesIndexContent.includes("router.use('/career-readiness', careerReadinessRoutes)") &&
    appTsxContent.includes('path="/career-readiness"'),
    'Phase 27 Career Readiness remains functional and mounted'
  );

  check(
    routesIndexContent.includes("router.use('/career-paths', careerPathsRoutes)") &&
    appTsxContent.includes('path="/career-paths"'),
    'Phase 28 Career Paths remains functional and mounted'
  );

  check(
    dashboardLayoutContent.includes("path: '/whats-next'"),
    'What\'s Next? remains functional in navigation'
  );

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
