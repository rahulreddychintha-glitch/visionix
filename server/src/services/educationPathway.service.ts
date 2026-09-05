import { 
  INDIAN_EDUCATION_TREE, 
  ALL_EDUCATION_NODES, 
  PATHWAY_COMPARISON_PRESETS,
  IEducationTreeNode,
  IPathwayCareerRef,
  IPathwayComparisonPreset,
  EducationNodeType
} from '../constants/indianEducationTree.constants';
import { EDUCATION_PATHWAYS, IEducationPathway } from '../constants/educationPathways.constants';
import { CAREERS_DATA } from '../constants/careers.constants';
import { PersonalizationService, IPersonalizationContext } from './personalization.service';
import { UserProfile, IUserProfile } from '../models/UserProfile';

export { IEducationTreeNode, IPathwayCareerRef, IPathwayComparisonPreset, EducationNodeType };

export interface ICurrentEducationContext {
  level: string;
  currentClass?: string;
  studyYear?: string;
  stream: string;
  branchSpecialization?: string;
  institution?: string;
  graduationYear?: number;
  courses?: Array<{
    stream?: string;
    branchSpecialization?: string;
    studyYear?: string;
    institution?: string;
  }>;
}

export interface IResolvedPathwayCareer {
  id: string;
  title: string;
  category: string;
  salaryRange?: string;
  growthRate?: string;
  demandLevel?: string;
}

export interface IResolvedEducationPathway extends Omit<IEducationPathway, 'careers'> {
  resolvedCareers: IResolvedPathwayCareer[];
  fitScore: number;
  fitReason: string;
}

export interface IEducationPathwaysResponse {
  currentEducation: ICurrentEducationContext | null;
  userCurrentNodeId: string | null;
  treeRoot: IEducationTreeNode;
  allNodes: IEducationTreeNode[];
  comparisonPresets: IPathwayComparisonPreset[];
  pathways: IResolvedEducationPathway[];
}

export class EducationPathwayService {
  /**
   * Helper to resolve career IDs into structured IPathwayCareerRef objects from CAREERS_DATA
   */
  public static resolveCareerObjects(careerIds: string[], defaultCategory: string = 'General'): IPathwayCareerRef[] {
    return careerIds.map(careerId => {
      const normalized = careerId.toLowerCase().trim();
      const found = CAREERS_DATA.find(c => 
        c.id === normalized || 
        c.id === normalized.replace(/-/g, '_') ||
        c.id.replace(/_/g, '-') === normalized
      );
      if (found) {
        return {
          id: found.id,
          title: found.title,
          category: found.category,
          salaryRange: found.salaryRange,
          growthRate: found.growthRate,
          demandLevel: found.demandLevel
        };
      }
      return {
        id: careerId,
        title: careerId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        category: defaultCategory
      };
    });
  }

  /**
   * Deeply hydrates a tree node and all its children with rich career objects from CAREERS_DATA.
   */
  public static hydrateTreeNode(node: IEducationTreeNode): IEducationTreeNode {
    const cloned: IEducationTreeNode = { ...node };

    if (cloned.careerIds && cloned.careerIds.length > 0) {
      cloned.resolvedCareers = this.resolveCareerObjects(cloned.careerIds, cloned.category || 'General');
    }

    if (cloned.children && cloned.children.length > 0) {
      cloned.children = cloned.children.map(child => this.hydrateTreeNode(child));
    }

    return cloned;
  }

  /**
   * Resolves the student's exact "YOU ARE HERE" node ID within the independent Indian education tree.
   */
  public static matchUserCurrentNodeId(rawEducation?: IUserProfile['education'], ctx?: IPersonalizationContext): string {
    const levelRaw = (rawEducation?.level || ctx?.educationLevel || '').toLowerCase();
    const classRaw = (rawEducation?.currentClass || ctx?.currentClass || '').toLowerCase();
    const streamRaw = (rawEducation?.stream || ctx?.discipline || '').toLowerCase();
    const branchRaw = (rawEducation?.branchSpecialization || ctx?.specialization || '').toLowerCase();

    // 1. School / Class 10
    if (
      levelRaw.includes('school') ||
      levelRaw.includes('10th') ||
      classRaw.includes('class 6') ||
      classRaw.includes('class 7') ||
      classRaw.includes('class 8') ||
      classRaw.includes('class 9') ||
      classRaw.includes('class 10') ||
      classRaw.includes('10')
    ) {
      return 'stage-class-10';
    }

    // 2. Intermediate / Senior Secondary Streams
    if (
      levelRaw.includes('intermediate') ||
      levelRaw.includes('10+2') ||
      levelRaw.includes('12th') ||
      levelRaw.includes('puc') ||
      levelRaw.includes('junior college')
    ) {
      if (streamRaw.includes('mpc') || (streamRaw.includes('math') && streamRaw.includes('physics'))) return 'stream-mpc';
      if (streamRaw.includes('bipc') || streamRaw.includes('biology') || streamRaw.includes('botany')) return 'stream-bipc';
      if (streamRaw.includes('pcmb')) return 'stream-pcmb';
      if (streamRaw.includes('mec') || (streamRaw.includes('math') && streamRaw.includes('commerce'))) return 'stream-mec';
      if (streamRaw.includes('cec') || (streamRaw.includes('civic') && streamRaw.includes('commerce'))) return 'stream-cec';
      if (streamRaw.includes('hec') || streamRaw.includes('arts') || streamRaw.includes('humanities')) return 'stream-hec';
      if (streamRaw.includes('vocational') || streamRaw.includes('skill')) return 'stream-vocational';
      return 'stage-intermediate';
    }

    // 3. Polytechnic Diploma Branches
    if (levelRaw.includes('diploma') || levelRaw.includes('polytechnic') || streamRaw.includes('dip_')) {
      if (streamRaw.includes('cse') || branchRaw.includes('computer')) return 'branch-polytechnic-cse';
      if (streamRaw.includes('mech') || branchRaw.includes('mechanical')) return 'branch-polytechnic-mech';
      if (streamRaw.includes('civil') || branchRaw.includes('civil')) return 'branch-polytechnic-civil';
      if (streamRaw.includes('ece') || streamRaw.includes('eee') || branchRaw.includes('electronics') || branchRaw.includes('electrical')) return 'branch-polytechnic-ece-eee';
      return 'stage-diploma';
    }

    // 4. ITI / Vocational
    if (levelRaw.includes('iti') || levelRaw.includes('vocational')) {
      if (streamRaw.includes('electrician') || branchRaw.includes('electrician')) return 'branch-iti-electrician';
      if (streamRaw.includes('fitter') || branchRaw.includes('fitter')) return 'branch-iti-fitter';
      if (streamRaw.includes('copa') || branchRaw.includes('copa')) return 'branch-iti-copa';
      return 'stage-iti';
    }

    // 5. Undergraduate Degrees & Branches
    if (levelRaw.includes('undergraduate') || levelRaw.includes('bachelor') || levelRaw.includes('degree') || levelRaw.includes('btech') || levelRaw.includes('b.tech') || levelRaw.includes('bcom') || levelRaw.includes('bca') || levelRaw.includes('mbbs')) {
      if (streamRaw.includes('btech') || streamRaw.includes('b.tech') || streamRaw.includes('engineering')) {
        if (branchRaw.includes('cse') || branchRaw.includes('computer') || branchRaw.includes('software')) return 'branch-btech-cse';
        if (branchRaw.includes('ai') || branchRaw.includes('data') || branchRaw.includes('machine learning')) return 'branch-btech-ai-ds';
        if (branchRaw.includes('cyber') || branchRaw.includes('security')) return 'branch-btech-cybersecurity';
        if (branchRaw.includes('ece') || branchRaw.includes('electronics')) return 'branch-btech-ece';
        if (branchRaw.includes('eee') || branchRaw.includes('electrical')) return 'branch-btech-eee';
        if (branchRaw.includes('mech') || branchRaw.includes('mechanical')) return 'branch-btech-mech';
        if (branchRaw.includes('civil')) return 'branch-btech-civil';
        if (branchRaw.includes('aero') || branchRaw.includes('aviation')) return 'branch-btech-aero';
        if (branchRaw.includes('chem') || branchRaw.includes('chemical')) return 'branch-btech-chem';
        return 'degree-btech';
      }
      if (streamRaw.includes('bca') || branchRaw.includes('application')) return 'degree-bca';
      if (streamRaw.includes('bcom') || streamRaw.includes('b.com') || branchRaw.includes('commerce') || branchRaw.includes('account')) return 'degree-bcom';
      if (streamRaw.includes('bba') || streamRaw.includes('bms') || branchRaw.includes('business') || branchRaw.includes('management')) return 'degree-bba';
      if (streamRaw.includes('mbbs') || branchRaw.includes('medicine') || branchRaw.includes('surgery')) return 'degree-mbbs';
      if (streamRaw.includes('bds') || branchRaw.includes('dental')) return 'degree-bds';
      if (streamRaw.includes('pharm') || branchRaw.includes('pharmacy')) return 'degree-pharmacy';
      if (streamRaw.includes('nurs') || branchRaw.includes('allied')) return 'degree-nursing-allied';
      if (streamRaw.includes('agri') || branchRaw.includes('agriculture')) return 'degree-agri-biotech';
      if (streamRaw.includes('law') || streamRaw.includes('llb') || streamRaw.includes('ll.b')) return 'degree-law';
      if (streamRaw.includes('des') || branchRaw.includes('design')) return 'degree-bdes';
      if (streamRaw.includes('journal') || streamRaw.includes('media') || streamRaw.includes('bjmc')) return 'degree-bjmc';
      if (streamRaw.includes('pilot') || streamRaw.includes('cpl')) return 'degree-pilot-cpl';
      if (streamRaw.includes('bsc') || streamRaw.includes('b.sc') || streamRaw.includes('science')) return 'degree-bsc-mpc';
    }

    // Default fallback to Class 10 Foundation
    return 'stage-class-10';
  }

  /**
   * Deterministically returns the complete Indian Education-to-Career progression tree,
   * flat searchable nodes, comparison presets, and optional user "YOU ARE HERE" marker.
   */
  public static async getEducationPathways(userId?: string): Promise<IEducationPathwaysResponse> {
    const hydratedTreeRoot = this.hydrateTreeNode(INDIAN_EDUCATION_TREE);
    const hydratedAllNodes = ALL_EDUCATION_NODES.map(node => this.hydrateTreeNode(node));

    let currentEducation: ICurrentEducationContext | null = null;
    let userCurrentNodeId: string | null = null;
    let fallbackPathways: IResolvedEducationPathway[] = [];

    if (userId) {
      try {
        const [userContext, rawProfile] = await Promise.all([
          PersonalizationService.getPersonalizationContext(userId),
          UserProfile.findOne({ userId })
        ]);

        if (rawProfile?.education || userContext) {
          const rawEdu = rawProfile?.education;
          currentEducation = {
            level: rawEdu?.level || userContext.educationLevel || 'General Studies',
            currentClass: rawEdu?.currentClass || userContext.currentClass || '',
            studyYear: rawEdu?.studyYear || userContext.studyYear || '',
            stream: rawEdu?.stream || userContext.discipline || 'General Studies',
            branchSpecialization: rawEdu?.branchSpecialization || userContext.specialization || '',
            institution: rawEdu?.institution || userContext.institution || '',
            graduationYear: rawEdu?.graduationYear || userContext.graduationYear,
            courses: rawEdu?.courses || userContext.courses || []
          };

          userCurrentNodeId = this.matchUserCurrentNodeId(rawEdu, userContext);
        }
      } catch (err) {
        console.warn('Could not load user profile for YOU ARE HERE marker:', err);
      }
    }

    // Resolve legacy pathways list for backwards compatibility
    fallbackPathways = EDUCATION_PATHWAYS.map(p => ({
      ...p,
      resolvedCareers: this.resolveCareerObjects(p.careers, p.category),
      fitScore: 85,
      fitReason: 'Standard pathway match'
    }));

    return {
      currentEducation,
      userCurrentNodeId,
      treeRoot: hydratedTreeRoot,
      allNodes: hydratedAllNodes,
      comparisonPresets: PATHWAY_COMPARISON_PRESETS,
      pathways: fallbackPathways
    };
  }

  /**
   * Pure deterministic pathway and tree resolver given personalization context and profile education.
   */
  public static resolvePathwaysForProfile(
    ctx: IPersonalizationContext,
    rawEducation?: IUserProfile['education']
  ): IEducationPathwaysResponse {
    const userCurrentNodeId = this.matchUserCurrentNodeId(rawEducation, ctx);
    const hydratedTreeRoot = this.hydrateTreeNode(INDIAN_EDUCATION_TREE);
    const hydratedAllNodes = ALL_EDUCATION_NODES.map(node => this.hydrateTreeNode(node));

    const currentEducation: ICurrentEducationContext = {
      level: rawEducation?.level || ctx.educationLevel || 'General Studies',
      currentClass: rawEducation?.currentClass || ctx.currentClass || '',
      studyYear: rawEducation?.studyYear || ctx.studyYear || '',
      stream: rawEducation?.stream || ctx.discipline || 'General Studies',
      branchSpecialization: rawEducation?.branchSpecialization || ctx.specialization || '',
      institution: rawEducation?.institution || ctx.institution || '',
      graduationYear: rawEducation?.graduationYear || ctx.graduationYear,
      courses: rawEducation?.courses || ctx.courses || []
    };

    const fallbackPathways = EDUCATION_PATHWAYS.map(p => ({
      ...p,
      resolvedCareers: this.resolveCareerObjects(p.careers, p.category),
      fitScore: 85,
      fitReason: 'Deterministic profile match'
    }));

    return {
      currentEducation,
      userCurrentNodeId,
      treeRoot: hydratedTreeRoot,
      allNodes: hydratedAllNodes,
      comparisonPresets: PATHWAY_COMPARISON_PRESETS,
      pathways: fallbackPathways
    };
  }
}
