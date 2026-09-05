import mongoose from 'mongoose';
import {
  CAREERS_DATA,
  CAREER_SKILL_MAPPING,
  CareerMetadata,
  getCareerCategory,
} from '../constants/careers.constants';
import { CareerRoadmap } from '../models/CareerRoadmap';
import { UserProfile } from '../models/UserProfile';

export type EducationCompatibility =
  | 'Direct Fit'
  | 'Related Transition'
  | 'Requires Additional Education';

export interface ICareerPathItem {
  id: string;
  title: string;
  category: string;
  description: string;
  overview?: string;
  relationshipType: 'alternative' | 'backup';
  matchScore: number; // 0 - 100
  relevanceReason: string;
  sharedSkills: string[];
  transferableSkills: string[];
  skillsToDevelop: string[];
  education: {
    compatibility: EducationCompatibility;
    requiredEducation: string;
    relevantDegrees: string[];
    relevantSubjects: string[];
    transitionRequirement: string;
  };
  learning: {
    recommendedSkill: string;
    hubRoute: string;
  };
  actions: {
    compareRoute: string;
    skillGapRoute: string;
    roadmapRoute: string;
  };
  metrics: {
    salaryRange: string;
    demandLevel: string;
    growthRate: string;
  };
}

export interface IPrimaryCareerInfo {
  id: string;
  title: string;
  category: string;
  description: string;
  education: string;
  skills: string[];
  salaryRange: string;
  demandLevel: string;
  growthRate: string;
  source: 'roadmap' | 'profile' | 'override' | 'none';
}

export interface ICareerPathsResponse {
  hasTargetCareer: boolean;
  primaryCareer: IPrimaryCareerInfo | null;
  alternatives: ICareerPathItem[];
  backupPaths: ICareerPathItem[];
  factorsExplanation: {
    domain: string;
    skills: string;
    transferableSkills: string;
    education: string;
    learning: string;
  };
  disclaimer: string;
  lastUpdated: string;
}

// Deterministic Allied Domain Mapping
const ALLIED_DOMAINS: Record<string, string[]> = {
  Technology: ['Engineering', 'Science', 'Arts & Design', 'Business & Finance'],
  Healthcare: ['Science', 'Community & Social Services', 'Fitness & Sports'],
  Education: ['Community & Social Services', 'Media & Entertainment', 'Science'],
  Science: ['Healthcare', 'Engineering', 'Agriculture', 'Technology'],
  Engineering: ['Technology', 'Science', 'Aviation', 'Vocational / Technical Trades'],
  'Arts & Design': ['Media & Entertainment', 'Technology', 'Marketing'],
  Aviation: ['Engineering', 'Defence', 'Technology'],
  Law: ['Government', 'Business & Finance', 'Community & Social Services'],
  'Business & Finance': ['Technology', 'Law', 'Hospitality & Tourism'],
  'Hospitality & Tourism': ['Business & Finance', 'Media & Entertainment'],
  'Media & Entertainment': ['Arts & Design', 'Business & Finance', 'Technology'],
  Agriculture: ['Science', 'Engineering', 'Business & Finance'],
  Government: ['Law', 'Defence', 'Community & Social Services'],
  Defence: ['Government', 'Aviation', 'Engineering'],
  'Vocational / Technical Trades': ['Engineering', 'Technology'],
  'Fitness & Sports': ['Healthcare', 'Education'],
  'Community & Social Services': ['Healthcare', 'Education', 'Government'],
};

// General Transferable Skills recognized across multiple professional fields
const GENERAL_TRANSFERABLE_SKILLS = [
  'Critical Thinking',
  'Problem Solving',
  'Communication',
  'Analytical Thinking',
  'Leadership',
  'Teamwork',
  'Project Management',
  'Presentation',
  'Decision Making',
  'Active Listening',
  'Writing',
  'Math',
  'Research',
];

export class CareerPathsService {
  /**
   * Deterministically generates tailored Alternative Careers and Backup Career Paths
   * based on the student's authoritative primary career, education, and skills.
   */
  public static async getCareerPaths(
    userId: string,
    careerIdOverride?: string
  ): Promise<ICareerPathsResponse> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Fetch user data in parallel
    const [roadmapDoc, userProfile] = await Promise.all([
      CareerRoadmap.findOne({ userId: userObjectId }).sort({ updatedAt: -1 }),
      UserProfile.findOne({ userId: userObjectId }),
    ]);

    // 2. Resolve Primary Career
    let primaryCareer: IPrimaryCareerInfo | null = null;

    if (careerIdOverride) {
      const matched = CAREERS_DATA.find(
        (c) =>
          c.id.toLowerCase() === careerIdOverride.toLowerCase() ||
          c.title.toLowerCase() === careerIdOverride.toLowerCase().replace(/_/g, ' ')
      );
      if (matched) {
        primaryCareer = {
          id: matched.id,
          title: matched.title,
          category: matched.category,
          description: matched.description,
          education: matched.education,
          skills: matched.skills,
          salaryRange: matched.salaryRange,
          demandLevel: matched.demandLevel,
          growthRate: matched.growthRate,
          source: 'override',
        };
      }
    }

    if (!primaryCareer && roadmapDoc?.careerId) {
      const matched = CAREERS_DATA.find(
        (c) =>
          c.id.toLowerCase() === roadmapDoc.careerId.toLowerCase() ||
          c.title.toLowerCase() === roadmapDoc.careerTitle.toLowerCase()
      );
      primaryCareer = {
        id: roadmapDoc.careerId,
        title: roadmapDoc.careerTitle,
        category: matched?.category || 'Active Roadmap Career',
        description: matched?.description || `Target career from active career roadmap.`,
        education: matched?.education || `Bachelor's degree or professional qualification in field.`,
        skills: matched?.skills || CAREER_SKILL_MAPPING[roadmapDoc.careerId] || ['Problem Solving', 'Communication'],
        salaryRange: matched?.salaryRange || 'Competitive Market Rate',
        demandLevel: matched?.demandLevel || 'High Demand',
        growthRate: matched?.growthRate || '+12% (Steady Growth)',
        source: 'roadmap',
      };
    }

    if (!primaryCareer && userProfile?.careerGoals?.dreamCareer) {
      const dream = userProfile.careerGoals.dreamCareer;
      const matched = CAREERS_DATA.find(
        (c) =>
          c.title.toLowerCase() === dream.toLowerCase() ||
          c.id.toLowerCase() === dream.toLowerCase().replace(/\s+/g, '_')
      );
      if (matched) {
        primaryCareer = {
          id: matched.id,
          title: matched.title,
          category: matched.category,
          description: matched.description,
          education: matched.education,
          skills: matched.skills,
          salaryRange: matched.salaryRange,
          demandLevel: matched.demandLevel,
          growthRate: matched.growthRate,
          source: 'profile',
        };
      }
    }

    // If no target career can be resolved, return safe empty state directing student to exploration
    if (!primaryCareer) {
      return {
        hasTargetCareer: false,
        primaryCareer: null,
        alternatives: [],
        backupPaths: [],
        factorsExplanation: {
          domain: 'Career category and domain alignment to target pathways.',
          skills: 'Technical and methodological skills shared between careers.',
          transferableSkills: 'Existing foundational and soft competencies that apply across roles.',
          education: 'Current academic level, stream, and degree compatibility.',
          learning: 'Targeted course modules to bridge specific skill differences.',
        },
        disclaimer:
          'These alternative and backup career pathways are educational exploration options derived from profile alignment and curriculum relationships. They do not constitute hiring predictions, salary guarantees, or job placement assurances.',
        lastUpdated: new Date().toISOString(),
      };
    }

    // 3. Extract Student Skills and Education Profile
    const studentVerifiedSkills: string[] = [];
    if (userProfile?.skills?.verifiedSkills) {
      userProfile.skills.verifiedSkills.forEach((s: any) => {
        const name = typeof s === 'string' ? s : s?.name;
        if (name && !studentVerifiedSkills.includes(name)) {
          studentVerifiedSkills.push(name);
        }
      });
    }

    const studentTechnicalSkills: string[] = userProfile?.skills?.technicalSkills || [];
    const studentSoftSkills: string[] = userProfile?.skills?.softSkills || [];
    const allStudentSkills = Array.from(
      new Set([...studentVerifiedSkills, ...studentTechnicalSkills, ...studentSoftSkills])
    );

    const studentEducation = userProfile?.education || {};
    const primarySkillsSet = new Set(primaryCareer.skills.map((s) => s.toLowerCase()));

    // 4. Evaluate Candidates from CAREERS_DATA (excluding primary career)
    interface ScoredCandidate {
      career: CareerMetadata;
      sharedSkills: string[];
      transferableSkills: string[];
      skillsToDevelop: string[];
      educationFit: EducationCompatibility;
      transitionRequirement: string;
      relevanceReason: string;
      matchScore: number;
      categoryScore: number;
      isSameCategory: boolean;
      isAlliedCategory: boolean;
    }

    const candidatePool: ScoredCandidate[] = [];

    for (const c of CAREERS_DATA) {
      if (c.id.toLowerCase() === primaryCareer.id.toLowerCase()) continue;
      if (c.title.toLowerCase() === primaryCareer.title.toLowerCase()) continue;

      const candidateSkills = c.skills || [];

      // A. Shared Skills (intersection of primary career skills & candidate career skills)
      const sharedSkills = candidateSkills.filter((s) => primarySkillsSet.has(s.toLowerCase()));

      // B. Transferable Skills (student's actual verified/reported skills that match candidate skills)
      const transferableFromStudent = candidateSkills.filter((s) =>
        allStudentSkills.some((us) => us.toLowerCase() === s.toLowerCase())
      );
      // General cross-functional transferable skills present in candidate
      const generalTransferable = candidateSkills.filter((s) =>
        GENERAL_TRANSFERABLE_SKILLS.some((g) => g.toLowerCase() === s.toLowerCase())
      );
      const combinedTransferable = Array.from(
        new Set([...transferableFromStudent, ...generalTransferable])
      );

      // C. Skills to Develop (candidate skills not shared with primary and not yet possessed by student)
      const skillsToDevelop = candidateSkills.filter(
        (s) =>
          !primarySkillsSet.has(s.toLowerCase()) &&
          !allStudentSkills.some((us) => us.toLowerCase() === s.toLowerCase())
      );

      // D. Domain & Category Affinity
      const isSameCategory = c.category.toLowerCase() === primaryCareer.category.toLowerCase();
      const isAlliedCategory = (ALLIED_DOMAINS[primaryCareer.category] || []).some(
        (allied) => allied.toLowerCase() === c.category.toLowerCase()
      );

      let categoryScore = 10;
      if (isSameCategory) categoryScore = 40;
      else if (isAlliedCategory) categoryScore = 25;

      // E. Skill Overlap Score (up to 35 points)
      const skillOverlapRatio = candidateSkills.length > 0 ? sharedSkills.length / candidateSkills.length : 0;
      const skillScore = Math.round(skillOverlapRatio * 35);

      // F. Transferable Skills Score (up to 15 points)
      const transferScore = Math.min(combinedTransferable.length * 5, 15);

      // G. Education Compatibility Assessment
      const { fit: educationFit, requirement: transitionRequirement } =
        this.evaluateEducationCompatibility(studentEducation, c, primaryCareer);

      let educationScore = 5;
      if (educationFit === 'Direct Fit') educationScore = 10;
      else if (educationFit === 'Related Transition') educationScore = 7;
      else educationScore = 3;

      const totalScore = Math.min(categoryScore + skillScore + transferScore + educationScore, 100);

      // Grounded Reason Generator
      const relevanceReason = this.generateRelevanceReason(
        c,
        primaryCareer,
        sharedSkills,
        combinedTransferable,
        isSameCategory,
        isAlliedCategory
      );

      candidatePool.push({
        career: c,
        sharedSkills,
        transferableSkills: combinedTransferable,
        skillsToDevelop,
        educationFit,
        transitionRequirement,
        relevanceReason,
        matchScore: totalScore,
        categoryScore,
        isSameCategory,
        isAlliedCategory,
      });
    }

    // 5. Separate into Alternative Careers and Backup Career Paths (Strictly Disjoint)
    // --------------------------------------------------------------------------------

    // A) Alternative Careers: Closely related in same category or immediate allied domain with high shared skills
    const alternativeCandidates = candidatePool
      .filter((item) => item.isSameCategory || (item.isAlliedCategory && item.sharedSkills.length >= 2))
      .sort((a, b) => b.matchScore - a.matchScore);

    const selectedAlternatives = alternativeCandidates.slice(0, 4);
    const selectedAlternativeIds = new Set(selectedAlternatives.map((a) => a.career.id));

    // B) Backup Career Paths: Practical alternative directions / pivots sharing transferable skills
    // Strictly disjoint from selected alternatives
    const backupCandidates = candidatePool
      .filter((item) => !selectedAlternativeIds.has(item.career.id))
      .sort((a, b) => {
        // Prioritize transferable skills count and practical pivot viability
        const aPivotScore = a.transferableSkills.length * 10 + a.matchScore;
        const bPivotScore = b.transferableSkills.length * 10 + b.matchScore;
        return bPivotScore - aPivotScore;
      });

    const selectedBackups = backupCandidates.slice(0, 3);

    // 6. Format Response DTOs
    const formatItem = (
      item: ScoredCandidate,
      relationshipType: 'alternative' | 'backup'
    ): ICareerPathItem => {
      const recommendedSkill =
        item.skillsToDevelop[0] || item.career.skills[0] || 'Foundational Principles';

      return {
        id: item.career.id,
        title: item.career.title,
        category: item.career.category,
        description: item.career.description,
        overview: item.career.overview,
        relationshipType,
        matchScore: item.matchScore,
        relevanceReason: item.relevanceReason,
        sharedSkills: item.sharedSkills,
        transferableSkills: item.transferableSkills,
        skillsToDevelop: item.skillsToDevelop,
        education: {
          compatibility: item.educationFit,
          requiredEducation: item.career.education,
          relevantDegrees: item.career.relevantDegrees || [],
          relevantSubjects: item.career.relevantSubjects || [],
          transitionRequirement: item.transitionRequirement,
        },
        learning: {
          recommendedSkill,
          hubRoute: `/learning-hub?career=${item.career.id}`,
        },
        actions: {
          compareRoute: `/compare?ids=${primaryCareer.id},${item.career.id}`,
          skillGapRoute: `/skill-gap`,
          roadmapRoute: `/roadmap`,
        },
        metrics: {
          salaryRange: item.career.salaryRange,
          demandLevel: item.career.demandLevel,
          growthRate: item.career.growthRate,
        },
      };
    };

    return {
      hasTargetCareer: true,
      primaryCareer,
      alternatives: selectedAlternatives.map((item) => formatItem(item, 'alternative')),
      backupPaths: selectedBackups.map((item) => formatItem(item, 'backup')),
      factorsExplanation: {
        domain:
          'Evaluates industry category and sub-discipline proximity to ensure recommendations reside in closely related practice areas.',
        skills:
          'Identifies technical tools, operational methods, and core competencies shared directly between your primary choice and alternative fields.',
        transferableSkills:
          'Highlights non-domain specific strengths (problem solving, critical thinking, communication, analytical modeling) that carry into new roles.',
        education:
          'Assesses degree, stream, and academic requirements to determine whether a transition requires supplemental study or fits your current track.',
        learning:
          'Connects directly to Visionix course modules and curriculum milestones to help you acquire missing skills systematically.',
      },
      disclaimer:
        'These alternative and backup career pathways are educational exploration options derived from profile alignment and curriculum relationships. They do not constitute hiring predictions, salary guarantees, or job placement assurances.',
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Deterministically evaluates academic compatibility between student's profile and candidate career.
   */
  private static evaluateEducationCompatibility(
    studentEducation: any,
    candidateCareer: CareerMetadata,
    primaryCareer: IPrimaryCareerInfo
  ): { fit: EducationCompatibility; requirement: string } {
    const candidateEdu = (candidateCareer.education || '').toLowerCase();
    const studentStream = (studentEducation?.stream || '').toLowerCase();
    const studentBranch = (studentEducation?.branchSpecialization || '').toLowerCase();
    const studentLevel = (studentEducation?.level || '').toLowerCase();

    // 1. High specialization / strict licensure fields (Medicine, Surgery, Dentistry, Law Judiciary)
    const strictMedical = ['doctor', 'surgeon', 'dentist'];
    if (strictMedical.includes(candidateCareer.id.toLowerCase())) {
      if (studentBranch.includes('mbbs') || studentStream.includes('pcb') || studentStream.includes('medical')) {
        return {
          fit: 'Direct Fit',
          requirement: 'Direct Fit: Aligns with medical sciences curriculum and MBBS qualification track.',
        };
      }
      return {
        fit: 'Requires Additional Education',
        requirement: `Requires formal admission into Bachelor of Medicine (MBBS) through entrance examination.`,
      };
    }

    // 2. Pure Engineering disciplines
    const isEngineeringCareer = candidateCareer.category.toLowerCase() === 'engineering' || candidateCareer.id.includes('engineer');
    if (isEngineeringCareer) {
      if (studentStream.includes('pcm') || studentStream.includes('engineering') || studentBranch.includes('tech') || studentBranch.includes('engineering')) {
        return {
          fit: 'Direct Fit',
          requirement: 'Direct Fit: Directly compatible with STEM/Engineering academic tracks.',
        };
      }
      if (primaryCareer.category.toLowerCase() === 'technology' || primaryCareer.category.toLowerCase() === 'science') {
        return {
          fit: 'Related Transition',
          requirement: 'Related Transition: Transition supported by foundational quantitative and technical coursework.',
        };
      }
      return {
        fit: 'Requires Additional Education',
        requirement: `Requires enrolling in an accredited Bachelor of Engineering (B.E./B.Tech) program.`,
      };
    }

    // 3. Technology & Software
    if (candidateCareer.category.toLowerCase() === 'technology') {
      if (studentStream.includes('cs') || studentStream.includes('computer') || studentBranch.includes('cs') || studentBranch.includes('it') || studentStream.includes('pcm')) {
        return {
          fit: 'Direct Fit',
          requirement: 'Direct Fit: Fits your current technology and computational coursework track.',
        };
      }
      return {
        fit: 'Related Transition',
        requirement: 'Related Transition: Accessible via industry certification, bootcamp training, or elective computer science coursework.',
      };
    }

    // 4. Business, Finance & Management
    if (candidateCareer.category.toLowerCase() === 'business & finance') {
      if (studentStream.includes('commerce') || studentStream.includes('business') || studentBranch.includes('mba') || studentBranch.includes('finance')) {
        return {
          fit: 'Direct Fit',
          requirement: 'Direct Fit: Aligns with commerce, business economics, and quantitative management studies.',
        };
      }
      return {
        fit: 'Related Transition',
        requirement: 'Related Transition: Open to graduates of various disciplines with supplemental business or MBA coursework.',
      };
    }

    // 5. General fallback
    if (candidateCareer.category.toLowerCase() === primaryCareer.category.toLowerCase()) {
      return {
        fit: 'Direct Fit',
        requirement: 'Direct Fit: Shares academic prerequisites and core discipline pathways with your primary career.',
      };
    }

    return {
      fit: 'Related Transition',
      requirement: `Related Transition: Requires complementary study or specialized certification in ${candidateCareer.category}.`,
    };
  }

  /**
   * Generates a clear, grounded reason why a candidate career is recommended as an alternative or backup.
   */
  private static generateRelevanceReason(
    candidate: CareerMetadata,
    primary: IPrimaryCareerInfo,
    sharedSkills: string[],
    transferableSkills: string[],
    isSameCategory: boolean,
    isAlliedCategory: boolean
  ): string {
    if (isSameCategory && sharedSkills.length >= 2) {
      return `Shares core competencies in ${sharedSkills.slice(0, 3).join(', ')} within the ${candidate.category} domain.`;
    }

    if (isSameCategory) {
      return `Operates within the same ${candidate.category} domain with overlapping professional pathways.`;
    }

    if (isAlliedCategory && sharedSkills.length >= 1) {
      return `Allied field in ${candidate.category} leveraging your primary competencies in ${sharedSkills[0]}.`;
    }

    if (transferableSkills.length >= 2) {
      return `Practical alternative applying transferable strengths in ${transferableSkills.slice(0, 2).join(' and ')}.`;
    }

    return `Related career option within ${candidate.category} offering a viable transition path.`;
  }
}
