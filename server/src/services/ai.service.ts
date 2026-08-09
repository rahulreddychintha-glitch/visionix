import config from '../config/env';
import { AiConversationHistory } from '../models/AiConversationHistory';
import { PersonalizationService, IPersonalizationContext } from './personalization.service';

export interface IAiChatMessageInput {
  userId: string;
  message: string;
  sessionId?: string;
}

export interface IAiChatMessageResponse {
  reply: string;
  sessionId: string;
  history: Array<{
    role: 'user' | 'model' | 'system';
    content: string;
    timestamp: Date;
  }>;
  aiProviderUsed: 'gemini' | 'unconfigured';
}

export class AiService {
  /**
   * Generates a context-aware AI response for the user's message.
   */
  public static async processChatMessage(input: IAiChatMessageInput): Promise<IAiChatMessageResponse> {
    const { userId, message, sessionId: providedSessionId } = input;

    // Load user's personalization context
    const pContext = await PersonalizationService.getPersonalizationContext(userId);

    // Fetch or create AI conversation history record
    let historyDoc = await AiConversationHistory.findOne({ userId });
    if (!historyDoc) {
      historyDoc = new AiConversationHistory({ userId, sessions: [] });
    }

    // Determine target session
    const sessionId = providedSessionId || `session_${Date.now()}`;
    let session = historyDoc.sessions.find((s) => s.sessionId === sessionId);

    if (!session) {
      session = {
        sessionId,
        title: message.length > 30 ? `${message.substring(0, 30)}...` : message,
        messages: [],
        lastActive: new Date(),
      };
      historyDoc.sessions.push(session);
    }

    // Append user message to history
    const userTimestamp = new Date();
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: userTimestamp,
    });

    let aiReply = '';
    let providerUsed: 'gemini' | 'unconfigured' = 'unconfigured';

    // Verify GEMINI_API_KEY configuration
    if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY.trim().length === 0) {
      aiReply = 'Visionix AI Assistant service is currently unconfigured. The GEMINI_API_KEY environment variable is missing on the server.';
      providerUsed = 'unconfigured';
    } else {
      try {
        aiReply = await this.callGeminiApi(message, pContext, session.messages);
        providerUsed = 'gemini';
      } catch (err: any) {
        console.error('[Visionix AI] Gemini API request failed:', err?.message || err);
        throw err;
      }
    }

    // Append AI reply to session history
    const modelTimestamp = new Date();
    session.messages.push({
      role: 'model',
      content: aiReply,
      timestamp: modelTimestamp,
    });

    session.lastActive = modelTimestamp;
    await historyDoc.save();

    return {
      reply: aiReply,
      sessionId,
      history: session.messages,
      aiProviderUsed: providerUsed,
    };
  }

  /**
   * Fetches active sessions or specific session history for a user.
   */
  public static async getChatHistory(userId: string, sessionId?: string) {
    const historyDoc = await AiConversationHistory.findOne({ userId });
    if (!historyDoc || historyDoc.sessions.length === 0) {
      return { sessions: [], activeSession: null };
    }

    if (sessionId) {
      const activeSession = historyDoc.sessions.find((s) => s.sessionId === sessionId) || null;
      return { sessions: historyDoc.sessions, activeSession };
    }

    // Default to most recent session
    const sorted = [...historyDoc.sessions].sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());
    return {
      sessions: sorted,
      activeSession: sorted[0] || null,
    };
  }

  /**
   * Clears conversation history for a user.
   */
  public static async clearChatHistory(userId: string): Promise<boolean> {
    await AiConversationHistory.findOneAndUpdate({ userId }, { sessions: [], totalTokensUsed: 0 });
    return true;
  }

  /**
   * Deletes a specific conversation session for a user.
   */
  public static async deleteChatSession(userId: string, sessionId: string): Promise<boolean> {
    const history = await AiConversationHistory.findOne({ userId });
    if (!history) {
      return false;
    }
    const sessionExists = history.sessions.some((s) => s.sessionId === sessionId);
    if (!sessionExists) {
      return false;
    }
    await AiConversationHistory.updateOne(
      { userId },
      { $pull: { sessions: { sessionId } } }
    );
    return true;
  }

  /**
   * Private helper to invoke Google Gemini REST API using standard fetch.
   */
  private static async callGeminiApi(
    userMessage: string,
    pContext: IPersonalizationContext,
    messagesHistory: Array<{ role: 'user' | 'model' | 'system'; content: string }>
  ): Promise<string> {
    const systemPrompt = `You are Visionix, a concise AI career mentor and academic advisor.
User Profile Context:
- Name: ${pContext.name}
- Discipline/Stream: ${pContext.discipline}
- Education Level: ${pContext.educationLevel} (${pContext.studentStatus})
- Target Career: ${pContext.dreamCareer}
- Technical/Core Skills: ${pContext.skills.technicalSkills.join(', ') || 'Not specified'}
- Soft Skills: ${pContext.skills.softSkills.join(', ') || 'Not specified'}
- Career Objectives: ${pContext.careerGoals.careerObjectives || 'Not specified'}

Instructions:
1. Persona & Tone: Be a friendly, conversational mentor. Write with a direct, conversational, and personalized tone.
2. Conciseness & Length:
   - Keep responses easy to scan. Prefer short paragraphs and bullet points. Avoid huge blocks of text.
   - For simple questions, provide a short 2-5 sentence answer.
   - For regular or complex questions, keep responses to approximately 3-7 short paragraphs OR 3-7 useful bullet points.
   - DO NOT automatically produce extremely detailed answers or long essays unless the user's message explicitly requests a detailed response, comprehensive explanation, deep explanation, full roadmap, complete guide, or step-by-step detailed plan.
3. Content & Relevance:
   - Answer the user's exact question first.
   - Tailor guidance to their specific profile details (discipline: ${pContext.discipline}, goals, skills) but DO NOT repeat their entire profile unless relevant.
   - Avoid information dumps. Keep advice focused and action-oriented.
4. Formatting: Use Markdown (headings, bold, lists, paragraphs, code blocks when necessary) for structure.
5. Roadmaps: If a career roadmap is explicitly requested, use a compact 5-step structure (Goal, 1. Current position, 2. Next skill/education step, 3. Next milestone, 4. Practical experience, 5. Target outcome) with short, single-sentence descriptions per step.
6. Follow-up: When useful, end with at most ONE concise follow-up question. Do not ask multiple questions at once.`;

    const modelName = 'gemini-3.5-flash-lite';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.GEMINI_API_KEY}`;

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const maxAttempts = 3;
    let attempt = 0;
    let lastError: any = null;

    while (attempt < maxAttempts) {
      attempt++;
      console.log(`[Gemini] Request started. Model: ${modelName}. Attempt ${attempt}/${maxAttempts}`);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: messagesHistory.slice(-6).map((msg) => ({
              role: msg.role === 'model' ? 'model' : 'user',
              parts: [{ text: msg.content }],
            })),
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            }
          }),
        });

        console.log(`[Gemini] Response status: ${response.status}`);

        if (response.ok) {
          const data: any = await response.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!generatedText) {
            console.error('[Visionix AI] Gemini API returned an empty or malformed response body.');
            throw new Error('Gemini API returned an empty or malformed response body.');
          }

          return generatedText.trim();
        }

        // Handle error status
        const errText = await response.text();
        let parsedErr: any;
        try {
          parsedErr = JSON.parse(errText);
        } catch {
          parsedErr = null;
        }

        const errMsg = parsedErr?.error?.message || errText || 'Unknown error';
        const errStatus = response.status;
        const errCategory = parsedErr?.error?.status || 'UNKNOWN';

        console.error(`[Gemini] Request failed on attempt ${attempt}. Status: ${errStatus}, Category: ${errCategory}, Message: ${errMsg}`);

        // Custom structured error
        const customError: any = new Error(errMsg);
        customError.status = errStatus;
        customError.code = 'GEMINI_API_ERROR';
        customError.category = errCategory;
        lastError = customError;

        // Check if error is transient
        const transientStatuses = [408, 429, 500, 502, 503, 504];
        if (!transientStatuses.includes(errStatus)) {
          // Non-transient error, fail immediately without retry
          throw customError;
        }

        // Transient error, perform backoff if attempts remain
        if (attempt < maxAttempts) {
          const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
          console.log(`[Gemini] Transient error encountered. Retrying in ${delay}ms...`);
          await sleep(delay);
        }

      } catch (e: any) {
        lastError = e;
        console.error(`[Gemini] Exception encountered on attempt ${attempt}:`, e.message);
        
        if (attempt < maxAttempts) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.log(`[Gemini] Retrying in ${delay}ms...`);
          await sleep(delay);
        } else {
          throw e;
        }
      }
    }

    throw lastError || new Error('Failed to connect to Gemini API after maximum retry attempts.');
  }
}
