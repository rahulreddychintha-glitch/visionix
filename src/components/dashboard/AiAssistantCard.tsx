import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare } from 'lucide-react';
import type { AssistantData } from '../../types/dashboard.types';
import styles from './DashboardWidgets.module.css';

interface AiAssistantCardProps {
  assistant?: AssistantData;
}

export const AiAssistantCard: React.FC<AiAssistantCardProps> = ({ assistant }) => {
  const activeMessage = assistant?.messages?.[0]?.text || "Your Python foundations are solid. I recommend moving to Phase 2: PyTorch and neural networks next.";
  const isOnline = assistant ? assistant.isOnline : true;

  return (
    <motion.div 
      className={`premiumCard premiumCardHero ${styles.aiCard}`}
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'space-between', padding: '12px' }}
    >
      {/* Glowing floating particles (limited to 5 for optimal performance) */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            borderRadius: '50%',
            background: 'var(--color-secondary)',
            filter: 'blur(1px)',
            opacity: Math.random() * 0.3 + 0.15,
            top: `${Math.random() * 70 + 15}%`,
            left: `${Math.random() * 80 + 10}%`,
            pointerEvents: 'none',
          }}
          animate={{
            y: [0, -25 - Math.random() * 15, 0],
            x: [0, Math.random() * 16 - 8, 0],
            opacity: [0.15, 0.45, 0.15],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Online indicator */}
      <div className={styles.onlineBadge} style={{ top: '16px', right: '16px' }}>
        <motion.span 
          className={styles.pulsingDot} 
          animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={!isOnline ? { backgroundColor: '#9ca3af', boxShadow: 'none' } : {}}
        />
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </div>

      {/* AI Avatar with concentric glowing pulse rings */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0px' }}>
        <motion.div
          style={{
            position: 'absolute',
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            border: '1px solid rgba(126, 58, 242, 0.15)',
            background: 'radial-gradient(circle, rgba(126, 58, 242, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
        <motion.div
          style={{
            position: 'absolute',
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            border: '1px solid rgba(126, 58, 242, 0.2)',
            pointerEvents: 'none'
          }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.div 
          className={styles.aiAvatarWrapperRefined}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <MessageSquare size={28} />
        </motion.div>
      </div>

      {/* Greeting and description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
        <h3 className="text-subheading" style={{ fontSize: '1.15rem' }}>AI Career Match Assistant</h3>
        <p className="text-description" style={{ fontSize: '0.8rem', maxWidth: '280px', margin: '0 auto', textAlign: 'center' }}>
          Real-time mentorship & interactive interview coaching.
        </p>
      </div>

      {/* Message bubble container */}
      <div 
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          padding: '8px 12px',
          borderRadius: '16px 16px 16px 4px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.4',
          textAlign: 'left',
          position: 'relative',
          width: '100%',
          maxWidth: '280px',
          margin: '2px auto',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.02)',
          zIndex: 2
        }}
      >
        <span style={{ fontWeight: 700, color: 'var(--color-primary)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Visionix AI</span>
        "{activeMessage}"
      </div>

      {/* Chat button with premium shine effect */}
      <motion.button 
        className={`premiumButtonPrimary ${styles.shineBtn}`}
        aria-label="Chat with AI Assistant"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        style={{ width: '100%', zIndex: 2, padding: '8px 16px', fontSize: '0.85rem' }}
      >
        <span>Chat with AI</span>
        <Sparkles size={12} />
      </motion.button>
    </motion.div>
  );
};
