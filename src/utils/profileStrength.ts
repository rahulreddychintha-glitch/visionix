export interface ProfileStrengthBreakdown {
  basicInformation: number;
  education: number;
  experience: number;
  interests: number;
  skills: number;
  languages: number;
  careerGoals: number;
  portfolio: number;
  preferences: number;
}

export interface ProfileStrengthResult {
  score: number;
  label: string;
  blocks: string;
  breakdown: ProfileStrengthBreakdown;
}

/**
 * Pure utility function to calculate AI Profile Strength based on onboarding profile completeness.
 * Fully deterministic, no React dependency, reusable across Dashboard, Recommendation Engine, and Assistant.
 */
export function calculateProfileStrength(profile: any): ProfileStrengthResult {
  if (!profile) {
    return {
      score: 0,
      label: 'Great Start',
      blocks: '□□□□□□□□□□',
      breakdown: {
        basicInformation: 0,
        education: 0,
        experience: 0,
        interests: 0,
        skills: 0,
        languages: 0,
        careerGoals: 0,
        portfolio: 0,
        preferences: 0,
      },
    };
  }

  const personal = profile.personal || {};
  const education = profile.education || {};
  const interests = profile.interests || {};
  const skills = profile.skills || {};
  const careerGoals = profile.careerGoals || {};

  // 1. Basic Information (Name) - Mandatory
  const hasName = personal.fullName && personal.fullName.trim().length >= 2;
  const basicScore = hasName ? 30 : 0;

  // 2. Education (Stream) - Mandatory; Level and branchSpecialization are optional bonus fields
  const hasStream = !!education.stream;
  const hasLevel = !!education.level;
  const hasSpecialization = !!education.branchSpecialization;

  const eduMandatoryScore = hasStream ? 30 : 0;
  const eduOptionalScore = (hasLevel ? 5 : 0) + (hasSpecialization ? 5 : 0);

  // 3. Career goals (dreamCareer) - Mandatory
  const hasDreamCareer = !!careerGoals.dreamCareer;
  const careerMandatoryScore = hasDreamCareer ? 20 : 0;

  // 4. Interests (Optional bonus)
  const hasInterests = interests.careerInterests && interests.careerInterests.length > 0;
  const interestsScore = hasInterests ? 5 : 0;

  // 5. Skills (Optional bonus)
  const hasSkills = skills.technicalSkills && skills.technicalSkills.length > 0;
  const skillsScore = hasSkills ? 5 : 0;

  // Calculate overall score (80% mandatory + 20% optional bonus)
  const score = basicScore + eduMandatoryScore + careerMandatoryScore + eduOptionalScore + interestsScore + skillsScore;

  const breakdown: ProfileStrengthBreakdown = {
    basicInformation: hasName ? 100 : 0,
    education: hasStream ? 100 : 0,
    experience: 100,
    interests: hasInterests ? 100 : 0,
    skills: hasSkills ? 100 : 0,
    languages: 100,
    careerGoals: hasDreamCareer ? 100 : 0,
    portfolio: 100,
    preferences: 100,
  };

  let label = 'Great Start';
  if (score >= 90) {
    label = 'Excellent Profile';
  } else if (score >= 60) {
    label = 'Almost Complete';
  }

  const filledCount = Math.round(score / 10);
  const blocks = '■'.repeat(filledCount) + '□'.repeat(10 - filledCount);

  return {
    score,
    label,
    blocks,
    breakdown,
  };
}
