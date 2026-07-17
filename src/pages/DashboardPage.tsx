import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '80px 24px 120px 24px',
      backgroundColor: 'var(--bg-dark)',
      position: 'relative',
    }}>
      {/* Background canvas lights matching Landing page */}
      <div className="glow-accent-primary" style={{ width: '400px', height: '400px', top: '10%', left: '15%' }}></div>
      <div className="glow-accent-secondary" style={{ width: '450px', height: '450px', bottom: '10%', right: '15%' }}></div>

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '600px',
        padding: '40px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-card)', paddingBottom: '20px' }}>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.2rem', marginBottom: '4px' }}>Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Welcome to your career cockpit</p>
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={logout}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '10px 16px',
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            padding: '20px', 
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.03)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(88, 80, 236, 0.2)'
            }}>
              <UserIcon size={24} style={{ color: '#fff' }} />
            </div>
            <div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 600 }}>{user?.fullName}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user?.email}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ 
              padding: '16px', 
              background: 'rgba(255, 255, 255, 0.01)', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid rgba(255, 255, 255, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Role Context</span>
              <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} style={{ color: 'var(--color-primary)' }} />
                {user?.role === 'admin' ? 'Administrator' : 'Standard User'}
              </span>
            </div>
            <div style={{ 
              padding: '16px', 
              background: 'rgba(255, 255, 255, 0.01)', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid rgba(255, 255, 255, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Account Created</span>
              <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ 
          padding: '16px', 
          background: 'rgba(88, 80, 236, 0.05)', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid rgba(88, 80, 236, 0.1)',
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Phase 3 Authentication Connected Successfully!
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>
            Next Phase: Onboarding & Profile Questionnaire
          </p>
        </div>
      </div>
    </div>
  );
};
