import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { validateEmail } from '../utils/validation';
import { extractErrorMessage } from '../utils/error';
import axios from 'axios';
import styles from './AuthPage.module.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Controlled states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Success and Error handling
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (fieldErrors.email) {
      setFieldErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent duplicate submissions

    setError(null);
    setSuccess(null);
    setFieldErrors({});

    // Client-side validations
    const errors: typeof fieldErrors = {};
    if (!email) {
      errors.email = 'Email address is required';
    } else {
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        errors.email = emailValidation.error;
      }
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      
      // Accessibility: Focus automatically moves to first invalid field
      const firstInvalidId = errors.email ? 'email' : 'password';
      document.getElementById(firstInvalidId)?.focus();
      return;
    }

    setIsLoading(true);
    try {
      // 1. Authenticate with backend, save JWT and user, update AuthContext immediately
      await login({ email, password }, rememberMe);
      
      // 2. Display success message
      setSuccess('✓ Login successful.');
      
      // 3. Wait approximately 1.5 seconds, then navigate to dashboard
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 1500);
    } catch (err: unknown) {
      setIsLoading(false);
      
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 401) {
          setFieldErrors({ password: 'Incorrect email or password.' });
          document.getElementById('password')?.focus();
        } else if (status === 400 && data && Array.isArray(data.errors)) {
          // Map backend validation errors to fields
          const bErrors: typeof fieldErrors = {};
          data.errors.forEach((e: { field?: string; message: string }) => {
            if (e.field === 'email' || e.field === 'password') {
              bErrors[e.field] = e.message;
            }
          });
          setFieldErrors(bErrors);
          
          // Focus first invalid field returned from backend
          const focusId = bErrors.email ? 'email' : (bErrors.password ? 'password' : undefined);
          if (focusId) document.getElementById(focusId)?.focus();
        } else {
          setError(extractErrorMessage(err));
        }
      } else {
        setError(extractErrorMessage(err));
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} glass-panel`}>
        <button className={styles.backBtn} onClick={() => navigate('/')} disabled={isLoading}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
        
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to continue your personalized career journey.</p>
        
        {success && (
          <div className={styles.successAlert} role="alert">
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className={styles.errorAlert} role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={18} />
              <input 
                type="email" 
                id="email" 
                className={styles.input} 
                placeholder="you@example.com" 
                autoComplete="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                disabled={isLoading}
                aria-invalid={fieldErrors.email ? 'true' : 'false'}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                required 
              />
            </div>
            {fieldErrors.email && (
              <span id="email-error" role="alert" className={styles.fieldError}>
                {fieldErrors.email}
              </span>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={18} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                className={styles.input} 
                placeholder="••••••••" 
                autoComplete="current-password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={isLoading}
                style={{ paddingRight: '44px' }}
                aria-invalid={fieldErrors.password ? 'true' : 'false'}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                required 
              />
              <button
                type="button"
                className={styles.togglePasswordBtn}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && (
              <span id="password-error" role="alert" className={styles.fieldError}>
                {fieldErrors.password}
              </span>
            )}
          </div>

          <div className={styles.rememberGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span>Remember Me</span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className={`${styles.submitBtn} ${isLoading ? styles.btnDisabled : ''}`}
            disabled={isLoading}
            aria-busy={isLoading ? 'true' : 'false'}
          >
            {isLoading && !success ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <style>{`
                  @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                  .spin-animation {
                    animation: spin 1s linear infinite;
                  }
                `}</style>
                <Loader2 className="spin-animation" size={16} />
                Logging In...
              </span>
            ) : (
              'Log In'
            )}
          </button>
        </form>
        
        <p className={styles.footer}>
          Don't have an account?
          <a href="#" className={styles.footerLink} onClick={(e) => { e.preventDefault(); if (!isLoading) navigate('/signup'); }}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};
