import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Send, Sparkles, Loader2, ArrowLeft, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CareerService } from '../../services/career.service';
import type { Career } from '../../services/career.service';
import { AiApiService } from '../../services/ai.service';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import styles from '../../pages/CareerExplorerPage.module.css';

interface CareerDetailsModalProps {
  career: Career | null;
  onClose: () => void;
  onToggleBookmark: (career: Career) => void;
  onToggleCompare: (career: Career) => void;
}

export const CareerDetailsModal: React.FC<CareerDetailsModalProps> = ({
  career,
  onClose,
  onToggleBookmark,
  onToggleCompare
}) => {
  const navigate = useNavigate();
  const [isChatActive, setIsChatActive] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model' | 'system'; content: string; timestamp: string | Date }>>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState<boolean>(false);

  // Reset explanation when career changes
  useEffect(() => {
    setAiExplanation(null);
    setLoadingExplanation(false);
  }, [career?.id]);

  const handleGenerateExplanation = async () => {
    if (!career) return;
    try {
      setLoadingExplanation(true);
      const explanation = await CareerService.getRecommendationExplanation(career.id);
      setAiExplanation(explanation);
    } catch (err) {
      console.error('Error generating AI explanation:', err);
      setAiExplanation('Could not generate the AI explanation at this time. Please try again.');
    } finally {
      setLoadingExplanation(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Fetch or initialize chat history when chat mode becomes active
  useEffect(() => {
    if (!career || !isChatActive) return;

    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const response = await AiApiService.getHistory(`career_session_${career.id}`);
        if (response.activeSession && response.activeSession.messages.length > 0) {
          setMessages(response.activeSession.messages);
        } else {
          // Add system/welcome message
          setMessages([
            {
              role: 'model',
              content: `Hello! I am your AI career mentor. Ask me anything about becoming a **${career.title}**, such as required studies, skills, career path, or specializations!`,
              timestamp: new Date().toISOString()
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching career session history:', err);
        // Fallback to welcome message
        setMessages([
          {
            role: 'model',
            content: `Hello! I am your AI career mentor. Ask me anything about becoming a **${career.title}**, such as required studies, skills, career path, or specializations!`,
            timestamp: new Date().toISOString()
          }
        ]);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [career, isChatActive]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isChatActive && messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [messages, isChatActive, scrollToBottom]);

  if (!career) return null;

  const handleSendMessage = async (overrideText?: string) => {
    const textToSend = (overrideText || inputText).trim();
    if (!textToSend || isSending) return;

    setInputText('');
    setIsSending(true);

    // Append user message locally
    const userMessage = {
      role: 'user' as const,
      content: textToSend,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await AiApiService.sendMessage(
        textToSend,
        `career_session_${career.id}`,
        career.id
      );
      setMessages(response.history);
    } catch (err) {
      console.error('Failed to send AI message:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'system' as const,
          content: 'Sorry, I experienced an issue connecting to the server. Please try again.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const suggestions = [
    `What does a ${career.title} do?`,
    'What skills should I learn?',
    'Is this suitable for my background?',
    'What is the typical career path?'
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={isChatActive ? styles.chatModalContent : styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleWrapper}>
            <p className={styles.cardCategory} style={{ marginBottom: '2px' }}>{career.category}</p>
            <h2 className="text-heading" style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isChatActive && (
                <button 
                  onClick={() => setIsChatActive(false)} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: 0 }}
                  aria-label="Back to details"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              {career.title}
            </h2>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Split view or single details view */}
        <div className={isChatActive ? styles.splitLayout : styles.modalBody}>
          
          {/* Left Column - Specifications */}
          <div className={isChatActive ? styles.leftCol : styles.modalBody}>
            <div className={styles.infoSection}>
              <p className={styles.infoLabel}>Description</p>
              <p className={styles.infoVal}>{career.description}</p>
            </div>

            {career.recommendationReason && (
              <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.12)', marginBottom: '16px' }}>
                <p className={styles.infoLabel} style={{ color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 8px 0', fontSize: '0.74rem' }}>
                  <Sparkles size={14} />
                  <span>Recommendation Insight</span>
                </p>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.45' }}>
                  {career.recommendationReason}
                </p>
                
                {aiExplanation ? (
                  <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '8px' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {aiExplanation}
                    </p>
                  </div>
                ) : loadingExplanation ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <Loader2 className="spin-animation" size={14} style={{ color: '#a78bfa' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Generating AI explanation...</span>
                  </div>
                ) : (
                  <button 
                    className="premiumButtonPrimary" 
                    style={{ 
                      padding: '5px 10px', 
                      fontSize: '0.74rem', 
                      background: 'rgba(124, 58, 237, 0.12)', 
                      border: '1px solid rgba(124, 58, 237, 0.25)', 
                      color: '#a78bfa',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      marginTop: '4px'
                    }}
                    onClick={handleGenerateExplanation}
                  >
                    Why is this recommended? Ask AI
                  </button>
                )}
              </div>
            )}

            <div className={styles.infoSection}>
              <p className={styles.infoLabel}>Typical Skills Required</p>
              {career.skills.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {career.skills.map((skill) => (
                    <span key={skill} className={styles.skillTag} style={{ fontSize: '0.78rem', padding: '4px 10px' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className={styles.infoVal}>Not Specified</p>
              )}
            </div>

            <div className={styles.infoSection}>
              <p className={styles.infoLabel}>Education Pathway</p>
              <p className={styles.infoVal}>{career.education}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={styles.infoSection}>
                <p className={styles.infoLabel}>Salary Range</p>
                <p className={styles.infoVal}>{career.salaryRange}</p>
              </div>
              <div className={styles.infoSection}>
                <p className={styles.infoLabel}>Growth Outlook</p>
                <p className={styles.infoVal}>{career.growthRate}</p>
              </div>
            </div>

            <div className={styles.infoSection}>
              <p className={styles.infoLabel}>Demand Level</p>
              <p className={styles.infoVal}>{career.demandLevel}</p>
            </div>
          </div>

          {/* Right Column - AI Chat (Enabled in split view) */}
          {isChatActive && (
            <div className={styles.rightCol}>
              <div className={styles.chatContainer}>
                {loadingHistory ? (
                  <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Loader2 className="spin-animation" size={24} style={{ color: 'var(--color-primary)' }} />
                  </div>
                ) : (
                  <div className={styles.messageHistory}>
                    {messages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`${styles.messageBubble} ${
                          msg.role === 'user' 
                            ? styles.userMessage 
                            : msg.role === 'model' 
                            ? styles.modelMessage 
                            : ''
                        }`}
                        style={msg.role === 'system' ? { alignSelf: 'center', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.8rem' } : undefined}
                      >
                        {msg.role === 'user' ? (
                          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                        ) : msg.role === 'model' ? (
                          <MarkdownRenderer content={msg.content} />
                        ) : (
                          <p style={{ margin: 0 }}>{msg.content}</p>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                {/* Suggestions Section */}
                <div className={styles.suggestionsGrid}>
                  {suggestions.map((sText) => (
                    <button 
                      key={sText} 
                      className={styles.suggestionBtn}
                      onClick={() => handleSendMessage(sText)}
                      disabled={isSending}
                    >
                      {sText}
                    </button>
                  ))}
                </div>

                {/* Input Controls */}
                <div className={styles.chatInputArea}>
                  <input
                    type="text"
                    className={styles.chatInput}
                    placeholder="Ask about studies, skills, path..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isSending}
                  />
                  <button 
                    className={styles.sendButton} 
                    onClick={() => handleSendMessage()}
                    disabled={isSending || !inputText.trim()}
                    aria-label="Send query"
                  >
                    {isSending ? <Loader2 className="spin-animation" size={16} /> : <Send size={16} />}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px', flexWrap: 'wrap', width: '100%' }}>
          <button
            className={career.saved ? 'premiumButtonSecondary' : 'premiumButtonPrimary'}
            style={{ flex: 1, minWidth: '130px' }}
            onClick={() => onToggleBookmark(career)}
          >
            {career.saved ? 'Remove Bookmark' : 'Save Career'}
          </button>
          
          <button
            className="premiumButtonSecondary"
            style={{ flex: 1, minWidth: '130px' }}
            onClick={() => {
              onToggleCompare(career);
              onClose();
            }}
          >
            Compare
          </button>

          {!isChatActive ? (
            <button
              className="premiumButtonPrimary"
              style={{ 
                flex: 1.2, 
                minWidth: '160px',
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                border: 'none',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onClick={() => setIsChatActive(true)}
            >
              <Sparkles size={16} />
              <span>Ask AI About Career</span>
            </button>
          ) : (
            <button
              className="premiumButtonSecondary"
              style={{ flex: 1, minWidth: '130px' }}
              onClick={() => setIsChatActive(false)}
            >
              Back to Details
            </button>
          )}

          <button
            className="premiumButtonPrimary"
            style={{ 
              flex: 1.2, 
              minWidth: '160px',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onClick={() => {
              navigate('/roadmap', { state: { selectedCareer: career } });
              onClose();
            }}
          >
            <Rocket size={16} />
            <span>Create Roadmap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
