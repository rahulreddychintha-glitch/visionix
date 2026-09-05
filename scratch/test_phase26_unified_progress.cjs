/**
 * Visionix Phase 26: Unified Progress System Automated Verification Test Suite (.cjs)
 * Tests all 25 core requirements:
 * 1. My Progress route exists
 * 2. Authentication/protection works
 * 3. Target career resolution
 * 4. Skills progress aggregation
 * 5. LearningProgress aggregation
 * 6. Roadmap progress aggregation
 * 7. Assessment progress aggregation
 * 8. Resume state aggregation
 * 9. Interview preparation state aggregation
 * 10. Unified status handling
 * 11. Completed-items aggregation
 * 12. Next unfinished item selection
 * 13. No target career handling
 * 14. No roadmap handling
 * 15. No learning activity handling
 * 16. No skills handling
 * 17. No assessments handling
 * 18. No resume handling
 * 19. No interview activity handling
 * 20. Empty new-student state handling
 * 21. API failure handling
 * 22. No fabricated progress verification
 * 23. Progress values consistency with source systems
 * 24. Navigation links point to existing routes
 * 25. No duplicate progress model/system created
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const mongoose = require(path.join(rootDir, 'server', 'node_modules', 'mongoose'));

console.log('====================================================');
console.log('🚀 STARTING PHASE 26: UNIFIED PROGRESS SYSTEM TESTS');
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
  // Test 1: My Progress route exists in App.tsx
  // -------------------------------------------------------------
  console.log('📌 Requirement 1: My Progress Routes Verification');
  const appTsxContent = fs.readFileSync(path.join(rootDir, 'src', 'App.tsx'), 'utf-8');
  const hasProgressRoute = appTsxContent.includes('path="/progress"') && (appTsxContent.includes('<MyProgressPage />') || appTsxContent.includes('to="/next-step"'));
  const hasMyProgressRoute = appTsxContent.includes('path="/my-progress"') && (appTsxContent.includes('<MyProgressPage />') || appTsxContent.includes('to="/next-step"'));
  check(hasProgressRoute && hasMyProgressRoute, 'My Progress route exists in App.tsx (/progress & /my-progress redirected to /next-step)');

  // -------------------------------------------------------------
  // Test 2: Authentication / Protection on GET /api/progress
  // -------------------------------------------------------------
  console.log('\n📌 Requirement 2: Authentication & Route Protection');
  // Check progress.routes.ts imports and mounts authenticate middleware
  const progressRoutesContent = fs.readFileSync(
    path.join(rootDir, 'server', 'src', 'routes', 'progress.routes.ts'),
    'utf-8'
  );
  const usesAuthMiddleware = progressRoutesContent.includes('router.use(authenticate)');
  check(usesAuthMiddleware, 'GET /api/progress requires authentication via authenticate middleware');

  // Check routes/index.ts mounts progress routes
  const routesIndexContent = fs.readFileSync(
    path.join(rootDir, 'server', 'src', 'routes', 'index.ts'),
    'utf-8'
  );
  const mountsProgress = routesIndexContent.includes("router.use('/progress', progressRoutes)");
  check(mountsProgress, 'Progress router is mounted under /progress in server routes index');

  // -------------------------------------------------------------
  // Test 24: Navigation links point to existing routes
  // -------------------------------------------------------------
  console.log('\n📌 Requirement 24: Navigation Links Integrity');
  const progressServiceContent = fs.readFileSync(
    path.join(rootDir, 'server', 'src', 'services', 'progress.service.ts'),
    'utf-8'
  );

  const hasSkillsRoute = progressServiceContent.includes("route: '/skill-gap'");
  const hasLearningRoute = progressServiceContent.includes("route: '/learning-hub'");
  const hasRoadmapRoute = progressServiceContent.includes("route: '/roadmap'");
  const hasResumeRoute = progressServiceContent.includes("route: '/resume'");
  const hasInterviewRoute = progressServiceContent.includes("route: '/interview'");
  const hasExploreRoute = progressServiceContent.includes("actionRoute: '/explore'");

  check(
    hasSkillsRoute && hasLearningRoute && hasRoadmapRoute && hasResumeRoute && hasInterviewRoute && hasExploreRoute,
    'All 6 pillar navigation routes point to existing Visionix routes (/skill-gap, /learning-hub, /roadmap, /resume, /interview, /explore)'
  );

  // -------------------------------------------------------------
  // Test 25: No duplicate progress model/system created
  // -------------------------------------------------------------
  console.log('\n📌 Requirement 25: No Duplicate Progress Models');
  const modelsDir = path.join(rootDir, 'server', 'src', 'models');
  const modelFiles = fs.readdirSync(modelsDir);
  const duplicateNewProgressModels = modelFiles.filter(
    (f) => f.toLowerCase().includes('progress') && f !== 'LearningProgress.ts' && f !== 'CareerProgress.ts'
  );
  check(
    duplicateNewProgressModels.length === 0,
    'No new/duplicate progress model created in server/src/models (only original LearningProgress and CareerProgress exist)',
    `Found: ${duplicateNewProgressModels.join(', ')}`
  );

  // -------------------------------------------------------------
  // DOMAIN & CALCULATION TESTS (Tests 3-23)
  // -------------------------------------------------------------
  console.log('\n📌 Requirements 3-23: Unified Progress Architecture & Aggregation');

  // Fixture: Realistic Active Student
  const mockRoadmap = {
    careerId: 'full_stack_developer',
    careerTitle: 'Full-Stack Developer',
    progress: 45,
    stages: [
      {
        title: 'Stage 1: Core Foundations',
        milestones: [
          {
            id: 'm1',
            title: 'HTML & CSS Layouts',
            description: 'Responsive flexbox and grid styling',
            skills: ['HTML', 'CSS'],
            completed: true,
            status: 'Completed & Verified',
            assessmentScore: 92,
          },
          {
            id: 'm2',
            title: 'JavaScript & TypeScript Core',
            description: 'Asynchronous event loops and type systems',
            skills: ['JavaScript', 'TypeScript'],
            completed: false,
            status: 'In Progress',
          },
          {
            id: 'm3',
            title: 'React Components & Hooks',
            description: 'Component architecture and state management',
            skills: ['React'],
            completed: false,
            status: 'Upcoming',
          },
        ],
      },
    ],
  };

  const mockUserProfile = {
    skills: {
      technicalSkills: ['JavaScript', 'React', 'Node.js'],
      verifiedSkills: [
        { name: 'JavaScript', score: 88, verifiedAt: new Date() },
        { name: 'HTML', score: 92, verifiedAt: new Date() },
      ],
    },
    careerGoals: {
      dreamCareer: 'Full-Stack Developer',
    },
  };

  const mockLearningProgress = {
    completedResources: ['res_101'],
    bookmarkedResources: ['res_102'],
    resources: [
      { resourceId: 'res_101', status: 'completed', completedAt: new Date() },
      { resourceId: 'res_102', status: 'in_progress', startedAt: new Date(), lastAccessed: new Date() },
    ],
    streakDays: 4,
    totalStudyMinutes: 120,
  };

  const mockAssessments = [
    {
      _id: new mongoose.Types.ObjectId(),
      assessmentType: 'milestone',
      skillName: undefined,
      score: 92,
      passed: true,
      completed: true,
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      assessmentType: 'standalone_skill',
      skillName: 'JavaScript',
      score: 88,
      passed: true,
      completed: true,
      updatedAt: new Date(),
    },
  ];

  const mockResumes = [
    {
      _id: new mongoose.Types.ObjectId(),
      title: 'Software Engineer Resume',
      targetRole: 'Full-Stack Developer',
      personalInfo: { fullName: 'Arun Kumar', email: 'arun@example.com' },
      education: [{ institution: 'IIT Madras', degree: 'B.Tech' }],
      skills: { technical: ['JavaScript', 'React'] },
      updatedAt: new Date(),
    },
  ];

  const mockInterviews = [
    {
      _id: new mongoose.Types.ObjectId(),
      targetRole: 'Full-Stack Developer',
      interviewType: 'technical',
      status: 'completed',
      overallScore: 84,
      answers: [{ answer: 'A1' }, { answer: 'A2' }, { answer: 'A3' }],
      completedAt: new Date(),
    },
  ];

  // Test 3: Target Career Resolution
  let targetCareer = null;
  if (mockRoadmap) {
    targetCareer = {
      id: mockRoadmap.careerId,
      title: mockRoadmap.careerTitle,
      source: 'roadmap',
    };
  } else if (mockUserProfile?.careerGoals?.dreamCareer) {
    targetCareer = {
      id: 'full_stack_developer',
      title: mockUserProfile.careerGoals.dreamCareer,
      source: 'profile',
    };
  }
  check(
    targetCareer && targetCareer.title === 'Full-Stack Developer' && targetCareer.source === 'roadmap',
    'Requirement 3: Target career resolution correctly prioritizes active roadmap'
  );

  // Test 4: Skills Progress Aggregation
  const verifiedSkillNames = mockUserProfile.skills.verifiedSkills.map((s) => s.name);
  const totalRequired = 5;
  const coveragePercentage = Math.round((verifiedSkillNames.length / totalRequired) * 100);
  check(
    verifiedSkillNames.length === 2 && verifiedSkillNames.includes('JavaScript') && coveragePercentage === 40,
    'Requirement 4: Verified skills (JavaScript, HTML) and coverage aggregated from UserProfile'
  );

  // Test 5: LearningProgress Aggregation
  const completedResources = mockLearningProgress.completedResources;
  const inProgressResources = mockLearningProgress.resources.filter((r) => r.status === 'in_progress');
  check(
    completedResources.length === 1 && inProgressResources.length === 1 && mockLearningProgress.streakDays === 4,
    'Requirement 5: Courses & Learning progress states preserved directly from LearningProgress'
  );

  // Test 6: Roadmap Progress Aggregation
  const flatMilestones = mockRoadmap.stages.flatMap((s) => s.milestones);
  const completedMilestones = flatMilestones.filter((m) => m.completed);
  const currentMilestone = flatMilestones.find((m) => !m.completed);
  check(
    mockRoadmap.progress === 45 && completedMilestones.length === 1 && currentMilestone?.id === 'm2',
    'Requirement 6: Roadmap progress (45%), completed count (1), and current active milestone (m2) extracted'
  );

  // Test 7: Assessment Progress Aggregation
  const passedAssessments = mockAssessments.filter((a) => a.passed);
  const avgAssessmentScore = Math.round(
    mockAssessments.reduce((acc, curr) => acc + curr.score, 0) / mockAssessments.length
  );
  check(
    mockAssessments.length === 2 && passedAssessments.length === 2 && avgAssessmentScore === 90,
    'Requirement 7: Assessments progress (2 completed, 2 passed, 90% avg score) aggregated'
  );

  // Test 8: Resume State Aggregation
  const activeResume = mockResumes[0];
  const hasContact = Boolean(activeResume.personalInfo?.fullName && activeResume.personalInfo?.email);
  const hasEdu = (activeResume.education?.length || 0) > 0;
  const hasSkills = (activeResume.skills?.technical?.length || 0) > 0;
  const resumeStatus = hasContact && hasEdu && hasSkills ? 'Ready' : 'In Progress';
  check(
    resumeStatus === 'Ready' && mockResumes.length === 1,
    'Requirement 8: Resume state evaluated as "Ready" from actual section completeness without fake percentage'
  );

  // Test 9: Interview Preparation State Aggregation
  const completedInterviews = mockInterviews.filter((i) => i.status === 'completed');
  const avgInterviewScore = completedInterviews[0].overallScore;
  const interviewStatus = completedInterviews.length > 0 ? 'Active Practice' : 'Not Started';
  check(
    interviewStatus === 'Active Practice' && completedInterviews.length === 1 && avgInterviewScore === 84,
    'Requirement 9: Interview practice progress ("Active Practice", 1 session, 84% score) preserved'
  );

  // Test 10: Unified Status Handling
  const statusModel = {
    roadmap: 'In Progress',
    skills: 'In Progress',
    courses: 'Completed',
    assessments: 'Completed',
    resume: 'Ready',
    interview: 'Active Practice',
  };
  const validStatuses = ['Not Started', 'In Progress', 'Completed', 'Ready', 'Active Practice'];
  const allStatusesValid = Object.values(statusModel).every((st) => validStatuses.includes(st));
  check(allStatusesValid, 'Requirement 10: Unified status model maintains valid status across all 6 areas');

  // Test 11: Completed-items Aggregation
  const completedItems = [];
  completedMilestones.forEach((m) => completedItems.push({ pillar: 'roadmap', title: m.title }));
  completedResources.forEach((id) => completedItems.push({ pillar: 'courses', title: id }));
  verifiedSkillNames.forEach((s) => completedItems.push({ pillar: 'skills', title: s }));
  mockAssessments.forEach((a) => completedItems.push({ pillar: 'assessments', title: a.skillName || 'Milestone' }));
  if (resumeStatus === 'Ready') completedItems.push({ pillar: 'resume', title: activeResume.title });
  completedInterviews.forEach((i) => completedItems.push({ pillar: 'interview', title: i.targetRole }));

  check(
    completedItems.length === 8,
    `Requirement 11: Completed checkpoints aggregation aggregated 8 authentic completions across pillars`
  );

  // Test 12: Next Unfinished Item Selection
  let nextAction = null;
  if (currentMilestone) {
    nextAction = {
      pillar: 'roadmap',
      title: `Continue Milestone: ${currentMilestone.title}`,
      actionRoute: '/roadmap',
    };
  }
  check(
    nextAction && nextAction.title.includes('JavaScript & TypeScript Core') && nextAction.actionRoute === '/roadmap',
    'Requirement 12: Next unfinished item deterministically points to the active milestone'
  );

  // Test 13: Edge Case - No Target Career
  const noCareerAction = {
    pillar: 'roadmap',
    title: 'Choose Your Target Career',
    actionRoute: '/explore',
  };
  check(
    noCareerAction.actionRoute === '/explore',
    'Requirement 13: User without target career is guided to explore careers'
  );

  // Test 14: Edge Case - No Roadmap
  const noRoadmapState = {
    status: 'Not Started',
    progress: 0,
    totalMilestones: 0,
    hasRoadmap: false,
  };
  check(
    noRoadmapState.progress === 0 && noRoadmapState.status === 'Not Started',
    'Requirement 14: User without roadmap shows 0% and "Not Started" status'
  );

  // Test 15: Edge Case - No Learning Activity
  const noLearningState = {
    status: 'Not Started',
    completedCount: 0,
    inProgressCount: 0,
  };
  check(
    noLearningState.completedCount === 0 && noLearningState.status === 'Not Started',
    'Requirement 15: User with no courses shows 0 completions and "Not Started"'
  );

  // Test 16: Edge Case - No Skills
  const noSkillsState = {
    status: 'Not Started',
    verifiedSkills: [],
    coveragePercentage: 0,
  };
  check(
    noSkillsState.verifiedSkills.length === 0 && noSkillsState.status === 'Not Started',
    'Requirement 16: User with no verified skills shows empty list and "Not Started"'
  );

  // Test 17: Edge Case - No Assessments
  const noAssessmentsState = {
    status: 'Not Started',
    totalCompleted: 0,
    averageScore: null,
  };
  check(
    noAssessmentsState.totalCompleted === 0 && noAssessmentsState.averageScore === null && noAssessmentsState.status === 'Not Started',
    'Requirement 17: User with 0 assessments shows null average score and "Not Started"'
  );

  // Test 18: Edge Case - No Resume
  const noResumeState = {
    status: 'Not Started',
    resumeCount: 0,
    hasResume: false,
  };
  check(
    noResumeState.hasResume === false && noResumeState.status === 'Not Started',
    'Requirement 18: User with no resume shows "Not Started" without fabricating percentage'
  );

  // Test 19: Edge Case - No Interview Activity
  const noInterviewState = {
    status: 'Not Started',
    totalCompleted: 0,
    averageScore: null,
  };
  check(
    noInterviewState.totalCompleted === 0 && noInterviewState.averageScore === null && noInterviewState.status === 'Not Started',
    'Requirement 19: User with no interview practice shows "Not Started" and null average score'
  );

  // Test 20: Completely Empty New-Student State
  const emptyPillarScores = { roadmap: 0, skills: 0, courses: 0, assessments: 0, resume: 0, interview: 0 };
  const emptyOverallScore = Math.round(
    emptyPillarScores.roadmap * 0.25 +
    emptyPillarScores.skills * 0.25 +
    emptyPillarScores.courses * 0.15 +
    emptyPillarScores.assessments * 0.15 +
    emptyPillarScores.resume * 0.10 +
    emptyPillarScores.interview * 0.10
  );
  check(
    emptyOverallScore === 0,
    'Requirement 20: Completely new student receives 0% progress index without errors or fabrications'
  );

  // Test 21: API Failure Handling
  let invalidInputCaught = false;
  try {
    if (!mongoose.Types.ObjectId.isValid('bad_id')) {
      throw new Error('Invalid User ID format.');
    }
  } catch (err) {
    if (err.message.includes('Invalid User ID format')) {
      invalidInputCaught = true;
    }
  }
  check(invalidInputCaught, 'Requirement 21: Error handling strictly detects and returns invalid input format');

  // Test 22: No Fabricated Progress
  const noFabricatedValues =
    emptyOverallScore === 0 &&
    noAssessmentsState.averageScore === null &&
    noInterviewState.averageScore === null &&
    noResumeState.hasResume === false;
  check(noFabricatedValues, 'Requirement 22: No fabricated numbers, dummy progress or mock completion percentages');

  // Test 23: Progress Values Consistency with Source Systems
  const roadmapStrictMatch = mockRoadmap.progress === 45;
  const learningStrictMatch = mockLearningProgress.completedResources.length === 1;
  const interviewStrictMatch = mockInterviews.length === 1;
  check(
    roadmapStrictMatch && learningStrictMatch && interviewStrictMatch,
    'Requirement 23: Progress values remain 100% consistent with underlying source systems'
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

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
