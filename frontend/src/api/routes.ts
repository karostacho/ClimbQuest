import { api } from './client';

export interface Route {
  id: number;
  route_name: string;
  grade_index: number;
  climb_date: string;
  comment: string | null;
  created_at: string;
}

export type SortBy = 'date' | 'grade';
export type SortOrder = 'asc' | 'desc';

export function fetchRoutes(sortBy: SortBy, order: SortOrder): Promise<Route[]> {
  return api.get<Route[]>(`/routes?sort_by=${sortBy}&order=${order}`);
}

export interface NewRoute {
  route_name: string;
  grade_index: number;
  climb_date: string;
  comment?: string;
}

export function createRoute(route: NewRoute): Promise<Route> {
  return api.post<Route>('/routes', route);
}

export function deleteRoute(id: number): Promise<void> {
  return api.delete<void>(`/routes/${id}`);
}
