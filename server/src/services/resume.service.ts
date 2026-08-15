import mongoose from 'mongoose';
import { Resume, IResumeDocument } from '../models/Resume';
import { UserProfile } from '../models/UserProfile';
import { User } from '../models/User';

export class ResumeService {
  /**
   * Fetch all resumes belonging to a user.
   */
  public static async getUserResumes(userId: string): Promise<IResumeDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return [];
    }
    return Resume.find({ userId }).sort({ updatedAt: -1 });
  }

  /**
   * Fetch a single resume by ID, enforcing user ownership.
   */
  public static async getResumeById(userId: string, resumeId: string): Promise<IResumeDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(resumeId)) {
      return null;
    }
    return Resume.findOne({ _id: resumeId, userId });
  }

  /**
   * Helper to format existing UserProfile & User data into resume-compatible prefill values.
   * Does NOT overwrite the UserProfile.
   */
  public static async getProfilePrefillData(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }

    const user = await User.findById(userId);
    const profile = await UserProfile.findOne({ userId });

    const fullName = profile?.personal?.fullName || user?.fullName || '';
    const email = user?.email || '';
    const locationParts = [profile?.personal?.city, profile?.personal?.state, profile?.personal?.country].filter(Boolean);
    const location = locationParts.join(', ');

    // Extract education
    const education = [];
    if (profile?.education?.institution || profile?.education?.level || profile?.education?.stream) {
      education.push({
        institution: profile.education.institution || 'University / College',
        degree: profile.education.level || 'Degree',
        fieldOfStudy: profile.education.stream || profile.education.branchSpecialization || '',
        startDate: '',
        endDate: profile.education.graduationYear ? String(profile.education.graduationYear) : '',
        current: profile.education.studentStatus === 'Enrolled' || profile.education.studentStatus === 'Currently Studying',
        grade: '',
        description: '',
      });
    }

    // Extract experience
    const experience = [];
    if (profile?.experience?.currentRole) {
      experience.push({
        company: 'Current Company / Organization',
        position: profile.experience.currentRole,
        location: location || '',
        startDate: '',
        endDate: '',
        current: true,
        description: profile.experience.yearsOfExperience ? `Experience: ${profile.experience.yearsOfExperience}` : '',
        highlights: [],
      });
    }

    // Extract verified skills + profile skills
    const technicalSkills = new Set<string>();
    (profile?.skills?.technicalSkills || []).forEach((s) => technicalSkills.add(s));
    (profile?.skills?.verifiedSkills || []).forEach((vs) => {
      const name = typeof vs === 'string' ? vs : vs.name;
      if (name) technicalSkills.add(name);
    });

    const softSkills = profile?.skills?.softSkills || [];
    const languages = (profile?.skills?.languages || []).map((lang) => ({
      name: lang,
      proficiency: 'Fluent',
    }));

    const certifications = (profile?.skills?.certifications || []).map((cert) => ({
      name: cert,
      issuer: 'Verified Institution',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      url: '',
    }));

    const links = profile?.skills?.portfolioLinks;

    return {
      title: profile?.careerGoals?.dreamCareer ? `${profile.careerGoals.dreamCareer} Resume` : 'My Professional Resume',
      targetRole: profile?.careerGoals?.dreamCareer || '',
      templateId: 'modern' as const,
      personalInfo: {
        fullName,
        email,
        phone: '',
        location,
        linkedin: links?.linkedin || '',
        github: links?.github || '',
        portfolio: links?.portfolio || '',
        website: links?.other || '',
      },
      summary: profile?.careerGoals?.careerObjectives || '',
      education,
      experience,
      projects: [],
      skills: {
        technical: Array.from(technicalSkills),
        soft: softSkills,
        tools: [],
      },
      certifications,
      achievements: [],
      languages,
      customSections: [],
    };
  }

  /**
   * Create a new resume for the user, with optional prefill from UserProfile.
   */
  public static async createResume(
    userId: string,
    data: any = {},
    prefillFromProfile: boolean = false
  ): Promise<IResumeDocument> {
    let initialData = { ...data };

    if (prefillFromProfile) {
      const prefill = await this.getProfilePrefillData(userId);
      if (prefill) {
        initialData = {
          title: initialData.title || prefill.title,
          targetRole: initialData.targetRole || prefill.targetRole,
          personalInfo: {
            ...prefill.personalInfo,
            ...(initialData.personalInfo || {}),
          },
          summary: initialData.summary || prefill.summary,
          education: initialData.education && initialData.education.length > 0 ? initialData.education : prefill.education,
          experience: initialData.experience && initialData.experience.length > 0 ? initialData.experience : prefill.experience,
          projects: initialData.projects || [],
          skills: {
            technical: initialData.skills?.technical || prefill.skills.technical,
            soft: initialData.skills?.soft || prefill.skills.soft,
            tools: initialData.skills?.tools || [],
          },
          certifications: initialData.certifications && initialData.certifications.length > 0 ? initialData.certifications : prefill.certifications,
          achievements: initialData.achievements || [],
          languages: initialData.languages && initialData.languages.length > 0 ? initialData.languages : prefill.languages,
          customSections: initialData.customSections || [],
        };
      }
    }

    const resume = new Resume({
      ...initialData,
      userId: new mongoose.Types.ObjectId(userId),
    });

    return resume.save();
  }

  /**
   * Update an existing resume, enforcing user ownership.
   */
  public static async updateResume(
    userId: string,
    resumeId: string,
    data: any
  ): Promise<IResumeDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(resumeId)) {
      return null;
    }

    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      return null;
    }

    // Do not allow changing userId
    delete data.userId;
    delete data._id;

    Object.assign(resume, data);
    return resume.save();
  }

  /**
   * Delete an existing resume, enforcing user ownership.
   */
  public static async deleteResume(userId: string, resumeId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(resumeId)) {
      return false;
    }

    const result = await Resume.deleteOne({ _id: resumeId, userId });
    return result.deletedCount === 1;
  }
}
