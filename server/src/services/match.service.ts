import { IPersonalizationContext } from './personalization.service';

export interface ICareerMatchResult {
  careerId: string;
  careerTitle: string;
  matchScore: number;
  matchLevel: 'Strong' | 'Moderate' | 'Low' | 'Needs Development';
  isProfileComplete: boolean;
  strengths: string[];
  skillsYouHave: string[];
  skillGaps: string[];
  improvementSuggestions: string[];
}

export class MatchService {
  /**
   * Deterministically calculates career match details.
   */
  public static calculateMatch(
    career: any,
    ctx: IPersonalizationContext
  ): ICareerMatchResult {
    const discipline = ctx.discipline || '';
    const dreamCareer = ctx.dreamCareer || '';
    const techSkills = ctx.skills?.technicalSkills || [];
    const softSkills = ctx.skills?.softSkills || [];
    const careerInterests = ctx.interests?.careerInterests || [];

    // Profile completeness check
    const isProfileComplete = !(
      (!discipline || discipline === 'Not Specified' || discipline === 'General Studies') &&
      techSkills.length === 0 &&
      softSkills.length === 0 &&
      careerInterests.length === 0 &&
      !dreamCareer
    );

    if (!isProfileComplete) {
      return {
        careerId: career.id,
        careerTitle: career.title,
        matchScore: 0,
        matchLevel: 'Needs Development',
        isProfileComplete: false,
        strengths: [],
        skillsYouHave: [],
        skillGaps: [],
        improvementSuggestions: []
      };
    }

    let eduScore = 0;
    const lowerStream = discipline.toLowerCase();
    const lowerCategory = career.category.toLowerCase();
    const lowerTitle = career.title.toLowerCase();

    // 1. Education stream match (Max 35 points)
    if (discipline && discipline !== 'Not Specified' && discipline !== 'General Studies') {
      if (lowerCategory.includes(lowerStream) || lowerStream.includes(lowerCategory)) {
        eduScore = 35;
      } else if (lowerTitle.includes(lowerStream) || lowerStream.includes(lowerTitle)) {
        eduScore = 25;
      }
    }

    // 2. Skills match (Max 45 points)
    const verifiedNames = (ctx.skills?.verifiedSkills || []).map((vs: any) => typeof vs === 'string' ? vs : vs.name);
    const userSkills = Array.from(new Set([...techSkills, ...softSkills, ...verifiedNames])).map(s => s.toLowerCase());
    const matchingSkills = career.skills.filter((cs: string) => 
      userSkills.some(us => us === cs.toLowerCase() || cs.toLowerCase().includes(us) || us.includes(cs.toLowerCase()))
    );
    const gaps = career.skills.filter((cs: string) => !matchingSkills.includes(cs));
    
    let skillsScore = 0;
    if (career.skills.length > 0) {
      skillsScore = Math.round((matchingSkills.length / career.skills.length) * 45);
    }

    // 3. Interests alignment (Max 10 points)
    const hasInterestMatch = careerInterests.some((i: string) => 
      i.toLowerCase() === lowerTitle || lowerTitle.includes(i.toLowerCase())
    );
    const interestScore = hasInterestMatch ? 10 : 0;

    // 4. Dream career alignment (Max 10 points)
    const dreamScore = (dreamCareer && dreamCareer.toLowerCase() === lowerTitle) ? 10 : 0;

    const matchScore = eduScore + skillsScore + interestScore + dreamScore;

    // Classify Match Level
    let matchLevel: ICareerMatchResult['matchLevel'] = 'Needs Development';
    if (matchScore >= 75) {
      matchLevel = 'Strong';
    } else if (matchScore >= 45) {
      matchLevel = 'Moderate';
    } else if (matchScore >= 15) {
      matchLevel = 'Low';
    }

    // Strengths
    const strengths: string[] = [];
    if (dreamScore > 0) {
      strengths.push(`Matches your stated dream career ambition.`);
    }
    if (eduScore === 35) {
      strengths.push(`Direct alignment with your field of study in ${discipline}.`);
    } else if (eduScore > 0) {
      strengths.push(`Broad academic exposure to this industry category.`);
    }
    // Check verified skills vs self-reported skills
    const verifiedSkillsList = (ctx.skills.verifiedSkills || []).map((vs: any) =>
      (typeof vs === 'string' ? vs : vs.name).toLowerCase()
    );
    const matchingVerifiedSkills = matchingSkills.filter((ms: string) =>
      verifiedSkillsList.some((vs: string) => vs === ms.toLowerCase() || ms.toLowerCase().includes(vs) || vs.includes(ms.toLowerCase()))
    );
    const matchingProfileSkills = matchingSkills.filter((ms: string) =>
      !matchingVerifiedSkills.some((vs: string) => vs.toLowerCase() === ms.toLowerCase())
    );

    if (matchingVerifiedSkills.length > 0) {
      strengths.push(`Possess verified skills in ${matchingVerifiedSkills.slice(0, 3).join(', ')}.`);
    }
    if (matchingProfileSkills.length > 0) {
      strengths.push(`Profile background includes skills in ${matchingProfileSkills.slice(0, 3).join(', ')}.`);
    }
    if (interestScore > 0) {
      strengths.push(`Matches your stated career goals and interests.`);
    }
    if (strengths.length === 0) {
      strengths.push(`General compatibility with the ${career.category} industry.`);
    }

    // Skill Gaps
    const skillGaps = gaps.map((g: string) => `Missing career skill: ${g}`);

    // Improvement suggestions
    const improvementSuggestions: string[] = [];
    if (gaps.length > 0) {
      improvementSuggestions.push(`Acquire and verify missing career skills: ${gaps.join(', ')}.`);
    }
    if (eduScore === 0) {
      improvementSuggestions.push(`Bridge domain knowledge gap: Explore foundation materials or courses in ${career.category}.`);
    }
    if (matchingSkills.length === 0) {
      improvementSuggestions.push(`Hands-on projects: Develop simple practice projects to build initial comfort with ${career.title} tools.`);
    }
    if (improvementSuggestions.length === 0) {
      improvementSuggestions.push(`Continuous learning: Stay updated with standard patterns in the industry.`);
    }

    return {
      careerId: career.id,
      careerTitle: career.title,
      matchScore,
      matchLevel,
      isProfileComplete: true,
      strengths,
      skillsYouHave: matchingSkills,
      skillGaps,
      improvementSuggestions
    };
  }
}
