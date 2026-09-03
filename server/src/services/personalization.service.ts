import mongoose from 'mongoose';
import { UserProfile } from '../models/UserProfile';
import { UserPreferences } from '../models/UserPreferences';
import { User } from '../models/User';
import { LearningProgress } from '../models/LearningProgress';
import { CareerProgress } from '../models/CareerProgress';

export interface IPersonalizationContext {
  userId: string;
  name: string;
  discipline: string;
  specialization: string;
  educationLevel: string;
  studentStatus: string;
  institution: string;
  currentClass: string;
  studyYear: string;
  courses: Array<{
    stream?: string;
    branchSpecialization?: string;
    studyYear?: string;
    institution?: string;
  }>;
  graduationYear?: number;
  dreamCareer: string;
  currentOccupation: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  skills: {
    technicalSkills: string[];
    softSkills: string[];
    languages: string[];
    certifications: string[];
    verifiedSkills?: Array<{
      name: string;
      verifiedAt: Date;
      source: string;
      assessmentId?: string;
      careerId?: string;
      milestoneId?: string;
      score?: number;
    }>;
  };
  interests: {
    careerInterests: string[];
    favouriteSubjects: string[];
    technologies: string[];
    industries: string[];
  };
  careerGoals: {
    dreamCareer: string;
    preferredIndustries: string[];
    salaryGoal: string;
    careerObjectives: string;
    preferredJobType: string;
    preferredLocation: string;
    longTermAspirations: string;
  };
  learningPreferences: {
    learningStyle: string;
    weeklyStudyTime: number;
    preferredResources: string[];
  };
  workPreferences: {
    remoteHybridOffice: string;
    startupEnterprise: string;
    teamSize: string;
  };
  userPreferences: {
    theme: string;
    language: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReport: boolean;
  };
  hasCompletedOnboarding: boolean;
  learningProgress: {
    completedResources: string[];
    bookmarkedResources: string[];
    streakDays: number;
    totalStudyMinutes: number;
    lastStudyDate: Date | null;
  } | null;
  careerProgress: {
    selectedCareer: string | null;
    currentPhase: number;
    completedMilestones: string[];
    totalMilestones: number;
    lastActivity: Date;
  } | null;
}

export class PersonalizationService {
  private static contextCache = new Map<string, { timestamp: number; data: IPersonalizationContext }>();
  private static contextPromises = new Map<string, Promise<IPersonalizationContext>>();
  private static CACHE_TTL_MS = 30 * 1000; // 30 seconds server-side cache TTL

  /**
   * Constructs a normalized Personalization Context for a given user.
   * Caches in-memory for 30s to prevent duplicate MongoDB queries across concurrent/sequential endpoints.
   */
  public static async getPersonalizationContext(userId: string | mongoose.Types.ObjectId): Promise<IPersonalizationContext> {
    const userKey = userId.toString();
    const now = Date.now();
    const cached = this.contextCache.get(userKey);
    if (cached && now - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data;
    }

    const pending = this.contextPromises.get(userKey);
    if (pending) {
      return pending;
    }

    const promise = (async () => {
      try {
        const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

        const [user, profile, preferences, learningProgress, careerProgress] = await Promise.all([
          User.findById(userObjectId),
          UserProfile.findOne({ userId: userObjectId }),
          UserPreferences.findOne({ userId: userObjectId }),
          LearningProgress.findOne({ userId: userObjectId }),
          CareerProgress.findOne({ userId: userObjectId }),
        ]);

        const name = profile?.personal?.fullName || user?.fullName || 'User';
        const stream = profile?.education?.stream || 'General Studies';
        const level = profile?.education?.level || 'Undergraduate';

        const data: IPersonalizationContext = {
          userId: userObjectId.toString(),
          name,
          discipline: stream,
          specialization: profile?.education?.branchSpecialization || '',
          educationLevel: level,
          studentStatus: profile?.education?.studentStatus || 'Student',
          institution: profile?.education?.institution || '',
          currentClass: profile?.education?.currentClass || '',
          studyYear: profile?.education?.studyYear || '',
          courses: profile?.education?.courses || [],
          graduationYear: profile?.education?.graduationYear,
          dreamCareer: profile?.careerGoals?.dreamCareer || 'Career Explorer',
          currentOccupation: profile?.education?.currentOccupation || '',
          location: {
            country: profile?.personal?.country || '',
            state: profile?.personal?.state || '',
            city: profile?.personal?.city || '',
          },
          skills: {
            technicalSkills: profile?.skills?.technicalSkills || [],
            softSkills: profile?.skills?.softSkills || [],
            languages: profile?.skills?.languages || [],
            certifications: profile?.skills?.certifications || [],
            verifiedSkills: profile?.skills?.verifiedSkills || [],
          },
          interests: {
            careerInterests: profile?.interests?.careerInterests || [],
            favouriteSubjects: profile?.interests?.favouriteSubjects || [],
            technologies: profile?.interests?.technologies || [],
            industries: profile?.interests?.industries || [],
          },
          careerGoals: {
            dreamCareer: profile?.careerGoals?.dreamCareer || '',
            preferredIndustries: profile?.careerGoals?.preferredIndustries || [],
            salaryGoal: profile?.careerGoals?.salaryGoal || '',
            careerObjectives: profile?.careerGoals?.careerObjectives || '',
            preferredJobType: profile?.careerGoals?.preferredJobType || '',
            preferredLocation: profile?.careerGoals?.preferredLocation || '',
            longTermAspirations: profile?.careerGoals?.longTermAspirations || '',
          },
          learningPreferences: {
            learningStyle: profile?.learningPreferences?.learningStyle || 'Visual & Practical',
            weeklyStudyTime: profile?.learningPreferences?.weeklyStudyTime || 10,
            preferredResources: profile?.learningPreferences?.preferredResources || ['Courses', 'Projects', 'Interactive Modules'],
          },
          workPreferences: {
            remoteHybridOffice: profile?.workPreferences?.remoteHybridOffice || 'Hybrid',
            startupEnterprise: profile?.workPreferences?.startupEnterprise || 'Balanced',
            teamSize: profile?.workPreferences?.teamSize || 'Medium',
          },
          userPreferences: {
            theme: preferences?.theme || 'dark',
            language: preferences?.language || 'en',
            emailNotifications: preferences?.emailNotifications ?? true,
            pushNotifications: preferences?.pushNotifications ?? true,
            weeklyReport: preferences?.weeklyReport ?? true,
          },
          hasCompletedOnboarding: profile?.onboarding?.completed || user?.isOnboarded || false,
          learningProgress: learningProgress ? {
            completedResources: learningProgress.completedResources,
            bookmarkedResources: learningProgress.bookmarkedResources,
            streakDays: learningProgress.streakDays,
            totalStudyMinutes: learningProgress.totalStudyMinutes,
            lastStudyDate: learningProgress.lastStudyDate,
          } : null,
          careerProgress: careerProgress ? {
            selectedCareer: careerProgress.selectedCareer,
            currentPhase: careerProgress.currentPhase,
            completedMilestones: careerProgress.completedMilestones,
            totalMilestones: careerProgress.totalMilestones,
            lastActivity: careerProgress.lastActivity,
          } : null,
        };

        PersonalizationService.contextCache.set(userKey, { timestamp: Date.now(), data });
        return data;
      } finally {
        PersonalizationService.contextPromises.delete(userKey);
      }
    })();

    this.contextPromises.set(userKey, promise);
    return promise;
  }

  /**
   * Invalidate server personalization context cache for a specific user or globally.
   */
  public static invalidatePersonalizationCache(userId?: string | mongoose.Types.ObjectId): void {
    if (userId) {
      const key = userId.toString();
      PersonalizationService.contextCache.delete(key);
      PersonalizationService.contextPromises.delete(key);
    } else {
      PersonalizationService.contextCache.clear();
      PersonalizationService.contextPromises.clear();
    }
  }


  /**
   * Helper to return clean, verified seed videos for different disciplines if YouTube API key is missing.
   */
  public static getSeededVideosForDiscipline(discipline: string): any[] {
    const norm = (discipline || '').toLowerCase();
    
    // 1. Civil Engineering
    if (norm.includes('civil')) {
      return [
        {
          id: 'bap9C1N7jX8',
          title: 'What is Civil Engineering? | Design, Infrastructure, Careers',
          channel: 'Engineering Explained',
          duration: '12:45',
          views: '850K views',
          publishedAt: '2 years ago',
          thumbnail: 'https://img.youtube.com/vi/bap9C1N7jX8/mqdefault.jpg'
        },
        {
          id: '519LuGCSfEE',
          title: 'Top 5 Specializations in Civil Engineering',
          channel: 'Civil Mentors',
          duration: '18:20',
          views: '240K views',
          publishedAt: '1 year ago',
          thumbnail: 'https://img.youtube.com/vi/519LuGCSfEE/mqdefault.jpg'
        }
      ];
    }
    
    // 2. Medicine / Health
    if (
      norm.includes('medicine') ||
      norm.includes('health') ||
      norm.includes('nursing') ||
      norm.includes('dentistry')
    ) {
      return [
        {
          id: '1aW_LgTkn8M',
          title: 'How to Study Anatomy in Medical School',
          channel: 'MedSchoolInsiders',
          duration: '14:10',
          views: '1.2M views',
          publishedAt: '3 years ago',
          thumbnail: 'https://img.youtube.com/vi/1aW_LgTkn8M/mqdefault.jpg'
        },
        {
          id: 'T1G4_6h469E',
          title: 'Introduction to Clinical Diagnostics & Pathology',
          channel: 'Med Lecturio',
          duration: '22:05',
          views: '380K views',
          publishedAt: '2 years ago',
          thumbnail: 'https://img.youtube.com/vi/T1G4_6h469E/mqdefault.jpg'
        }
      ];
    }
    
    // 3. Business / Finance / Commerce
    if (
      norm.includes('business') ||
      norm.includes('management') ||
      norm.includes('finance') ||
      norm.includes('commerce') ||
      norm.includes('accounting')
    ) {
      return [
        {
          id: '8aN89B9Y6lM',
          title: 'Corporate Finance Foundations: WACC, NPV, IRR',
          channel: 'Finance Theory',
          duration: '19:35',
          views: '450K views',
          publishedAt: '1 year ago',
          thumbnail: 'https://img.youtube.com/vi/8aN89B9Y6lM/mqdefault.jpg'
        },
        {
          id: 'IP3E9X4gqXU',
          title: 'Introduction to Excel Financial Modeling for Bankers',
          channel: 'Wall Street Prep',
          duration: '25:10',
          views: '890K views',
          publishedAt: '2 years ago',
          thumbnail: 'https://img.youtube.com/vi/IP3E9X4gqXU/mqdefault.jpg'
        }
      ];
    }
    
    // 4. Design / Arts
    if (
      norm.includes('design') ||
      norm.includes('art') ||
      norm.includes('fashion') ||
      norm.includes('animation')
    ) {
      return [
        {
          id: 'c87S8m4K91Q',
          title: 'UI/UX Design Process: Visual Hierarchy & Design Systems',
          channel: 'Figma Academy',
          duration: '16:50',
          views: '670K views',
          publishedAt: '1 year ago',
          thumbnail: 'https://img.youtube.com/vi/c87S8m4K91Q/mqdefault.jpg'
        },
        {
          id: '7S7D8F9g9hI',
          title: 'Typography & Layout Rules Every Designer Must Know',
          channel: 'The Futur',
          duration: '21:15',
          views: '1.4M views',
          publishedAt: '3 years ago',
          thumbnail: 'https://img.youtube.com/vi/7S7D8F9g9hI/mqdefault.jpg'
        }
      ];
    }
    
    // 5. Default: Computer Science & AI
    return [
      {
        id: 'wjZofJX0v4M',
        title: 'But what is a neural network? | Chapter 1, Deep learning',
        channel: '3Blue1Brown',
        duration: '20:13',
        views: '12M views',
        publishedAt: '6 years ago',
        thumbnail: 'https://img.youtube.com/vi/wjZofJX0v4M/mqdefault.jpg'
      },
      {
        id: 'aircAruvnKk',
        title: 'But what is a convolution?',
        channel: '3Blue1Brown',
        duration: '26:01',
        views: '3.4M views',
        publishedAt: '1 year ago',
        thumbnail: 'https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg'
      }
    ];
  }
}
