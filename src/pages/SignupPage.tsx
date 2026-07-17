import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, AlertCircle, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { 
  validateName, 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword, 
  getPasswordStrength 
} from '../utils/validation';
import { extractErrorMessage } from '../utils/error';
import axios from 'axios';
import styles from './AuthPage.module.css';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Controlled states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Success and Error handling
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleNameChange = (val: string) => {
    setFullName(val);
    if (fieldErrors.fullName) {
      setFieldErrors(prev => ({ ...prev, fullName: undefined }));
    }
  };

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

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (fieldErrors.confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const strength = getPasswordStrength(password);
  
  // Choose correct CSS class and label for strength meter
  const getStrengthClass = () => {
    switch (strength) {
      case 'weak': return styles.strengthWeak;
      case 'medium': return styles.strengthMedium;
      case 'strong': return styles.strengthStrong;
      case 'very-strong': return styles.strengthVeryStrong;
      case 'very-weak':
      default:
        return styles.strengthVeryWeak;
    }
  };

  const getStrengthLabel = () => {
    switch (strength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      case 'very-strong': return 'Very Strong';
      case 'very-weak':
      default:
        return 'Very Weak';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent duplicate submissions

    setError(null);
    setSuccess(null);
    setFieldErrors({});

    // Validate inputs
    const errors: typeof fieldErrors = {};

    if (!fullName) {
      errors.fullName = 'Full name is required';
    } else {
      const nameVal = validateName(fullName);
      if (!nameVal.valid) errors.fullName = nameVal.error;
    }

    if (!email) {
      errors.email = 'Email address is required';
    } else {
      const emailVal = validateEmail(email);
      if (!emailVal.valid) errors.email = emailVal.error;
    }

    if (!password) {
      errors.password = 'Password is required';
    } else {
      const passVal = validatePassword(password);
      if (!passVal.valid) errors.password = passVal.error;
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else {
      const confirmVal = validateConfirmPassword(password, confirmPassword);
      if (!confirmVal.valid) errors.confirmPassword = confirmVal.error;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      
      // Accessibility: Focus automatically moves to first invalid field
      const firstInvalidId = errors.fullName ? 'name' : (errors.email ? 'email' : (errors.password ? 'password' : 'confirmPassword'));
      document.getElementById(firstInvalidId)?.focus();
      return;
    }

    setIsLoading(true);
    try {
      // 1. Authenticate with backend, save JWT and user, update AuthContext immediately
      await register({ fullName, email, password });
      
      // 2. Display success message
      setSuccess('✓ Account created successfully.');
      
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
        
        if (status === 409) {
          setFieldErrors({ email: 'Email address is already registered.' });
          document.getElementById('email')?.focus();
        } else if (status === 400 && data && Array.isArray(data.errors)) {
          // Map backend validation errors to fields
          const bErrors: typeof fieldErrors = {};
          data.errors.forEach((e: { field?: string; message: string }) => {
            if (e.field) {
              const key = e.field === 'name' ? 'fullName' : e.field;
              bErrors[key as keyof typeof fieldErrors] = e.message;
            }
          });
          setFieldErrors(bErrors);
          
          // Focus first invalid field returned from backend
          const focusId = bErrors.fullName ? 'name' : (bErrors.email ? 'email' : (bErrors.password ? 'password' : (bErrors.confirmPassword ? 'confirmPassword' : undefined)));
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
        
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Start mapping your high-growth AI career roadmap.</p>
        
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
            <label htmlFor="name">Full Name</label>
            <div className={styles.inputWrapper}>
              <User className={styles.inputIcon} size={18} />
              <input 
                type="text" 
                id="name" 
                className={styles.input} 
                placeholder="John Doe" 
                autoComplete="name"
                value={fullName}
                onChange={(e) => handleNameChange(e.target.value)}
                disabled={isLoading}
                aria-invalid={fieldErrors.fullName ? 'true' : 'false'}
                aria-describedby={fieldErrors.fullName ? 'name-error' : undefined}
                required 
              />
            </div>
            {fieldErrors.fullName && (
              <span id="name-error" role="alert" className={styles.fieldError}>
                {fieldErrors.fullName}
              </span>
            )}
          </div>

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
                autoComplete="new-password"
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

          {/* Password strength meter */}
          {password && (
            <div className={styles.strengthWrapper}>
              <div className={styles.strengthTrack}>
                <div className={`${styles.strengthBar} ${getStrengthClass()}`} />
              </div>
              <span className={styles.strengthText}>Strength: {getStrengthLabel()}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={18} />
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                id="confirmPassword" 
                className={styles.input} 
                placeholder="••••••••" 
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                disabled={isLoading}
                style={{ paddingRight: '44px' }}
                aria-invalid={fieldErrors.confirmPassword ? 'true' : 'false'}
                aria-describedby={fieldErrors.confirmPassword ? 'confirm-password-error' : undefined}
                required 
              />
              <button
                type="button"
                className={styles.togglePasswordBtn}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <span id="confirm-password-error" role="alert" className={styles.fieldError}>
                {fieldErrors.confirmPassword}
              </span>
            )}
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
                Creating Account...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        
        <p className={styles.footer}>
          Already have an account?
          <a href="#" className={styles.footerLink} onClick={(e) => { e.preventDefault(); if (!isLoading) navigate('/login'); }}>
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};
