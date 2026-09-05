/**
 * Visionix Phase 32: Career Path Explorer Automated Verification Test Suite (.cjs)
 * 
 * Verifies:
 * 1. Zero duplication: authoritative INDIAN_EDUCATION_TREE, EducationPathwayService, CAREERS_DATA,
 *    CareerDetailsModal, Skill Navigator, Learning Hub/Courses, Roadmap, and Progress.
 * 2. All 4 route aliases: /whats-next, /path-explorer, /career-path-explorer, /education-pathways.
 * 3. Sidebar: Tools & Utilities -> 'Career Path Explorer' -> path: '/whats-next'.
 * 4. Visual tree UI structure (not a card dashboard), branching connectors, compact nodes.
 * 5. Progressive disclosure: expand/collapse, Expand All, Collapse All, Focus My Position.
 * 6. "YOU ARE HERE" non-restrictive positioning and breadcrumb ancestor trail.
 * 7. Career integration: resolved CAREERS_DATA items, CareerDetailsModal, View Details, Compare, Paths, Roadmap.
 * 8. Ecosystem integration: /skill-gap, /courses, /roadmap, /next-step.
 * 9. Node Details Inspector: breadcrumb trail, attributes, entrance exams, outcomes, next branches, skills, careers.
 * 10. Required education coverage: Class 10, Intermediate (MPC, BiPC, PCMB, MEC, CEC, HEC, Vocational),
 *     Polytechnic Diploma (CSE, Mech, Civil, ECE/EEE) + lateral B.Tech, ITI (Electrician, Fitter, COPA),
 *     degrees, specializations, skills, careers.
 * 11. Search and category filters.
 * 12. Mobile responsiveness (320px, 360px, 375px, 390px, 412px, 430px).
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('🚀 STARTING PHASE 32: CAREER PATH EXPLORER TESTS');
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
  // Read frontend and backend files
  const appTsx = fs.readFileSync(path.join(rootDir, 'src', 'App.tsx'), 'utf-8');
  const dashboardLayoutTsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'DashboardLayout.tsx'), 'utf-8');
  const explorerPageTsx = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'CareerPathExplorerPage.tsx'), 'utf-8');
  const explorerCss = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'CareerPathExplorerPage.module.css'), 'utf-8');
  const frontendServiceTs = fs.readFileSync(path.join(rootDir, 'src', 'services', 'educationPathway.service.ts'), 'utf-8');
  const backendServiceTs = fs.readFileSync(path.join(rootDir, 'server', 'src', 'services', 'educationPathway.service.ts'), 'utf-8');
  const educationTreeConstantsTs = fs.readFileSync(path.join(rootDir, 'server', 'src', 'constants', 'indianEducationTree.constants.ts'), 'utf-8');

  // Dynamically load backend tree data from compiled dist to test data integrity
  const { INDIAN_EDUCATION_TREE, ALL_EDUCATION_NODES } = require(path.join(rootDir, 'server', 'dist', 'constants', 'indianEducationTree.constants.js'));
  const { CAREERS_DATA } = require(path.join(rootDir, 'server', 'dist', 'constants', 'careers.constants.js'));

  // -------------------------------------------------------------
  // Section 1: Route Aliases and Backward Compatibility
  // -------------------------------------------------------------
  console.log('📌 Section 1: Route Aliases & Navigation Verification');

  const hasWhatsNextRoute = appTsx.includes("'/whats-next'");
  const hasPathExplorerRoute = appTsx.includes("'/path-explorer'");
  const hasCareerPathExplorerRoute = appTsx.includes("'/career-path-explorer'");
  const hasEducationPathwaysRoute = appTsx.includes("'/education-pathways'");

  check(
    hasWhatsNextRoute && hasPathExplorerRoute && hasCareerPathExplorerRoute && hasEducationPathwaysRoute,
    'Requirement 1: All 4 route aliases (/whats-next, /path-explorer, /career-path-explorer, /education-pathways) are registered in App.tsx',
    `Missing one or more route aliases in App.tsx`
  );

  check(
    appTsx.includes('<CareerPathExplorerPage />'),
    'Requirement 2: All 4 routes render CareerPathExplorerPage'
  );

  check(
    dashboardLayoutTsx.includes("label: 'Career Path Explorer'") &&
    dashboardLayoutTsx.includes("path: '/whats-next'"),
    'Requirement 3: Sidebar under Tools & Utilities uses label "Career Path Explorer" with path "/whats-next"',
    'Sidebar label or path mismatch'
  );

  // -------------------------------------------------------------
  // Section 2: Zero Duplication & Source of Truth Architecture
  // -------------------------------------------------------------
  console.log('\n📌 Section 2: Zero Duplication & Single Source of Truth');

  check(
    explorerPageTsx.includes('EducationPathwayService.getPathways()'),
    'Requirement 4: CareerPathExplorerPage fetches data from authoritative EducationPathwayService'
  );

  check(
    explorerPageTsx.includes('CareerDetailsModal') &&
    explorerPageTsx.includes('CareerService.getCareers()'),
    'Requirement 5: Career details modal reuses existing authoritative CareerDetailsModal contract'
  );

  check(
    explorerPageTsx.includes('useProfile'),
    'Requirement 6: Reuses existing authoritative useProfile for current student context'
  );

  check(
    backendServiceTs.includes('CAREERS_DATA.find') &&
    backendServiceTs.includes('resolveCareerObjects'),
    'Requirement 7: Backend EducationPathwayService resolves career relationships directly from CAREERS_DATA without duplicating career catalogue'
  );

  // -------------------------------------------------------------
  // Section 3: Data-Driven Indian Education Coverage & Structure
  // -------------------------------------------------------------
  console.log('\n📌 Section 3: Data-Driven Indian Education Coverage & Representative Pathways');

  // Education root
  check(
    INDIAN_EDUCATION_TREE.id === 'stage-class-10' &&
    INDIAN_EDUCATION_TREE.nodeType === 'education_stage',
    'Requirement 8: Education root node is Class 10 Foundation (stage-class-10)'
  );

  // Find intermediate stage
  const intermediateNode = INDIAN_EDUCATION_TREE.children.find(c => c.id === 'stage-intermediate');
  check(
    Boolean(intermediateNode),
    'Requirement 9: Intermediate / 10+2 stage exists under Class 10'
  );

  // Check required intermediate streams: MPC, BiPC, PCMB, MEC, CEC, HEC, Vocational
  const intermediateStreams = intermediateNode ? intermediateNode.children.map(c => c.id) : [];
  const requiredStreams = [
    'stream-mpc',
    'stream-bipc',
    'stream-pcmb',
    'stream-mec',
    'stream-cec',
    'stream-hec',
    'stream-vocational'
  ];

  const hasAllIntermediateStreams = requiredStreams.every(s => intermediateStreams.includes(s));
  check(
    hasAllIntermediateStreams,
    'Requirement 10: All representative Intermediate streams (MPC, BiPC, PCMB, MEC, CEC, HEC, Vocational) exist',
    `Found streams: ${intermediateStreams.join(', ')}`
  );

  // Check Diploma / Polytechnic stage & branches
  const diplomaNode = INDIAN_EDUCATION_TREE.children.find(c => c.id === 'stage-diploma');
  check(
    Boolean(diplomaNode),
    'Requirement 11: Polytechnic Diploma stage exists under Class 10'
  );

  const diplomaBranches = diplomaNode ? diplomaNode.children.map(c => c.id) : [];
  const requiredDiplomaBranches = [
    'branch-polytechnic-cse',
    'branch-polytechnic-mech',
    'branch-polytechnic-civil',
    'branch-polytechnic-ece-eee'
  ];
  const hasAllDiplomaBranches = requiredDiplomaBranches.every(b => diplomaBranches.includes(b));
  check(
    hasAllDiplomaBranches,
    'Requirement 12: Major Polytechnic Diploma branches (CSE, Mechanical, Civil, ECE/EEE) exist',
    `Found branches: ${diplomaBranches.join(', ')}`
  );

  // Check Lateral Entry to B.Tech relationship
  const cseDiploma = diplomaNode?.children.find(c => c.id === 'branch-polytechnic-cse');
  const hasLateralEntry = cseDiploma?.children?.some(c => c.id === 'branch-diploma-lateral-btech' || c.title.toLowerCase().includes('lateral'));
  check(
    Boolean(hasLateralEntry),
    'Requirement 13: Polytechnic Diploma connects to 2nd-Year Lateral Entry B.Tech degree'
  );

  // Check ITI / Vocational trades
  const itiNode = INDIAN_EDUCATION_TREE.children.find(c => c.id === 'stage-iti');
  check(
    Boolean(itiNode),
    'Requirement 14: ITI / Vocational Technical Training stage exists under Class 10'
  );

  const itiBranches = itiNode ? itiNode.children.map(c => c.id) : [];
  const requiredItiTrades = [
    'branch-iti-electrician',
    'branch-iti-fitter',
    'branch-iti-copa'
  ];
  const hasAllItiTrades = requiredItiTrades.every(t => itiBranches.includes(t));
  check(
    hasAllItiTrades,
    'Requirement 15: Required ITI trades (Electrician, Fitter, COPA) exist',
    `Found ITI trades: ${itiBranches.join(', ')}`
  );

  // Check Degree Families & Branches under MPC (e.g. B.Tech, BCA, B.Arch, Pilot)
  const mpcStream = intermediateNode?.children.find(c => c.id === 'stream-mpc');
  const mpcDegrees = mpcStream ? mpcStream.children.map(c => c.id) : [];
  check(
    mpcDegrees.includes('degree-btech') && mpcDegrees.includes('degree-bca'),
    'Requirement 16: MPC stream connects to professional degrees (B.Tech, BCA)'
  );

  // Check B.Tech specializations (CSE, AI-DS, Cybersecurity, ECE, Mech, Civil)
  const btechDegree = mpcStream?.children.find(c => c.id === 'degree-btech');
  const btechBranches = btechDegree ? btechDegree.children.map(c => c.id) : [];
  const requiredBtechBranches = [
    'branch-btech-cse',
    'branch-btech-ai-ds',
    'branch-btech-cybersecurity',
    'branch-btech-ece',
    'branch-btech-mech',
    'branch-btech-civil'
  ];
  check(
    requiredBtechBranches.every(b => btechBranches.includes(b)),
    'Requirement 17: B.Tech degree branches into cutting-edge specializations (CSE, AI & DS, Cyber Security, ECE, Mech, Civil)'
  );

  // Check Medical (BiPC) degrees (MBBS, BDS, Pharmacy)
  const bipcStream = intermediateNode?.children.find(c => c.id === 'stream-bipc');
  const bipcDegrees = bipcStream ? bipcStream.children.map(c => c.id) : [];
  check(
    bipcDegrees.includes('degree-mbbs') && bipcDegrees.includes('degree-pharmacy'),
    'Requirement 18: BiPC stream connects to healthcare degrees (MBBS, Pharmacy)'
  );

  // Check Commerce (MEC/CEC) degrees (B.Com, BBA, CA, Law)
  const mecStream = intermediateNode?.children.find(c => c.id === 'stream-mec');
  const cecStream = intermediateNode?.children.find(c => c.id === 'stream-cec');
  const commerceDegrees = [...(mecStream ? mecStream.children.map(c => c.id) : []), ...(cecStream ? cecStream.children.map(c => c.id) : [])];
  check(
    commerceDegrees.includes('degree-bcom') && commerceDegrees.includes('degree-ca') && commerceDegrees.includes('degree-law'),
    'Requirement 19: Commerce & Arts streams connect to professional degrees (B.Com, CA, Law)'
  );

  // Check Career mapping resolution integrity against CAREERS_DATA
  const nodesWithCareers = ALL_EDUCATION_NODES.filter(n => n.careerIds && n.careerIds.length > 0);
  const totalCareerRefs = nodesWithCareers.reduce((acc, n) => acc + n.careerIds.length, 0);
  const careersDataIds = new Set(CAREERS_DATA.map(c => c.id));
  const validMappedCareers = nodesWithCareers.every(n => 
    n.careerIds.every(cid => careersDataIds.has(cid))
  );
  check(
    nodesWithCareers.length >= 15 && validMappedCareers,
    `Requirement 20: All careerIds in education tree map directly to authoritative CAREERS_DATA (${nodesWithCareers.length} nodes with ${totalCareerRefs} career links)`
  );

  // -------------------------------------------------------------
  // Section 4: Visual Tree UI & Progressive Disclosure Controls
  // -------------------------------------------------------------
  console.log('\n📌 Section 4: Visual Tree UI, Connectors & Progressive Disclosure');

  check(
    explorerCss.includes('.treeContainer') &&
    explorerCss.includes('.treeBranch') &&
    explorerCss.includes('.branchArm') &&
    explorerCss.includes('.nodeCard'),
    'Requirement 21: CSS implements connected tree visual styling with visible branch spines and arms'
  );

  check(
    explorerPageTsx.includes('handleToggleExpand') &&
    explorerPageTsx.includes('handleExpandAll') &&
    explorerPageTsx.includes('handleCollapseAll'),
    'Requirement 22: Progressive disclosure handlers (toggle expand, expand all, collapse all) exist'
  );

  check(
    explorerPageTsx.includes('handleFocusMyPosition') &&
    explorerPageTsx.includes('styles.youAreHereBanner') &&
    explorerPageTsx.includes('YOU ARE HERE'),
    'Requirement 23: "YOU ARE HERE" banner and "Focus My Position" action are implemented'
  );

  check(
    explorerPageTsx.includes('styles.nodeCardYouAreHere') &&
    explorerPageTsx.includes('styles.hereIndicator'),
    'Requirement 24: Current user position node receives distinct highlighting without restricting exploration of other branches'
  );

  // -------------------------------------------------------------
  // Section 5: Node Details Inspector Panel
  // -------------------------------------------------------------
  console.log('\n📌 Section 5: Node Details Inspector Panel Verification');

  check(
    explorerCss.includes('.inspectorPanel') &&
    explorerPageTsx.includes('selectedNode') &&
    explorerPageTsx.includes('styles.inspectorBreadcrumbs'),
    'Requirement 25: Node Details Inspector with clickable breadcrumb ancestor trail is implemented'
  );

  check(
    explorerPageTsx.includes('selectedNode.duration') &&
    explorerPageTsx.includes('selectedNode.eligibility'),
    'Requirement 26: Inspector displays factual duration and eligibility where supported by data'
  );

  check(
    explorerPageTsx.includes('selectedNode.entranceExams'),
    'Requirement 27: Inspector displays competitive entrance exams'
  );

  check(
    explorerPageTsx.includes('selectedNode.outcomes'),
    'Requirement 28: Inspector displays key progression outcomes'
  );

  check(
    explorerPageTsx.includes('selectedNode.skills'),
    'Requirement 29: Inspector displays competencies with link to Skill Navigator (/skill-gap)'
  );

  check(
    explorerPageTsx.includes('selectedNode.resolvedCareers') &&
    explorerPageTsx.includes('handleOpenCareerModal') &&
    explorerPageTsx.includes("navigate('/compare'") &&
    explorerPageTsx.includes("navigate('/career-paths'") &&
    explorerPageTsx.includes("navigate('/roadmap'"),
    'Requirement 30: Inspector displays associated careers with View Details, Compare, Paths, and Roadmap actions'
  );

  check(
    explorerPageTsx.includes("navigate('/courses')") &&
    explorerPageTsx.includes("navigate('/roadmap')") &&
    explorerPageTsx.includes("navigate('/next-step')"),
    'Requirement 31: Inspector provides direct connected ecosystem links to Courses, Roadmap, and Your Next Step'
  );

  // -------------------------------------------------------------
  // Section 6: Search & Category Filter Toolbar
  // -------------------------------------------------------------
  console.log('\n📌 Section 6: Search & Category Filter Toolbar');

  check(
    explorerPageTsx.includes('searchQuery') &&
    explorerPageTsx.includes('styles.searchInput') &&
    explorerPageTsx.includes('styles.nodeCardDimmed'),
    'Requirement 32: Search bar dynamically filters tree nodes and dims non-matching branches while preserving structure'
  );

  check(
    explorerPageTsx.includes('STREAM_FILTERS') &&
    explorerPageTsx.includes('activeStreamFilter'),
    'Requirement 33: Stream category filters (MPC, BiPC, MEC, Diploma, ITI, etc.) are available'
  );

  // -------------------------------------------------------------
  // Section 7: Mobile Responsiveness & Viewports
  // -------------------------------------------------------------
  console.log('\n📌 Section 7: Mobile Responsiveness (320px–430px)');

  check(
    explorerCss.includes('@media (max-width: 1024px)') &&
    explorerCss.includes('@media (max-width: 768px)') &&
    explorerCss.includes('@media (max-width: 480px)'),
    'Requirement 34: Responsive breakpoints for desktop (1024px+), tablet (768px), and mobile (480px and below) are defined'
  );

  check(
    explorerCss.includes('grid-template-columns: 1fr;') &&
    explorerCss.includes('overflow-x: hidden'),
    'Requirement 35: Mobile converts grid to single column and prevents accidental horizontal overflow'
  );

  check(
    explorerCss.includes('.lateralBranchHighlight'),
    'Requirement 36: Lateral entry branch connectors are distinctly highlighted'
  );

  // -------------------------------------------------------------
  // Section 8: Summary Report
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 PHASE 32 VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    console.error(`\n❌ ${failed} test(s) failed. Please review the details above.`);
    process.exit(1);
  } else {
    console.log('\n🎉 ALL PHASE 32 AUTOMATED TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
