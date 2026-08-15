import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { UserProfile } from '../models/UserProfile';
import { UserPreferences } from '../models/UserPreferences';
import { Resume } from '../models/Resume';
import { ResumeAnalysis } from '../models/ResumeAnalysis';
import { Interview } from '../models/Interview';
import { CareerRoadmap } from '../models/CareerRoadmap';
import { CareerProgress } from '../models/CareerProgress';
import { CareerAssessment } from '../models/CareerAssessment';
import { BusinessProfile } from '../models/BusinessProfile';
import { BusinessIdea } from '../models/BusinessIdea';
import { StartupRoadmap } from '../models/StartupRoadmap';
import { SkillGapAnalysis } from '../models/SkillGapAnalysis';
import { LearningProgress } from '../models/LearningProgress';
import { SavedCareer } from '../models/SavedCareer';
import { AiConversationHistory } from '../models/AiConversationHistory';
import { DashboardSettings } from '../models/DashboardSettings';
import { BCRYPT_SALT_ROUNDS } from '../constants/auth.constants';

export interface ISettingsPayload {
  account: {
    fullName: string;
    email: string;
    avatar?: string;
    role: string;
    isOnboarded: boolean;
    createdAt: Date;
  };
  profile: {
    personal: any;
    education: any;
    experience: any;
    careerGoals: any;
  };
  preferences: {
    theme: 'dark' | 'light' | 'system';
    language: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReport: boolean;
    careerUpdates: boolean;
    learningReminders: boolean;
    assessmentReminders: boolean;
    interviewReminders: boolean;
    businessUpdates: boolean;
    aiRecommendationsEnabled: boolean;
    aiPersonalizedSuggestions: boolean;
    aiLearningAssistance: boolean;
  };
}

export class SettingsService {
  /**
   * Retrieves all settings and preferences for the authenticated user.
   */
  public static async getSettings(userId: string): Promise<ISettingsPayload> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [user, profile, preferences] = await Promise.all([
      User.findById(userObjectId),
      UserProfile.findOne({ userId: userObjectId }),
      UserPreferences.findOne({ userId: userObjectId }),
    ]);

    if (!user) {
      throw new Error('User account not found.');
    }

    let prefDoc = preferences;
    if (!prefDoc) {
      prefDoc = await UserPreferences.create({ userId: userObjectId });
    }

    return {
      account: {
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isOnboarded: user.isOnboarded,
        createdAt: user.createdAt,
      },
      profile: {
        personal: profile?.personal || {},
        education: profile?.education || {},
        experience: profile?.experience || {},
        careerGoals: profile?.careerGoals || {},
      },
      preferences: {
        theme: (prefDoc.theme as any) || 'dark',
        language: prefDoc.language || 'en',
        emailNotifications: prefDoc.emailNotifications ?? true,
        pushNotifications: prefDoc.pushNotifications ?? true,
        weeklyReport: prefDoc.weeklyReport ?? true,
        careerUpdates: prefDoc.careerUpdates ?? true,
        learningReminders: prefDoc.learningReminders ?? true,
        assessmentReminders: prefDoc.assessmentReminders ?? true,
        interviewReminders: prefDoc.interviewReminders ?? true,
        businessUpdates: prefDoc.businessUpdates ?? true,
        aiRecommendationsEnabled: prefDoc.aiRecommendationsEnabled ?? true,
        aiPersonalizedSuggestions: prefDoc.aiPersonalizedSuggestions ?? true,
        aiLearningAssistance: prefDoc.aiLearningAssistance ?? true,
      },
    };
  }

  /**
   * Updates user preferences, theme, notification settings, and AI toggles.
   */
  public static async updatePreferences(
    userId: string,
    updates: Partial<ISettingsPayload['preferences']>
  ): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    let prefDoc = await UserPreferences.findOne({ userId: userObjectId });
    if (!prefDoc) {
      prefDoc = new UserPreferences({ userId: userObjectId });
    }

    if (updates.theme) prefDoc.theme = updates.theme;
    if (updates.language) prefDoc.language = updates.language;
    if (typeof updates.emailNotifications === 'boolean') prefDoc.emailNotifications = updates.emailNotifications;
    if (typeof updates.pushNotifications === 'boolean') prefDoc.pushNotifications = updates.pushNotifications;
    if (typeof updates.weeklyReport === 'boolean') prefDoc.weeklyReport = updates.weeklyReport;
    if (typeof updates.careerUpdates === 'boolean') prefDoc.careerUpdates = updates.careerUpdates;
    if (typeof updates.learningReminders === 'boolean') prefDoc.learningReminders = updates.learningReminders;
    if (typeof updates.assessmentReminders === 'boolean') prefDoc.assessmentReminders = updates.assessmentReminders;
    if (typeof updates.interviewReminders === 'boolean') prefDoc.interviewReminders = updates.interviewReminders;
    if (typeof updates.businessUpdates === 'boolean') prefDoc.businessUpdates = updates.businessUpdates;
    if (typeof updates.aiRecommendationsEnabled === 'boolean') prefDoc.aiRecommendationsEnabled = updates.aiRecommendationsEnabled;
    if (typeof updates.aiPersonalizedSuggestions === 'boolean') prefDoc.aiPersonalizedSuggestions = updates.aiPersonalizedSuggestions;
    if (typeof updates.aiLearningAssistance === 'boolean') prefDoc.aiLearningAssistance = updates.aiLearningAssistance;

    await prefDoc.save();
    return prefDoc;
  }

  /**
   * Updates basic account & profile fields safely without touching Phase 12 verified skills.
   */
  public static async updateAccountProfile(
    userId: string,
    data: {
      fullName?: string;
      personal?: any;
      education?: any;
      experience?: any;
      careerGoals?: any;
    }
  ): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (data.fullName && data.fullName.trim().length >= 2) {
      await User.findByIdAndUpdate(userObjectId, {
        fullName: data.fullName.trim(),
      });
    }

    const profile = await UserProfile.findOne({ userId: userObjectId });
    if (profile) {
      if (data.personal) {
        profile.personal = { ...profile.personal, ...data.personal };
        if (data.fullName) profile.personal.fullName = data.fullName.trim();
      }
      if (data.education) {
        profile.education = { ...profile.education, ...data.education };
      }
      if (data.experience) {
        profile.experience = { ...profile.experience, ...data.experience };
      }
      if (data.careerGoals) {
        profile.careerGoals = { ...profile.careerGoals, ...data.careerGoals };
      }
      await profile.save();
    }
  }

  /**
   * Changes user password after verifying email and existing password.
   */
  public static async changePassword(
    userId: string,
    email: string,
    oldPass: string,
    newPass: string,
    confirmPass?: string
  ): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    if (!email || !email.trim()) {
      throw new Error('Email address is required.');
    }

    if (!newPass || newPass.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }

    if (confirmPass && confirmPass !== newPass) {
      throw new Error('New password and confirmation do not match.');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User account not found.');
    }

    if (user.email.toLowerCase() !== email.trim().toLowerCase()) {
      throw new Error('The provided email does not match the account currently logged in.');
    }

    const isMatch = await user.comparePassword(oldPass);
    if (!isMatch) {
      throw new Error('Current password is incorrect.');
    }

    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    user.password = await bcrypt.hash(newPass, salt);
    await user.save();
  }

  /**
   * Exports all authenticated user's data as a JSON archive.
   */
  public static async exportUserData(userId: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [
      user,
      profile,
      preferences,
      resumes,
      interviews,
      roadmaps,
      assessments,
      businessProfile,
      businessIdeas,
      skillGapAnalyses,
      learningProgress,
    ] = await Promise.all([
      User.findById(userObjectId).select('-password'),
      UserProfile.findOne({ userId: userObjectId }),
      UserPreferences.findOne({ userId: userObjectId }),
      Resume.find({ userId: userObjectId }),
      Interview.find({ userId: userObjectId }),
      CareerRoadmap.find({ userId: userObjectId }),
      CareerAssessment.find({ userId: userObjectId }),
      BusinessProfile.findOne({ userId: userObjectId }),
      BusinessIdea.find({ userId: userObjectId }),
      SkillGapAnalysis.find({ userId: userObjectId }),
      LearningProgress.findOne({ userId: userObjectId }),
    ]);

    return {
      exportMetadata: {
        platform: 'Visionix AI Career Guidance',
        exportedAt: new Date(),
        version: '1.0.0',
      },
      user,
      profile,
      preferences,
      resumes,
      interviews,
      roadmaps,
      assessments,
      businessProfile,
      businessIdeas,
      skillGapAnalyses,
      learningProgress,
    };
  }

  /**
   * Permanently deletes user account and all associated documents.
   */
  public static async deleteAccount(userId: string, pass: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(userObjectId);
    if (!user) {
      throw new Error('User not found.');
    }

    const isMatch = await user.comparePassword(pass);
    if (!isMatch) {
      throw new Error('Incorrect password. Account deletion aborted.');
    }

    // Clean up all collections for this user
    await Promise.all([
      User.findByIdAndDelete(userObjectId),
      UserProfile.deleteMany({ userId: userObjectId }),
      UserPreferences.deleteMany({ userId: userObjectId }),
      DashboardSettings.deleteMany({ userId: userObjectId }),
      Resume.deleteMany({ userId: userObjectId }),
      ResumeAnalysis.deleteMany({ userId: userObjectId }),
      Interview.deleteMany({ userId: userObjectId }),
      CareerRoadmap.deleteMany({ userId: userObjectId }),
      CareerProgress.deleteMany({ userId: userObjectId }),
      CareerAssessment.deleteMany({ userId: userObjectId }),
      BusinessProfile.deleteMany({ userId: userObjectId }),
      BusinessIdea.deleteMany({ userId: userObjectId }),
      StartupRoadmap.deleteMany({ userId: userObjectId }),
      SkillGapAnalysis.deleteMany({ userId: userObjectId }),
      LearningProgress.deleteMany({ userId: userObjectId }),
      SavedCareer.deleteMany({ userId: userObjectId }),
      AiConversationHistory.deleteMany({ userId: userObjectId }),
    ]);
  }
}
