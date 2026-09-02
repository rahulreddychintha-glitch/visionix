import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Mic, Compass, Sparkles, ArrowRight, Wrench } from 'lucide-react';
import styles from './DashboardWidgets.module.css';

export const QuickToolsHub: React.FC = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: 'AI Resume Builder',
      desc: 'ATS-optimized resume tailored to your target career',
      icon: FileText,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.1)',
      path: '/resume',
      badge: 'ATS Ready'
    },
    {
      title: 'AI Mock Interview',
      desc: 'Practice technical & behavioral questions with AI feedback',
      icon: Mic,
      color: '#a855f7',
      bg: 'rgba(168, 85, 247, 0.1)',
      path: '/interview',
      badge: 'AI Powered'
    },
    {
      title: 'Skill Navigator',
      desc: 'Detect skill gaps and access targeted learning plans',
      icon: Sparkles,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
      path: '/skill-gap',
      badge: 'Skill Matrix'
    },
    {
      title: 'Career Explorer',
      desc: 'Discover and compare 100+ high-demand career pathways',
      icon: Compass,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
      path: '/explore',
      badge: 'Directory'
    }
  ];

  return (
    <motion.div
      className="premiumCard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '18px 20px',
        boxSizing: 'border-box'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 className="text-subheading" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Career Suite & Tools</h3>
            <p className="text-caption" style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>Accelerate your career preparation</p>
          </div>
          <Wrench size={16} style={{ color: 'var(--color-primary)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.title}
                onClick={() => navigate(tool.path)}
                className={styles.interactiveListItem}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.015)',
                  border: '1px solid rgba(255, 255, 255, 0.035)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: tool.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tool.color,
                    flexShrink: 0
                  }}>
                    <Icon size={14} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {tool.title}
                      </span>
                      <span style={{
                        fontSize: '0.6rem',
                        padding: '1px 4px',
                        borderRadius: '3px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-muted)',
                        fontWeight: 500
                      }}>
                        {tool.badge}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.675rem', color: 'var(--text-secondary)', margin: '1px 0 0 0', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tool.desc}
                    </p>
                  </div>
                </div>
                <ArrowRight size={12} style={{ color: 'var(--text-muted)', flexShrink: 0, marginLeft: '4px' }} />
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/resume')}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '14px',
          padding: '8px 14px',
          borderRadius: '8px',
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.22)',
          color: '#c084fc',
          fontSize: '0.78rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.18)';
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.22)';
        }}
      >
        Launch AI Resume Builder <ArrowRight size={13} />
      </button>
    </motion.div>
  );
};
