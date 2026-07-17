import { STORAGE_KEYS } from '../constants/auth.constants';
import type { User } from '../types/auth.types';

/**
 * Gets the JWT token from either localStorage or sessionStorage.
 */
export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN) ?? sessionStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Saves the JWT token. If rememberMe is true, it is stored in localStorage.
 * Otherwise, it is stored in sessionStorage.
 */
export const setToken = (token: string, rememberMe = false): void => {
  // Clear any existing token first
  removeToken();
  if (rememberMe) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } else {
    sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }
};

/**
 * Removes the JWT token from both localStorage and sessionStorage.
 */
export const removeToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
};

/**
 * Gets the authenticated User details from localStorage.
 */
export const getUser = (): User | null => {
  const userJson = localStorage.getItem(STORAGE_KEYS.USER) ?? sessionStorage.getItem(STORAGE_KEYS.USER);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
};

/**
 * Saves the authenticated User details. Matches the token storage type.
 */
export const setUser = (user: User, rememberMe = false): void => {
  removeUser();
  const userJson = JSON.stringify(user);
  if (rememberMe) {
    localStorage.setItem(STORAGE_KEYS.USER, userJson);
  } else {
    sessionStorage.setItem(STORAGE_KEYS.USER, userJson);
  }
};

/**
 * Removes the authenticated User details from storage.
 */
export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  sessionStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Clears all authentication details from storage.
 */
export const clearAuthStorage = (): void => {
  removeToken();
  removeUser();
};
