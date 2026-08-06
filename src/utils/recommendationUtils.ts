import {
  TECHNICAL_SKILLS,
  DREAM_CAREERS,
  getTaxonomyLabel,
  STUDENT_STATUSES,
  EDUCATION_DOMAINS,
  EDUCATION_BRANCHES,
  SPECIALIZATIONS,
  INDUSTRIES
} from '../constants/onboarding.constants';

export interface CareerRecommendation {
  id: string;
  title: string;
  matchScore: number;
  stars: string;
  reason: string;
  category: string;
}

export interface SkillGapResult {
  currentSkills: string[];
  expectedSkills: string[];
  missingSkills: string[];
}

export interface SmartSuggestionItem {
  id: string;
  label: string;
  category: string;
}

// Typical expected skills mapping per career/domain
const CAREER_EXPECTED_SKILLS: Record<string, string[]> = {
  ai_engineer: ['python', 'pytorch', 'tensorflow', 'sql', 'c_plus_plus', 'docker'],
  software_engineer: ['javascript', 'typescript', 'react', 'node_js', 'sql', 'docker'],
  data_scientist: ['python', 'sql', 'pytorch', 'excel', 'docker'],
  cloud_architect: ['aws', 'docker', 'python', 'sql'],
  cyber_security_engineer: ['python', 'c_plus_plus', 'sql', 'docker'],
  ui_ux_designer: ['figma', 'javascript'],
  doctor: ['communication', 'critical_thinking', 'problem_solving'],
  dentist: ['communication', 'critical_thinking'],
  clinical_researcher: ['python', 'critical_thinking', 'problem_solving'],
  financial_analyst: ['excel', 'sql', 'python', 'critical_thinking'],
  chartered_accountant: ['excel', 'sql', 'critical_thinking'],
  investment_banker: ['excel', 'critical_thinking', 'communication'],
  product_manager: ['communication', 'critical_thinking', 'problem_solving', 'leadership'],
  management_consultant: ['critical_thinking', 'communication', 'problem_solving', 'leadership'],
  entrepreneur: ['leadership', 'communication', 'problem_solving', 'critical_thinking'],
  corporate_lawyer: ['communication', 'critical_thinking', 'leadership'],
};

// Domain default expected skills fallback
const DOMAIN_EXPECTED_SKILLS: Record<string, string[]> = {
  engineering: ['python', 'javascript', 'sql', 'c_plus_plus', 'problem_solving'],
  medicine_healthcare: ['critical_thinking', 'communication', 'problem_solving'],
  commerce_finance: ['excel', 'sql', 'critical_thinking', 'communication'],
  business_management: ['communication', 'leadership', 'critical_thinking', 'problem_solving'],
  law_legal: ['communication', 'critical_thinking', 'leadership'],
  design_media: ['figma', 'javascript', 'critical_thinking'],
};

/**
 * Pure utility function to compute smart suggestions for a user profile based on academic stream/domain.
 * Returns suggestion items ("Recommended for You").
 */
export function getSmartSuggestions(profile: any): SmartSuggestionItem[] {
  const stream = (profile?.education?.stream || '').toLowerCase();

  if (stream.includes('engineering') || stream.includes('stem')) {
    return [
      { id: 'computer_science_eng', label: 'Computer Science', category: 'Engineering' },
      { id: 'artificial_intelligence', label: 'AI', category: 'Technology' },
      { id: 'cyber_security', label: 'Cyber Security', category: 'Security' },
      { id: 'software_engineering', label: 'Software Engineering', category: 'Software' },
    ];
  }

  if (stream.includes('medicine') || stream.includes('healthcare')) {
    return [
      { id: 'doctor', label: 'Doctor', category: 'Healthcare' },
      { id: 'dentist', label: 'Dentist', category: 'Healthcare' },
      { id: 'clinical_researcher', label: 'Medical Research', category: 'Research' },
      { id: 'healthcare_ai', label: 'Healthcare AI', category: 'AI & Health' },
    ];
  }

  if (stream.includes('commerce') || stream.includes('finance')) {
    return [
      { id: 'accounting_audit', label: 'Accounting', category: 'Finance' },
      { id: 'corporate_finance', label: 'Finance', category: 'Finance' },
      { id: 'investment_banker', label: 'Investment Banking', category: 'Banking' },
      { id: 'business_analytics', label: 'Business Analytics', category: 'Data' },
    ];
  }

  // Default suggestions for general profile
  return [
    { id: 'software_engineering', label: 'Software Engineering', category: 'Technology' },
    { id: 'artificial_intelligence', label: 'Artificial Intelligence', category: 'AI' },
    { id: 'data_science', label: 'Data Analytics', category: 'Data' },
    { id: 'product_management', label: 'Product Strategy', category: 'Management' },
  ];
}

/**
 * Alias wrapper for getSmartSuggestions to support legacy or contextual callers.
 */
export function getContextualSuggestions(profile: any): SmartSuggestionItem[] {
  return getSmartSuggestions(profile);
}

/**
 * Pure utility function to analyze Skill Gaps between user's current skills and expected career skills.
 * Deterministic and informational only.
 */
export function getSkillGap(profile: any): SkillGapResult {
  const userSkills: string[] = [
    ...(profile?.skills?.technicalSkills || []),
    ...(profile?.skills?.softSkills || []),
  ].map((s) => String(s).toLowerCase());

  const dreamCareer = (profile?.careerGoals?.dreamCareer || '').toLowerCase();
  const stream = (profile?.education?.stream || '').toLowerCase();

  let expectedRaw: string[] = CAREER_EXPECTED_SKILLS[dreamCareer];
  if (!expectedRaw) {
    const key = Object.keys(CAREER_EXPECTED_SKILLS).find(
      (k) => dreamCareer.includes(k) || k.includes(dreamCareer)
    );
    if (key) {
      expectedRaw = CAREER_EXPECTED_SKILLS[key];
    }
  }

  if (!expectedRaw) {
    expectedRaw = DOMAIN_EXPECTED_SKILLS[stream] || [
      'problem_solving',
      'critical_thinking',
      'python',
      'sql',
      'communication',
    ];
  }

  const missingRaw = expectedRaw.filter((s) => !userSkills.includes(s));

  const currentSkills = userSkills.map((s) => getTaxonomyLabel(TECHNICAL_SKILLS, s));
  const expectedSkills = expectedRaw.map((s) => getTaxonomyLabel(TECHNICAL_SKILLS, s));
  const missingSkills = missingRaw.map((s) => getTaxonomyLabel(TECHNICAL_SKILLS, s));

  return {
    currentSkills,
    expectedSkills,
    missingSkills,
  };
}

/**
 * Pure utility function to get top recommended careers derived deterministically from profile.
 */
export function getRecommendedCareers(profile: any): CareerRecommendation[] {
  const dreamCareerId = profile?.careerGoals?.dreamCareer || '';
  const dreamCareerObj = DREAM_CAREERS.find(
    (c) => c.id === dreamCareerId || c.label.toLowerCase() === dreamCareerId.toLowerCase()
  );

  const stream = (profile?.education?.stream || '').toLowerCase();
  const userSkills = profile?.skills?.technicalSkills || [];

  // Deterministic top 3 recommendations based on profile heuristics
  let recs: CareerRecommendation[] = [];

  if (stream.includes('engineering') || stream.includes('stem')) {
    recs = [
      {
        id: dreamCareerId || 'ai_engineer',
        title: dreamCareerObj?.label || 'AI Engineer',
        matchScore: userSkills.length >= 3 ? 95 : 88,
        stars: '★★★★★',
        reason: 'Strong alignment with your STEM background and technical skill selection.',
        category: 'Technology',
      },
      {
        id: 'data_scientist',
        title: 'Data Scientist',
        matchScore: userSkills.length >= 2 ? 91 : 84,
        stars: '★★★★★',
        reason: 'High demand match for analytical modeling & data processing skills.',
        category: 'Data & Analytics',
      },
      {
        id: 'software_engineer',
        title: 'Software Engineer',
        matchScore: 89,
        stars: '★★★★☆',
        reason: 'Core match for full-stack software and algorithmic problem solving.',
        category: 'Software Development',
      },
    ];
  } else if (stream.includes('medicine') || stream.includes('healthcare')) {
    recs = [
      {
        id: dreamCareerId || 'doctor',
        title: dreamCareerObj?.label || 'Doctor / Physician',
        matchScore: 96,
        stars: '★★★★★',
        reason: 'Direct match for medical & clinical healthcare specialization.',
        category: 'Clinical Healthcare',
      },
      {
        id: 'clinical_researcher',
        title: 'Clinical Researcher',
        matchScore: 92,
        stars: '★★★★★',
        reason: 'Strong fit for pharmaceutical trials & medical research objectives.',
        category: 'Medical Research',
      },
      {
        id: 'healthcare_ai',
        title: 'Healthcare AI Specialist',
        matchScore: 87,
        stars: '★★★★☆',
        reason: 'Emerging interdisciplinary match combining clinical & digital tech.',
        category: 'HealthTech',
      },
    ];
  } else if (stream.includes('commerce') || stream.includes('finance')) {
    recs = [
      {
        id: dreamCareerId || 'financial_analyst',
        title: dreamCareerObj?.label || 'Financial Analyst',
        matchScore: 94,
        stars: '★★★★★',
        reason: 'Strong alignment with finance, valuation, and capital market goals.',
        category: 'Finance',
      },
      {
        id: 'investment_banker',
        title: 'Investment Banker',
        matchScore: 90,
        stars: '★★★★★',
        reason: 'Optimal match for corporate finance & valuation objectives.',
        category: 'Investment Banking',
      },
      {
        id: 'chartered_accountant',
        title: 'Chartered Accountant (CA)',
        matchScore: 88,
        stars: '★★★★☆',
        reason: 'High demand path for audit, compliance, and corporate taxation.',
        category: 'Accounting & Audit',
      },
    ];
  } else {
    recs = [
      {
        id: dreamCareerId || 'software_engineer',
        title: dreamCareerObj?.label || 'Software Engineer',
        matchScore: 92,
        stars: '★★★★★',
        reason: 'Versatile tech path matching career exploration preferences.',
        category: 'Technology',
      },
      {
        id: 'product_manager',
        title: 'Product Manager',
        matchScore: 88,
        stars: '★★★★☆',
        reason: 'Great match for cross-functional strategy & roadmap execution.',
        category: 'Management',
      },
      {
        id: 'ui_ux_designer',
        title: 'UI/UX Designer',
        matchScore: 85,
        stars: '★★★★☆',
        reason: 'Excellent alignment with user experience & design focus.',
        category: 'Design',
      },
    ];
  }

  return recs;
}

/**
 * Pure utility function to generate AI Recommendation Preview for the Finish Step.
 */
export function generateRecommendationPreview(profile: any): CareerRecommendation[] {
  return getRecommendedCareers(profile);
}

/**
 * Pure utility function to generate natural 2-3 sentence AI Profile Summary.
 * Guarantees zero "None", "N/A", "Missing", "Unknown", or "Not Specified" placeholders.
 */
export function generateAISummarySentences(profile: any): string[] {
  const personal = profile?.personal || {};
  const education = profile?.education || {};
  const skills = profile?.skills || {};
  const careerGoals = profile?.careerGoals || {};

  const isValid = (val: any) => {
    if (!val) return false;
    const str = String(val).trim().toLowerCase();
    return (
      str !== '' &&
      str !== 'not specified' &&
      str !== 'none' &&
      str !== 'n/a' &&
      str !== 'missing' &&
      str !== 'unknown'
    );
  };

  const name = isValid(personal.fullName) ? personal.fullName : 'The candidate';

  const statusLabel = isValid(education.studentStatus)
    ? getTaxonomyLabel(STUDENT_STATUSES, education.studentStatus)
    : '';
  const domainLabel = isValid(education.stream)
    ? getTaxonomyLabel(EDUCATION_DOMAINS, education.stream)
    : '';
  const branchLabel = isValid(education.branchSpecialization)
    ? getTaxonomyLabel(EDUCATION_BRANCHES, education.branchSpecialization)
    : '';
  const specLabel = isValid(education.specialization)
    ? getTaxonomyLabel(SPECIALIZATIONS, education.specialization)
    : '';

  const dreamCareerLabel = isValid(careerGoals.dreamCareer)
    ? getTaxonomyLabel(DREAM_CAREERS, careerGoals.dreamCareer)
    : '';
  const industryLabel = isValid(careerGoals.preferredIndustries?.[0])
    ? getTaxonomyLabel(INDUSTRIES, careerGoals.preferredIndustries[0])
    : '';

  const techSkills = (skills.technicalSkills || [])
    .filter(isValid)
    .map((s: string) => getTaxonomyLabel(TECHNICAL_SKILLS, s));

  // Sentence 1: Role & Background
  const roleText = statusLabel ? statusLabel.toLowerCase() : 'learner';
  const specText = specLabel
    ? ` specializing in ${specLabel}`
    : branchLabel
    ? ` studying ${branchLabel}`
    : domainLabel
    ? ` in ${domainLabel}`
    : '';
  const sentence1 = `${name} is a ${roleText}${specText}.`;

  // Sentence 2: Skills & Execution
  const sentence2 =
    techSkills.length > 0
      ? `They excel at building solutions using ${techSkills.slice(0, 3).join(', ')}.`
      : 'They are focused on acquiring high-impact skills for career growth.';

  // Sentence 3: Aspirations
  const sentence3 = dreamCareerLabel
    ? `Their goal is to work as a ${dreamCareerLabel}${industryLabel ? ` in the ${industryLabel} sector` : ''}.`
    : 'They are actively exploring personalized career roadmaps.';

  return [sentence1, sentence2, sentence3];
}
