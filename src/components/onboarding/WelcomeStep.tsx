import React from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { NavigationButtons } from './NavigationButtons';
import styles from '../../pages/OnboardingPage.module.css';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px', 
      animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      textAlign: 'center',
      padding: '10px 0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(88, 80, 236, 0.15), rgba(126, 58, 242, 0.15))',
          border: '1px solid rgba(88, 80, 236, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)',
          boxShadow: '0 8px 32px rgba(88, 80, 236, 0.08)',
        }}>
          <Compass size={36} className="pulse" />
        </div>
      </div>

      <div>
        <h2 className={styles.title} style={{ fontSize: '2.2rem', fontWeight: 700 }}>Welcome to Visionix</h2>
        <p className={styles.subtitle} style={{ maxWidth: '460px', margin: '12px auto 0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
          Help us personalize your career journey. Answering a few quick questions allows Visionix AI to recommend tailored paths, essential skills, curriculum roadmaps, and custom learning materials.
        </p>
      </div>

      <div style={{
        marginTop: '8px',
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.01)',
        border: '1px solid rgba(255, 255, 255, 0.03)',
        borderRadius: 'var(--radius-md)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        maxWidth: '360px',
        margin: '0 auto',
      }}>
        <Sparkles size={16} style={{ color: 'var(--color-accent)' }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Takes less than 2 minutes to calibrate</span>
      </div>

      <NavigationButtons
        isFirstStep={true}
        isLastStep={false}
        isLoading={false}
        onNext={onNext}
        nextText="Get Started"
      />
    </div>
  );
};
