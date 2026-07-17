import { api } from './client';

export interface User {
  id: number;
  name: string;
  email: string;
}

export function fetchCurrentUser(): Promise<User> {
  return api.get<User>('/auth/me');
}

export function register(name: string, email: string, password: string): Promise<User> {
  return api.post<User>('/auth/register', { name, email, password });
}

export function login(email: string, password: string): Promise<User> {
  return api.post<User>('/auth/login', { email, password });
}

export function logout(): Promise<void> {
  return api.post<void>('/auth/logout');
}
