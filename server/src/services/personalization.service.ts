import mongoose from 'mongoose';
import { UserProfile } from '../models/UserProfile';
import { UserPreferences } from '../models/UserPreferences';
import { User } from '../models/User';

export interface IPersonalizationContext {
  userId: string;
  name: string;
  discipline: string;
  educationLevel: string;
  studentStatus: string;
  institution: string;
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
}

export class PersonalizationService {
  /**
   * Constructs a normalized Personalization Context for a given user.
   */
  public static async getPersonalizationContext(userId: string | mongoose.Types.ObjectId): Promise<IPersonalizationContext> {
    const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

    const [user, profile, preferences] = await Promise.all([
      User.findById(userObjectId),
      UserProfile.findOne({ userId: userObjectId }),
      UserPreferences.findOne({ userId: userObjectId }),
    ]);

    const name = profile?.personal?.fullName || user?.fullName || 'User';
    const stream = profile?.education?.stream || 'General Studies';
    const level = profile?.education?.level || 'Undergraduate';

    return {
      userId: userObjectId.toString(),
      name,
      discipline: stream,
      educationLevel: level,
      studentStatus: profile?.education?.studentStatus || 'Student',
      institution: profile?.education?.institution || '',
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
    };
  }
}
