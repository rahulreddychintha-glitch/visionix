import { IPersonalizationContext } from './personalization.service';
import { CAREERS_DATA, getCareerCategory, CAREER_SKILL_MAPPING } from '../constants/careers.constants';

export interface ICourseRelevanceEvaluation {
  relevanceLevel: 'Strongly Relevant' | 'Relevant' | 'Requires Additional Education / Transition';
  relevanceTag: string;
  isStronglyRelevant: boolean;
  reason: string;
  relevantSubjects: string[];
  entranceRequirements: string[];
  learningRequirements: string[];
}

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
   * Evaluates deterministic course and education relevance for any career against a student's profile.
   */
  public static evaluateCourseRelevance(
    career: any,
    ctx: IPersonalizationContext
  ): ICourseRelevanceEvaluation {
    const rawDiscipline = (ctx.discipline || '').toLowerCase();
    const rawLevel = (ctx.educationLevel || ctx.studentStatus || '').toLowerCase();
    const rawSpec = (ctx.specialization || '').toLowerCase();
    const currentClass = (ctx.currentClass || '').toLowerCase();
    const careerTitle = (career.title || '').toLowerCase();
    const category = (career.category || getCareerCategory(career.title)).toLowerCase();
    const careerId = (career.id || careerTitle.replace(/[^a-z0-9]+/g, '_')).toLowerCase();

    // Default subjects and entrance requirements mapping based on career category & ID
    const { subjects, entrances, learning } = this.getCareerSubjectAndEntranceRequirements(careerId, category, career.skills || []);

    // 1. Check if user is School Student (Classes 6-10)
    const isSchool = rawLevel.includes('school') || rawLevel.includes('10th') || currentClass.includes('class 6') || currentClass.includes('class 7') || currentClass.includes('class 8') || currentClass.includes('class 9') || currentClass.includes('class 10');
    if (isSchool) {
      const coreFoundational = ['engineering', 'technology', 'healthcare', 'science', 'law', 'business & finance', 'government', 'defence', 'arts & design'];
      if (coreFoundational.includes(category)) {
        return {
          relevanceLevel: 'Strongly Relevant',
          relevanceTag: 'Foundational Pathway',
          isStronglyRelevant: true,
          reason: `High foundational exploration match for secondary school students (${ctx.currentClass || 'Classes 6–10'}).`,
          relevantSubjects: subjects,
          entranceRequirements: entrances,
          learningRequirements: learning
        };
      }
      return {
        relevanceLevel: 'Relevant',
        relevanceTag: 'Explore Pathway',
        isStronglyRelevant: false,
        reason: `Available career pathway for secondary school students to explore.`,
        relevantSubjects: subjects,
        entranceRequirements: entrances,
        learningRequirements: learning
      };
    }

    // 2. Intermediate / +2 / PUC
    const isIntermediate = rawLevel.includes('intermediate') || rawLevel.includes('12th') || rawLevel.includes('puc') || rawDiscipline.includes('mpc') || rawDiscipline.includes('bipc') || rawDiscipline.includes('pcmb') || rawDiscipline.includes('mec') || rawDiscipline.includes('cec') || rawDiscipline.includes('hec') || rawDiscipline.includes('vocational_inter');

    if (isIntermediate) {
      // MPC (Maths, Physics, Chemistry)
      if (rawDiscipline.includes('mpc') || (rawDiscipline.includes('science') && !rawDiscipline.includes('bio') && !rawDiscipline.includes('bipc'))) {
        if (category === 'technology' || category === 'engineering' || category === 'aviation' || (category === 'science' && (careerId.includes('space') || careerId.includes('scientist') || careerId.includes('researcher'))) || careerId === 'architect') {
          return {
            relevanceLevel: 'Strongly Relevant',
            relevanceTag: 'Direct Stream Fit',
            isStronglyRelevant: true,
            reason: `Directly aligns with your Intermediate MPC stream (Engineering, Technology & Physical Sciences).`,
            relevantSubjects: subjects,
            entranceRequirements: entrances,
            learningRequirements: learning
          };
        }
        if (category === 'business & finance' || category === 'arts & design' || category === 'government' || category === 'defence') {
          return {
            relevanceLevel: 'Relevant',
            relevanceTag: 'Relevant to Stream',
            isStronglyRelevant: false,
            reason: `Accessible career pathway for students with an analytical MPC mathematics background.`,
            relevantSubjects: subjects,
            entranceRequirements: entrances,
            learningRequirements: learning
          };
        }
        if (category === 'healthcare' || careerId.includes('biotech') || careerId.includes('genetic') || careerId.includes('doctor') || careerId.includes('nurse')) {
          return {
            relevanceLevel: 'Requires Additional Education / Transition',
            relevanceTag: 'Requires Biology / NEET Pathway',
            isStronglyRelevant: false,
            reason: `Medical and clinical healthcare careers typically require a biological sciences (BiPC/NEET) background.`,
            relevantSubjects: subjects,
            entranceRequirements: entrances,
            learningRequirements: learning
          };
        }
      }

      // BiPC (Biology, Physics, Chemistry)
      if (rawDiscipline.includes('bipc') || (rawDiscipline.includes('science') && (rawDiscipline.includes('bio') || rawDiscipline.includes('medical')))) {
        if (category === 'healthcare' || (category === 'science' && (careerId.includes('bio') || careerId.includes('genetic') || careerId.includes('agri') || careerId.includes('environ') || careerId.includes('scientist') || careerId.includes('researcher')))) {
          return {
            relevanceLevel: 'Strongly Relevant',
            relevanceTag: 'Direct Stream Fit',
            isStronglyRelevant: true,
            reason: `Directly aligns with your Intermediate BiPC stream (Medicine, Life Sciences & Healthcare).`,
            relevantSubjects: subjects,
            entranceRequirements: entrances,
            learningRequirements: learning
          };
        }
        if (category === 'agriculture' || category === 'government' || category === 'education') {
          return {
            relevanceLevel: 'Relevant',
            relevanceTag: 'Relevant to Stream',
            isStronglyRelevant: false,
            reason: `Relevant pathway accessible with a life sciences background.`,
            relevantSubjects: subjects,
            entranceRequirements: entrances,
            learningRequirements: learning
          };
        }
        if (category === 'engineering' || (category === 'technology' && !careerId.includes('bio'))) {
          return {
            relevanceLevel: 'Requires Additional Education / Transition',
            relevanceTag: 'Requires Mathematics / Engineering Pathway',
            isStronglyRelevant: false,
            reason: `Core engineering programs generally require Mathematics (MPC/JEE) qualification.`,
            relevantSubjects: subjects,
            entranceRequirements: entrances,
            learningRequirements: learning
          };
        }
      }

      // PCMB (Physics, Chemistry, Maths, Biology)
      if (rawDiscipline.includes('pcmb')) {
        if (category === 'technology' || category === 'engineering' || category === 'healthcare' || category === 'science' || careerId === 'architect' || category === 'aviation') {
          return {
            relevanceLevel: 'Strongly Relevant',
            relevanceTag: 'Dual Stream Fit',
            isStronglyRelevant: true,
            reason: `Directly aligns with your versatile PCMB dual track (Engineering, Computing, & Medical Sciences).`,
            relevantSubjects: subjects,
            entranceRequirements: entrances,
            learningRequirements: learning
          };
        }
      }

      // MEC (Maths, Economics, Commerce)
      if (rawDiscipline.includes('mec')) {
        if (category === 'business & finance' || careerId === 'chartered_accountant' || careerId === 'financial_analyst' || careerId === 'investment_banker' || careerId === 'product_manager' || careerId === 'data_scientist') {
          return {
            relevanceLevel: 'Strongly Relevant',
            relevanceTag: 'Direct Stream Fit',
            isStronglyRelevant: true,
            reason: `Directly aligns with your Intermediate MEC stream (Finance, Economics, Analytics & Management).`,
            relevantSubjects: subjects,
            entranceRequirements: entrances,
            learningRequirements: learning
          };
        }
        if (category === 'law' || category === 'government' || category === 'technology') {
          return {
            relevanceLevel: 'Relevant',
            relevanceTag: 'Relevant to Stream',
            isStronglyRelevant: false,
            reason: `Accessible pathway for commerce and analytical mathematics students.`,
            relevantSubjects: subjects,
            entranceRequirements: entrances,
            learningRequirements: learning
          };
        }
      }

      // CEC (Civics, Economics, Commerce)
      if (rawDiscipline.includes('cec')) {
        if (category === 'business & finance' || category === 'law' || category === 'government' || careerId === 'chartered_accountant' || careerId === 'financial_analyst' || careerId === 'lawyer') {
          return {
            relevanceLevel: 'Strongly Relevant',
            relevanceTag: 'Direct Stream Fit',
            isStronglyRelevant: true,
            reason: `Directly aligns with your Intermediate CEC stream (Commerce, Corporate Law & Public Administration).`,
            relevantSubjects: subjects,
            entranceRequirements: entrances,
            learningRequirements: learning
          };
        }
        if (category === 'media & entertainment' || category === 'hospitality & tourism') {
          return {
            relevanceLevel: 'Relevant',
            relevanceTag: 'Relevant to Stream',
            isStronglyRelevant: false,
            reason: `Applicable commerce and business communications pathway.`,
            relevantSubjects: subjects,
            entranceRequirements: entrances,
            learningRequirements: learning
          };
        }
      }

      // HEC (History, Economics, Civics)
      if (rawDiscipline.includes('hec') || rawDiscipline.includes('humanities') || rawDiscipline.includes('arts')) {
        if (category === 'government' || category === 'law' || category === 'media & entertainment' || category === 'arts & design' || careerId.includes('officer') || careerId === 'lawyer' || careerId === 'journalist') {
          return {
            relevanceLevel: 'Strongly Relevant',
            relevanceTag: 'Direct Stream Fit',
            isStronglyRelevant: true,
            reason: `Directly aligns with your Intermediate HEC stream (Civil Services, Legal Studies, Media & Arts).`,
            relevantSubjects: subjects,
            entranceRequirements: entrances,
            learningRequirements: learning
          };
        }
        if (category === 'business & finance' || category === 'education' || category === 'hospitality & tourism') {
          return {
            relevanceLevel: 'Relevant',
            relevanceTag: 'Relevant to Stream',
            isStronglyRelevant: false,
            reason: `Accessible career pathway for humanities and social sciences students.`,
            relevantSubjects: subjects,
            entranceRequirements: entrances,
            learningRequirements: learning
          };
        }
      }

      // Vocational Intermediate
      if (rawDiscipline.includes('vocational')) {
        if (category === 'skilled trades' || category === 'hospitality & tourism' || category === 'media & entertainment' || careerId === 'nurse' || careerId === 'electrician' || careerId === 'chef') {
          return {
            relevanceLevel: 'Strongly Relevant',
            relevanceTag: 'Direct Vocational Fit',
            isStronglyRelevant: true,
            reason: `Directly aligns with practical skills from your vocational intermediate curriculum.`,
            relevantSubjects: subjects,
            entranceRequirements: entrances,
            learningRequirements: learning
          };
        }
      }
    }

    // 3. Diploma / Polytechnic
    const isDiploma = rawLevel.includes('diploma') || rawLevel.includes('polytechnic') || rawDiscipline.includes('dip_') || rawSpec.includes('dip_');
    if (isDiploma) {
      const matchCSE = rawDiscipline.includes('cse') || rawDiscipline.includes('computer') || rawDiscipline.includes('it') || rawSpec.includes('dip_cse');
      const matchMech = rawDiscipline.includes('mech') || rawDiscipline.includes('auto') || rawSpec.includes('dip_mech') || rawSpec.includes('dip_auto');
      const matchCivil = rawDiscipline.includes('civil') || rawSpec.includes('dip_civil');
      const matchElectrical = rawDiscipline.includes('eee') || rawDiscipline.includes('ece') || rawDiscipline.includes('electrical') || rawSpec.includes('dip_eee') || rawSpec.includes('dip_ece');
      const matchPharma = rawDiscipline.includes('pharm') || rawSpec.includes('dip_pharm');

      if (matchCSE && (category === 'technology' || careerId === 'software_engineer' || careerId === 'ui_designer' || careerId === 'ux_designer' || careerId === 'cloud_engineer' || careerId === 'cybersecurity_analyst')) {
        return {
          relevanceLevel: 'Strongly Relevant',
          relevanceTag: 'Diploma CSE Fit',
          isStronglyRelevant: true,
          reason: `Directly aligns with your Diploma in Computer Engineering / IT.`,
          relevantSubjects: subjects,
          entranceRequirements: entrances,
          learningRequirements: learning
        };
      }

      if (matchMech && (careerId.includes('mechanical') || careerId.includes('robotics') || careerId.includes('mechanic') || careerId.includes('marine') || category === 'engineering')) {
        return {
          relevanceLevel: 'Strongly Relevant',
          relevanceTag: 'Diploma Mechanical Fit',
          isStronglyRelevant: true,
          reason: `Directly aligns with your Diploma in Mechanical Engineering.`,
          relevantSubjects: subjects,
          entranceRequirements: entrances,
          learningRequirements: learning
        };
      }

      if (matchCivil && (careerId.includes('civil') || careerId.includes('architect') || category === 'engineering')) {
        return {
          relevanceLevel: 'Strongly Relevant',
          relevanceTag: 'Diploma Civil Fit',
          isStronglyRelevant: true,
          reason: `Directly aligns with your Diploma in Civil Engineering.`,
          relevantSubjects: subjects,
          entranceRequirements: entrances,
          learningRequirements: learning
        };
      }

      if (matchElectrical && (careerId.includes('electrical') || careerId.includes('electrician') || careerId.includes('robotics') || category === 'engineering')) {
        return {
          relevanceLevel: 'Strongly Relevant',
          relevanceTag: 'Diploma EEE/ECE Fit',
          isStronglyRelevant: true,
          reason: `Directly aligns with your Diploma in Electrical/Electronics Engineering.`,
          relevantSubjects: subjects,
          entranceRequirements: entrances,
          learningRequirements: learning
        };
      }

      if (matchPharma && (careerId.includes('pharmacist') || careerId.includes('bio') || category === 'healthcare')) {
        return {
          relevanceLevel: 'Strongly Relevant',
          relevanceTag: 'Diploma Pharmacy Fit',
          isStronglyRelevant: true,
          reason: `Directly aligns with your D.Pharm (Diploma in Pharmacy).`,
          relevantSubjects: subjects,
          entranceRequirements: entrances,
          learningRequirements: learning
        };
      }
    }

    // 4. Undergraduate Degree Specializations
    // B.Tech / B.E. / BCA / B.Sc CS
    const isTechDegree = rawDiscipline.includes('btech') || rawDiscipline.includes('bca') || rawDiscipline.includes('bsc_cs') || rawDiscipline.includes('computer') || rawDiscipline.includes('information') || rawSpec.includes('computer') || rawSpec.includes('artificial') || rawSpec.includes('data');
    if (isTechDegree) {
      if (category === 'technology' || careerId === 'product_manager' || careerId === 'ui_designer' || careerId === 'ux_designer') {
        return {
          relevanceLevel: 'Strongly Relevant',
          relevanceTag: 'Degree Alignment',
          isStronglyRelevant: true,
          reason: `Directly relevant to your computer science / technical undergraduate curriculum.`,
          relevantSubjects: subjects,
          entranceRequirements: entrances,
          learningRequirements: learning
        };
      }
      if (category === 'engineering' || category === 'business & finance') {
        return {
          relevanceLevel: 'Relevant',
          relevanceTag: 'Interdisciplinary Fit',
          isStronglyRelevant: false,
          reason: `Strong interdisciplinary fit for technology and engineering graduates.`,
          relevantSubjects: subjects,
          entranceRequirements: entrances,
          learningRequirements: learning
        };
      }
    }

    // B.Com / BBA / BMS
    const isCommerceDegree = rawDiscipline.includes('bcom') || rawDiscipline.includes('bba') || rawDiscipline.includes('bms') || rawDiscipline.includes('commerce') || rawDiscipline.includes('finance') || rawDiscipline.includes('accounting');
    if (isCommerceDegree) {
      if (category === 'business & finance' || careerId === 'chartered_accountant' || careerId === 'financial_analyst' || careerId === 'investment_banker' || careerId === 'marketing_manager' || careerId === 'product_manager') {
        return {
          relevanceLevel: 'Strongly Relevant',
          relevanceTag: 'Commerce Degree Fit',
          isStronglyRelevant: true,
          reason: `Directly relevant to your undergraduate commerce/business curriculum.`,
          relevantSubjects: subjects,
          entranceRequirements: entrances,
          learningRequirements: learning
        };
      }
    }

    // MBBS / BDS / B.Pharm / Nursing
    const isMedicalDegree = rawDiscipline.includes('mbbs') || rawDiscipline.includes('bds') || rawDiscipline.includes('bpharm') || rawDiscipline.includes('nursing') || rawDiscipline.includes('medicine');
    if (isMedicalDegree) {
      if (category === 'healthcare' || careerId.includes('doctor') || careerId.includes('surgeon') || careerId.includes('pharmacist') || careerId.includes('nurse')) {
        return {
          relevanceLevel: 'Strongly Relevant',
          relevanceTag: 'Clinical Degree Fit',
          isStronglyRelevant: true,
          reason: `Direct clinical alignment with your medical/health sciences degree program.`,
          relevantSubjects: subjects,
          entranceRequirements: entrances,
          learningRequirements: learning
        };
      }
    }

    // Law (LLB / 5-Year Integrated)
    const isLawDegree = rawDiscipline.includes('law') || rawDiscipline.includes('llb') || rawDiscipline.includes('clat');
    if (isLawDegree) {
      if (category === 'law' || category === 'government' || careerId === 'lawyer' || careerId === 'judge' || careerId === 'ias_officer') {
        return {
          relevanceLevel: 'Strongly Relevant',
          relevanceTag: 'Legal Degree Fit',
          isStronglyRelevant: true,
          reason: `Direct professional alignment with your legal studies curriculum.`,
          relevantSubjects: subjects,
          entranceRequirements: entrances,
          learningRequirements: learning
        };
      }
    }

    // 5. Generic Category & Discipline Heuristics
    if (rawDiscipline && rawDiscipline !== 'not specified' && rawDiscipline !== 'general studies') {
      if (category.includes(rawDiscipline) || rawDiscipline.includes(category)) {
        return {
          relevanceLevel: 'Strongly Relevant',
          relevanceTag: 'Discipline Fit',
          isStronglyRelevant: true,
          reason: `Strongly matches your academic field of study in ${ctx.discipline}.`,
          relevantSubjects: subjects,
          entranceRequirements: entrances,
          learningRequirements: learning
        };
      }
    }

    // Check shared skills
    const techSkills = (ctx.skills?.technicalSkills || []).map(s => s.toLowerCase());
    const matchingSkills = (career.skills || []).filter((cs: string) =>
      techSkills.some(us => us === cs.toLowerCase() || cs.toLowerCase().includes(us) || us.includes(cs.toLowerCase()))
    );

    if (matchingSkills.length >= 2) {
      return {
        relevanceLevel: 'Relevant',
        relevanceTag: 'Skill Compatibility',
        isStronglyRelevant: false,
        reason: `Shares key required skills (${matchingSkills.slice(0, 2).join(', ')}) with your profile.`,
        relevantSubjects: subjects,
        entranceRequirements: entrances,
        learningRequirements: learning
      };
    }

    // Default Fallback
    const requiresSpecificLicense = ['doctor', 'surgeon', 'dentist', 'pharmacist', 'nurse', 'architect', 'pilot', 'lawyer', 'judge', 'chartered_accountant'].includes(careerId);
    if (requiresSpecificLicense) {
      return {
        relevanceLevel: 'Requires Additional Education / Transition',
        relevanceTag: 'Specific Degree Required',
        isStronglyRelevant: false,
        reason: `Requires specialized qualifying degrees or professional licensure beyond current course.`,
        relevantSubjects: subjects,
        entranceRequirements: entrances,
        learningRequirements: learning
      };
    }

    return {
      relevanceLevel: 'Relevant',
      relevanceTag: 'Career Pathway',
      isStronglyRelevant: false,
      reason: `Explore this career pathway and its development requirements.`,
      relevantSubjects: subjects,
      entranceRequirements: entrances,
      learningRequirements: learning
    };
  }

  /**
   * Helper providing real relevant academic subjects, entrance requirements, and learning areas.
   */
  private static getCareerSubjectAndEntranceRequirements(
    careerId: string,
    category: string,
    _skills: string[]
  ): { subjects: string[]; entrances: string[]; learning: string[] } {
    const subjectsMap: Record<string, string[]> = {
      technology: ['Computer Science', 'Mathematics', 'Data Structures & Algorithms', 'Discrete Mathematics', 'Database Systems'],
      engineering: ['Engineering Physics', 'Applied Mathematics', 'Engineering Mechanics', 'CAD / Drafting', 'Thermodynamics'],
      healthcare: ['Human Anatomy', 'Physiology', 'Biochemistry', 'Clinical Pathology', 'Pharmacology'],
      'business & finance': ['Financial Accounting', 'Corporate Finance', 'Microeconomics', 'Business Statistics', 'Taxation & Auditing'],
      law: ['Constitutional Law', 'Jurisprudence', 'Contract Law', 'Criminal Justice', 'Legal Drafting'],
      'arts & design': ['Visual Design Principles', 'Typography', 'Human-Computer Interaction (HCI)', 'Digital Prototyping', 'Art History'],
      aviation: ['Aviation Physics', 'Meteorology', 'Navigation & Instruments', 'Air Regulations', 'Technical General'],
      science: ['Advanced Physics', 'Organic Chemistry', 'Molecular Biology', 'Research Methodology', 'Statistical Modeling'],
      government: ['Indian Polity & Governance', 'Modern Indian History', 'Geography & Environment', 'Economic Development', 'Ethics & Integrity'],
      defence: ['General Studies', 'Mathematics', 'Military Strategy', 'Physics & Chemistry', 'Physical Stamina Training'],
      'hospitality & tourism': ['Food & Beverage Service', 'Front Office Operations', 'Culinary Arts', 'Hospitality Management', 'Tourism Marketing'],
      'media & entertainment': ['Mass Communication', 'Journalism Ethics', 'Digital Media Production', 'Video Editing', 'Creative Writing'],
      agriculture: ['Agronomy', 'Soil Science & Plant Pathology', 'Agricultural Economics', 'Genetics & Plant Breeding', 'Horticulture'],
      'skilled trades': ['Workshop Practice', 'Circuit Analysis', 'Machine Operations', 'Trade Technical Theory', 'Industrial Safety']
    };

    const entranceMap: Record<string, string[]> = {
      technology: ['JEE Main / JEE Advanced', 'GATE (CS/IT)', 'NIMCET (MCA)', 'University / Campus Coding Tests'],
      engineering: ['JEE Main / State Engineering CETs', 'GATE (Engineering)', 'Lateral Entry ECET / LEET (Polytechnic)'],
      healthcare: ['NEET-UG (MBBS/BDS)', 'NEET-PG / INI-CET', 'GPAT (Pharmacy)', 'State Nursing CETs'],
      'business & finance': ['CA Foundation / Intermediate / Final (ICAI)', 'CAT / XAT / GMAT (MBA)', 'CFA Examination', 'NISM Certifications'],
      law: ['CLAT (Common Law Admission Test)', 'AILET', 'State Bar Council All India Bar Exam (AIBE)', 'Judicial Services Examination'],
      'arts & design': ['UCEED / CEED', 'NID DAT', 'NATA / JEE Paper 2 (Architecture)', 'Portfolio Review & Creative Aptitude Test'],
      aviation: ['DGCA Commercial Pilot License (CPL) Exams', 'Air Force Common Admission Test (AFCAT)', 'Class 1 Aviation Medical Assessment'],
      science: ['CSIR-NET / UGC-NET (Junior Research Fellowship)', 'GATE (Sciences)', 'IIT-JAM (M.Sc Admissions)'],
      government: ['UPSC Civil Services Examination (Prelims, Mains, Interview)', 'State Public Service Commission (PSC) Exams', 'SSC CGL'],
      defence: ['National Defence Academy (NDA) Exam', 'Combined Defence Services (CDS) Exam', 'Services Selection Board (SSB) Interview'],
      'hospitality & tourism': ['NCHMCT JEE (Hotel Management)', 'Institutional Culinary Aptitude Tests'],
      'media & entertainment': ['IIMC Entrance Examination', 'FTII Entrance Exam', 'Creative Portfolio Submission'],
      agriculture: ['ICAR AIEEA (All India Entrance Examination for Agriculture)', 'State Agriculture University CETs'],
      'skilled trades': ['ITI All India Trade Test (AITT)', 'Apprenticeship Board Certifications', 'State Trade Licensing']
    };

    const learningMap: Record<string, string[]> = {
      technology: ['Full-stack web/mobile application architectures', 'Data pipelines, Machine Learning & Cloud deployment', 'Clean code & system design fundamentals'],
      engineering: ['3D CAD modeling, simulations & manufacturing drawings', 'Structural, thermal, and electrical load calculations', 'Quality assurance and ISO safety standards'],
      healthcare: ['Clinical diagnostic workflows & physical assessments', 'Evidence-based patient care & ethical pharmacology', 'Hospital rotation rounds and emergency procedures'],
      'business & finance': ['Financial statement analysis, DCF valuation & NPV modeling', 'Business strategy, market research & KPI telemetry', 'Taxation compliance, auditing & management reporting'],
      law: ['Legal research, precedent analysis & contract drafting', 'Courtroom moot arguments & client negotiation strategies', 'Statutory interpretation and regulatory filings'],
      'arts & design': ['Design systems, interactive wireframes & high-fidelity prototypes', 'User research, usability testing & visual hierarchy', 'Digital brand assets and creative portfolio presentation'],
      aviation: ['Cockpit instrument flight rules (IFR) and visual flight rules (VFR)', 'Flight simulator hours, flight logs & emergency protocols', 'Radio telephony communication and meteorology analysis'],
      science: ['Controlled laboratory experiment design & data analysis', 'Statistical hypothesis testing and peer-reviewed literature reviews', 'Advanced analytical instrumentation and titration/sequencing'],
      government: ['Public administration, policy formulation & execution', 'Constitutional mandates, district administration & citizen services', 'Comprehensive essay writing and analytical decision-making'],
      defence: ['Physical endurance, obstacle drills & tactical navigation', 'Leadership under pressure and unit coordination', 'Defense equipment operation and strategic command'],
      'hospitality & tourism': ['Hospitality operations, guest relations & revenue management', 'Culinary prep, food safety & hygiene standards', 'Event scheduling, vendor contracts & tourism logistics'],
      'media & entertainment': ['Content creation, camera composition & audio-video editing', 'Investigative reporting, interviewing & storytelling', 'Audience engagement analysis and digital marketing'],
      agriculture: ['Crop rotation, irrigation systems & soil fertility management', 'Pest management, organic agriculture & modern agri-tech machinery', 'Farm financial management and supply chain logistics'],
      'skilled trades': ['Blueprint reading, wiring/plumbing schematics & circuit testing', 'Machine maintenance, calibration & tool operation', 'Safety code compliance, troubleshooting & hands-on repairs']
    };

    const subjects = subjectsMap[category] || ['Core Domain Studies', 'Analytical Methods', 'Applied Technical Fundamentals'];
    const entrances = entranceMap[category] || ['Standard Qualifying Degree Examination', 'Professional Assessment Test'];
    const learning = learningMap[category] || ['Core domain foundational principles', 'Hands-on practical application tasks', 'Industry standard tool proficiency'];

    return { subjects, entrances, learning };
  }

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

    // Fetch recommendations dynamically from the 75 career options
    const recs = await this.getRecommendedCareers(ctx);
    const topCareers = recs.careers.slice(0, 3).map((c) => ({
      id: c.id,
      title: c.title,
      matchScore: c.match?.matchScore || (allUserSkills.length >= 3 ? 92 : 85),
      stars: '★★★★★',
      reason: c.recommendationReason || `Strong alignment with your ${ctx.discipline} education background.`,
      category: c.category
    }));

    const expectedSkills = CAREER_SKILL_MAPPING[recs.careers[0]?.id] || ['Problem Solving', 'Communication', 'Technical Proficiency', 'Critical Thinking'];
    const missingSkills = expectedSkills.filter(
      (s) => !allUserSkills.some((us) => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))
    );

    const smartSuggestions = recs.careers.slice(0, 3).map((c) => ({
      id: c.id,
      label: c.title,
      category: c.category
    }));

    const statusText = ctx.studentStatus && ctx.studentStatus !== 'Not Specified' && ctx.studentStatus !== 'Student'
      ? ctx.studentStatus.toLowerCase()
      : 'learner';
    const instText = ctx.institution && ctx.institution !== 'Not Specified'
      ? ` at ${ctx.institution}`
      : '';

    const summarySentences = [
      `${ctx.name} is a ${statusText} studying ${ctx.discipline}${instText}.`,
      techSkills.length > 0
        ? `They demonstrate competence in ${techSkills.slice(0, 3).join(', ')}.`
        : 'They are actively building foundational skills in their chosen course.',
      ctx.dreamCareer
        ? `Their target ambition is to excel as a ${ctx.dreamCareer}.`
        : 'They are exploring course-relevant career pathways.',
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
   * using the deterministic Indian Education Course Relevance engine.
   */
  public static async getRecommendedCareers(ctx: IPersonalizationContext): Promise<{ careers: any[]; isProfileComplete: boolean }> {
    const discipline = ctx.discipline || '';
    const dreamCareer = ctx.dreamCareer || '';
    const techSkills = ctx.skills.technicalSkills || [];
    const softSkills = ctx.skills.softSkills || [];
    const careerInterests = ctx.interests.careerInterests || [];

    // Profile completeness check
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

    const dreamCategory = dreamCareer ? getCareerCategory(dreamCareer) : '';
    const dreamId = dreamCareer ? dreamCareer.toLowerCase().replace(/[^a-z0-9]+/g, '_') : '';
    const dreamKeywords = dreamCareer
      ? dreamCareer.toLowerCase().split(/\s+/).filter(w => w.length > 2)
      : [];

    const careersWithScores = CAREERS_DATA.map((c) => {
      let score = 0;
      const lowerTitle = c.title.toLowerCase();
      const lowerCategory = c.category.toLowerCase();

      // 1. Evaluate deterministic Course & Education Relevance
      const courseEval = this.evaluateCourseRelevance(c, ctx);
      if (courseEval.relevanceLevel === 'Strongly Relevant') {
        score += 60;
      } else if (courseEval.relevanceLevel === 'Relevant') {
        score += 30;
      } else {
        score += 5;
      }

      // 2. User Interests Match (+25)
      const hasInterestMatch = careerInterests.some((i: string) => 
        i.toLowerCase() === lowerTitle || lowerTitle.includes(i.toLowerCase())
      );
      if (hasInterestMatch) {
        score += 25;
      }

      // 3. User Skills Match (+10 per skill, up to +30)
      const matchingUserSkills = c.skills.filter((cs: string) => 
        techSkills.some((us: string) => us.toLowerCase() === cs.toLowerCase() || cs.toLowerCase().includes(us.toLowerCase()))
      );
      score += Math.min(matchingUserSkills.length * 10, 30);

      // 4. Optional Dream Career Preference (+40 for exact match, +20 for category)
      let isDream = false;
      if (dreamCareer && lowerTitle === dreamCareer.toLowerCase()) {
        score += 40;
        isDream = true;
      } else if (dreamCategory && lowerCategory === dreamCategory.toLowerCase()) {
        score += 20;
      } else if (dreamKeywords.some((word) => lowerTitle.includes(word))) {
        score += 15;
      }

      // Format clean recommendation reason
      let displayReason = courseEval.reason;
      if (isDream) {
        displayReason = `Matches your stated target ambition (${dreamCareer}) and aligns with your education.`;
      }

      return {
        career: {
          ...c,
          courseRelevance: courseEval,
          relevanceLevel: courseEval.relevanceLevel,
          relevanceTag: courseEval.relevanceTag,
          recommendationReason: displayReason,
          relevantSubjects: courseEval.relevantSubjects,
          entranceRequirements: courseEval.entranceRequirements,
          learningRequirements: courseEval.learningRequirements
        },
        score,
        reason: displayReason,
        matchingSkillsCount: matchingUserSkills.length
      };
    });

    // Filter out careers with 0 or very low scores
    const filtered = careersWithScores.filter((item) => item.score > 0);

    // Sort: highest score first, then by matching skills count
    filtered.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.matchingSkillsCount - a.matchingSkillsCount;
    });

    // Format recommendations
    const results = filtered.map((item) => ({
      ...item.career,
      relevanceScore: item.score,
    }));

    return {
      careers: results,
      isProfileComplete: true
    };
  }
}
