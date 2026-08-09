import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import { AiApiService } from '../../services/ai.service';
import { usePersonalization } from '../../hooks/usePersonalization';
import type { AiChatMessage } from '../../types/ai.types';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  discipline?: string;
  dreamCareer?: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  userName,
  discipline,
  dreamCareer,
}) => {
  const { personalizationContext } = usePersonalization();

  const activeUserName = userName || personalizationContext?.name || 'Learner';
  const activeDiscipline = discipline || personalizationContext?.discipline || 'General Studies';
  const activeDreamCareer = dreamCareer || personalizationContext?.dreamCareer || 'Career Professional';

  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on open
  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const data = await AiApiService.getHistory();
      if (data.activeSession && data.activeSession.messages.length > 0) {
        setMessages(data.activeSession.messages);
        setSessionId(data.activeSession.sessionId);
      } else {
        // Default initial welcome message
        const welcomeMessage: AiChatMessage = {
          role: 'model',
          content: `Hello ${activeUserName}! 👋 I'm your Visionix AI Career Assistant. I am calibrated to support your ambition in ${activeDiscipline} aiming for ${activeDreamCareer}. Ask me anything about career strategies, skill roadmaps, or interview prep!`,
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (err) {
      console.warn('Could not load online chat history, starting new session:', err);
      const welcomeMessage: AiChatMessage = {
        role: 'model',
        content: `Hello ${activeUserName}! 👋 I'm your Visionix AI Career Assistant. How can I assist your career progression today?`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue('');

    const userMessage: AiChatMessage = {
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await AiApiService.sendMessage(userText, sessionId);
      setSessionId(response.sessionId);
      setMessages(response.history);
    } catch (err: any) {
      console.error('Error sending AI message:', err);
      
      let userFriendlyMessage = "Visionix couldn't reach the AI service. Please check the server connection.";
      const axiosError = err as any;
      const status = axiosError.response?.data?.error?.status || axiosError.response?.status;

      if (status === 403) {
        userFriendlyMessage = "Visionix couldn't access the Gemini service. Please check the API configuration.";
      } else if (status === 429) {
        userFriendlyMessage = "Visionix AI is temporarily busy. Please try again shortly.";
      } else if (status === 503 || status === 502 || status === 504 || status === 500) {
        userFriendlyMessage = "Gemini is temporarily unavailable. Please try again shortly.";
      } else if (status === 400) {
        userFriendlyMessage = "Visionix couldn't process this request. Please try again.";
      }

      const errorMessage: AiChatMessage = {
        role: 'model',
        content: userFriendlyMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await AiApiService.clearHistory();
      setSessionId(undefined);
      const resetMsg: AiChatMessage = {
        role: 'model',
        content: `Conversation reset. Ready for your next career query, ${userName}!`,
        timestamp: new Date().toISOString(),
      };
      setMessages([resetMsg]);
    } catch (err) {
      console.error('Failed to clear conversation history:', err);
    }
  };

  const quickQuestions = [
    `What skills should I prioritize for ${dreamCareer}?`,
    `Give me a 3-month career roadmap for ${discipline}.`,
    `How can I prepare for interviews in ${dreamCareer}?`,
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: '640px',
            height: '85vh',
            maxHeight: '700px',
            background: 'linear-gradient(135deg, rgba(20, 18, 38, 0.95), rgba(12, 10, 24, 0.98))',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(126, 58, 242, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Top Bar Header */}
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(126, 58, 242, 0.3), rgba(88, 80, 236, 0.2))',
                  border: '1px solid rgba(126, 58, 242, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c084fc',
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}>Visionix AI Assistant</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Personalized Guidance • {activeDiscipline}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={handleClearHistory}
                title="Clear conversation history"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s ease',
                }}
              >
                <Trash2 size={18} />
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {messages.map((msg, index) => {
              const isModel = msg.role === 'model' || msg.role === 'system';
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: isModel ? 'flex-start' : 'flex-end',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  {isModel && (
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: 'rgba(126, 58, 242, 0.15)',
                        border: '1px solid rgba(126, 58, 242, 0.3)',
                        color: '#c084fc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Bot size={18} />
                    </div>
                  )}

                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '14px 18px',
                      borderRadius: isModel ? '0 16px 16px 16px' : '16px 0 16px 16px',
                      background: isModel
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'linear-gradient(135deg, rgba(126, 58, 242, 0.3), rgba(88, 80, 236, 0.25))',
                      border: isModel
                        ? '1px solid rgba(255, 255, 255, 0.07)'
                        : '1px solid rgba(126, 58, 242, 0.4)',
                      color: 'var(--text-primary)',
                      fontSize: '0.925rem',
                      lineHeight: '1.55',
                      whiteSpace: 'pre-wrap',
                      boxShadow: isModel ? 'none' : '0 4px 20px rgba(126, 58, 242, 0.15)',
                    }}
                  >
                    {isModel ? <MarkdownRenderer content={msg.content} /> : msg.content}
                  </div>

                  {!isModel && (
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <User size={18} />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: 'rgba(126, 58, 242, 0.15)',
                    border: '1px solid rgba(126, 58, 242, 0.3)',
                    color: '#c084fc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot size={18} />
                </div>
                <div
                  style={{
                    padding: '12px 18px',
                    borderRadius: '0 16px 16px 16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#c084fc',
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Visionix is thinking</span>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', height: '10px' }}>
                    <span className="typing-dot typing-dot-1" style={{ width: '5px', height: '5px', backgroundColor: '#c084fc' }} />
                    <span className="typing-dot typing-dot-2" style={{ width: '5px', height: '5px', backgroundColor: '#c084fc' }} />
                    <span className="typing-dot typing-dot-3" style={{ width: '5px', height: '5px', backgroundColor: '#c084fc' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '0 20px 10px 20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputValue(q);
                }}
                style={{
                  fontSize: '0.75rem',
                  padding: '6px 12px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(0, 0, 0, 0.2)',
              display: 'flex',
              gap: '12px',
            }}
          >
            <input
              type="text"
              placeholder="Ask Visionix AI about career roadmaps, skills, interview prep..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              style={{
                padding: '12px 20px',
                borderRadius: '14px',
                background: inputValue.trim() && !isLoading
                  ? 'linear-gradient(135deg, #7e3af2, #5850ec)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                color: '#fff',
                cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 600,
              }}
            >
              <span>Send</span>
              <Send size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
