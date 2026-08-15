import mongoose from 'mongoose';
import config from '../config/env';
import { Resume } from '../models/Resume';
import {
  ResumeAnalysis,
  IResumeAnalysisDocument,
  IResumeAnalysisStrength,
  IResumeAnalysisImprovement,
  IResumeSuggestedChange,
} from '../models/ResumeAnalysis';
import { PersonalizationService } from './personalization.service';

export class ResumeAnalysisService {
  /**
   * Performs an AI-powered resume analysis for the authenticated user's resume.
   */
  public static async analyzeResume(userId: string, resumeId: string): Promise<IResumeAnalysisDocument> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new Error('Invalid User ID or Resume ID format.');
    }

    // 1. Validate ownership
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      throw new Error('Resume not found or access denied.');
    }

    // 2. Fetch User Profile personalization context & Phase 12 verified skills
    const pContext = await PersonalizationService.getPersonalizationContext(userId);
    const verifiedSkills = (pContext.skills?.verifiedSkills || []).map((vs: any) =>
      typeof vs === 'string' ? vs : vs.name
    ).filter(Boolean);

    // 3. Verify Gemini API key configuration
    if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY.trim().length === 0) {
      throw new Error(
        'Visionix AI Resume Analysis service is currently unconfigured. The GEMINI_API_KEY environment variable is missing on the server.'
      );
    }

    // 4. Construct AI System Prompt & Payload
    const cleanResumeData = {
      title: resume.title,
      targetRole: resume.targetRole || 'Not specified',
      personalInfo: {
        fullName: resume.personalInfo?.fullName || 'Not provided',
        email: resume.personalInfo?.email || 'Not provided',
        phone: resume.personalInfo?.phone || 'Not provided',
        location: resume.personalInfo?.location || 'Not provided',
        linkedin: resume.personalInfo?.linkedin || '',
        github: resume.personalInfo?.github || '',
        portfolio: resume.personalInfo?.portfolio || '',
        website: resume.personalInfo?.website || '',
      },
      summary: resume.summary || '',
      experience: resume.experience || [],
      education: resume.education || [],
      projects: resume.projects || [],
      skills: {
        technical: resume.skills?.technical || [],
        tools: resume.skills?.tools || [],
        soft: resume.skills?.soft || [],
      },
      certifications: resume.certifications || [],
      achievements: resume.achievements || [],
      languages: resume.languages || [],
      customSections: resume.customSections || [],
    };

    const systemPrompt = `You are Visionix AI Resume Auditor & Career Consultant.
Your task is to analyze the user's authentic resume data and return a rigorous, constructive, and actionable assessment in strict JSON format.

CRITICAL INTEGRITY RULES:
1. NEVER INVENT INFORMATION: Never create fake companies, past employers, dates, metrics, degrees, certifications, or project names. If information is missing (such as lack of quantifiable results or missing projects), recommend that the user add their real experiences.
2. VERIFIED SKILLS DISTINCTION: The user's assessment-certified skills from Phase 12 are: [${verifiedSkills.join(', ') || 'None verified yet'}]. You may recognize these as strong verified proof of competency. Do NOT invent verified skills or mark other skills as verified.
3. TARGET-ROLE-AWARE EVALUATION: Target Role is "${cleanResumeData.targetRole}". Evaluate relevance, keywords, and competencies specifically against this target role. If targetRole is "Not specified", evaluate against general professional standards and suggest specifying a target role.
4. ATS-SAFE RECOMMENDATIONS: Visionix resumes use clean, standard A4 single/two-column text templates. Do NOT recommend adding charts, graphics, tables, photos, or complex decorative elements that break ATS parsers.
5. SUGGESTED CHANGES: Provide 2 to 6 specific, field-targeted wording improvements for weak descriptions or summaries. Each suggested change MUST target a specific fieldPath (e.g. "summary", "experience[0].description", "experience[0].highlights[0]", "projects[0].description") and provide the exact original text and improved suggested text.

EXPECTED JSON SCHEMA:
{
  "overallScore": <number 0-100>,
  "summary": "<2-4 sentence executive analysis of the resume's overall quality and market-readiness>",
  "targetRoleAlignment": {
    "score": <number 0-100>,
    "role": "${cleanResumeData.targetRole}",
    "feedback": "<concise feedback on how well the resume matches this target role>"
  },
  "strengths": [
    { "title": "<strength title>", "description": "<concise rationale>" }
  ],
  "improvements": [
    {
      "section": "summary" | "experience" | "education" | "skills" | "projects" | "certifications" | "achievements" | "general",
      "priority": "high" | "medium" | "low",
      "issue": "<what needs improvement>",
      "recommendation": "<actionable recommendation on how to improve it>"
    }
  ],
  "ats": {
    "score": <number 0-100>,
    "positiveFactors": ["<positive ATS factor 1>", "<positive ATS factor 2>"],
    "issues": ["<potential ATS issue or missing keyword 1>"],
    "recommendations": ["<ATS recommendation 1>", "<ATS recommendation 2>"]
  },
  "sectionScores": {
    "summary": <number 0-100>,
    "experience": <number 0-100>,
    "skills": <number 0-100>,
    "projects": <number 0-100>,
    "education": <number 0-100>,
    "overallStructure": <number 0-100>
  },
  "suggestedChanges": [
    {
      "id": "sug_1",
      "section": "<Section Name>",
      "fieldPath": "summary" | "experience[0].description" | "experience[0].highlights[0]" | "projects[0].description",
      "original": "<exact current user text to replace>",
      "suggested": "<improved wording preserving factual truth without inventing claims>",
      "reason": "<why this improves impact, conciseness, or action-verb strength>"
    }
  ]
}

Return ONLY valid JSON. Do not include markdown preamble or conversational text.`;

    const modelName = 'gemini-3.5-flash-lite';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.GEMINI_API_KEY}`;

    let response: globalThis.Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `Analyze this resume JSON:\n${JSON.stringify(cleanResumeData, null, 2)}` }],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
        }),
        signal: AbortSignal.timeout(30000), // 30s network timeout
      });
    } catch (fetchErr: any) {
      if (fetchErr?.name === 'TimeoutError' || fetchErr?.name === 'AbortError') {
        throw new Error('AI resume analysis timed out. Please try again.');
      }
      throw new Error(`Failed to connect to AI analysis service: ${fetchErr?.message || 'Network error'}`);
    }

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('AI resume analysis service is temporarily busy (rate limit reached). Please try again shortly.');
      }
      if (response.status === 403 || response.status === 401) {
        throw new Error('AI service authentication failed. Please check Gemini API key configuration.');
      }
      throw new Error(`AI analysis service responded with status ${response.status}`);
    }

    const data: any = await response.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text || typeof text !== 'string') {
      throw new Error('Empty response received from AI resume analysis service.');
    }

    text = text.trim();
    if (text.startsWith('```')) {
      text = text.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/g, '').trim();
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (_parseErr) {
      throw new Error('Malformed JSON received from AI analysis service.');
    }

    // 5. Strict Sanitization & Score Clamping (0-100)
    const clamp = (val: any, fallback = 75) => {
      const num = Number(val);
      if (isNaN(num)) return fallback;
      return Math.max(0, Math.min(100, Math.round(num)));
    };

    const overallScore = clamp(parsed.overallScore, 75);
    const summaryText = typeof parsed.summary === 'string' && parsed.summary.trim().length > 0
      ? parsed.summary.trim()
      : 'Resume analysis generated based on submitted content.';

    const targetRoleAlignment = {
      score: clamp(parsed.targetRoleAlignment?.score, overallScore),
      role: cleanResumeData.targetRole,
      feedback: typeof parsed.targetRoleAlignment?.feedback === 'string'
        ? parsed.targetRoleAlignment.feedback
        : cleanResumeData.targetRole !== 'Not specified'
        ? `Alignment evaluated for ${cleanResumeData.targetRole}.`
        : 'Specify a target role to receive tailored keyword and domain alignment analysis.',
    };

    const strengths: IResumeAnalysisStrength[] = Array.isArray(parsed.strengths)
      ? parsed.strengths.filter((s: any) => s && typeof s.title === 'string' && typeof s.description === 'string')
      : [];

    const validSections = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'general'];
    const validPriorities = ['high', 'medium', 'low'];
    const improvements: IResumeAnalysisImprovement[] = Array.isArray(parsed.improvements)
      ? parsed.improvements
          .filter((imp: any) => imp && typeof imp.issue === 'string' && typeof imp.recommendation === 'string')
          .map((imp: any) => ({
            section: validSections.includes(imp.section) ? imp.section : 'general',
            priority: validPriorities.includes(imp.priority) ? imp.priority : 'medium',
            issue: imp.issue,
            recommendation: imp.recommendation,
          }))
      : [];

    const ats = {
      score: clamp(parsed.ats?.score, overallScore),
      positiveFactors: Array.isArray(parsed.ats?.positiveFactors)
        ? parsed.ats.positiveFactors.filter((f: any) => typeof f === 'string')
        : ['Clear text headings', 'Standard contact structure'],
      issues: Array.isArray(parsed.ats?.issues)
        ? parsed.ats.issues.filter((i: any) => typeof i === 'string')
        : [],
      recommendations: Array.isArray(parsed.ats?.recommendations)
        ? parsed.ats.recommendations.filter((r: any) => typeof r === 'string')
        : [],
    };

    const sectionScores = {
      summary: clamp(parsed.sectionScores?.summary, 70),
      experience: clamp(parsed.sectionScores?.experience, 75),
      skills: clamp(parsed.sectionScores?.skills, 80),
      projects: clamp(parsed.sectionScores?.projects, 75),
      education: clamp(parsed.sectionScores?.education, 85),
      overallStructure: clamp(parsed.sectionScores?.overallStructure, 80),
    };

    const suggestedChanges: IResumeSuggestedChange[] = Array.isArray(parsed.suggestedChanges)
      ? parsed.suggestedChanges
          .filter((sug: any) => sug && typeof sug.suggested === 'string' && typeof sug.fieldPath === 'string')
          .map((sug: any, idx: number) => ({
            id: typeof sug.id === 'string' ? sug.id : `sug_${Date.now()}_${idx}`,
            section: typeof sug.section === 'string' ? sug.section : 'Content',
            fieldPath: sug.fieldPath,
            original: typeof sug.original === 'string' ? sug.original : '',
            suggested: sug.suggested,
            reason: typeof sug.reason === 'string' ? sug.reason : 'Improved impact and clarity.',
          }))
      : [];

    // 6. Save analysis document to MongoDB (preserving history)
    const analysisDoc = new ResumeAnalysis({
      userId: new mongoose.Types.ObjectId(userId),
      resumeId: new mongoose.Types.ObjectId(resumeId),
      overallScore,
      summary: summaryText,
      targetRoleAlignment,
      strengths,
      improvements,
      ats,
      sectionScores,
      suggestedChanges,
    });

    return analysisDoc.save();
  }

  /**
   * Retrieves past analysis history for a specific resume belonging to the user.
   */
  public static async getAnalysisHistory(userId: string, resumeId: string): Promise<IResumeAnalysisDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(resumeId)) {
      return [];
    }

    // Verify ownership
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      return [];
    }

    return ResumeAnalysis.find({ userId, resumeId }).sort({ createdAt: -1 });
  }

  /**
   * Retrieves the latest analysis for a specific resume belonging to the user.
   */
  public static async getLatestAnalysis(userId: string, resumeId: string): Promise<IResumeAnalysisDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(resumeId)) {
      return null;
    }

    return ResumeAnalysis.findOne({ userId, resumeId }).sort({ createdAt: -1 });
  }
}
