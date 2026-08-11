import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Send, Sparkles, Loader2, ArrowLeft, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CareerService } from '../../services/career.service';
import type { Career, CareerMatchResult } from '../../services/career.service';
import { AiApiService } from '../../services/ai.service';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import styles from '../../pages/CareerExplorerPage.module.css';

interface CareerDetailsModalProps {
  career: Career | null;
  onClose: () => void;
  onToggleBookmark: (career: Career) => void;
  onToggleCompare: (career: Career) => void;
  compareList: Career[];
}

export const CareerDetailsModal: React.FC<CareerDetailsModalProps> = ({
  career,
  onClose,
  onToggleBookmark,
  onToggleCompare,
  compareList
}) => {
  const isInCompare = career ? compareList.some((c) => c.id === career.id) : false;
  const navigate = useNavigate();
  const [isChatActive, setIsChatActive] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model' | 'system'; content: string; timestamp: string | Date }>>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'details' | 'match'>('details');
  const [matchData, setMatchData] = useState<CareerMatchResult | null>(null);
  const [loadingMatch, setLoadingMatch] = useState<boolean>(false);
  const [matchExplanation, setMatchExplanation] = useState<string | null>(null);
  const [loadingMatchExplanation, setLoadingMatchExplanation] = useState<boolean>(false);

  // Reset explanation and tabs when career changes
  useEffect(() => {
    setAiExplanation(null);
    setLoadingExplanation(false);
    setActiveTab('details');
    setMatchData(null);
    setMatchExplanation(null);
    setLoadingMatchExplanation(false);
  }, [career?.id]);

  useEffect(() => {
    if (activeTab === 'match' && career && !matchData && !loadingMatch) {
      const fetchMatch = async () => {
        try {
          setLoadingMatch(true);
          const res = await CareerService.getCareerMatch(career.id);
          setMatchData(res);
        } catch (err) {
          console.error('Error fetching career match:', err);
        } finally {
          setLoadingMatch(false);
        }
      };
      fetchMatch();
    }
  }, [activeTab, career, matchData, loadingMatch]);

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
            {/* Sub-tab selector */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '16px', paddingBottom: '8px' }}>
              <button
                style={{
                  background: activeTab === 'details' ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                  border: 'none',
                  color: activeTab === 'details' ? 'var(--text-primary)' : 'var(--text-muted)',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button
                style={{
                  background: activeTab === 'match' ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                  border: 'none',
                  color: activeTab === 'match' ? 'var(--text-primary)' : 'var(--text-muted)',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onClick={() => setActiveTab('match')}
              >
                <Sparkles size={14} style={{ color: '#a78bfa' }} />
                Career Match
              </button>
            </div>

            {activeTab === 'details' ? (
              <>
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
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {loadingMatch ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '24px 0', justifyContent: 'center' }}>
                    <Loader2 className="spin-animation" size={20} style={{ color: 'var(--color-primary)' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Calculating compatibility...</span>
                  </div>
                ) : !matchData ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Could not compute match data.</p>
                ) : !matchData.isProfileComplete ? (
                  <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <p className="text-heading" style={{ fontSize: '1rem', marginBottom: '8px' }}>Not Enough Profile Data</p>
                    <p className="text-description" style={{ fontSize: '0.85rem', lineHeight: '1.45', margin: '0 0 14px 0' }}>
                      Complete more of your profile or onboarding details to receive a personalized Career Match compatibility score.
                    </p>
                    <button
                      className="premiumButtonPrimary"
                      onClick={() => {
                        navigate('/profile');
                        onClose();
                      }}
                    >
                      Update Profile
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Circular Score Visualizer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div style={{ position: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="70" height="70" viewBox="0 0 70 70">
                          <circle cx="35" cy="35" r="30" fill="transparent" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="6" />
                          <circle cx="35" cy="35" r="30" fill="transparent" 
                            stroke="url(#matchGrad)" 
                            strokeWidth="6" 
                            strokeDasharray={2 * Math.PI * 30} 
                            strokeDashoffset={2 * Math.PI * 30 * (1 - matchData.matchScore / 100)} 
                            strokeLinecap="round"
                            transform="rotate(-90 35 35)"
                          />
                          <defs>
                            <linearGradient id="matchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span style={{ position: 'absolute', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {matchData.matchScore}%
                        </span>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Current Compatibility
                        </p>
                        <h4 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', color: matchData.matchScore >= 75 ? '#10b981' : matchData.matchScore >= 45 ? '#f59e0b' : '#ef4444' }}>
                          {matchData.matchLevel} Alignment
                        </h4>
                      </div>
                    </div>

                    {/* AI Match Explanation */}
                    <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.12)' }}>
                      <p className={styles.infoLabel} style={{ color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 8px 0', fontSize: '0.74rem' }}>
                        <Sparkles size={14} />
                        <span>AI Compatibility Analysis</span>
                      </p>
                      {matchExplanation ? (
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                          {matchExplanation}
                        </p>
                      ) : loadingMatchExplanation ? (
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                           <Loader2 className="spin-animation" size={14} style={{ color: '#a78bfa' }} />
                           <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Analyzing profile fit...</span>
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
                          onClick={async () => {
                            try {
                              setLoadingMatchExplanation(true);
                              const exp = await CareerService.getCareerMatchExplanation(career.id);
                              setMatchExplanation(exp);
                            } catch (err) {
                              console.error(err);
                              setMatchExplanation('Could not load match explanation at this time.');
                            } finally {
                              setLoadingMatchExplanation(false);
                            }
                          }}
                        >
                          Ask AI About Your Match
                        </button>
                      )}
                    </div>

                    {/* Strengths */}
                    <div className={styles.infoSection}>
                      <p className={styles.infoLabel}>Your Strengths</p>
                      <ul style={{ margin: '6px 0 0 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {matchData.strengths.map((str, idx) => (
                          <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', listStyleType: 'checkmark' }}>
                            {str}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills Comparison */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className={styles.infoSection}>
                        <p className={styles.infoLabel}>Skills You Have</p>
                        {matchData.skillsYouHave.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                            {matchData.skillsYouHave.map(skill => (
                              <span key={skill} className={styles.skillTag} style={{ fontSize: '0.72rem', padding: '3px 8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p style={{ margin: '6px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>None listed in profile</p>
                        )}
                      </div>

                      <div className={styles.infoSection}>
                        <p className={styles.infoLabel}>Skill Gaps</p>
                        {matchData.skillGaps.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                            {matchData.skillGaps.map(gapStr => {
                              const skillName = gapStr.replace('Missing verified skill: ', '');
                              return (
                                <span key={skillName} className={styles.skillTag} style={{ fontSize: '0.72rem', padding: '3px 8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                  {skillName}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <p style={{ margin: '6px 0 0 0', fontSize: '0.8rem', color: '#10b981' }}>✓ No skill gaps!</p>
                        )}
                      </div>
                    </div>

                    {/* Areas to Improve */}
                    <div className={styles.infoSection}>
                      <p className={styles.infoLabel}>Areas to Improve</p>
                      <ul style={{ margin: '6px 0 0 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {matchData.improvementSuggestions.map((sugg, idx) => (
                          <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                            {sugg}
                          </li>
                         ))}
                       </ul>
                     </div>
                  </>
                )}
              </div>
            )}
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
            className={isInCompare ? "premiumButtonPrimary" : "premiumButtonSecondary"}
            style={{ 
              flex: 1, 
              minWidth: '130px',
              background: isInCompare ? 'rgba(236, 72, 153, 0.15)' : '',
              border: isInCompare ? '1px solid rgba(236, 72, 153, 0.4)' : '',
              color: isInCompare ? '#ec4899' : ''
            }}
            onClick={() => {
              if (career) {
                onToggleCompare(career);
              }
            }}
            disabled={!isInCompare && compareList.length >= 3}
            title={!isInCompare && compareList.length >= 3 ? "You can compare up to 3 careers max." : ""}
          >
            {isInCompare ? 'Remove Compare' : 'Add to Compare'}
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
