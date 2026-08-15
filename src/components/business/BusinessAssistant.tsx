import React, { useState, useEffect, useRef } from 'react';
import type { IAssistantChatMessage } from '../../types/startupRoadmap.types';
import { StartupRoadmapApiService } from '../../services/startupRoadmap.service';
import {
  Sparkles,
  Send,
  Loader2,
  Trash2,
  Bot,
  User,
  Rocket,
} from 'lucide-react';
import styles from './BusinessAssistant.module.css';

interface BusinessAssistantProps {
  roadmapId?: string;
  businessIdeaId?: string;
  ventureTitle?: string;
  ventureStage?: string;
}

const DEFAULT_PROMPTS = [
  "What's my next best step?",
  'How do I conduct unbiased customer interviews?',
  'What should my MVP include and exclude?',
  'How can I find my first 10 beta users?',
  'What are the biggest execution risks for this idea?',
  'What founder grants or hackathons fit this project?',
];

export const BusinessAssistant: React.FC<BusinessAssistantProps> = ({
  roadmapId,
  businessIdeaId,
  ventureTitle = 'Your Venture',
  ventureStage = 'Early Stage',
}) => {
  const [messages, setMessages] = useState<IAssistantChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your **Visionix AI Startup Mentor**. I'm here to provide pragmatic, step-by-step guidance tailored to **${ventureTitle}** currently at the **${ventureStage}** stage.\n\nAsk me about problem validation, customer discovery, MVP architecture, pricing models, or your next execution steps!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        "What's my next best step?",
        'How do I test my solution with users?',
        'Help me plan my MVP scope.',
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg: IAssistantChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Build conversation history for API
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await StartupRoadmapApiService.chatWithAssistant(
        query,
        roadmapId,
        businessIdeaId,
        history
      );

      const assistantMsg: IAssistantChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: res.suggestedFollowUps,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: IAssistantChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ ${err?.response?.data?.message || err?.message || 'Failed to connect to AI Assistant. Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Chat history cleared. How can I help you move **${ventureTitle}** forward today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: DEFAULT_PROMPTS.slice(0, 3),
      },
    ]);
  };

  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant');
  const activeFollowUps = lastAssistantMessage?.suggestedFollowUps || DEFAULT_PROMPTS.slice(0, 3);

  return (
    <div className={styles.container}>
      {/* 1. Header with Context Badge & Clear Action */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3 className={styles.headerTitle}>
            <Sparkles size={18} style={{ color: '#818cf8' }} />
            AI Business Assistant & Mentor
          </h3>
          <div className={styles.contextChip}>
            <Rocket size={12} />
            <span>{ventureTitle}</span>
            <span>•</span>
            <span>{ventureStage}</span>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#9ca3af',
            borderRadius: '6px',
            padding: '5px 10px',
            fontSize: '0.76rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
          title="Clear chat history"
        >
          <Trash2 size={12} /> Clear Chat
        </button>
      </div>

      {/* 2. Messages List */}
      <div className={styles.messagesArea}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '0.72rem', color: msg.role === 'user' ? 'rgba(255, 255, 255, 0.8)' : '#818cf8' }}>
              {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
              <span style={{ fontWeight: 700 }}>{msg.role === 'user' ? 'You' : 'Visionix AI Mentor'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div style={{ whiteSpace: 'pre-line' }}>{msg.content}</div>
          </div>
        ))}

        {loading && (
          <div className={styles.assistantMessage} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', color: '#818cf8' }} />
            <span>Analyzing venture roadmap and preparing advice...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Suggested Follow-Up Prompts */}
      {!loading && activeFollowUps.length > 0 && (
        <div className={styles.quickPromptsRow}>
          {activeFollowUps.map((prompt, idx) => (
            <button
              key={idx}
              className={styles.quickPromptBtn}
              onClick={() => handleSendMessage(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* 4. Input Bar */}
      <div className={styles.inputBar}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Ask anything about customer discovery, MVP planning, validation, pricing..."
          className={styles.textInput}
          rows={1}
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || loading}
          className={styles.sendBtn}
          title="Send message"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
