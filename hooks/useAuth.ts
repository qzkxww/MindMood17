import { useState, useEffect, createContext, useContext } from 'react';
import { Platform } from 'react-native';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  provider: 'apple' | 'google' | 'email';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password?: string) => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock authentication service - replace with your actual auth service
class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signInWithEmail(email: string, password?: string): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      provider: 'email'
    };
    
    this.currentUser = user;
    return user;
  }

  async signInWithApple(): Promise<User> {
    // In a real app, use expo-apple-authentication
    if (Platform.OS === 'web') {
      throw new Error('Apple Sign In is not available on web');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: 'user@icloud.com',
      name: 'Apple User',
      provider: 'apple'
    };
    
    this.currentUser = user;
    return user;
  }

  async signInWithGoogle(): Promise<User> {
    // In a real app, use expo-auth-session with Google
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: 'user@gmail.com',
      name: 'Google User',
      provider: 'google'
    };
    
    this.currentUser = user;
    return user;
  }

  async signOut(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export function useAuthService() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const authService = AuthService.getInstance();

  useEffect(() => {
    // Check for existing session on mount
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const signIn = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithEmail(email, password);
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithApple();
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithGoogle();
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    signIn,
    signInWithApple,
    signInWithGoogle,
    signOut,
  };
}