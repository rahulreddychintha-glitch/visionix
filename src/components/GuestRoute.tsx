import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/auth.constants';
import { Loader2 } from 'lucide-react';

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Track if they were authenticated when the route first loaded
  const [wasAuthenticatedOnLoad, setWasAuthenticatedOnLoad] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading && wasAuthenticatedOnLoad === null) {
      setWasAuthenticatedOnLoad(isAuthenticated);
    }
  }, [isLoading, isAuthenticated, wasAuthenticatedOnLoad]);

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
          Loading...
        </span>
      </div>
    );
  }

  // Redirect if they were already authenticated when the route loaded.
  // This satisfies the redirect job of GuestRoute without prematurely unmounting
  // children components during their login/signup submit transitions.
  if (wasAuthenticatedOnLoad || (wasAuthenticatedOnLoad === null && isAuthenticated)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};
