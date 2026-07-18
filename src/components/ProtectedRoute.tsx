import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/auth.constants';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowPendingOnboarding?: boolean;
  isOnboardingRoute?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  allowPendingOnboarding = false,
  isOnboardingRoute = false
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        backgroundColor: 'var(--bg-dark)',
        color: 'var(--text-secondary)',
        gap: '12px',
      }}>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin-animation {
            animation: spin 1s linear infinite;
          }
        `}</style>
        <Loader2 className="spin-animation" size={32} style={{ color: 'var(--color-primary)' }} />
        <span style={{ fontSize: '0.95rem', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>
          Verifying session...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Redirect to onboarding if authenticated but onboarding is incomplete
  if (!user?.isOnboarded && !allowPendingOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // Redirect to dashboard if already onboarded and trying to access onboarding wizard
  if (user?.isOnboarded && isOnboardingRoute) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};
