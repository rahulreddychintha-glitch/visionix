import { IPersonalizationContext } from './personalization.service';

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
    const allUserSkills = [...techSkills, ...softSkills].map((s) => s.toLowerCase());

    // Domain heuristic recommendations
    let topCareers: IRecommendationResult['topCareers'] = [];
    let smartSuggestions: IRecommendationResult['smartSuggestions'] = [];
    let expectedSkills: string[] = [];

    if (discipline.includes('engineering') || discipline.includes('stem') || discipline.includes('computer')) {
      topCareers = [
        {
          id: dreamCareer.toLowerCase().replace(/\s+/g, '_') || 'software_engineer',
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
    } else if (discipline.includes('medicine') || discipline.includes('health') || discipline.includes('nursing') || discipline.includes('pharmacy')) {
      topCareers = [
        {
          id: dreamCareer.toLowerCase().replace(/\s+/g, '_') || 'medical_practitioner',
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
    } else if (discipline.includes('commerce') || discipline.includes('finance') || discipline.includes('business') || discipline.includes('economics')) {
      topCareers = [
        {
          id: dreamCareer.toLowerCase().replace(/\s+/g, '_') || 'financial_analyst',
          title: dreamCareer || 'Financial Analyst',
          matchScore: 94,
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
    } else if (discipline.includes('law') || discipline.includes('legal')) {
      topCareers = [
        {
          id: dreamCareer.toLowerCase().replace(/\s+/g, '_') || 'corporate_lawyer',
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
    } else if (discipline.includes('design') || discipline.includes('arts') || discipline.includes('architecture') || discipline.includes('fashion')) {
      topCareers = [
        {
          id: dreamCareer.toLowerCase().replace(/\s+/g, '_') || 'product_designer',
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
    } else {
      // General / Multidisciplinary fallback
      topCareers = [
        {
          id: dreamCareer.toLowerCase().replace(/\s+/g, '_') || 'career_specialist',
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

    const missingSkills = expectedSkills.filter(
      (s) => !allUserSkills.some((us) => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))
    );

    const summarySentences = [
      `${ctx.name} is a ${ctx.studentStatus.toLowerCase()} pursuing ${ctx.discipline}${ctx.institution ? ` at ${ctx.institution}` : ''}.`,
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
}
