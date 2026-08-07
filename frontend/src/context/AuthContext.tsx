import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ApiError, setUnauthorizedHandler } from '../api/client';
import { fetchCurrentUser, login as loginRequest, logout as logoutRequest, register as registerRequest, type User } from '../api/auth';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Any 401 from any request (not just this initial check) routes through
    // here too, so an expired/invalid session clears `user` immediately
    // instead of leaving stale auth state around.
    setUnauthorizedHandler(() => {
      setUser(null);
      queryClient.clear();
    });

    fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));

    return () => setUnauthorizedHandler(null);
  }, [queryClient]);

  async function login(email: string, password: string, rememberMe: boolean) {
    const loggedInUser = await loginRequest(email, password, rememberMe);
    setUser(loggedInUser);
  }

  async function register(name: string, email: string, password: string) {
    await registerRequest(name, email, password);
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
    // Prevents the next user who logs in on this tab from briefly seeing
    // this user's cached /api/routes data before the fresh fetch resolves.
    queryClient.clear();
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { ApiError };
