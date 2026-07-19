import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface UnderDevelopmentPageProps {
  title: string;
}

export const UnderDevelopmentPage: React.FC<UnderDevelopmentPageProps> = ({ title }) => {
  return (
    <DashboardLayout>
      <div className="ambient-noise" />
      <div className="glow-accent-primary" style={{ width: '400px', height: '400px', top: '20%', left: '25%', opacity: 0.3 }}></div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '24px'
      }}>
        <motion.div
          className="premiumCard"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ maxWidth: '480px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(88, 80, 236, 0.1), rgba(126, 58, 242, 0.1))',
            border: '1px solid rgba(88, 80, 236, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)'
          }}>
            <HelpCircle size={32} />
          </div>
          <div>
            <h2 className="text-heading" style={{ fontSize: '1.45rem', marginBottom: '8px' }}>Module Under Development</h2>
            <p className="text-caption" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', fontWeight: 700 }}>
              {title} Page
            </p>
          </div>
          <p className="text-description" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
            The {title.toLowerCase()} page details and backend configurations are currently being prepared for the next release phase. Live updates will reflect once the server synchronization completes.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};
