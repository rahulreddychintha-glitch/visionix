import api from './api';

export type EducationNodeType =
  | 'education_stage'
  | 'stream'
  | 'degree_family'
  | 'branch'
  | 'specialization'
  | 'higher_study'
  | 'qualification';

export interface PathwayCareerRef {
  id: string;
  title: string;
  category: string;
  salaryRange?: string;
  growthRate?: string;
  demandLevel?: string;
}

export interface EducationTreeNode {
  id: string;
  title: string;
  subtitle?: string;
  shortCode?: string;
  nodeType: EducationNodeType;
  category: string;
  description: string;
  duration?: string;
  eligibility?: string;
  entranceExams?: string[];
  majorBranches?: string[];
  higherStudyOptions?: string[];
  skills?: string[];
  outcomes?: string[];
  careerIds?: string[];
  resolvedCareers?: PathwayCareerRef[];
  children?: EducationTreeNode[];
  isDirectFit?: boolean;
}

export interface PathwayComparisonPreset {
  id: string;
  title: string;
  description: string;
  nodeIds: string[];
}

export interface CurrentEducationContext {
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

export interface EducationPathway {
  id: string;
  title: string;
  category: string;
  description: string;
  applicableTo: {
    levels: string[];
    streams: string[];
    branches?: string[];
    currentClasses?: string[];
  };
  nextEducationOptions: string[];
  courses: string[];
  entranceExams: string[];
  duration: string;
  skills: string[];
  resolvedCareers: PathwayCareerRef[];
  keyOutcomes: string[];
  isDirectStreamFit: boolean;
  fitScore: number;
  fitReason: string;
}

export interface EducationPathwaysResponse {
  currentEducation: CurrentEducationContext | null;
  userCurrentNodeId: string | null;
  treeRoot: EducationTreeNode;
  allNodes: EducationTreeNode[];
  comparisonPresets: PathwayComparisonPreset[];
  pathways: EducationPathway[];
}

export class EducationPathwayService {
  private static cache: { timestamp: number; data: EducationPathwaysResponse } | null = null;
  private static pendingPromise: Promise<EducationPathwaysResponse> | null = null;
  private static CACHE_TTL_MS = 30 * 1000; // 30s cache

  /**
   * Fetch the standalone Indian Education Tree and personal context from the backend.
   */
  public static async getPathways(forceRefresh = false): Promise<EducationPathwaysResponse> {
    const now = Date.now();
    if (!forceRefresh && this.cache && now - this.cache.timestamp < this.CACHE_TTL_MS) {
      return this.cache.data;
    }

    if (!forceRefresh && this.pendingPromise) {
      return this.pendingPromise;
    }

    this.pendingPromise = (async () => {
      try {
        const response = await api.get('/education-pathways');
        const data = response.data.data;
        EducationPathwayService.cache = { timestamp: Date.now(), data };
        return data;
      } finally {
        EducationPathwayService.pendingPromise = null;
      }
    })();

    return this.pendingPromise;
  }

  /**
   * Clear in-memory pathway cache.
   */
  public static clearCache(): void {
    this.cache = null;
    this.pendingPromise = null;
  }
}
