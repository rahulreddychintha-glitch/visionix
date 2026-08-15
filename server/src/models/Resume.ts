import mongoose, { Schema, Document } from 'mongoose';

export interface IResumeEducation {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  grade?: string;
  description?: string;
}

export interface IResumeExperience {
  company: string;
  position: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  highlights?: string[];
}

export interface IResumeProject {
  name: string;
  description?: string;
  technologies?: string[];
  link?: string;
  github?: string;
  highlights?: string[];
}

export interface IResumeSkills {
  technical: string[];
  soft: string[];
  tools?: string[];
}

export interface IResumeCertification {
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface IResumeLanguage {
  name: string;
  proficiency?: string;
}

export interface IResumeCustomSection {
  heading: string;
  content: string;
}

export interface IResumePersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
}

export interface IResume {
  userId: mongoose.Types.ObjectId;
  title: string;
  targetRole?: string;
  templateId?: 'modern' | 'classic' | 'minimal';
  personalInfo: IResumePersonalInfo;
  summary?: string;
  education: IResumeEducation[];
  experience: IResumeExperience[];
  projects: IResumeProject[];
  skills: IResumeSkills;
  certifications: IResumeCertification[];
  achievements: string[];
  languages: IResumeLanguage[];
  customSections: IResumeCustomSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IResumeDocument extends IResume, Document {}

const ResumeEducationSchema = new Schema<IResumeEducation>(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, trim: true, default: '' },
    startDate: { type: String, trim: true, default: '' },
    endDate: { type: String, trim: true, default: '' },
    current: { type: Boolean, default: false },
    grade: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const ResumeExperienceSchema = new Schema<IResumeExperience>(
  {
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    location: { type: String, trim: true, default: '' },
    startDate: { type: String, trim: true, default: '' },
    endDate: { type: String, trim: true, default: '' },
    current: { type: Boolean, default: false },
    description: { type: String, trim: true, default: '' },
    highlights: { type: [String], default: [] },
  },
  { _id: false }
);

const ResumeProjectSchema = new Schema<IResumeProject>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    technologies: { type: [String], default: [] },
    link: { type: String, trim: true, default: '' },
    github: { type: String, trim: true, default: '' },
    highlights: { type: [String], default: [] },
  },
  { _id: false }
);

const ResumeCertificationSchema = new Schema<IResumeCertification>(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: String, trim: true, default: '' },
    expiryDate: { type: String, trim: true, default: '' },
    credentialId: { type: String, trim: true, default: '' },
    url: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const ResumeLanguageSchema = new Schema<IResumeLanguage>(
  {
    name: { type: String, required: true, trim: true },
    proficiency: { type: String, trim: true, default: 'Fluent' },
  },
  { _id: false }
);

const ResumeCustomSectionSchema = new Schema<IResumeCustomSection>(
  {
    heading: { type: String, required: true, trim: true },
    content: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const ResumeSchema = new Schema<IResumeDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Resume title is required'],
      trim: true,
      default: 'My Resume',
    },
    targetRole: {
      type: String,
      trim: true,
      default: '',
    },
    templateId: {
      type: String,
      trim: true,
      enum: ['modern', 'classic', 'minimal'],
      default: 'modern',
    },
    personalInfo: {
      fullName: { type: String, trim: true, default: '' },
      email: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' },
      location: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      github: { type: String, trim: true, default: '' },
      portfolio: { type: String, trim: true, default: '' },
      website: { type: String, trim: true, default: '' },
    },
    summary: {
      type: String,
      trim: true,
      default: '',
    },
    education: {
      type: [ResumeEducationSchema],
      default: [],
    },
    experience: {
      type: [ResumeExperienceSchema],
      default: [],
    },
    projects: {
      type: [ResumeProjectSchema],
      default: [],
    },
    skills: {
      technical: { type: [String], default: [] },
      soft: { type: [String], default: [] },
      tools: { type: [String], default: [] },
    },
    certifications: {
      type: [ResumeCertificationSchema],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
    },
    languages: {
      type: [ResumeLanguageSchema],
      default: [],
    },
    customSections: {
      type: [ResumeCustomSectionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = mongoose.model<IResumeDocument>('Resume', ResumeSchema);
