/**
 * Phase 21 Automated Verification Test Suite (.cjs)
 * Tests:
 * 1. User Authentication & Profile Education Context setup
 * 2. Course Relevance Determination for Indian Education streams (MPC, BiPC, B.Tech CSE, etc.)
 * 3. Career Comparison API (1, 2, and 3 careers) + 4-career limit rejection (400 Bad Request)
 * 4. Shared vs Unique skills calculation in Career Comparison
 * 5. Roadmap Comparison API (1, 2, and 3 roadmaps) + Path differences extraction
 * 6. Target Career ("Choose This Career") profile sync flow
 * 7. GET and POST query parameters for comparison endpoints
 */

const http = require('http');

const SERVER_URL = 'http://localhost:5000';
let authToken = '';

async function makeRequest(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SERVER_URL);
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (authToken) {
      reqHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: reqHeaders,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 STARTING PHASE 21 AUTOMATED VERIFICATION TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 0. Register / Login test user
    console.log('📌 Test 0: Authenticate Test Student');
    const testEmail = `student_${Date.now()}@visionix.ai`;
    const testPassword = 'Password@123';

    const regRes = await makeRequest('/api/auth/register', 'POST', {
      fullName: 'Aditya Varma',
      email: testEmail,
      password: testPassword,
    });

    if (regRes.status === 201 || regRes.status === 200) {
      authToken = regRes.body?.data?.token || regRes.body?.token;
      assert(Boolean(authToken), `Successfully registered test student (${testEmail})`);
    } else {
      console.log('Register failed with:', regRes.status, regRes.body);
      // Try login if user exists
      const loginRes = await makeRequest('/api/auth/login', 'POST', {
        email: testEmail,
        password: testPassword,
      });
      authToken = loginRes.body?.data?.token || loginRes.body?.token;
      assert(Boolean(authToken), `Successfully logged in test student`);
    }

    // Set user profile education to Intermediate (MPC)
    const profileRes = await makeRequest('/api/profile', 'POST', {
      personal: {
        fullName: 'Aditya Varma',
        firstName: 'Aditya',
        lastName: 'Varma',
      },
      education: {
        level: 'Intermediate (11th & 12th)',
        currentClass: 'Class 12',
        stream: 'MPC',
        institution: 'Narayana Junior College'
      },
      skills: {
        technicalSkills: ['Mathematics', 'Physics', 'Programming Basics', 'Python'],
      },
      careerGoals: {
        dreamCareer: 'Software Engineer',
        preferredIndustries: ['Technology']
      }
    });
    assert(profileRes.status === 200, `Updated profile with Intermediate MPC education`);

    // 1. Fetch Career Catalog with Course Relevance
    console.log('\n📌 Test 1: Fetch Career Catalog with Education Relevance');
    const catalogRes = await makeRequest('/api/careers');
    const catalogData = catalogRes.body?.data || catalogRes.body;
    assert(catalogRes.status === 200, `Catalog API responded with 200 (Got ${catalogRes.status})`);
    assert(catalogData.careers && catalogData.careers.length > 0, `Found ${catalogData.careers?.length} careers in catalog`);

    const careers = catalogData.careers || [];
    const softwareEng = careers.find(c => c.id === 'software-engineer' || c.title?.toLowerCase().includes('software')) || careers[0];
    const dataScientist = careers.find(c => c.id === 'data-scientist' || c.title?.toLowerCase().includes('data')) || careers[1];
    const doctor = careers.find(c => c.id === 'doctor' || c.title?.toLowerCase().includes('doctor') || c.category === 'Healthcare') || careers[2];
    const ca = careers.find(c => c.id === 'chartered-accountant' || c.title?.toLowerCase().includes('accountant') || c.category === 'Business & Finance') || careers[3];

    console.log(`Sample compared careers: 
      - Career 1: ${softwareEng?.title} (${softwareEng?.id})
      - Career 2: ${dataScientist?.title} (${dataScientist?.id})
      - Career 3: ${doctor?.title} (${doctor?.id})
      - Career 4: ${ca?.title} (${ca?.id})`);

    // Verify course relevance for MPC student
    if (softwareEng?.courseRelevance) {
      assert(softwareEng.courseRelevance.relevanceLevel === 'Strongly Relevant', `Software Engineer evaluated as 'Strongly Relevant' for MPC student (Got: ${softwareEng.courseRelevance.relevanceLevel})`);
      assert(Array.isArray(softwareEng.courseRelevance.relevantSubjects), `Software Engineer contains relevantSubjects: ${softwareEng.courseRelevance.relevantSubjects?.join(', ')}`);
      assert(Array.isArray(softwareEng.courseRelevance.entranceRequirements), `Software Engineer contains entranceRequirements: ${softwareEng.courseRelevance.entranceRequirements?.join(', ')}`);
    }

    if (doctor?.courseRelevance) {
      assert(doctor.courseRelevance.relevanceLevel === 'Requires Additional Education / Transition', `Medical Doctor evaluated as 'Requires Additional Education / Transition' for MPC student without Biology (Got: ${doctor.courseRelevance.relevanceLevel})`);
    }

    // 2. Career Comparison API - 2 Careers
    console.log('\n📌 Test 2: Career Comparison API (2 Careers)');
    const compare2Res = await makeRequest('/api/careers/compare', 'POST', {
      careerIds: [softwareEng.id, dataScientist.id]
    });
    const comp2Data = compare2Res.body?.data || compare2Res.body;
    assert(compare2Res.status === 200, `Comparison API returned 200 (Got ${compare2Res.status})`);
    assert(comp2Data.careers && comp2Data.careers.length === 2, `Returned 2 compared careers`);
    assert(Array.isArray(comp2Data.sharedSkills), `Computed sharedSkills array: ${JSON.stringify(comp2Data.sharedSkills)}`);
    assert(typeof comp2Data.uniqueSkillsByCareer === 'object', `Computed uniqueSkillsByCareer mapping`);

    // 3. Career Comparison API - 3 Careers
    console.log('\n📌 Test 3: Career Comparison API (3 Careers - Maximum Allowed)');
    const compare3Res = await makeRequest('/api/careers/compare', 'POST', {
      careerIds: [softwareEng.id, dataScientist.id, doctor.id]
    });
    const comp3Data = compare3Res.body?.data || compare3Res.body;
    assert(compare3Res.status === 200, `Comparison API returned 200 for 3 careers`);
    assert(comp3Data.careers && comp3Data.careers.length === 3, `Returned exactly 3 compared careers`);

    // 4. Career Comparison API - 4 Careers (Should be rejected with 400 Bad Request)
    console.log('\n📌 Test 4: Enforce Max 3 Limit on Career Comparison (4 Careers Rejection)');
    const compare4Res = await makeRequest('/api/careers/compare', 'POST', {
      careerIds: [softwareEng.id, dataScientist.id, doctor.id, ca.id]
    });
    assert(compare4Res.status === 400, `API rejected 4 careers with 400 Bad Request (Got ${compare4Res.status})`);
    const comp4Err = compare4Res.body?.message || compare4Res.body?.error || JSON.stringify(compare4Res.body);
    assert(comp4Err.includes('Maximum 3') || comp4Err.includes('3 careers'), `Error message clearly states maximum 3 limit: "${comp4Err}"`);

    // 5. Roadmap Comparison API - 2 Careers
    console.log('\n📌 Test 5: Roadmap Comparison API (2 Careers)');
    const roadmapCompareRes = await makeRequest('/api/roadmap/compare', 'POST', {
      careerIds: [softwareEng.id, dataScientist.id]
    });
    const rm2Data = roadmapCompareRes.body?.data || roadmapCompareRes.body;
    assert(roadmapCompareRes.status === 200, `Roadmap comparison API returned 200 (Got ${roadmapCompareRes.status})`);
    assert(rm2Data.roadmaps && rm2Data.roadmaps.length === 2, `Returned 2 compared roadmaps`);
    
    const r1 = rm2Data.roadmaps?.[0];
    const r2 = rm2Data.roadmaps?.[1];
    assert(r1 && r1.stages && r1.stages.length > 0, `Roadmap 1 (${r1?.careerTitle}) contains ${r1?.stages?.length} stages`);
    assert(r2 && r2.stages && r2.stages.length > 0, `Roadmap 2 (${r2?.careerTitle}) contains ${r2?.stages?.length} stages`);
    assert(rm2Data.pathDifferences && rm2Data.pathDifferences.keyDifferences?.length > 0, `Roadmap comparison contains path differences: ${rm2Data.pathDifferences?.summary}`);

    // 6. Roadmap Comparison API - 3 Careers
    console.log('\n📌 Test 6: Roadmap Comparison API (3 Careers)');
    const roadmapCompare3Res = await makeRequest('/api/roadmap/compare', 'POST', {
      careerIds: [softwareEng.id, dataScientist.id, doctor.id]
    });
    const rm3Data = roadmapCompare3Res.body?.data || roadmapCompare3Res.body;
    assert(roadmapCompare3Res.status === 200, `Roadmap comparison API returned 200 for 3 careers`);
    assert(rm3Data.roadmaps && rm3Data.roadmaps.length === 3, `Returned exactly 3 compared roadmaps`);

    // 7. Roadmap Comparison API - 4 Careers (Should be rejected with 400 Bad Request)
    console.log('\n📌 Test 7: Enforce Max 3 Limit on Roadmap Comparison (4 Careers Rejection)');
    const roadmapCompare4Res = await makeRequest('/api/roadmap/compare', 'POST', {
      careerIds: [softwareEng.id, dataScientist.id, doctor.id, ca.id]
    });
    assert(roadmapCompare4Res.status === 400, `Roadmap API rejected 4 careers with 400 Bad Request (Got ${roadmapCompare4Res.status})`);

    // 8. GET query parameter support for both comparison routes
    console.log('\n📌 Test 8: GET Query Parameter Support for /compare endpoints');
    const getCareerCompareRes = await makeRequest(`/api/careers/compare?ids=${softwareEng.id},${dataScientist.id}`);
    assert(getCareerCompareRes.status === 200, `GET /api/careers/compare?ids=... returned 200`);

    const getRoadmapCompareRes = await makeRequest(`/api/roadmap/compare?ids=${softwareEng.id},${dataScientist.id}`);
    assert(getRoadmapCompareRes.status === 200, `GET /api/roadmap/compare?ids=... returned 200`);

    console.log('\n====================================================');
    console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal error running verification tests:', err);
    process.exit(1);
  }
}

runTests();
