/**
 * Visionix Phase 30: Mobile Experience 2.0 Verification Suite
 * 
 * Verifies that responsive contracts, mobile breakpoints, modal padding,
 * grid collapses, touch targets, and route preservations are fully met.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

console.log('\n======================================================');
console.log('  VISIONIX PHASE 30: MOBILE EXPERIENCE 2.0 TEST SUITE');
console.log('======================================================\n');

// 1. Mobile Navigation & Shell Contracts
console.log('1. Mobile Navigation & Shell:');
const dashboardLayoutCode = fs.readFileSync(path.join(__dirname, '../src/components/DashboardLayout.tsx'), 'utf8');
const dashboardLayoutCss = fs.readFileSync(path.join(__dirname, '../src/components/DashboardLayout.module.css'), 'utf8');

test('DashboardLayout has mobile backdrop overlay with tap-to-dismiss', () => {
  assert(dashboardLayoutCode.includes('styles.mobileOverlay'), 'Missing mobileOverlay in DashboardLayout.tsx');
  assert(dashboardLayoutCode.includes('setIsSidebarOpen(false)'), 'Overlay must close sidebar on tap');
  assert(dashboardLayoutCss.includes('.mobileOverlay'), 'DashboardLayout.module.css must define .mobileOverlay');
  assert(dashboardLayoutCss.includes('@media (max-width: 1024px)'), 'mobileOverlay must be scoped to mobile/tablet');
});

test('DashboardLayout sidebar has maximum width constraint for narrow viewports', () => {
  assert(dashboardLayoutCss.includes('max-width: min(280px, 85vw)'), 'Sidebar must have max-width constraint for narrow viewports');
});

test('DashboardLayout has 480px breakpoint for compact mobile padding and navbar', () => {
  assert(dashboardLayoutCss.includes('@media (max-width: 480px)'), 'Missing 480px breakpoint in DashboardLayout.module.css');
});

test('DashboardLayout auto-closes sidebar when clicking nav items and AI button', () => {
  assert(dashboardLayoutCode.includes('if (isSidebarOpen) setIsSidebarOpen(false);'), 'Nav items must auto-close mobile drawer');
});

// 2. Core Pages Responsive Grid & Spacing
console.log('\n2. Core Dashboard & Explorer Responsive Contracts:');
const zone1HeroCode = fs.readFileSync(path.join(__dirname, '../src/components/dashboard/Zone1DirectionHero.tsx'), 'utf8');
const explorerCss = fs.readFileSync(path.join(__dirname, '../src/pages/CareerExplorerPage.module.css'), 'utf8');
const roadmapCss = fs.readFileSync(path.join(__dirname, '../src/pages/CareerRoadmapPage.module.css'), 'utf8');
const compareCss = fs.readFileSync(path.join(__dirname, '../src/pages/CareerComparePage.module.css'), 'utf8');
const nextStepCss = fs.readFileSync(path.join(__dirname, '../src/pages/YourNextStepPage.module.css'), 'utf8');
const readinessCss = fs.readFileSync(path.join(__dirname, '../src/pages/CareerReadinessPage.module.css'), 'utf8');

test('Zone1DirectionHero grid uses min(100%, 280px) to prevent overflow on 320px/360px', () => {
  assert(zone1HeroCode.includes('minmax(min(100%, 280px), 1fr)'), 'Zone1DirectionHero grid must adapt below 320px');
});

test('CareerExplorerPage has mobile breakpoint for 1-column grid collapse and searchBarRow', () => {
  assert(explorerCss.includes('@media (max-width: 640px)'), 'Missing @media (max-width: 640px) in CareerExplorerPage.module.css');
  assert(explorerCss.includes('grid-template-columns: 1fr'), 'Grid must collapse to 1fr on mobile');
  assert(explorerCss.includes('searchBarRow'), 'searchBarRow must adapt on mobile');
});

test('CareerExplorerPage modal padding is compact on mobile to prevent squishing', () => {
  assert(explorerCss.includes('.modalOverlay') && explorerCss.includes('padding: 10px'), 'modalOverlay padding must be compact on mobile');
  assert(explorerCss.includes('.modalContent') && explorerCss.includes('padding: 18px 14px'), 'modalContent padding must be compact on mobile');
});

test('CareerRoadmapPage has mobile breakpoint reducing timeline/milestone left padding', () => {
  assert(roadmapCss.includes('@media (max-width: 640px)'), 'Missing @media (max-width: 640px) in CareerRoadmapPage.module.css');
  assert(roadmapCss.includes('.timeline {') && roadmapCss.includes('padding-left: 8px'), 'Timeline left padding must be reduced on mobile');
  assert(roadmapCss.includes('.milestonesList {') && roadmapCss.includes('padding-left: 12px'), 'Milestones list left padding must be reduced on mobile');
});

test('CareerComparePage has 480px breakpoint collapsing metricsRow into 1 column', () => {
  assert(compareCss.includes('@media (max-width: 480px)'), 'Missing @media (max-width: 480px) in CareerComparePage.module.css');
  assert(compareCss.includes('.metricsRow {') && compareCss.includes('grid-template-columns: 1fr'), 'metricsRow must stack on <= 480px');
});

test('YourNextStepPage has responsive breakpoints for container, positionGrid, and full-width CTA', () => {
  assert(nextStepCss.includes('@media (max-width: 640px)'), 'Missing @media (max-width: 640px) in YourNextStepPage.module.css');
  assert(nextStepCss.includes('@media (max-width: 480px)'), 'Missing @media (max-width: 480px) in YourNextStepPage.module.css');
  assert(nextStepCss.includes('.positionGrid {') && nextStepCss.includes('grid-template-columns: 1fr'), 'positionGrid must collapse to 1 column on <= 480px');
  assert(nextStepCss.includes('.primaryCta {') && nextStepCss.includes('width: 100%'), 'primaryCta must be full-width on mobile');
});

test('CareerReadinessPage has 520px breakpoint stacking overallCard vertically with centered gauge', () => {
  assert(readinessCss.includes('@media (max-width: 520px)'), 'Missing @media (max-width: 520px) in CareerReadinessPage.module.css');
  assert(readinessCss.includes('.overallCard {') && readinessCss.includes('flex-direction: column'), 'overallCard must stack vertically on <= 520px');
});

// 3. Learning / Development / Tools Pages
console.log('\n3. Learning, Resume & Interview Responsive Contracts:');
const coursesCss = fs.readFileSync(path.join(__dirname, '../src/pages/CourseRecommendationsPage.module.css'), 'utf8');
const learningHubCss = fs.readFileSync(path.join(__dirname, '../src/pages/LearningHubPage.module.css'), 'utf8');
const skillNavCss = fs.readFileSync(path.join(__dirname, '../src/pages/SkillNavigatorPage.module.css'), 'utf8');
const resumeCss = fs.readFileSync(path.join(__dirname, '../src/pages/ResumeBuilderPage.module.css'), 'utf8');
const interviewCss = fs.readFileSync(path.join(__dirname, '../src/pages/InterviewPage.module.css'), 'utf8');

test('CourseRecommendationsPage has mobile breakpoint for 1-column grid collapse and compact modals', () => {
  assert(coursesCss.includes('@media (max-width: 640px)'), 'Missing 640px breakpoint in CourseRecommendationsPage.module.css');
  assert(coursesCss.includes('.allCoursesGrid') && coursesCss.includes('grid-template-columns: 1fr'), 'allCoursesGrid must collapse to 1fr on mobile');
});

test('LearningHubPage has mobile breakpoint for compact video modal and filter controls', () => {
  assert(learningHubCss.includes('@media (max-width: 640px)'), 'Missing 640px breakpoint in LearningHubPage.module.css');
  assert(learningHubCss.includes('.playerModal'), 'playerModal must have responsive styles on mobile');
});

test('SkillNavigatorPage has 420px breakpoint collapsing statsGrid and mobile switcherGrid', () => {
  assert(skillNavCss.includes('@media (max-width: 420px)'), 'Missing 420px breakpoint in SkillNavigatorPage.module.css');
  assert(skillNavCss.includes('.statsGrid {') && skillNavCss.includes('grid-template-columns: 1fr'), 'statsGrid must stack on <= 420px');
  assert(skillNavCss.includes('.switcherGrid {') && skillNavCss.includes('grid-template-columns: 1fr'), 'switcherGrid must stack on mobile');
});

test('ResumeBuilderPage turns sidebarNav into a horizontal scrollable tab bar on mobile', () => {
  assert(resumeCss.includes('@media (max-width: 768px)'), 'Missing 768px breakpoint in ResumeBuilderPage.module.css');
  assert(resumeCss.includes('.sidebarNav {') && resumeCss.includes('flex-direction: row'), 'sidebarNav must be horizontal on mobile');
  assert(resumeCss.includes('overflow-x: auto'), 'sidebarNav must allow horizontal scrolling on mobile');
});

test('InterviewPage has mobile breakpoint for container, navTabs, and dialog actions', () => {
  assert(interviewCss.includes('@media (max-width: 640px)'), 'Missing 640px breakpoint in InterviewPage.module.css');
  assert(interviewCss.includes('.navTabs {') && interviewCss.includes('display: flex'), 'navTabs must be flexible on mobile');
  assert(interviewCss.includes('.modalActions {') && interviewCss.includes('flex-direction: column-reverse'), 'modalActions must stack on mobile');
});

// 4. Auth & Onboarding Mobile Contracts
console.log('\n4. Auth & Onboarding Mobile Contracts:');
const authCss = fs.readFileSync(path.join(__dirname, '../src/pages/AuthPage.module.css'), 'utf8');
const onboardingCss = fs.readFileSync(path.join(__dirname, '../src/pages/OnboardingPage.module.css'), 'utf8');

test('AuthPage has 480px breakpoint for compact mobile padding', () => {
  assert(authCss.includes('@media (max-width: 480px)'), 'Missing 480px breakpoint in AuthPage.module.css');
  assert(authCss.includes('.container {') && authCss.includes('padding: 32px 14px 48px'), 'Container padding must be compact on mobile');
});

test('OnboardingPage has 480px breakpoint for compact mobile padding and full-width actions', () => {
  assert(onboardingCss.includes('@media (max-width: 480px)'), 'Missing 480px breakpoint in OnboardingPage.module.css');
  assert(onboardingCss.includes('.card {') && onboardingCss.includes('padding: 20px 14px'), 'Card padding must be compact on mobile');
  assert(onboardingCss.includes('.actions {') && onboardingCss.includes('flex-direction: column-reverse'), 'Actions must stack on mobile');
});

// 5. Preserved Navigation & Routes
console.log('\n5. Preserved Routes & Navigation Integrity:');
const appCode = fs.readFileSync(path.join(__dirname, '../src/App.tsx'), 'utf8');

test('All Phase 20-29 core routes remain fully intact', () => {
  const routes = [
    '/dashboard',
    '/explore',
    '/compare',
    '/roadmap',
    '/next-step',
    '/career-readiness',
    '/career-paths',
    '/courses',
    '/learning-hub',
    '/resume',
    '/interview',
    '/skill-gap',
    '/whats-next',
    '/login',
    '/signup',
    '/onboarding',
  ];
  for (const r of routes) {
    assert(appCode.includes(r), `Route ${r} must remain intact in App.tsx`);
  }
});

test('All sidebar NAV_GROUPS items remain fully preserved', () => {
  const navItems = [
    'Dashboard',
    'AI Career Assistant',
    'Career Roadmap',
    'Career Paths',
    'Explore Careers',
    'Courses & Learning',
    'YouTube Learning',
    'Interview Prep',
    'Skill Gap',
    'Quizzes & Assessments',
    "What's Next?",
    'Career Readiness',
    'Resume Builder',
    'Saved & Bookmarks',
    'Business & Startup',
    'Your Next Step',
    'Settings',
  ];
  for (const item of navItems) {
    assert(dashboardLayoutCode.includes(item), `Navigation item "${item}" must be preserved in NAV_GROUPS`);
  }
});

console.log('\n------------------------------------------------------');
console.log(`Results: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('------------------------------------------------------\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
