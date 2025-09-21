import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, LoginRequest, SignupRequest } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginData: LoginRequest) => Promise<void>;
  register: (signupData: SignupRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          try {
            const userData = await authApi.getCurrentUser();
            setUser(userData);
          } catch (error) {
            console.error('Failed to get current user:', error);
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        // 로그인 없이도 접근 가능하도록 로딩 완료
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (loginData: LoginRequest) => {
    try {
      const response: AuthResponse = await authApi.login(loginData);
      localStorage.setItem('authToken', response.accessToken);
      
      const userData: User = {
        id: response.id,
        username: response.username,
        email: response.email,
        displayName: response.displayName,
        roles: response.roles,
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (signupData: SignupRequest) => {
    try {
      console.log('useAuth register 호출:', signupData);
      const result = await authApi.register(signupData);
      console.log('useAuth register 성공:', result);
      return result;
    } catch (error) {
      console.error('useAuth register 실패:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    authApi.logout().catch(console.error);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};