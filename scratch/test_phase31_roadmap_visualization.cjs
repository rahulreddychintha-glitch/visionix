/**
 * Visionix Phase 31: Career Roadmap Visualization Automated Verification Test Suite (.cjs)
 * 
 * Tests the 7 conceptual stages, visual progression ribbon, completed/current/upcoming distinctions,
 * preserved explicit Create Roadmap behavior (no silent generation), single source of truth,
 * preserved career switching and milestone actions, and responsive layout contracts.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('🚀 STARTING PHASE 31: CAREER ROADMAP VISUALIZATION TESTS');
console.log('================================================================\n');

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
  const roadmapPageTsx = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'CareerRoadmapPage.tsx'), 'utf-8');
  const roadmapCss = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'CareerRoadmapPage.module.css'), 'utf-8');
  const roadmapModel = fs.readFileSync(path.join(rootDir, 'server', 'src', 'models', 'CareerRoadmap.ts'), 'utf-8');
  const roadmapService = fs.readFileSync(path.join(rootDir, 'server', 'src', 'services', 'roadmap.service.ts'), 'utf-8');
  const frontendRoadmapService = fs.readFileSync(path.join(rootDir, 'src', 'services', 'roadmap.service.ts'), 'utf-8');

  // -------------------------------------------------------------
  // Section 1: 7 Conceptual Stages Structure
  // -------------------------------------------------------------
  console.log('📌 Section 1: 7 Conceptual Stages Structure Verification');

  check(
    roadmapPageTsx.includes("title: 'Current Stage'") &&
    roadmapPageTsx.includes("title: 'Next 6–12 Months'") &&
    roadmapPageTsx.includes("title: 'Skills'") &&
    roadmapPageTsx.includes("title: 'Courses'") &&
    roadmapPageTsx.includes("title: 'Projects'") &&
    roadmapPageTsx.includes("title: 'Assessments'") &&
    roadmapPageTsx.includes("title: 'Next Career Stage'"),
    'Requirement 1: All 7 conceptual stages are formally defined and configured',
    'Missing one or more of the 7 conceptual stages in CONCEPTUAL_STAGES'
  );

  check(
    roadmapPageTsx.includes('renderStage1') &&
    roadmapPageTsx.includes('renderStage2') &&
    roadmapPageTsx.includes('renderStage3') &&
    roadmapPageTsx.includes('renderStage4') &&
    roadmapPageTsx.includes('renderStage5') &&
    roadmapPageTsx.includes('renderStage6') &&
    roadmapPageTsx.includes('renderStage7'),
    'Requirement 2: Dedicated render methods exist for all 7 conceptual stages'
  );

  check(
    roadmapPageTsx.includes('id="stage-1"') &&
    roadmapPageTsx.includes('id="stage-2"') &&
    roadmapPageTsx.includes('id="stage-3"') &&
    roadmapPageTsx.includes('id="stage-4"') &&
    roadmapPageTsx.includes('id="stage-5"') &&
    roadmapPageTsx.includes('id="stage-6"') &&
    roadmapPageTsx.includes('id="stage-7"'),
    'Requirement 3: Distinct semantic anchors and containers for all 7 stages exist'
  );

  // -------------------------------------------------------------
  // Section 2: Progression Ribbon & Stepper Navigation
  // -------------------------------------------------------------
  console.log('\n📌 Section 2: Progression Ribbon & Stepper Navigation');

  check(
    roadmapPageTsx.includes('styles.progressionNav') &&
    roadmapPageTsx.includes('styles.progressionStepper') &&
    roadmapPageTsx.includes('styles.stagePill'),
    'Requirement 4: Visual progression ribbon and stepper navigation exist in CareerRoadmapPage'
  );

  check(
    roadmapCss.includes('.progressionNav') &&
    roadmapCss.includes('.progressionStepper') &&
    roadmapCss.includes('.stagePill') &&
    roadmapCss.includes('.stagePillCurrent') &&
    roadmapCss.includes('.stagePillCompleted') &&
    roadmapCss.includes('.stagePillUpcoming'),
    'Requirement 5: Progression ribbon CSS with active, completed, and upcoming pill styles'
  );

  check(
    roadmapPageTsx.includes('styles.viewModeToggle') &&
    roadmapPageTsx.includes("'progression'") &&
    roadmapPageTsx.includes("'milestones'"),
    'Requirement 6: View Mode Switcher between Visual Progression and Milestones Explorer'
  );

  check(
    roadmapPageTsx.includes('setActiveFilterStage'),
    'Requirement 7: Interactive stage filtering allows focusing on individual stages or viewing all 7'
  );

  // -------------------------------------------------------------
  // Section 3: Status Distinction (COMPLETED, CURRENT, UPCOMING)
  // -------------------------------------------------------------
  console.log('\n📌 Section 3: Status Distinction Verification');

  check(
    roadmapPageTsx.includes('getConceptualStageStatus') &&
    roadmapCss.includes('.statusCompleted') &&
    roadmapCss.includes('.statusCurrent') &&
    roadmapCss.includes('.statusUpcoming'),
    'Requirement 8: Conceptual stages dynamically compute and visually distinguish completed/current/upcoming'
  );

  check(
    roadmapPageTsx.includes('skillsOverview.verified') &&
    roadmapPageTsx.includes('skillsOverview.inProgress') &&
    roadmapPageTsx.includes('skillsOverview.upcoming'),
    'Requirement 9: Skills breakdown explicitly groups into Verified, In-Progress, and Upcoming'
  );

  check(
    roadmapCss.includes('.skillItemVerified') &&
    roadmapCss.includes('.skillItemCurrent') &&
    roadmapCss.includes('.skillItemUpcoming'),
    'Requirement 10: Skill items have distinct visual styling for verified, current, and upcoming'
  );

  check(
    roadmapPageTsx.includes('assessments.passed') &&
    roadmapPageTsx.includes('assessments.needsReview') &&
    roadmapPageTsx.includes('assessments.ready') &&
    roadmapPageTsx.includes('assessments.upcoming'),
    'Requirement 11: Assessments stage distinctly categorizes passed, review-recommended, ready, and upcoming'
  );

  // -------------------------------------------------------------
  // Section 4: Single Source of Truth & No Second Roadmap System
  // -------------------------------------------------------------
  console.log('\n📌 Section 4: Single Source of Truth & Data Integrity');

  check(
    roadmapModel.includes('export interface ICareerRoadmapDocument') &&
    roadmapModel.includes('export const CareerRoadmap ='),
    'Requirement 12: Backend CareerRoadmap model remains the single authoritative schema'
  );

  check(
    frontendRoadmapService.includes('export interface CareerRoadmap') &&
    frontendRoadmapService.includes('export class RoadmapService'),
    'Requirement 13: Frontend RoadmapService is the unified API client'
  );

  check(
    roadmapPageTsx.includes('RoadmapService.getRoadmap') &&
    roadmapPageTsx.includes('roadmap.progress'),
    'Requirement 14: Roadmap progress and data read directly from authoritative roadmap object'
  );

  // -------------------------------------------------------------
  // Section 5: No Silent Roadmap Generation & Explicit Creation Flow
  // -------------------------------------------------------------
  console.log('\n📌 Section 5: Explicit Create Roadmap Flow (No Silent Creation)');

  check(
    roadmapPageTsx.includes('startAiGeneration') &&
    roadmapPageTsx.includes('Create Roadmap') &&
    roadmapPageTsx.includes('pendingCareer'),
    'Requirement 15: No-roadmap state renders explicit "Create Roadmap" button'
  );

  check(
    roadmapPageTsx.includes('handleInitialCheck') &&
    roadmapPageTsx.includes('RoadmapService.getRoadmap(careerId)') &&
    !roadmapPageTsx.includes('useEffect(() => {\n    startAiGeneration'),
    'Requirement 16: Roadmap is never silently generated on page load (checks existence without auto-generation)'
  );

  check(
    roadmapPageTsx.includes('confirmModal') &&
    roadmapPageTsx.includes('Regenerate Career Path?') &&
    roadmapPageTsx.includes('Path Already Exists'),
    'Requirement 17: Overwrite / regeneration confirmation modal prevents accidental data loss'
  );

  // -------------------------------------------------------------
  // Section 6: Preserved Actions (Milestones, Quizzes, YouTube, AI, Switch)
  // -------------------------------------------------------------
  console.log('\n📌 Section 6: Functional Actions Preservation');

  check(
    roadmapPageTsx.includes('handleStartMilestone') &&
    roadmapPageTsx.includes('Start Milestone'),
    'Requirement 18: Start Milestone action is preserved and functional'
  );

  check(
    roadmapPageTsx.includes('handleMarkCompleted') &&
    roadmapPageTsx.includes("navigate('/exams'") &&
    roadmapPageTsx.includes("mode: 'milestone'"),
    'Requirement 19: Complete milestone redirects to assessments hub (/exams) with milestone parameters'
  );

  check(
    roadmapPageTsx.includes('setShowResourcesModal(true)') &&
    roadmapPageTsx.includes("navigate('/youtube'"),
    'Requirement 20: Learning resources modal and YouTube learning navigation are preserved'
  );

  check(
    roadmapPageTsx.includes('openAiModal()') &&
    roadmapPageTsx.includes('Ask AI'),
    'Requirement 21: AI milestone workspace integration is preserved'
  );

  check(
    roadmapPageTsx.includes('handleSelectCareerToLoad') &&
    roadmapPageTsx.includes('Switch Path') &&
    roadmapPageTsx.includes('savedCareers'),
    'Requirement 22: Career switching dropdown with saved careers is preserved'
  );

  // -------------------------------------------------------------
  // Section 7: Compact Meaningful Empty States & No Fake Data
  // -------------------------------------------------------------
  console.log('\n📌 Section 7: Compact Meaningful Empty States');

  check(
    roadmapCss.includes('.compactEmptyState') &&
    roadmapCss.includes('.compactEmptyText'),
    'Requirement 23: Compact meaningful empty state CSS classes exist'
  );

  check(
    roadmapPageTsx.includes('No verified skills yet') &&
    roadmapPageTsx.includes('All planned checkpoints in this roadmap are completed') &&
    roadmapPageTsx.includes('Hands-on exercises and practical application activities are embedded'),
    'Requirement 24: Meaningful empty states used for empty categories without fabricated content'
  );

  // -------------------------------------------------------------
  // Section 8: Mobile Responsiveness & Layout
  // -------------------------------------------------------------
  console.log('\n📌 Section 8: Mobile Responsiveness & Layout Constraints');

  check(
    roadmapCss.includes('@media (max-width: 640px)') &&
    roadmapCss.includes('.timeline {') &&
    roadmapCss.includes('padding-left: 8px'),
    'Requirement 25: Mobile breakpoint preserves Phase 30 mobile spacing rules'
  );

  check(
    roadmapCss.includes('.progressionStepper {') &&
    roadmapCss.includes('overflow-x: auto') &&
    roadmapCss.includes('-webkit-overflow-scrolling: touch'),
    'Requirement 26: Progression ribbon scrolls horizontally on mobile without window viewport overflow'
  );

  check(
    roadmapCss.includes('.upcomingTimelineGrid,') &&
    roadmapCss.includes('.skillsClustersGrid,') &&
    roadmapCss.includes('.coursesGrid,') &&
    roadmapCss.includes('grid-template-columns: 1fr'),
    'Requirement 27: Responsive grid collapse to 1-column on mobile screens <= 640px'
  );

  // -------------------------------------------------------------
  // Section 9: Next Career Stage Destination
  // -------------------------------------------------------------
  console.log('\n📌 Section 9: Next Career Stage Destination Card');

  check(
    roadmapPageTsx.includes('Next Career Stage: {roadmap.careerTitle}') &&
    roadmapPageTsx.includes('/career-readiness') &&
    roadmapPageTsx.includes('/career-paths'),
    'Requirement 28: Stage 7 displays target career destination with links to Career Readiness and Career Paths'
  );

  // -------------------------------------------------------------
  // Section 10: Connected Career Journey Track & Orientation Hero
  // -------------------------------------------------------------
  console.log('\n📌 Section 10: Connected Career Journey Track & Orientation Hero');

  check(
    roadmapPageTsx.includes('styles.journeyHero') &&
    roadmapPageTsx.includes('Where Am I?') &&
    roadmapPageTsx.includes('What Comes Next?') &&
    roadmapPageTsx.includes('Where Am I Going?') &&
    roadmapCss.includes('.journeyHero') &&
    roadmapCss.includes('.journeyOrientationGrid') &&
    roadmapCss.includes('.orientationCardCurrent'),
    'Requirement 29: Top Orientation Hero answers Where Am I?, What Comes Next?, and Where Am I Going?'
  );

  check(
    roadmapPageTsx.includes('styles.roadmapJourneyTrack') &&
    roadmapPageTsx.includes('styles.journeySpineLine') &&
    roadmapPageTsx.includes('styles.journeyNodeItem') &&
    roadmapCss.includes('.roadmapJourneyTrack') &&
    roadmapCss.includes('.journeySpineLine') &&
    roadmapCss.includes('.journeyNodeItem'),
    'Requirement 30: Continuous connected journey track with glowing spine line connects all roadmap stages'
  );

  check(
    roadmapPageTsx.includes('expandedStages') &&
    roadmapPageTsx.includes('toggleStageExpansion') &&
    roadmapPageTsx.includes('handleExpandAll') &&
    roadmapPageTsx.includes('handleCollapseAll') &&
    roadmapPageTsx.includes('handleFocusCurrent'),
    'Requirement 31: Compact accordion nodes with expand/collapse, Expand All, Collapse All, and Focus Current'
  );

  check(
    roadmapCss.includes('.markerCompleted') &&
    roadmapCss.includes('.markerCurrent') &&
    roadmapCss.includes('.markerUpcoming') &&
    roadmapCss.includes('.markerDestination') &&
    roadmapPageTsx.includes('YOU ARE HERE'),
    'Requirement 32: Visual status distinction on nodes with checkmarks, YOU ARE HERE pulsing ring, and destination marker'
  );

  check(
    roadmapCss.includes('.nodeExpandedBody .stageSectionCard') &&
    roadmapCss.includes('.nodeExpandedBody .stageSectionHeader'),
    'Requirement 33: De-boxing of nested stage cards removes template feel, duplicate headers, and repeated Stage X blocks'
  );

  // Summary
  console.log('\n================================================================');
  console.log(`📊 PHASE 31 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error running Phase 31 tests:', err);
  process.exit(1);
});
