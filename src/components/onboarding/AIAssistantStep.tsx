import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';
import { NavigationButtons } from './NavigationButtons';
import styles from '../../pages/OnboardingPage.module.css';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

interface AIAssistantStepProps {
  data: any;
  onChange: (section: string, fields: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

interface QuestionConfig {
  id: string;
  questionText: string;
  options: string[];
  field: string; // The field under careerGoals or workPreferences to map to
  section: string; // The section name in state
  placeholder: string;
}

export const AIAssistantStep: React.FC<AIAssistantStepProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
  isLoading
}) => {
  const userName = data.personal?.fullName?.split(' ')[0] || 'there';
  const dreamCareer = data.careerGoals?.dreamCareer || 'your chosen career';

  // Questions configuration
  const questions: QuestionConfig[] = [
    {
      id: 'motivation',
      questionText: `What motivates you the most in pursuing a career in ${dreamCareer}?`,
      options: ['High Salary', 'Continuous Learning', 'Creative Freedom', 'Building Products', 'Helping People', 'Stability & Security'],
      section: 'careerGoals',
      field: 'careerObjectives',
      placeholder: 'Type your motivation...'
    },
    {
      id: 'pathway',
      questionText: 'Which path interests you the most right now?',
      options: ['Jobs', 'Higher Studies', 'Business / Startup', 'Research', 'Freelancing', 'Government Jobs', 'Undecided'],
      section: 'education',
      field: 'higherEducationPlans', // maps to higherEducationPlans
      placeholder: 'Type your pathway preference...'
    },
    {
      id: 'work_type',
      questionText: 'What kind of work environments or sectors do you enjoy?',
      options: ['Technology', 'Healthcare', 'Business', 'Arts & Design', 'Science & Engineering', 'Education', 'Law & Governance', 'Sports & Fitness', 'Creative Media'],
      section: 'workPreferences',
      field: 'remoteHybridOffice', // maps to remoteHybridOffice
      placeholder: 'Type your environment preference...'
    },
    {
      id: 'anything_else',
      questionText: 'Is there anything else you would like Visionix to know about your goals or preferences?',
      options: ['Open to relocation', 'Prefer remote work', 'Looking for internships', 'Ready to start!'],
      section: 'careerGoals',
      field: 'longTermAspirations', // maps to longTermAspirations
      placeholder: 'Type anything else or "Nothing else"...'
    }
  ];

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationComplete, setConversationComplete] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation
  useEffect(() => {
    if (messages.length === 0) {
      setIsTyping(true);
      const timer1 = setTimeout(() => {
        const welcomeMessage: Message = {
          id: 'welcome',
          sender: 'bot',
          text: `Hi ${userName} 👋\n\nI'm your Visionix Career Assistant.\n\nI just need a few quick answers to personalize your experience. Let's start with a quick question.`,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);

        const timer2 = setTimeout(() => {
          const firstQuestion: Message = {
            id: 'q-0',
            sender: 'bot',
            text: questions[0].questionText,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, firstQuestion]);
          setIsTyping(false);
        }, 1200);

        return () => clearTimeout(timer2);
      }, 600);

      return () => clearTimeout(timer1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || isTyping || conversationComplete) return;

    // Add user message
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Save answer into state
    const currentQuestion = questions[currentQuestionIdx];
    const prevSectionData = data[currentQuestion.section] || {};
    
    // Determine mapping logic
    let mappedVal = textToSend;
    if (currentQuestion.id === 'motivation') {
      mappedVal = `Primary motivation: ${textToSend}. Primary goal is to build a successful career as a ${dreamCareer}.`;
    }

    onChange(currentQuestion.section, {
      ...prevSectionData,
      [currentQuestion.field]: mappedVal
    });

    // Check if there are more questions
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < questions.length) {
      setCurrentQuestionIdx(nextIdx);
      setIsTyping(true);
      
      setTimeout(() => {
        const nextBotMsg: Message = {
          id: `q-${nextIdx}`,
          sender: 'bot',
          text: questions[nextIdx].questionText,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, nextBotMsg]);
        setIsTyping(false);
      }, 1000);
    } else {
      // Completed the conversation
      setIsTyping(true);
      setTimeout(() => {
        const endBotMsg: Message = {
          id: 'complete',
          sender: 'bot',
          text: `Perfect! Thank you, ${userName}. I've noted down your preferences and calibrated our recommendation engines.\n\nClick "Continue" below to review your career dashboard setup.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, endBotMsg]);
        setIsTyping(false);
        setConversationComplete(true);

        // Also save conversation summary into state
        const conversationSummary = messages
          .concat(userMsg)
          .filter(m => m.id !== 'welcome' && m.id !== 'complete')
          .map(m => `${m.sender === 'bot' ? 'Q' : 'A'}: ${m.text}`)
          .join('\n');
        
        onChange('careerGoals', {
          ...(data.careerGoals || {}),
          careerObjectives: `${data.careerGoals?.careerObjectives || ''}\n\nAI Conversation summary:\n${conversationSummary}`
        });

      }, 1200);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputValue);
    }
  };

  const currentQuestion = questions[currentQuestionIdx];

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', minHeight: '480px' }}
    >
      <div>
        <h2 className={styles.title}>AI Career Assistant</h2>
        <p className={styles.subtitle}>
          Visionix AI will align your motivation, pathway preference, and career interests.
        </p>
      </div>

      {/* Chat Messages Panel */}
      <div
        style={{
          flex: 1,
          minHeight: '300px',
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.3)'
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.18 }}
                style={{
                  display: 'flex',
                  justifyContent: isBot ? 'flex-start' : 'flex-end',
                  alignItems: 'flex-start',
                  gap: '10px',
                  width: '100%'
                }}
              >
                {/* Bot Icon */}
                {isBot && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.25)',
                    color: '#c084fc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Bot size={16} />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: isBot ? '0 14px 14px 14px' : '14px 0 14px 14px',
                    background: isBot 
                      ? 'rgba(255, 255, 255, 0.03)' 
                      : 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(88, 80, 236, 0.2))',
                    border: isBot 
                      ? '1px solid rgba(255, 255, 255, 0.06)' 
                      : '1px solid rgba(139, 92, 246, 0.4)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-line',
                    boxShadow: isBot ? 'none' : '0 4px 15px rgba(139, 92, 246, 0.1)'
                  }}
                >
                  {isBot && msg.id === 'welcome' && (
                    <span style={{ fontWeight: 700, color: '#c084fc', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                      Visionix AI
                    </span>
                  )}
                  {msg.text}
                </div>

                {/* User Icon */}
                {!isBot && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <User size={16} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              color: '#c084fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={16} />
            </div>
            <div style={{
              padding: '12px 20px',
              borderRadius: '0 14px 14px 14px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              display: 'flex',
              gap: '4px',
              alignItems: 'center'
            }}>
              <span className="pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#c084fc', display: 'inline-block' }} />
              <span className="pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#c084fc', display: 'inline-block', animationDelay: '0.2s' }} />
              <span className="pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#c084fc', display: 'inline-block', animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies Panel */}
      <AnimatePresence mode="wait">
        {!conversationComplete && !isTyping && currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Quick Replies
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {currentQuestion.options.map((opt) => (
                <motion.button
                  key={opt}
                  type="button"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSendMessage(opt)}
                  style={{
                    fontSize: '0.8rem',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Free Text Input Form */}
      {!conversationComplete && (
        <div style={{ display: 'flex', gap: '10px', width: '100%', position: 'relative' }}>
          <input
            type="text"
            className={styles.input}
            placeholder={isTyping ? 'Assistant is typing...' : currentQuestion?.placeholder || 'Type your message...'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isTyping || isLoading}
            style={{ paddingRight: '46px' }}
          />
          <button
            type="button"
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping || isLoading}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: inputValue.trim() ? '#c084fc' : 'var(--text-muted)',
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              transition: 'color 0.15s ease'
            }}
          >
            <Send size={16} />
          </button>
        </div>
      )}

      {/* Step Navigation Buttons */}
      <NavigationButtons
        isFirstStep={false}
        isLastStep={false}
        isLoading={isLoading}
        onNext={onNext}
        onPrev={onPrev}
        nextDisabled={!conversationComplete}
      />
    </div>
  );
};
