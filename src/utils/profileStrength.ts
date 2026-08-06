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
  const experience = profile.experience || {};
  const interests = profile.interests || {};
  const skills = profile.skills || {};
  const careerGoals = profile.careerGoals || {};
  const learningPreferences = profile.learningPreferences || {};
  const portfolioLinks = skills.portfolioLinks || {};

  // 1. Basic Information (Name, Location, Gender)
  let basicScore = 0;
  if (personal.fullName && personal.fullName.trim().length >= 2) basicScore += 50;
  if (personal.gender || personal.country || personal.city || personal.state) basicScore += 50;

  // 2. Education Profile
  let eduScore = 0;
  if (education.level) eduScore += 30;
  if (education.studentStatus) eduScore += 30;
  if (education.stream) eduScore += 25;
  if (education.branchSpecialization || education.institution || education.graduationYear) eduScore += 15;

  // 3. Experience Profile
  let expScore = 100;
  const status = education.studentStatus || '';
  const isWorking = status.includes('working') || status.includes('changer') || status.includes('Professional');
  if (isWorking) {
    expScore = 0;
    if (experience.yearsOfExperience || education.currentOccupation || experience.currentRole) expScore += 50;
    if (education.currentOccupation || experience.currentRole) expScore += 50;
  }

  // 4. Interests Profile
  let intScore = 0;
  if (interests.careerInterests && interests.careerInterests.length > 0) intScore += 50;
  if (interests.favouriteSubjects && interests.favouriteSubjects.length > 0) intScore += 50;

  // 5. Skills Profile
  let sklScore = 0;
  if (skills.technicalSkills && skills.technicalSkills.length > 0) sklScore += 60;
  if (skills.softSkills && skills.softSkills.length > 0) sklScore += 40;

  // 6. Languages Profile
  let langScore = 0;
  if (skills.languages && skills.languages.length > 0) langScore += 100;

  // 7. Career Goals Profile
  let goalScore = 0;
  if (careerGoals.dreamCareer) goalScore += 40;
  if (careerGoals.preferredIndustries && careerGoals.preferredIndustries.length > 0) goalScore += 30;
  if (careerGoals.careerObjectives) goalScore += 30;

  // 8. Portfolio & Links
  let portScore = 0;
  if (portfolioLinks.github) portScore += 35;
  if (portfolioLinks.linkedin) portScore += 35;
  if (portfolioLinks.portfolio || portfolioLinks.other) portScore += 30;

  // 9. Preferences & Confidence
  let prefScore = 0;
  if (learningPreferences.learningStyle || learningPreferences.learningPace) prefScore += 40;
  if (learningPreferences.weeklyStudyTime !== undefined && learningPreferences.weeklyStudyTime !== '') prefScore += 30;
  if (careerGoals.careerConfidence !== undefined && careerGoals.careerConfidence !== null) prefScore += 30;

  const breakdown: ProfileStrengthBreakdown = {
    basicInformation: Math.min(100, basicScore),
    education: Math.min(100, eduScore),
    experience: Math.min(100, expScore),
    interests: Math.min(100, intScore),
    skills: Math.min(100, sklScore),
    languages: Math.min(100, langScore),
    careerGoals: Math.min(100, goalScore),
    portfolio: Math.min(100, portScore),
    preferences: Math.min(100, prefScore),
  };

  // Weighted overall calculation
  const weightedScore =
    breakdown.basicInformation * 0.10 +
    breakdown.education * 0.20 +
    breakdown.interests * 0.15 +
    breakdown.skills * 0.20 +
    breakdown.languages * 0.05 +
    breakdown.careerGoals * 0.15 +
    breakdown.experience * 0.05 +
    breakdown.portfolio * 0.05 +
    breakdown.preferences * 0.05;

  const score = Math.min(100, Math.max(0, Math.round(weightedScore)));

  let label = 'Great Start';
  if (score >= 80) {
    label = 'Excellent Profile';
  } else if (score >= 45) {
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
