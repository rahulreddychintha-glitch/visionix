import axios from 'axios';

/**
 * Standard utility to extract error messages from backend API errors.
 */
export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Check for network errors (no response from server)
    if (!error.response) {
      return 'Unable to connect to the server.';
    }

    const status = error.response.status;

    if (status === 401) {
      return 'Incorrect email or password.';
    }
    if (status === 409) {
      return 'Email address is already registered.';
    }
    if (status === 500) {
      return 'Something went wrong. Please try again.';
    }

    // Default API error message fallback (sanitized)
    const data = error.response.data;
    if (data && typeof data === 'object') {
      if ('message' in data && typeof data.message === 'string') {
        return data.message;
      }
    }
    return 'Something went wrong. Please try again.';
  }
  
  return 'Something went wrong. Please try again.';
};
