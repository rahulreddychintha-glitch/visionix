import mongoose from 'mongoose';
import config from '../config/env';
import {
  Interview,
  IInterviewDocument,
  InterviewType,
  InterviewDifficulty,
  IInterviewQuestion,
  IInterviewAnswer,
  ICategoryScores,
  IWeakArea,
} from '../models/Interview';
import { Resume } from '../models/Resume';
import { PersonalizationService } from './personalization.service';

export interface IGenerateInterviewInput {
  targetRole: string;
  interviewType: InterviewType;
  difficulty: InterviewDifficulty;
  questionCount: number;
  focusAreas?: string[];
  timerSeconds?: number;
  resumeId?: string;
}

export class InterviewService {
  /**
   * Generates a new AI-powered interview session using Gemini.
   */
  public static async generateInterview(
    userId: string,
    input: IGenerateInterviewInput
  ): Promise<IInterviewDocument> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    const {
      targetRole,
      interviewType,
      difficulty,
      questionCount,
      focusAreas = [],
      timerSeconds = 0,
      resumeId,
    } = input;

    // 1. Fetch User Personalization Context & Phase 12 Verified Skills (Read-Only)
    const pContext = await PersonalizationService.getPersonalizationContext(userId);
    const verifiedSkills = (pContext.skills?.verifiedSkills || []).map((vs: any) =>
      typeof vs === 'string' ? vs : vs.name
    ).filter(Boolean);

    // 2. Load Resume if resumeId is provided
    let resumeData: any = null;
    if (resumeId) {
      if (!mongoose.Types.ObjectId.isValid(resumeId)) {
        throw new Error('Invalid Resume ID format.');
      }
      const foundResume = await Resume.findOne({ _id: resumeId, userId });
      if (foundResume) {
        resumeData = {
          title: foundResume.title,
          summary: foundResume.summary || '',
          experience: foundResume.experience || [],
          education: foundResume.education || [],
          projects: foundResume.projects || [],
          skills: foundResume.skills || { technical: [], soft: [], tools: [] },
        };
      }
    }

    // 3. Verify Gemini API key configuration
    if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY.trim().length === 0) {
      throw new Error(
        'Visionix AI Interview service is currently unconfigured. The GEMINI_API_KEY environment variable is missing on the server.'
      );
    }

    // 4. Construct AI Question Generation Prompt
    const systemPrompt = `You are the Visionix AI Interviewer & Technical Hiring Manager.
Your task is to generate exactly ${questionCount} high-quality, realistic interview questions for a candidate preparing for the role: "${targetRole}".

INTERVIEW CONFIGURATION:
- Interview Type: ${interviewType.toUpperCase()} (mock = mixed technical & behavioral; technical = technical knowledge & problem solving; behavioral = situational/STAR questions; resume_based = specific questions on the candidate's authentic resume).
- Target Role: "${targetRole}"
- Target Difficulty: "${difficulty}"
- Selected Focus Areas: [${focusAreas.join(', ') || 'General domain fundamentals'}]
- Verified Skills from Phase 12 assessments: [${verifiedSkills.join(', ') || 'None verified yet'}]
${
  resumeData
    ? `- Candidate Resume Data: ${JSON.stringify(resumeData, null, 2)}`
    : '- Candidate Resume: None attached (generate role-specific questions based on target role and focus areas).'
}

CRITICAL INTEGRITY & ANTI-HALLUCINATION RULES:
1. NEVER INVENT CANDIDATE HISTORY: For resume_based questions, reference ONLY actual projects, technologies, and experience present in the provided resume data. Never fabricate employers, metrics, or claims.
2. VERIFIED SKILLS: You may ask deeper technical questions about verified skills (${verifiedSkills.join(', ')}), as the candidate has proven competence in Phase 12.
3. CLEAR & CONCISE: Questions should be direct, professional, and simulate real interview conversations.
4. STRICT JSON FORMAT: Output MUST be a single JSON object containing an array "questions" of length ${questionCount}.

EXPECTED JSON SCHEMA:
{
  "title": "${targetRole} ${interviewType.toUpperCase()} Interview",
  "questions": [
    {
      "id": "q1",
      "question": "<Interview question text>",
      "category": "technical" | "behavioral" | "resume_based" | "problem_solving" | "system_design",
      "difficulty": "${difficulty}",
      "focusArea": "<Specific topic or skill targeted, e.g. React, System Design, Conflict Resolution>"
    }
  ]
}

Return ONLY valid JSON. Do not include markdown code block preambles or chat conversational filler.`;

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
              parts: [{ text: `Generate ${questionCount} ${difficulty} ${interviewType} interview questions for ${targetRole}.` }],
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
        throw new Error('AI interview generation timed out. Please try again.');
      }
      throw new Error(`Failed to connect to AI interview service: ${fetchErr?.message || 'Network error'}`);
    }

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('AI interview service is temporarily busy (rate limit reached). Please try again shortly.');
      }
      if (response.status === 403 || response.status === 401) {
        throw new Error('AI service authentication failed. Please check Gemini API key configuration.');
      }
      throw new Error(`AI interview service responded with status ${response.status}`);
    }

    const data: any = await response.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text || typeof text !== 'string') {
      throw new Error('Empty response received from AI interview generation service.');
    }

    text = text.trim();
    if (text.startsWith('```')) {
      text = text.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/g, '').trim();
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (_parseErr) {
      throw new Error('Malformed JSON received from AI interview service.');
    }

    const rawQuestions = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.questions) ? parsed.questions : [];
    if (rawQuestions.length === 0) {
      throw new Error('AI service failed to generate valid interview questions.');
    }

    // 5. Sanitize and validate questions
    const validatedQuestions: IInterviewQuestion[] = [];
    const seenTexts = new Set<string>();

    for (let i = 0; i < rawQuestions.length; i++) {
      const q = rawQuestions[i];
      if (!q || typeof q.question !== 'string' || q.question.trim().length < 8) continue;
      const qText = q.question.trim();
      if (seenTexts.has(qText.toLowerCase())) continue;
      seenTexts.add(qText.toLowerCase());

      validatedQuestions.push({
        id: `q_${Date.now()}_${i + 1}`,
        question: qText,
        category: typeof q.category === 'string' ? q.category : interviewType,
        difficulty: typeof q.difficulty === 'string' ? q.difficulty : difficulty,
        focusArea: typeof q.focusArea === 'string' && q.focusArea.trim().length > 0 ? q.focusArea.trim() : targetRole,
      });

      if (validatedQuestions.length >= questionCount) break;
    }

    if (validatedQuestions.length === 0) {
      throw new Error('AI question validation failed: No valid questions generated.');
    }

    // 6. Create and save new Interview session
    const interviewDoc = new Interview({
      userId: new mongoose.Types.ObjectId(userId),
      resumeId: resumeId ? new mongoose.Types.ObjectId(resumeId) : undefined,
      targetRole,
      interviewType,
      difficulty,
      questionCount: validatedQuestions.length,
      focusAreas,
      timerSeconds,
      timeSpentSeconds: 0,
      status: 'in_progress',
      questions: validatedQuestions,
      answers: [],
    });

    return interviewDoc.save();
  }

  /**
   * Evaluates user submitted answers using Gemini and computes full scores, STAR assessment, and weak areas.
   */
  public static async evaluateInterview(
    userId: string,
    interviewId: string,
    answers: { questionId: string; answer: string }[],
    timeSpentSeconds = 0
  ): Promise<IInterviewDocument> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(interviewId)) {
      throw new Error('Invalid User ID or Interview ID format.');
    }

    // 1. Validate ownership
    const interview = await Interview.findOne({ _id: interviewId, userId });
    if (!interview) {
      throw new Error('Interview session not found or access denied.');
    }

    if (interview.status === 'completed') {
      return interview; // Already evaluated
    }

    // 2. Verify Gemini API key configuration
    if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY.trim().length === 0) {
      throw new Error(
        'Visionix AI Interview service is currently unconfigured. The GEMINI_API_KEY environment variable is missing on the server.'
      );
    }

    // Match answers to questions
    const questionAnswerPairs = interview.questions.map((q) => {
      const submitted = answers.find((a) => a.questionId === q.id);
      return {
        id: q.id,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        focusArea: q.focusArea,
        userAnswer: submitted?.answer?.trim() || '(No answer provided)',
      };
    });

    const systemPrompt = `You are the Lead Technical Interview Evaluator & Executive Career Coach for Visionix.
Your task is to thoroughly, rigorously, and constructively evaluate candidate answers for the role: "${interview.targetRole}" (${interview.difficulty} level, ${interview.interviewType} type).

EVALUATION CRITERIA:
1. Technical Answers: Assess technical correctness, depth of explanation, domain terminology, and problem-solving logic.
2. Behavioral / Situational Answers: Assess clarity, communication, professionalism, and STAR structure (Situation, Task, Action, Result). Explicitly state which STAR elements were present vs missing.
3. Unanswered Questions: If the user provided "(No answer provided)" or an irrelevant filler, assign a score of 0 with constructive advice on what was expected.
4. Objective Scoring: Score each answer 0-100. Compute category scores (technical, communication, problemSolving, roleAlignment, clarity) and overallScore (0-100).
5. Weak Areas: Identify specific topics or competencies where the candidate scored under 70% with actionable recommendations.

EXPECTED JSON SCHEMA:
{
  "overallScore": <number 0-100>,
  "categoryScores": {
    "technical": <number 0-100>,
    "communication": <number 0-100>,
    "problemSolving": <number 0-100>,
    "roleAlignment": <number 0-100>,
    "clarity": <number 0-100>
  },
  "feedback": "<2-4 sentence executive summary of candidate performance, communication poise, and role readiness>",
  "strengths": [
    "<Key strength 1>",
    "<Key strength 2>"
  ],
  "improvements": [
    "<Actionable improvement area 1>",
    "<Actionable improvement area 2>"
  ],
  "weakAreas": [
    {
      "topic": "<Specific topic, e.g. React Reconciliation or STAR Storytelling>",
      "score": <number 0-100>,
      "recommendation": "<Concise study or practice advice>"
    }
  ],
  "evaluatedAnswers": [
    {
      "questionId": "<id>",
      "score": <number 0-100>,
      "feedback": "<constructive evaluation of this answer>",
      "strengths": ["<what was good>"],
      "improvements": ["<what was missing or weak>"],
      "starAssessment": {
        "situation": "<Present / Missing / Unclear>",
        "task": "<Present / Missing / Unclear>",
        "action": "<Present / Missing / Unclear>",
        "result": "<Present / Missing / Unclear>"
      }
    }
  ]
}

Return ONLY valid JSON.`;

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
              parts: [
                {
                  text: `Evaluate these interview answers for ${interview.targetRole}:\n${JSON.stringify(
                    questionAnswerPairs,
                    null,
                    2
                  )}`,
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
        }),
        signal: AbortSignal.timeout(35000), // 35s timeout
      });
    } catch (fetchErr: any) {
      if (fetchErr?.name === 'TimeoutError' || fetchErr?.name === 'AbortError') {
        throw new Error('AI interview evaluation timed out. Please try again.');
      }
      throw new Error(`Failed to connect to AI evaluation service: ${fetchErr?.message || 'Network error'}`);
    }

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('AI evaluation service is temporarily busy. Please try again shortly.');
      }
      throw new Error(`AI evaluation service responded with status ${response.status}`);
    }

    const data: any = await response.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text || typeof text !== 'string') {
      throw new Error('Empty response received from AI interview evaluation service.');
    }

    text = text.trim();
    if (text.startsWith('```')) {
      text = text.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/g, '').trim();
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (_parseErr) {
      throw new Error('Malformed JSON received from AI evaluation service.');
    }

    // 3. Sanitization and score clamping
    const clamp = (val: any, fallback = 70) => {
      const num = Number(val);
      if (isNaN(num)) return fallback;
      return Math.max(0, Math.min(100, Math.round(num)));
    };

    const overallScore = clamp(parsed.overallScore, 70);
    const categoryScores: ICategoryScores = {
      technical: clamp(parsed.categoryScores?.technical, overallScore),
      communication: clamp(parsed.categoryScores?.communication, overallScore),
      problemSolving: clamp(parsed.categoryScores?.problemSolving, overallScore),
      roleAlignment: clamp(parsed.categoryScores?.roleAlignment, overallScore),
      clarity: clamp(parsed.categoryScores?.clarity, overallScore),
    };

    const feedback = typeof parsed.feedback === 'string' && parsed.feedback.trim().length > 0
      ? parsed.feedback.trim()
      : 'Interview completed and evaluated against industry role benchmarks.';

    const strengths: string[] = Array.isArray(parsed.strengths)
      ? parsed.strengths.filter((s: any) => typeof s === 'string')
      : ['Clear problem-solving approach', 'Solid role alignment'];

    const improvements: string[] = Array.isArray(parsed.improvements)
      ? parsed.improvements.filter((i: any) => typeof i === 'string')
      : ['Deepen technical architecture explanations', 'Apply STAR structure to behavioral stories'];

    const weakAreas: IWeakArea[] = Array.isArray(parsed.weakAreas)
      ? parsed.weakAreas
          .filter((w: any) => w && typeof w.topic === 'string')
          .map((w: any) => ({
            topic: w.topic,
            score: clamp(w.score, 65),
            recommendation: typeof w.recommendation === 'string' ? w.recommendation : 'Review core concepts and practice explanations.',
          }))
      : [];

    // Map evaluated answers
    const evaluatedAnswers: IInterviewAnswer[] = interview.questions.map((q) => {
      const submitted = answers.find((a) => a.questionId === q.id);
      const evalItem = Array.isArray(parsed.evaluatedAnswers)
        ? parsed.evaluatedAnswers.find((e: any) => e.questionId === q.id)
        : null;

      return {
        questionId: q.id,
        answer: submitted?.answer || '',
        score: clamp(evalItem?.score, submitted?.answer?.trim() ? 70 : 0),
        feedback: evalItem?.feedback || (submitted?.answer?.trim() ? 'Answer evaluated.' : 'No answer was submitted for this question.'),
        strengths: Array.isArray(evalItem?.strengths) ? evalItem.strengths : [],
        improvements: Array.isArray(evalItem?.improvements) ? evalItem.improvements : [],
        starAssessment: evalItem?.starAssessment
          ? {
              situation: evalItem.starAssessment.situation || 'N/A',
              task: evalItem.starAssessment.task || 'N/A',
              action: evalItem.starAssessment.action || 'N/A',
              result: evalItem.starAssessment.result || 'N/A',
            }
          : undefined,
      };
    });

    // 4. Update and persist interview session
    interview.status = 'completed';
    interview.answers = evaluatedAnswers;
    interview.overallScore = overallScore;
    interview.categoryScores = categoryScores;
    interview.feedback = feedback;
    interview.strengths = strengths;
    interview.improvements = improvements;
    interview.weakAreas = weakAreas;
    interview.timeSpentSeconds = Number(timeSpentSeconds) || interview.timeSpentSeconds || 0;
    interview.completedAt = new Date();

    return interview.save();
  }

  /**
   * Retrieves all interview sessions belonging to the user.
   */
  public static async getInterviews(userId: string): Promise<IInterviewDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) return [];
    return Interview.find({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Retrieves a single interview session by ID for the user.
   */
  public static async getInterview(userId: string, interviewId: string): Promise<IInterviewDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(interviewId)) {
      return null;
    }
    return Interview.findOne({ _id: interviewId, userId });
  }

  /**
   * Retries an interview or spawns a fresh session targeting previous weak areas.
   */
  public static async retryInterview(
    userId: string,
    interviewId: string,
    focusWeakAreas = false
  ): Promise<IInterviewDocument> {
    const original = await this.getInterview(userId, interviewId);
    if (!original) {
      throw new Error('Original interview not found.');
    }

    const focusAreas = focusWeakAreas && original.weakAreas && original.weakAreas.length > 0
      ? original.weakAreas.map((w) => w.topic)
      : original.focusAreas;

    return this.generateInterview(userId, {
      targetRole: original.targetRole,
      interviewType: original.interviewType,
      difficulty: original.difficulty,
      questionCount: original.questionCount,
      focusAreas,
      timerSeconds: original.timerSeconds,
      resumeId: original.resumeId ? original.resumeId.toString() : undefined,
    });
  }

  /**
   * Deletes an interview session belonging to the user.
   */
  public static async deleteInterview(userId: string, interviewId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(interviewId)) {
      return false;
    }
    const result = await Interview.deleteOne({ _id: interviewId, userId });
    return (result.deletedCount || 0) > 0;
  }

  /**
   * Aggregates real user interview progress and statistics.
   */
  public static async getProgress(userId: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        totalCompleted: 0,
        averageScore: 0,
        bestScore: 0,
        questionsAnswered: 0,
        recentScores: [],
        weakAreas: [],
        interviewTypeBreakdown: {},
      };
    }

    const completed = await Interview.find({ userId, status: 'completed' }).sort({ completedAt: -1 });

    if (completed.length === 0) {
      return {
        totalCompleted: 0,
        averageScore: 0,
        bestScore: 0,
        questionsAnswered: 0,
        recentScores: [],
        weakAreas: [],
        interviewTypeBreakdown: {
          mock: 0,
          technical: 0,
          behavioral: 0,
          resume_based: 0,
          mixed: 0,
        },
      };
    }

    const totalScore = completed.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
    const averageScore = Math.round(totalScore / completed.length);
    const bestScore = Math.max(...completed.map((c) => c.overallScore || 0));
    const questionsAnswered = completed.reduce((acc, curr) => acc + (curr.answers?.length || 0), 0);

    const typeBreakdown: Record<string, number> = {
      mock: 0,
      technical: 0,
      behavioral: 0,
      resume_based: 0,
      mixed: 0,
    };

    const weakAreasMap = new Map<string, { topic: string; score: number; count: number; recommendation: string }>();

    completed.forEach((int) => {
      typeBreakdown[int.interviewType] = (typeBreakdown[int.interviewType] || 0) + 1;

      (int.weakAreas || []).forEach((w) => {
        const key = w.topic.toLowerCase().trim();
        const existing = weakAreasMap.get(key);
        if (existing) {
          existing.count += 1;
          existing.score = Math.round((existing.score + w.score) / 2);
        } else {
          weakAreasMap.set(key, {
            topic: w.topic,
            score: w.score,
            count: 1,
            recommendation: w.recommendation,
          });
        }
      });
    });

    const recentScores = completed.slice(0, 10).map((c) => ({
      id: c._id,
      date: c.completedAt || c.createdAt,
      score: c.overallScore || 0,
      type: c.interviewType,
      role: c.targetRole,
      difficulty: c.difficulty,
    }));

    const topWeakAreas = Array.from(weakAreasMap.values())
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);

    return {
      totalCompleted: completed.length,
      averageScore,
      bestScore,
      questionsAnswered,
      recentScores,
      weakAreas: topWeakAreas,
      interviewTypeBreakdown: typeBreakdown,
    };
  }
}
