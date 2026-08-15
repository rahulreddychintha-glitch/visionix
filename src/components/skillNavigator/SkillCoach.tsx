import React, { useState } from 'react';
import {
  Brain,
  Send,
  Loader2,
  Bot,
  User,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { SkillNavigatorService } from '../../services/skillNavigator.service';
import styles from './SkillNavigatorComponents.module.css';

interface SkillCoachProps {
  targetCareerTitle: string;
  targetCareerId: string;
  topMissingSkill?: string;
  verifiedSkillsCount: number;
}

interface IChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const SkillCoach: React.FC<SkillCoachProps> = ({
  targetCareerTitle,
  targetCareerId,
  topMissingSkill,
  verifiedSkillsCount,
}) => {
  const [messages, setMessages] = useState<IChatMessage[]>([
    {
      id: 'init_welcome',
      sender: 'ai',
      text: `Hello! I'm your Visionix Skill Coach for **${targetCareerTitle}**. I analyze your real profile and verified skills to help you prioritize your next learning milestones. What would you like to explore?`,
      timestamp: new Date(),
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const suggestedChips = [
    `What should I learn next for ${targetCareerTitle}?`,
    topMissingSkill ? `Why is ${topMissingSkill} important for this career?` : `How can I level up my skills?`,
    `How can I earn verified skills in Visionix?`,
    topMissingSkill ? `Give me a practical project idea to practice ${topMissingSkill}` : `Suggest a hands-on project`,
  ];

  const handleSendQuestion = async (qText: string) => {
    const trimmed = qText.trim();
    if (!trimmed || isLoading) return;

    setErrorMsg(null);
    setInputQuestion('');

    const userMsg: IChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await SkillNavigatorService.askCoach(trimmed, targetCareerId);

      const aiMsg: IChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (_err: any) {
      setErrorMsg('Failed to connect with AI Skill Coach. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    // Simple markdown formatting for bold, bullets, and line breaks
    return text.split('\n').map((line, idx) => {
      let content: React.ReactNode = line;

      // Handle bold **text**
      if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        content = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
      }

      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className={styles.chatBulletItem}>
            {typeof content === 'string' ? line.slice(2) : content}
          </li>
        );
      }

      if (/^\d+\.\s/.test(line)) {
        return (
          <p key={idx} className={styles.chatNumberedItem}>
            {content}
          </p>
        );
      }

      return (
        <p key={idx} className={styles.chatParagraph}>
          {content}
        </p>
      );
    });
  };

  return (
    <div className={styles.coachSection}>
      <div className={styles.coachHeaderRow}>
        <div className={styles.coachHeaderLeft}>
          <div className={styles.coachAvatarIcon}>
            <Brain size={20} />
          </div>
          <div>
            <h3 className={styles.sectionTitle}>AI Skill Coach</h3>
            <p className={styles.sectionSubtitle}>
              Ask questions about skill gaps, project ideas, and strategic learning steps tailored to {targetCareerTitle}.
            </p>
          </div>
        </div>

        <div className={styles.coachVerifiedTag}>
          <CheckCircle2 size={13} />
          <span>{verifiedSkillsCount} Verified Skills Grounding</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className={styles.suggestedChipsRow}>
        {suggestedChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            className={styles.promptChipBtn}
            onClick={() => handleSendQuestion(chip)}
            disabled={isLoading}
          >
            <Lightbulb size={12} />
            <span>{chip}</span>
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div className={styles.chatThread}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.chatMessageRow} ${
              msg.sender === 'user' ? styles.chatRowUser : styles.chatRowAi
            }`}
          >
            <div className={styles.chatAvatarBox}>
              {msg.sender === 'user' ? <User size={15} /> : <Bot size={15} />}
            </div>
            <div className={styles.chatBubble}>{renderFormattedText(msg.text)}</div>
          </div>
        ))}

        {isLoading && (
          <div className={`${styles.chatMessageRow} ${styles.chatRowAi}`}>
            <div className={styles.chatAvatarBox}>
              <Bot size={15} />
            </div>
            <div className={`${styles.chatBubble} ${styles.loadingBubble}`}>
              <Loader2 size={16} className={styles.spinIcon} />
              <span>Analyzing skill gaps and formulating practical guidance...</span>
            </div>
          </div>
        )}

        {errorMsg && <div className={styles.coachErrorBanner}>{errorMsg}</div>}
      </div>

      {/* Question Input Form */}
      <form
        className={styles.coachInputForm}
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuestion(inputQuestion);
        }}
      >
        <input
          type="text"
          placeholder={`Ask anything about skills, projects, or next steps for ${targetCareerTitle}...`}
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          disabled={isLoading}
          className={styles.coachTextInput}
        />
        <button
          type="submit"
          className={styles.coachSendBtn}
          disabled={!inputQuestion.trim() || isLoading}
          aria-label="Send Question"
        >
          <Send size={15} />
          <span>Ask Coach</span>
        </button>
      </form>
    </div>
  );
};
