import type { IBusinessIdea, IBusinessProfile, ISkillMatchResult } from '../types/business.types';

/**
 * Deterministically evaluates how closely a Business Idea matches the user's
 * background, technical competencies, verified skills, and entrepreneurship preferences.
 *
 * NOTE: UserProfile.skills.verifiedSkills is strictly READ-ONLY.
 */
export function calculateBusinessIdeaMatch(
  idea: IBusinessIdea,
  businessProfile: IBusinessProfile | null,
  userSkills: string[] = [],
  verifiedSkills: string[] = [],
  userIndustries: string[] = []
): ISkillMatchResult {
  const reqSkills = idea.requiredSkills || [];
  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim());
  const normalizedVerifiedSkills = verifiedSkills.map((s) => s.toLowerCase().trim());

  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];
  const verifiedMatchingSkills: string[] = [];

  reqSkills.forEach((skill) => {
    const norm = skill.toLowerCase().trim();
    const isVerified = normalizedVerifiedSkills.some((vs) => vs === norm || norm.includes(vs) || vs.includes(norm));
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

  // Calculate Match Score (0 - 100)
  let score = 0;
  const matchReasons: string[] = [];

  // 1. Skill overlap (Max 55 points)
  if (reqSkills.length > 0) {
    const skillRatio = matchingSkills.length / reqSkills.length;
    const skillPoints = Math.round(skillRatio * 55);
    score += skillPoints;
    if (matchingSkills.length > 0) {
      matchReasons.push(`${matchingSkills.length} of ${reqSkills.length} required skills match your background.`);
    }
  } else {
    score += 40;
  }

  // 2. Verified skills bonus (Max 15 points)
  if (verifiedMatchingSkills.length > 0) {
    score += Math.min(15, verifiedMatchingSkills.length * 8);
    matchReasons.push(`Verified competency in ${verifiedMatchingSkills.join(', ')}.`);
  }

  // 3. Industry alignment (Max 15 points)
  const combinedIndustries = [
    ...(businessProfile?.interestedIndustries || []),
    ...userIndustries,
  ].map((i) => i.toLowerCase().trim());

  const industryMatches = combinedIndustries.some(
    (ci) => ci === idea.industry.toLowerCase().trim() || idea.industry.toLowerCase().includes(ci)
  );

  if (industryMatches) {
    score += 15;
    matchReasons.push(`Matches your target industry: ${idea.industry}.`);
  }

  // 4. Experience & Stage Alignment (Max 15 points)
  if (businessProfile?.entrepreneurshipExperience) {
    const exp = businessProfile.entrepreneurshipExperience;
    if (
      (exp === 'Beginner' && idea.difficulty === 'Beginner') ||
      (exp === 'Some Experience' && idea.difficulty === 'Intermediate') ||
      (exp === 'Experienced' && idea.difficulty === 'Advanced') ||
      exp === 'Exploring'
    ) {
      score += 10;
      matchReasons.push(`Fits your ${idea.difficulty.toLowerCase()} venture experience.`);
    } else {
      score += 5;
    }
  } else {
    score += 5;
  }

  if (businessProfile?.preferredStartupStage) {
    score += 5;
  }

  // Clamp score between 10 and 99
  const finalScore = Math.max(15, Math.min(98, score));

  if (matchReasons.length === 0) {
    matchReasons.push(`General compatibility with the ${idea.category} sector.`);
  }

  return {
    totalRequired: reqSkills.length,
    matchedCount: matchingSkills.length,
    matchingSkills,
    missingSkills,
    verifiedMatchingSkills,
    matchScore: finalScore,
    matchReasons,
  };
}
