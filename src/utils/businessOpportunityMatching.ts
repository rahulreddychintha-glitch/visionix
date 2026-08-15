import type {
  IBusinessOpportunity,
  IBusinessProfile,
  IBusinessOpportunityMatch,
} from '../types/business.types';

/**
 * Deterministically evaluates how closely a Business Opportunity matches the user's
 * background, technical competencies, verified skills, and venture preferences.
 *
 * NOTE: UserProfile.skills.verifiedSkills is strictly READ-ONLY.
 */
export function calculateBusinessOpportunityMatch(
  opportunity: IBusinessOpportunity,
  businessProfile: IBusinessProfile | null,
  userSkills: string[] = [],
  verifiedSkills: string[] = [],
  userIndustries: string[] = []
): IBusinessOpportunityMatch {
  const reqSkills = opportunity.requiredSkills || [];
  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim());
  const normalizedVerifiedSkills = verifiedSkills.map((s) => s.toLowerCase().trim());

  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];
  const verifiedMatchingSkills: string[] = [];

  reqSkills.forEach((skill) => {
    const norm = skill.toLowerCase().trim();
    const isVerified = normalizedVerifiedSkills.some(
      (vs) => vs === norm || norm.includes(vs) || vs.includes(norm)
    );
    const isMatched =
      isVerified || normalizedUserSkills.some((us) => us === norm || norm.includes(us) || us.includes(norm));

    if (isMatched) {
      matchingSkills.push(skill);
      if (isVerified) {
        verifiedMatchingSkills.push(skill);
      }
    } else {
      missingSkills.push(skill);
    }
  });

  // Calculate Deadline State
  let deadlineStatus: 'open' | 'closing_soon' | 'passed' | 'no_deadline' = 'no_deadline';
  let daysLeft: number | null = null;

  if (opportunity.deadline) {
    const deadlineDate = new Date(opportunity.deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    daysLeft = diffDays;
    if (diffDays < 0) {
      deadlineStatus = 'passed';
    } else if (diffDays <= 7) {
      deadlineStatus = 'closing_soon';
    } else {
      deadlineStatus = 'open';
    }
  }

  // Calculate Match Score (0 - 100)
  let score = 0;
  const matchReasons: string[] = [];

  // 1. Skill overlap (Max 50 points)
  if (reqSkills.length > 0) {
    const skillRatio = matchingSkills.length / reqSkills.length;
    const skillPoints = Math.round(skillRatio * 50);
    score += skillPoints;
    if (matchingSkills.length > 0) {
      matchReasons.push(`${matchingSkills.length} of ${reqSkills.length} required competencies matched.`);
    }
  } else {
    score += 40;
  }

  // 2. Verified skills bonus (Max 15 points)
  if (verifiedMatchingSkills.length > 0) {
    score += Math.min(15, verifiedMatchingSkills.length * 8);
    matchReasons.push(`Verified proficiency in ${verifiedMatchingSkills.join(', ')}.`);
  }

  // 3. Industry alignment (Max 20 points)
  const combinedIndustries = [
    ...(businessProfile?.interestedIndustries || []),
    ...userIndustries,
  ].map((i) => i.toLowerCase().trim());

  const oppIndustries = (opportunity.industries || []).map((i) => i.toLowerCase().trim());
  const matchingIndustry = oppIndustries.find((oi) =>
    combinedIndustries.some((ci) => ci === oi || oi.includes(ci) || ci.includes(oi))
  );

  if (matchingIndustry || oppIndustries.length === 0) {
    score += 20;
    if (matchingIndustry) {
      matchReasons.push(`Target industry matches ${opportunity.category}.`);
    }
  }

  // 4. Experience & Difficulty Alignment (Max 15 points)
  if (businessProfile?.entrepreneurshipExperience) {
    const exp = businessProfile.entrepreneurshipExperience;
    if (
      (exp === 'Beginner' && opportunity.difficulty === 'Beginner') ||
      (exp === 'Some Experience' && opportunity.difficulty === 'Intermediate') ||
      (exp === 'Experienced' && opportunity.difficulty === 'Advanced') ||
      exp === 'Exploring'
    ) {
      score += 15;
      matchReasons.push(`Aligned with ${opportunity.difficulty.toLowerCase()} eligibility level.`);
    } else {
      score += 8;
    }
  } else {
    score += 10;
  }

  // Clamp score between 20 and 99
  const finalScore = Math.max(20, Math.min(99, score));

  if (matchReasons.length === 0) {
    matchReasons.push(`Open to applicants in the ${opportunity.category} domain.`);
  }

  return {
    totalRequired: reqSkills.length,
    matchedCount: matchingSkills.length,
    matchingSkills,
    missingSkills,
    verifiedMatchingSkills,
    matchScore: finalScore,
    matchReasons,
    deadlineStatus,
    daysLeft,
  };
}
