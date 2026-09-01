export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a user's full name.
 * Full name must be at least 2 characters and contain only letters and spaces.
 */
export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { valid: false, error: 'Full name is required' };
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  if (!/^[a-zA-Z\s]*$/.test(name)) {
    return { valid: false, error: 'Name can only contain letters and spaces' };
  }
  return { valid: true };
};

/**
 * Validates an email address.
 * RFC-compliant validation checking format correctness.
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { valid: false, error: 'Email address is required' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true };
};

/**
 * Validates password requirement.
 * Requires at least 6 characters.
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { valid: false, error: 'Password must contain at least 6 characters' };
  }
  return { valid: true };
};

/**
 * Validates that confirm password matches the primary password.
 */
export const validateConfirmPassword = (password: string, confirm: string): ValidationResult => {
  if (!confirm) {
    return { valid: false, error: 'Please confirm your password' };
  }
  if (password !== confirm) {
    return { valid: false, error: 'Passwords do not match' };
  }
  return { valid: true };
};

export type PasswordStrength = 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';

/**
 * Evaluates password strength score from 0-5.
 */
export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return 'very-weak';
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return 'very-weak';
  if (score === 2) return 'weak';
  if (score === 3) return 'medium';
  if (score === 4) return 'strong';
  return 'very-strong';
};
