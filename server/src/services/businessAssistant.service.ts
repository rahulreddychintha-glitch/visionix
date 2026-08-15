import mongoose from 'mongoose';
import config from '../config/env';
import { StartupRoadmap } from '../models/StartupRoadmap';
import { BusinessIdea } from '../models/BusinessIdea';
import { BusinessProfile } from '../models/BusinessProfile';
import { PersonalizationService } from './personalization.service';

export interface IBusinessValidationResult {
  validationScore: number;
  metricScores: {
    problemClarity: number;
    solutionClarity: number;
    targetCustomerClarity: number;
    feasibility: number;
    differentiation: number;
  };
  summary: string;
  strengths: string[];
  risks: string[];
  missingInformation: string[];
  recommendedSteps: string[];
}

export interface IPitchGenerationResult {
  pitchType: 'one_liner' | 'elevator' | 'pitch_deck' | 'business_plan';
  title: string;
  oneLiner?: string;
  elevatorPitch?: string;
  sections: { title: string; content: string; missingFields?: string[] }[];
  generatedAt: string;
}

export interface IAssistantChatResult {
  reply: string;
  suggestedFollowUps: string[];
  contextUsed: {
    ventureTitle?: string;
    stage?: string;
    verifiedSkillsCount: number;
  };
}

export class BusinessAssistantService {
  /**
   * Generates context-aware startup advice using Gemini AI.
   */
  public static async chatWithAssistant(
    userId: string,
    message: string,
    roadmapId?: string,
    businessIdeaId?: string,
    history: { role: 'user' | 'assistant'; content: string }[] = []
  ): Promise<IAssistantChatResult> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY.trim().length === 0) {
      throw new Error('AI Assistant is currently unavailable (GEMINI_API_KEY not configured).');
    }

    // 1. Gather User and Venture Context
    const [pContext, businessProfile, roadmap, idea] = await Promise.all([
      PersonalizationService.getPersonalizationContext(userId).catch(() => null),
      BusinessProfile.findOne({ userId }),
      roadmapId && mongoose.Types.ObjectId.isValid(roadmapId)
        ? StartupRoadmap.findOne({ _id: roadmapId, userId })
        : null,
      businessIdeaId && mongoose.Types.ObjectId.isValid(businessIdeaId)
        ? BusinessIdea.findOne({ _id: businessIdeaId, isActive: true })
        : null,
    ]);

    const verifiedSkills = (pContext?.skills?.verifiedSkills || []).map((vs: any) =>
      typeof vs === 'string' ? vs : vs.name
    ).filter(Boolean);

    const technicalSkills = pContext?.skills?.technicalSkills || [];

    // Context summary
    const ventureTitle = roadmap?.title || idea?.title || businessProfile?.currentStartupIdea?.title || 'Early Venture';
    const ventureStage = roadmap?.currentStage || businessProfile?.preferredStartupStage || 'Ideation';
    const activeMilestone = roadmap?.milestones?.find((m) => m.status === 'active');
    const pendingTasks = activeMilestone?.tasks?.filter((t) => t.status !== 'completed').map((t) => t.title) || [];

    const systemPrompt = `You are Visionix AI Business Assistant, an expert early-stage startup mentor and venture advisor.
You are helping a student founder turn their idea into a real, validated business.

CRITICAL PROJECT RULES:
1. NEVER invent or fabricate facts, users, customers, revenue, funding, traction, certifications, or partnerships.
2. If specific venture information is unknown, explicitly ask the user for clarification or label it as an assumption.
3. Keep advice pragmatic, highly actionable, concise, and focused on the student's CURRENT venture stage.
4. Highlight how the user's verified skills can be used for rapid prototyping and MVP building.
5. Provide markdown formatted responses with bullet points where appropriate.

STUDENT FOUNDER CONTEXT:
- Name: ${pContext?.name || 'Founder'}
- Discipline / Major: ${pContext?.discipline || 'Engineering & Technology'}
- Phase 12 Assessment-Verified Skills (Authoritative & Read-Only): [${verifiedSkills.join(', ') || 'None yet'}]
- Technical Skills: [${technicalSkills.slice(0, 10).join(', ') || 'General'}]
- Entrepreneurship Experience: ${businessProfile?.entrepreneurshipExperience || 'Exploring'}
- Current Venture: "${ventureTitle}"
- Current Stage: "${ventureStage}"
${activeMilestone ? `- Active Milestone: "${activeMilestone.title}"` : ''}
${pendingTasks.length > 0 ? `- Current Pending Tasks in Roadmap: [${pendingTasks.slice(0, 4).join('; ')}]` : ''}
${idea ? `- Target Problem: "${idea.problem}"\n- Proposed Solution: "${idea.solution}"\n- Target Audience: "${idea.targetAudience.join(', ')}"` : ''}

Output format:
Provide a clear, encouraging, structured response tailored to their question.
At the very end of your response, output a JSON block with 3 short suggested follow-up questions formatted as:
\`\`\`json
{
  "followUps": ["Question 1", "Question 2", "Question 3"]
}
\`\`\``;

    const conversationParts: any[] = [];
    conversationParts.push({ text: systemPrompt });

    // Include recent history (up to last 6 turns)
    const recentHistory = history.slice(-6);
    recentHistory.forEach((h) => {
      conversationParts.push({
        text: `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`,
      });
    });

    conversationParts.push({
      text: `User Question: ${message}`,
    });

    const modelName = 'gemini-2.5-flash-lite';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.GEMINI_API_KEY}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: conversationParts }],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 1200,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Gemini API error (${response.status}): ${errText || response.statusText}`);
    }

    const json = (await response.json()) as any;
    let fullText = json.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    // Extract followUps JSON if present
    let followUps = [
      'What should I prioritize this week?',
      'How do I test my solution with users?',
      'What are the biggest risks for this venture?',
    ];

    const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (Array.isArray(parsed.followUps) && parsed.followUps.length > 0) {
          followUps = parsed.followUps.slice(0, 3);
        }
        fullText = fullText.replace(jsonMatch[0], '').trim();
      } catch (_e) {
        // Fallback to default followUps
      }
    }

    return {
      reply: fullText,
      suggestedFollowUps: followUps,
      contextUsed: {
        ventureTitle,
        stage: ventureStage,
        verifiedSkillsCount: verifiedSkills.length,
      },
    };
  }

  /**
   * Performs an objective AI evaluation of a startup idea and returns validation gaps and risk analysis.
   */
  public static async validateBusinessIdea(
    userId: string,
    ideaId?: string,
    roadmapId?: string,
    customTitle?: string,
    customDescription?: string
  ): Promise<IBusinessValidationResult> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY.trim().length === 0) {
      throw new Error('AI Validation service is currently unavailable.');
    }

    const [idea, roadmap] = await Promise.all([
      ideaId && mongoose.Types.ObjectId.isValid(ideaId) ? BusinessIdea.findById(ideaId) : null,
      roadmapId && mongoose.Types.ObjectId.isValid(roadmapId) ? StartupRoadmap.findById(roadmapId) : null,
    ]);

    const title = customTitle || roadmap?.title || idea?.title || 'Early Stage Startup Concept';
    const description =
      customDescription || roadmap?.description || idea?.description || idea?.shortDescription || '';
    const problem = idea?.problem || 'Unspecified market problem';
    const solution = idea?.solution || description;
    const audience = idea?.targetAudience?.join(', ') || 'Unspecified target audience';

    const prompt = `You are an expert venture capitalist and startup incubator director assessing an early-stage student startup concept.
Evaluate the following startup concept objectively.

RULES:
1. Be realistic and constructive. Never claim guaranteed success or total failure.
2. Base assessment ONLY on the provided concept details.
3. Return ONLY valid JSON adhering strictly to the schema below.

CONCEPT DETAILS:
- Title: "${title}"
- Problem: "${problem}"
- Solution: "${solution}"
- Target Customers: "${audience}"
- Overview / Description: "${description}"

JSON SCHEMA:
{
  "validationScore": <integer 0-100>,
  "metricScores": {
    "problemClarity": <integer 0-100>,
    "solutionClarity": <integer 0-100>,
    "targetCustomerClarity": <integer 0-100>,
    "feasibility": <integer 0-100>,
    "differentiation": <integer 0-100>
  },
  "summary": "<1-2 sentence executive assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "risks": ["<critical market or execution risk 1>", "<risk 2>"],
  "missingInformation": ["<key missing data point 1>", "<missing data point 2>"],
  "recommendedSteps": ["<actionable validation experiment 1>", "<experiment 2>", "<experiment 3>"]
}`;

    const modelName = 'gemini-2.5-flash-lite';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.GEMINI_API_KEY}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini validation API failed with status ${response.status}`);
    }

    const json = (await response.json()) as any;
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    try {
      const parsed = JSON.parse(rawText);
      return {
        validationScore: parsed.validationScore || 75,
        metricScores: {
          problemClarity: parsed.metricScores?.problemClarity || 70,
          solutionClarity: parsed.metricScores?.solutionClarity || 75,
          targetCustomerClarity: parsed.metricScores?.targetCustomerClarity || 65,
          feasibility: parsed.metricScores?.feasibility || 80,
          differentiation: parsed.metricScores?.differentiation || 60,
        },
        summary: parsed.summary || 'Solid early concept with strong technical viability.',
        strengths: parsed.strengths || ['Clear technical value proposition', 'Accessible initial user segment'],
        risks: parsed.risks || ['Competition from established incumbent tools', 'User acquisition friction'],
        missingInformation: parsed.missingInformation || ['Customer willingness to pay data', 'Unit pricing model'],
        recommendedSteps: parsed.recommendedSteps || [
          'Conduct 5 Mom-Test customer interviews',
          'Deploy landing page with waitlist to measure interest',
        ],
      };
    } catch (_err) {
      throw new Error('Malformed JSON received from AI validation service.');
    }
  }

  /**
   * Generates a pitch or structured business plan draft based on known information.
   */
  public static async generatePitch(
    userId: string,
    pitchType: 'one_liner' | 'elevator' | 'pitch_deck' | 'business_plan',
    roadmapId?: string,
    businessIdeaId?: string
  ): Promise<IPitchGenerationResult> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }

    if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY.trim().length === 0) {
      throw new Error('Pitch Generation service is currently unavailable.');
    }

    const [idea, roadmap] = await Promise.all([
      businessIdeaId && mongoose.Types.ObjectId.isValid(businessIdeaId)
        ? BusinessIdea.findById(businessIdeaId)
        : null,
      roadmapId && mongoose.Types.ObjectId.isValid(roadmapId)
        ? StartupRoadmap.findById(roadmapId)
        : null,
    ]);

    const title = roadmap?.title || idea?.title || 'My Startup Venture';
    const problem = idea?.problem || roadmap?.description || 'Core user inefficiency.';
    const solution = idea?.solution || 'Modular technology platform.';
    const audience = idea?.targetAudience?.join(', ') || 'Target industry professionals.';
    const model = idea?.businessModel || roadmap?.businessModel || 'SaaS';

    const prompt = `You are an expert pitch consultant and venture advisor.
Generate a structured ${pitchType.replace('_', ' ')} based on the following verified venture details:

VENTURE DETAILS:
- Title: "${title}"
- Problem: "${problem}"
- Solution: "${solution}"
- Target Customer: "${audience}"
- Business Model: "${model}"

RULES:
1. Never fabricate fake customer numbers, fake revenue, fake team credentials, or fake partnerships.
2. If specific data is missing (such as exact pricing, team members, or current traction), explicitly write "[Information Needed: Specify ...]".
3. Return ONLY valid JSON adhering strictly to the schema below.

JSON SCHEMA:
{
  "pitchType": "${pitchType}",
  "title": "${title}",
  "oneLiner": "<1 sentence high-impact summary>",
  "elevatorPitch": "<60-second spoken pitch narrative>",
  "sections": [
    {
      "title": "<Section Title e.g. Problem / Solution / Business Model>",
      "content": "<Detailed pitch wording>",
      "missingFields": ["<optional missing fact e.g. Customer Acquisition Cost>"]
    }
  ]
}`;

    const modelName = 'gemini-2.5-flash-lite';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.GEMINI_API_KEY}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.25,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini pitch API failed with status ${response.status}`);
    }

    const json = (await response.json()) as any;
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    try {
      const parsed = JSON.parse(rawText);
      return {
        pitchType,
        title,
        oneLiner: parsed.oneLiner || `${title} provides ${solution} for ${audience}.`,
        elevatorPitch: parsed.elevatorPitch || '',
        sections: parsed.sections || [],
        generatedAt: new Date().toISOString(),
      };
    } catch (_err) {
      throw new Error('Malformed JSON received from pitch generation service.');
    }
  }
}
