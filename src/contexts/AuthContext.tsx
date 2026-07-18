import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, IRegisterInput, ILoginInput } from '../types/auth.types';
import { AuthService } from '../services/auth.service';
import { 
  getToken, 
  setToken as saveTokenToStorage, 
  setUser as saveUserToStorage, 
  clearAuthStorage, 
  getUser 
} from '../utils/storage';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: ILoginInput, rememberMe: boolean) => Promise<void>;
  register: (data: IRegisterInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (partialUser: Partial<User>) => void;
}

// eslint-disable-next-line react/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = getToken();
      const storedUser = getUser();

      if (storedToken && storedUser) {
        setTokenState(storedToken);
        setUserState(storedUser);
        
        try {
          // Verify session integrity with the backend
          const data = await AuthService.getMe();
          setUserState(data.user);
          // Update stored user details with fresh data from DB
          const isRemembered = !!localStorage.getItem('visionix_token');
          saveUserToStorage(data.user, isRemembered);
        } catch {
          // If token verification fails, clear invalid auth state
          clearAuthStorage();
          setTokenState(null);
          setUserState(null);
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (credentials: ILoginInput, rememberMe: boolean) => {
    const data = await AuthService.login(credentials);
    setTokenState(data.token);
    setUserState(data.user);
    saveTokenToStorage(data.token, rememberMe);
    saveUserToStorage(data.user, rememberMe);
  };

  const register = async (data: IRegisterInput) => {
    const responseData = await AuthService.register(data);
    setTokenState(responseData.token);
    setUserState(responseData.user);
    // Automatically login on signup - store in sessionStorage by default
    saveTokenToStorage(responseData.token, false);
    saveUserToStorage(responseData.user, false);
  };

  const logout = () => {
    // Attempt stateful logout on backend, but proceed locally regardless
    AuthService.logout().catch(() => {
      // Ignore API errors during logout to guarantee local state is cleared
    });
    clearAuthStorage();
    setTokenState(null);
    setUserState(null);
  };

  const refreshUser = async () => {
    try {
      const data = await AuthService.getMe();
      setUserState(data.user);
      const isRemembered = !!localStorage.getItem('visionix_token');
      saveUserToStorage(data.user, isRemembered);
    } catch (err) {
      console.error('Failed to refresh user session', err);
    }
  };

  const updateUser = (partialUser: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...partialUser };
      setUserState(updatedUser);
      const isRemembered = !!localStorage.getItem('visionix_token');
      saveUserToStorage(updatedUser, isRemembered);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
