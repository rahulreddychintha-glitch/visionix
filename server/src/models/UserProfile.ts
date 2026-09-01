import mongoose, { Schema, Document } from 'mongoose';

export interface IVerifiedSkill {
  name: string;
  verifiedAt: Date;
  source: string;
  assessmentId?: string;
  careerId?: string;
  milestoneId?: string;
  score?: number;
}

export interface IUserProfile {
  userId: mongoose.Types.ObjectId;
  personal: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    gender?: string;
    country?: string;
    state?: string;
    city?: string;
  };
  education: {
    level?: string;
    studentStatus?: string;
    institution?: string;
    stream?: string;
    branchSpecialization?: string;
    currentOccupation?: string;
    graduationYear?: number;
    higherEducationPlans?: string;
    studyYear?: string;
    currentClass?: string;
    courses?: Array<{
      stream?: string;
      branchSpecialization?: string;
      studyYear?: string;
      institution?: string;
    }>;
  };
  experience?: {
    yearsOfExperience?: string;
    currentRole?: string;
  };
  interests: {
    careerInterests: string[];
    favouriteSubjects: string[];
    technologies: string[];
    industries: string[];
  };
  skills: {
    technicalSkills: string[];
    softSkills: string[];
    languages: string[];
    certifications?: string[];
    portfolioLinks?: {
      github?: string;
      linkedin?: string;
      portfolio?: string;
      other?: string;
    };
    skillLevels: Map<string, string>;
    verifiedSkills?: IVerifiedSkill[];
  };
  careerGoals: {
    dreamCareer?: string;
    preferredIndustries: string[];
    salaryGoal?: string;
    careerObjectives?: string;
    preferredJobType?: string;
    preferredLocation?: string;
    longTermAspirations?: string;
  };
  learningPreferences: {
    learningStyle?: string;
    weeklyStudyTime?: number;
    preferredResources: string[];
  };
  workPreferences: {
    remoteHybridOffice?: string;
    startupEnterprise?: string;
    teamSize?: string;
  };
  onboarding: {
    currentStep: number;
    completed: boolean;
    completedAt?: Date;
    lastSavedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfileDocument extends IUserProfile, Document {}

const VerifiedSkillSchema = new Schema<IVerifiedSkill>(
  {
    name: { type: String, required: true },
    verifiedAt: { type: Date, default: Date.now },
    source: { type: String, default: 'milestone_assessment' },
    assessmentId: { type: String },
    careerId: { type: String },
    milestoneId: { type: String },
    score: { type: Number },
  },
  { _id: false }
);

const UserProfileSchema = new Schema<IUserProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
      index: true,
    },
    personal: {
      fullName: {
        type: String,
        trim: true,
      },
      firstName: {
        type: String,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
      dateOfBirth: {
        type: Date,
      },
      gender: {
        type: String,
        default: '',
      },
      country: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
    },
    education: {
      level: {
        type: String,
        trim: true,
      },
      studentStatus: {
        type: String,
        trim: true,
        default: '',
      },
      institution: {
        type: String,
        trim: true,
      },
      stream: {
        type: String,
        trim: true,
      },
      branchSpecialization: {
        type: String,
        trim: true,
        default: '',
      },
      currentOccupation: {
        type: String,
        trim: true,
        default: '',
      },
      graduationYear: {
        type: Number,
      },
      higherEducationPlans: {
        type: String,
        trim: true,
        default: '',
      },
      studyYear: {
        type: String,
        trim: true,
        default: '',
      },
      currentClass: {
        type: String,
        trim: true,
        default: '',
      },
      courses: {
        type: [
          {
            stream: { type: String, trim: true },
            branchSpecialization: { type: String, trim: true, default: '' },
            studyYear: { type: String, trim: true, default: '' },
            institution: { type: String, trim: true, default: '' },
          },
        ],
        default: [],
      },
    },
    experience: {
      yearsOfExperience: {
        type: String,
        trim: true,
        default: '',
      },
      currentRole: {
        type: String,
        trim: true,
        default: '',
      },
    },
    interests: {
      careerInterests: {
        type: [String],
        default: [],
      },
      favouriteSubjects: {
        type: [String],
        default: [],
      },
      technologies: {
        type: [String],
        default: [],
      },
      industries: {
        type: [String],
        default: [],
      },
    },
    skills: {
      technicalSkills: {
        type: [String],
        default: [],
      },
      softSkills: {
        type: [String],
        default: [],
      },
      languages: {
        type: [String],
        default: [],
      },
      certifications: {
        type: [String],
        default: [],
      },
      portfolioLinks: {
        github: { type: String, trim: true, default: '' },
        linkedin: { type: String, trim: true, default: '' },
        portfolio: { type: String, trim: true, default: '' },
        other: { type: String, trim: true, default: '' },
      },
      skillLevels: {
        type: Map,
        of: String,
        default: {},
      },
      verifiedSkills: {
        type: [VerifiedSkillSchema],
        default: [],
      },
    },
    careerGoals: {
      dreamCareer: {
        type: String,
        trim: true,
      },
      preferredIndustries: {
        type: [String],
        default: [],
      },
      salaryGoal: {
        type: String,
        trim: true,
      },
      careerObjectives: {
        type: String,
        default: '',
      },
      preferredJobType: {
        type: String,
        trim: true,
        default: '',
      },
      preferredLocation: {
        type: String,
        trim: true,
        default: '',
      },
      longTermAspirations: {
        type: String,
        default: '',
      },
    },
    learningPreferences: {
      learningStyle: {
        type: String,
        trim: true,
      },
      weeklyStudyTime: {
        type: Number,
      },
      preferredResources: {
        type: [String],
        default: [],
      },
    },
    workPreferences: {
      remoteHybridOffice: {
        type: String,
        trim: true,
      },
      startupEnterprise: {
        type: String,
        trim: true,
      },
      teamSize: {
        type: String,
        trim: true,
      },
    },
    onboarding: {
      currentStep: {
        type: Number,
        default: 0,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      completedAt: {
        type: Date,
      },
      lastSavedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const UserProfile = mongoose.model<IUserProfileDocument>('UserProfile', UserProfileSchema);
