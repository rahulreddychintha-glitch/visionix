import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { 
  Sparkles, 
  Brain, 
  Compass, 
  Target, 
  Send, 
  Plus, 
  RotateCcw, 
  Trash2, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Check, 
  Mic, 
  Settings, 
  Clock, 
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersonalization } from '../hooks/usePersonalization';
import { useAuth } from '../hooks/useAuth';
import { AiApiService } from '../services/ai.service';
import type { AiChatMessage, AiSession } from '../types/ai.types';
import styles from './AiAssistantPage.module.css';
import { MarkdownRenderer } from '../components/ui/MarkdownRenderer';
import { useNavigate } from 'react-router-dom';

export const AiAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const { personalizationContext } = usePersonalization();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [sessions, setSessions] = useState<AiSession[]>([]);
  const [activeMode, setActiveMode] = useState<'quick' | 'deep' | 'research'>('quick');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const userName = personalizationContext?.name || user?.fullName || 'Learner';
  const discipline = personalizationContext?.discipline || 'General Studies';
  const dreamCareer = personalizationContext?.dreamCareer || 'Career Professional';

  // Load chat history & sessions on mount
  useEffect(() => {
    loadChatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadChatData = async () => {
    try {
      setIsLoading(true);
      const data = await AiApiService.getHistory();
      if (data.sessions) {
        setSessions(data.sessions);
      }
      if (data.activeSession && data.activeSession.messages.length > 0) {
        setMessages(data.activeSession.messages);
        setSessionId(data.activeSession.sessionId);
      }
    } catch (err) {
      console.warn('Could not fetch existing conversation history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errorToast) {
      const timer = setTimeout(() => setErrorToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorToast]);

  const handleConfirmDelete = (sessId: string) => {
    setSessionToDelete(sessId);
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;
    try {
      setIsLoading(true);
      await AiApiService.deleteChatSession(sessionToDelete);
      
      // Update local sessions state
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionToDelete));
      
      // If the deleted session was the active one, clear active view
      if (sessionId === sessionToDelete) {
        setSessionId(undefined);
        setMessages([]);
      }
      
      setSessionToDelete(null);
    } catch (err) {
      console.error('Failed to delete chat session:', err);
      setErrorToast('Failed to delete conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle message submission
  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    if (!textToSend) {
      setInputValue('');
    }

    const userMessage: AiChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await AiApiService.sendMessage(text, sessionId);
      setSessionId(response.sessionId);
      setMessages(response.history);
      // Refresh session list in sidebar
      const historyData = await AiApiService.getHistory(response.sessionId);
      if (historyData.sessions) {
        setSessions(historyData.sessions);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartNewChat = () => {
    setSessionId(undefined);
    setMessages([]);
  };

  const handleClearHistory = async () => {
    try {
      await AiApiService.clearHistory();
      setSessionId(undefined);
      setMessages([]);
      setSessions([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const handleCopyText = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatTime = (ts: string | Date) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  const promptSuggestions = [
    `What are the best skills to become a ${dreamCareer}?`,
    `Give me a step-by-step career roadmap for ${discipline}.`,
    `How should I prepare for technical interviews in ${dreamCareer}?`,
    `Which top hiring companies look for ${discipline} graduates?`,
  ];

  return (
    <DashboardLayout>
      <div className="ambient-noise" />

      <div className={styles.container}>
        {/* Main Center Chat Container */}
        <main className={styles.chatMain}>
          {/* Header Bar */}
          <header className={styles.chatHeader}>
            <button 
              className={styles.newChatBtn}
              onClick={handleStartNewChat}
              title="Start a new conversation"
            >
              <Plus size={16} />
              <span>New Chat</span>
            </button>

            <div className={styles.headerTitleBox}>
              <div className={styles.headerBrandTitle}>
                <div className={styles.headerLogoIcon}>
                  <Brain size={18} />
                </div>
                <span className={styles.headerTitleText}>Visionix</span>
              </div>
              <span className={styles.headerSubtitle}>
                Your AI career companion. Ask anything about careers, skills, roadmaps and more.
              </span>
            </div>

            <button 
              className={styles.headerIconBtn} 
              onClick={handleClearHistory}
              title="Reset conversation history"
            >
              <Trash2 size={16} />
            </button>
          </header>

          {/* Messages Scroll Area */}
          <div className={styles.messagesScrollArea}>
            <div className={styles.dateSeparator}>
              <span className={styles.dateSeparatorText}>Today</span>
            </div>

            {messages.length === 0 ? (
              /* Welcome State */
              <div className={styles.welcomeContainer}>
                <div className={styles.welcomeIconWrapper}>
                  <Sparkles size={28} />
                </div>
                <h2 className={styles.welcomeTitle}>Visionix</h2>
                <p className={styles.welcomeSubtitle}>
                  Hi {userName}! 👋 I'm your Visionix AI Career Assistant. How can I help you today with your career journey in <strong>{discipline}</strong> towards <strong>{dreamCareer}</strong>?
                </p>

                <div className={styles.promptChipsGrid}>
                  {promptSuggestions.map((prompt, idx) => (
                    <motion.div
                      key={idx}
                      className={styles.promptChip}
                      onClick={() => handleSend(prompt)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      "{prompt}"
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              /* Conversation Messages Stream */
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`${styles.messageRow} ${isUser ? styles.userRow : styles.aiRow}`}
                    >
                      {!isUser && (
                        <div className={styles.aiAvatar}>
                          <Brain size={20} />
                        </div>
                      )}

                      <div className={styles.bubbleContainer}>
                        <div className={isUser ? styles.userBubble : styles.aiBubble}>
                          {isUser ? msg.content : <MarkdownRenderer content={msg.content} />}
                        </div>

                        {/* Meta info & action toolbar */}
                        {isUser ? (
                          <div className={styles.messageMeta}>
                            <span>{formatTime(msg.timestamp)}</span>
                            <Check size={13} style={{ color: '#a7f3d0' }} />
                          </div>
                        ) : (
                          <div className={styles.aiActionsRow}>
                            <button 
                              className={styles.actionBtn} 
                              onClick={() => handleCopyText(msg.content, index)}
                              title="Copy message"
                            >
                              {copiedIndex === index ? <Check size={14} style={{ color: '#4ade80' }} /> : <Copy size={14} />}
                            </button>
                            <button className={styles.actionBtn} title="Helpful">
                              <ThumbsUp size={14} />
                            </button>
                            <button className={styles.actionBtn} title="Not helpful">
                              <ThumbsDown size={14} />
                            </button>
                            <button 
                              className={styles.actionBtn} 
                              onClick={() => handleSend(messages[index - 1]?.content || 'Can you elaborate?')}
                              title="Regenerate"
                            >
                              <RotateCcw size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}

            {/* AI Response Loading Indicator */}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${styles.messageRow} ${styles.aiRow}`}
              >
                <div className={styles.aiAvatar}>
                  <Brain size={20} />
                </div>
                <div className={styles.aiBubble} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Visionix is thinking</span>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', height: '10px' }}>
                    <span className="typing-dot typing-dot-1" style={{ width: '5px', height: '5px', backgroundColor: '#c084fc' }} />
                    <span className="typing-dot typing-dot-2" style={{ width: '5px', height: '5px', backgroundColor: '#c084fc' }} />
                    <span className="typing-dot typing-dot-3" style={{ width: '5px', height: '5px', backgroundColor: '#c084fc' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Box */}
          <div className={styles.inputContainerWrapper}>
            <div className={styles.inputBox}>
              <textarea
                ref={textareaRef}
                className={styles.textarea}
                placeholder="Ask anything about careers, skills, courses..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isLoading}
              />

              <div className={styles.inputControlsRow}>
                <div className={styles.modeChipsGroup}>
                  <button 
                    className={`${styles.modeChip} ${activeMode === 'quick' ? styles.modeChipActive : ''}`}
                    onClick={() => setActiveMode('quick')}
                  >
                    <Sparkles size={12} />
                    <span>Quick</span>
                  </button>
                  <button 
                    className={`${styles.modeChip} ${activeMode === 'deep' ? styles.modeChipActive : ''}`}
                    onClick={() => setActiveMode('deep')}
                  >
                    <Brain size={12} />
                    <span>Deep</span>
                  </button>
                  <button 
                    className={`${styles.modeChip} ${activeMode === 'research' ? styles.modeChipActive : ''}`}
                    onClick={() => setActiveMode('research')}
                  >
                    <Compass size={12} />
                    <span>Research</span>
                  </button>
                </div>

                <div className={styles.inputActionsGroup}>
                  <button 
                    className={styles.actionBtn} 
                    title="Voice input (Placeholder)"
                    style={{ padding: '6px' }}
                  >
                    <Mic size={16} />
                  </button>
                  <button 
                    className={styles.sendBtn}
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isLoading}
                    title="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>

            <p className={styles.disclaimerText}>
              Visionix AI can make mistakes. Consider checking important information.
            </p>
          </div>
        </main>

        {/* Right Panel (Chat History & Profile Context) */}
        <aside className={styles.rightPanel}>
          {/* Chat History Card */}
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Chat History</h3>
              <Clock size={16} style={{ color: 'var(--text-muted)' }} />
            </div>

            <div className={styles.historyList}>
              {sessions.length > 0 ? (
                sessions.map((session, i) => (
                  <div 
                    key={session.sessionId || i} 
                    className={`${styles.historyItem} ${sessionId === session.sessionId ? styles.historyItemActive : ''}`}
                    onClick={() => {
                      setSessionId(session.sessionId);
                      setMessages(session.messages);
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                      <span className={styles.historyText}>{session.title || 'Career Guidance Chat'}</span>
                      <span className={styles.historyTime}>{formatTime(session.lastActive)}</span>
                    </div>
                    <button 
                      className={styles.deleteSessionBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmDelete(session.sessionId);
                      }}
                      title="Delete conversation"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.historyItem} style={{ justifyContent: 'center' }}>
                  <span className={styles.historyText} style={{ color: 'var(--text-muted)' }}>No recent chats</span>
                </div>
              )}
            </div>

            <button className={styles.viewAllLink} onClick={handleClearHistory}>
              <span>Clear chat history</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Profile Context Card */}
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Your Profile Context</h3>
            </div>
            <p className={styles.panelSubtitle}>
              These details help me give you better personalized answers.
            </p>

            <div className={styles.contextList}>
              <div className={styles.contextItem}>
                <div className={styles.contextIcon} style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                  <Compass size={16} />
                </div>
                <div>
                  <span className={styles.contextLabel}>Field</span>
                  <span className={styles.contextValue}>{discipline}</span>
                </div>
              </div>

              <div className={styles.contextItem}>
                <div className={styles.contextIcon} style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>
                  <Target size={16} />
                </div>
                <div>
                  <span className={styles.contextLabel}>Target Goal</span>
                  <span className={styles.contextValue}>{dreamCareer}</span>
                </div>
              </div>

              <div className={styles.contextItem}>
                <div className={styles.contextIcon} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                  <Brain size={16} />
                </div>
                <div>
                  <span className={styles.contextLabel}>Active Learner</span>
                  <span className={styles.contextValue}>{userName}</span>
                </div>
              </div>
            </div>

            <button 
              className={styles.updatePrefBtn}
              onClick={() => navigate('/settings')}
            >
              <Settings size={14} />
              <span>Update Preferences</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Lightweight Confirmation Modal */}
      <AnimatePresence>
        {sessionToDelete && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                background: 'linear-gradient(135deg, rgba(20, 18, 38, 0.95), rgba(12, 10, 24, 0.98))',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
              }}
            >
              <h4 style={{ margin: '0 0 12px 0', fontSize: '1.15rem', color: '#fff', fontWeight: 600 }}>
                Delete this conversation?
              </h4>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                This action cannot be undone. All messages in this session will be permanently deleted.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => setSessionToDelete(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSession}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)')}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              background: 'rgba(239, 68, 68, 0.95)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '8px',
              padding: '12px 24px',
              color: '#fff',
              fontWeight: 500,
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
              zIndex: 1001,
              pointerEvents: 'none',
            }}
          >
            {errorToast}
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};
