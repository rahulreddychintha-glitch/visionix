import { IPersonalizationContext } from './personalization.service';
import { CAREERS_DATA, getCareerCategory, CAREER_SKILL_MAPPING } from '../constants/careers.constants';

export interface IRecommendationResult {
  topCareers: Array<{
    id: string;
    title: string;
    matchScore: number;
    stars: string;
    reason: string;
    category: string;
  }>;
  skillGap: {
    currentSkills: string[];
    expectedSkills: string[];
    missingSkills: string[];
  };
  smartSuggestions: Array<{
    id: string;
    label: string;
    category: string;
  }>;
  summarySentences: string[];
}

export class RecommendationService {
  /**
   * Generates recommendation insights from a user's Personalization Context.
   */
  public static async generateRecommendations(ctx: IPersonalizationContext): Promise<IRecommendationResult> {
    const discipline = (ctx.discipline || '').toLowerCase();
    const dreamCareer = ctx.dreamCareer || 'Career Professional';
    const techSkills = ctx.skills.technicalSkills;
    const softSkills = ctx.skills.softSkills;
    const verifiedNames = (ctx.skills.verifiedSkills || []).map((vs: any) => typeof vs === 'string' ? vs : vs.name);
    const allUserSkills = Array.from(new Set([...techSkills, ...softSkills, ...verifiedNames])).map((s) => s.toLowerCase());

    // Domain heuristic recommendations
    let topCareers: IRecommendationResult['topCareers'] = [];
    let smartSuggestions: IRecommendationResult['smartSuggestions'] = [];
    let expectedSkills: string[] = [];

    // Normalize discipline & dream career
    const lowerDiscipline = discipline.toLowerCase();
    const lowerDreamCareer = dreamCareer.toLowerCase();

    // 1. Civil Engineering
    if (lowerDiscipline.includes('civil')) {
      topCareers = [
        {
          id: lowerDreamCareer.replace(/\s+/g, '_') || 'civil_engineer',
          title: dreamCareer || 'Civil Engineer',
          matchScore: allUserSkills.length >= 3 ? 95 : 88,
          stars: '★★★★★',
          reason: `Strong alignment with your civil engineering background and selected targets.`,
          category: 'Civil & Structural',
        },
        {
          id: 'structural_engineer',
          title: 'Structural Engineer',
          matchScore: 91,
          stars: '★★★★★',
          reason: 'High demand match for structural design, concrete structures, and load calculation.',
          category: 'Civil Engineering',
        },
        {
          id: 'construction_manager',
          title: 'Construction Manager',
          matchScore: 86,
          stars: '★★★★☆',
          reason: 'Focuses on site execution, scheduling, project budgeting, and construction safety.',
          category: 'Construction & Management',
        },
      ];
      expectedSkills = ['Civil Engineering', 'CAD', 'AutoCAD', 'Project Management', 'Structural Design'];
      smartSuggestions = [
        { id: 'structural_design', label: 'Structural Design & Analysis', category: 'Civil' },
        { id: 'project_mgmt', label: 'Construction Project Management', category: 'Management' },
        { id: 'environmental_civil', label: 'Environmental Engineering', category: 'Environmental' },
      ];
    }
    // 2. Computer Science / Technology / Software
    else if (
      lowerDiscipline.includes('computer') ||
      lowerDiscipline.includes('software') ||
      lowerDiscipline.includes('information') ||
      lowerDiscipline.includes('artificial') ||
      lowerDiscipline.includes('data science') ||
      lowerDiscipline.includes('cyber') ||
      lowerDiscipline.includes('cloud') ||
      lowerDiscipline.includes('blockchain') ||
      lowerDiscipline.includes('game')
    ) {
      topCareers = [
        {
          id: lowerDreamCareer.replace(/\s+/g, '_') || 'software_engineer',
          title: dreamCareer || 'Software Engineer',
          matchScore: allUserSkills.length >= 3 ? 95 : 88,
          stars: '★★★★★',
          reason: 'Strong alignment with your STEM background and technical skill selection.',
          category: 'Technology & Software',
        },
        {
          id: 'data_scientist',
          title: 'Data Scientist',
          matchScore: 91,
          stars: '★★★★★',
          reason: 'High demand match for analytical modeling and data processing.',
          category: 'Data & Analytics',
        },
        {
          id: 'cloud_architect',
          title: 'Cloud Systems Architect',
          matchScore: 86,
          stars: '★★★★☆',
          reason: 'Matches infrastructure, scalable network, and backend preferences.',
          category: 'Infrastructure',
        },
      ];
      expectedSkills = ['Python', 'Problem Solving', 'SQL', 'Git', 'System Design'];
      smartSuggestions = [
        { id: 'cs_eng', label: 'Computer Science & AI', category: 'Engineering' },
        { id: 'cloud_devops', label: 'Cloud & DevOps Engineering', category: 'Infrastructure' },
        { id: 'cyber_sec', label: 'Cybersecurity Analyst', category: 'Security' },
      ];
    }
    // 3. Medicine / Healthcare
    else if (
      lowerDiscipline.includes('medicine') ||
      lowerDiscipline.includes('health') ||
      lowerDiscipline.includes('nursing') ||
      lowerDiscipline.includes('pharmacy') ||
      lowerDiscipline.includes('dentistry') ||
      lowerDiscipline.includes('surgery')
    ) {
      topCareers = [
        {
          id: lowerDreamCareer.replace(/\s+/g, '_') || 'medical_practitioner',
          title: dreamCareer || 'Medical Practitioner / Doctor',
          matchScore: 96,
          stars: '★★★★★',
          reason: 'Direct match for healthcare, diagnostic, and clinical specialization.',
          category: 'Healthcare',
        },
        {
          id: 'clinical_researcher',
          title: 'Clinical Research Scientist',
          matchScore: 92,
          stars: '★★★★★',
          reason: 'Strong fit for medical trial methodology & life science research.',
          category: 'Medical Research',
        },
        {
          id: 'healthtech_specialist',
          title: 'HealthTech & BioInformatics Specialist',
          matchScore: 88,
          stars: '★★★★☆',
          reason: 'Interdisciplinary pathway bridging clinical health and digital diagnostics.',
          category: 'HealthTech',
        },
      ];
      expectedSkills = ['Clinical Diagnostics', 'Critical Thinking', 'Patient Communication', 'Medical Ethics'];
      smartSuggestions = [
        { id: 'clinical_medicine', label: 'Clinical Medicine & Surgery', category: 'Healthcare' },
        { id: 'pharmacology', label: 'Pharmacology & Therapeutics', category: 'Pharma' },
        { id: 'public_health', label: 'Public Health Administration', category: 'Healthcare' },
      ];
    }
    // 4. Business / Finance / Commerce
    else if (
      lowerDiscipline.includes('commerce') ||
      lowerDiscipline.includes('finance') ||
      lowerDiscipline.includes('business') ||
      lowerDiscipline.includes('economics') ||
      lowerDiscipline.includes('accounting') ||
      lowerDiscipline.includes('management') ||
      lowerDiscipline.includes('marketing')
    ) {
      topCareers = [
        {
          id: lowerDreamCareer.replace(/\s+/g, '_') || 'financial_analyst',
          title: dreamCareer || 'Financial Analyst',
          matchScore: allUserSkills.length >= 3 ? 95 : 88,
          stars: '★★★★★',
          reason: 'Strong alignment with financial modeling, valuation, and capital markets.',
          category: 'Finance',
        },
        {
          id: 'investment_banker',
          title: 'Investment Banker',
          matchScore: 90,
          stars: '★★★★★',
          reason: 'Optimal match for corporate finance, M&A strategy, and asset management.',
          category: 'Banking',
        },
        {
          id: 'chartered_accountant',
          title: 'Chartered Accountant / Auditor',
          matchScore: 88,
          stars: '★★★★☆',
          reason: 'Core path for financial audit, taxation, and corporate governance.',
          category: 'Accounting',
        },
      ];
      expectedSkills = ['Financial Modeling', 'Excel / Analytics', 'Critical Thinking', 'Corporate Law'];
      smartSuggestions = [
        { id: 'fintech', label: 'FinTech & Digital Banking', category: 'Finance' },
        { id: 'business_analytics', label: 'Business & Financial Analytics', category: 'Data' },
        { id: 'wealth_mgmt', label: 'Wealth & Asset Management', category: 'Investment' },
      ];
    }
    // 5. Arts / Design / Architecture
    else if (
      lowerDiscipline.includes('design') ||
      lowerDiscipline.includes('art') ||
      lowerDiscipline.includes('fashion') ||
      lowerDiscipline.includes('animation') ||
      lowerDiscipline.includes('interior') ||
      lowerDiscipline.includes('architecture')
    ) {
      topCareers = [
        {
          id: lowerDreamCareer.replace(/\s+/g, '_') || 'product_designer',
          title: dreamCareer || 'UI/UX & Product Designer',
          matchScore: 95,
          stars: '★★★★★',
          reason: 'Excellent alignment with user experience, visual hierarchy, and creative prototyping.',
          category: 'Design & Media',
        },
        {
          id: 'creative_director',
          title: 'Creative Brand Director',
          matchScore: 89,
          stars: '★★★★☆',
          reason: 'Great fit for spatial aesthetics, design systems, and brand storytelling.',
          category: 'Creative Arts',
        },
      ];
      expectedSkills = ['Figma / Design Tools', 'User Research', 'Wireframing', 'Visual Prototyping'];
      smartSuggestions = [
        { id: 'ui_ux', label: 'UI/UX Product Design', category: 'Design' },
        { id: 'brand_design', label: 'Brand Strategy & Media', category: 'Creative' },
      ];
    }
    // 6. Law
    else if (lowerDiscipline.includes('law') || lowerDiscipline.includes('legal')) {
      topCareers = [
        {
          id: lowerDreamCareer.replace(/\s+/g, '_') || 'corporate_lawyer',
          title: dreamCareer || 'Corporate Legal Counsel',
          matchScore: 95,
          stars: '★★★★★',
          reason: 'Strong alignment with corporate legal frameworks, compliance, and drafting.',
          category: 'Law & Governance',
        },
        {
          id: 'ip_attorney',
          title: 'Intellectual Property Attorney',
          matchScore: 89,
          stars: '★★★★☆',
          reason: 'High demand match for technology patents, copyright, and trademarks.',
          category: 'Legal',
        },
      ];
      expectedSkills = ['Legal Research', 'Contract Drafting', 'Negotiation', 'Critical Reasoning'];
      smartSuggestions = [
        { id: 'corp_law', label: 'Corporate Law & M&A', category: 'Legal' },
        { id: 'cyber_law', label: 'Cyber Law & IP Protection', category: 'Legal' },
      ];
    }
    // 7. General Fallback & Custom Others
    else {
      topCareers = [
        {
          id: lowerDreamCareer.replace(/\s+/g, '_') || 'career_specialist',
          title: dreamCareer || 'Career Specialist',
          matchScore: 92,
          stars: '★★★★★',
          reason: 'Strong alignment with your profile goals and career exploration preferences.',
          category: 'Professional Excellence',
        },
        {
          id: 'product_manager',
          title: 'Product Manager',
          matchScore: 88,
          stars: '★★★★☆',
          reason: 'Great match for cross-functional strategy, execution, and project leadership.',
          category: 'Management',
        },
      ];
      expectedSkills = ['Problem Solving', 'Strategic Planning', 'Communication', 'Project Management'];
      smartSuggestions = [
        { id: 'prof_dev', label: 'Professional Skills Mastery', category: 'Career' },
        { id: 'leadership', label: 'Leadership & Management', category: 'Management' },
      ];
    }

    // Deduplicate topCareers if dream career title matches other items
    topCareers = topCareers.filter((item, idx) => {
      if (idx === 0) return true;
      return item.title.toLowerCase() !== lowerDreamCareer;
    });

    const missingSkills = expectedSkills.filter(
      (s) => !allUserSkills.some((us) => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))
    );

    const statusText = ctx.studentStatus && ctx.studentStatus !== 'Not Specified' && ctx.studentStatus !== 'Student'
      ? ctx.studentStatus.toLowerCase()
      : 'learner';
    const instText = ctx.institution && ctx.institution !== 'Not Specified'
      ? ` at ${ctx.institution}`
      : '';

    const summarySentences = [
      `${ctx.name} is a ${statusText} pursuing ${ctx.discipline}${instText}.`,
      techSkills.length > 0
        ? `They demonstrate competence in ${techSkills.slice(0, 3).join(', ')}.`
        : 'They are actively building foundational skills in their chosen discipline.',
      ctx.dreamCareer
        ? `Their target ambition is to excel as a ${ctx.dreamCareer}.`
        : 'They are exploring high-impact personalized career pathways.',
    ];

    return {
      topCareers,
      skillGap: {
        currentSkills: techSkills.length > 0 ? techSkills : softSkills,
        expectedSkills,
        missingSkills,
      },
      smartSuggestions,
      summarySentences,
    };
  }

  /**
   * Evaluates the user context dynamically against the 75 career options in CAREERS_DATA
   * and returns a ranked recommendation list with deterministic reason explanations.
   */
  public static async getRecommendedCareers(ctx: IPersonalizationContext): Promise<{ careers: any[]; isProfileComplete: boolean }> {
    const discipline = ctx.discipline || '';
    const dreamCareer = ctx.dreamCareer || '';
    const techSkills = ctx.skills.technicalSkills || [];
    const softSkills = ctx.skills.softSkills || [];
    const careerInterests = ctx.interests.careerInterests || [];

    // Profile is incomplete if there's no stream, no skills, no interests, and no dream career specified
    const isProfileComplete = !(
      (!discipline || discipline === 'Not Specified' || discipline === 'General Studies') &&
      techSkills.length === 0 &&
      softSkills.length === 0 &&
      careerInterests.length === 0 &&
      !dreamCareer
    );

    if (!isProfileComplete) {
      return { careers: [], isProfileComplete: false };
    }

    // Resolve dream career properties if specified
    const dreamCategory = dreamCareer ? getCareerCategory(dreamCareer) : '';
    const dreamId = dreamCareer ? dreamCareer.toLowerCase().replace(/[^a-z0-9]+/g, '_') : '';
    const dreamSkills = dreamId ? (CAREER_SKILL_MAPPING[dreamId] || []) : [];
    
    // Split dream career words for keyword matching (e.g. "Civil Engineer" -> ["civil", "engineer"])
    const dreamKeywords = dreamCareer
      ? dreamCareer.toLowerCase().split(/\s+/).filter(w => w.length > 2)
      : [];

    const careersWithScores = CAREERS_DATA.map((c) => {
      let score = 0;
      const matchSignals: string[] = [];
      const lowerTitle = c.title.toLowerCase();
      const lowerCategory = c.category.toLowerCase();

      // 1. Dream Career Exact Match (+100)
      if (dreamCareer && lowerTitle === dreamCareer.toLowerCase()) {
        score += 100;
        matchSignals.push('dream_exact');
      }

      // 2. Dream Career Category Match (+50)
      if (dreamCategory && lowerCategory === dreamCategory.toLowerCase()) {
        score += 50;
        matchSignals.push('dream_category');
      }

      // 3. Dream Career Keyword Match (+40)
      const hasKeywordMatch = dreamKeywords.some(
        (word) => lowerTitle.includes(word) && lowerTitle !== dreamCareer.toLowerCase()
      );
      if (hasKeywordMatch) {
        score += 40;
        matchSignals.push('dream_keyword');
      }

      // 4. Dream Career Skills Similarity Match (+15)
      const sharedDreamSkills = c.skills.filter((s) =>
        dreamSkills.some((ds) => ds.toLowerCase() === s.toLowerCase())
      );
      if (sharedDreamSkills.length > 0 && lowerTitle !== dreamCareer.toLowerCase()) {
        score += 15;
        matchSignals.push('dream_skills');
      }

      // 5. User Interests Match (+30)
      const hasInterestMatch = careerInterests.some((i: string) => 
        i.toLowerCase() === lowerTitle || lowerTitle.includes(i.toLowerCase())
      );
      if (hasInterestMatch) {
        score += 30;
        matchSignals.push('interests');
      }

      // 6. User Discipline/Stream Match (+20)
      if (discipline && discipline !== 'Not Specified' && discipline !== 'General Studies') {
        const lowerDisc = discipline.toLowerCase();
        if (lowerCategory.includes(lowerDisc) || lowerDisc.includes(lowerCategory)) {
          score += 20;
          matchSignals.push('discipline');
        }
      }

      // 7. User Skills Match (+10 per skill)
      const matchingUserSkills = c.skills.filter((cs: string) => 
        techSkills.some((us: string) => us.toLowerCase() === cs.toLowerCase() || cs.toLowerCase().includes(us.toLowerCase()))
      );
      if (matchingUserSkills.length > 0) {
        score += matchingUserSkills.length * 10;
        matchSignals.push('skills');
      }

      // Determine the primary reason display text (Dream Career gets first precedence)
      let reason = '';
      if (matchSignals.includes('dream_exact')) {
        reason = `Matches your dream career.`;
      } else if (matchSignals.includes('dream_category') || matchSignals.includes('dream_keyword') || matchSignals.includes('dream_skills')) {
        reason = `Closely related to your dream career.`;
      } else if (matchSignals.includes('interests')) {
        reason = `Matches your career interests.`;
      } else if (matchSignals.includes('discipline')) {
        reason = `Related to your education background.`;
      } else if (matchSignals.includes('skills')) {
        reason = `Matches skills associated with your profile.`;
      } else {
        reason = `Matches relevance metrics in the ${c.category} category.`;
      }

      return {
        career: c,
        score,
        reason,
        matchingSkillsCount: matchingUserSkills.length
      };
    });

    // Filter out careers with a score of 0 (No generic technical fallbacks for non-tech domains!)
    const filtered = careersWithScores.filter((item) => item.score > 0);

    // Sort: highest score first, then by matching skills count
    filtered.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.matchingSkillsCount - a.matchingSkillsCount;
    });

    // Format top 12 recommendations
    const results = filtered.slice(0, 12).map((item) => ({
      ...item.career,
      recommendationReason: item.reason,
      relevanceScore: item.score,
    }));

    return {
      careers: results,
      isProfileComplete: true
    };
  }
}
