/**
 * Dashboard Service
 * Handles dashboard statistics API calls
 */

import api from './api';
import { User } from './auth';

export interface DashboardStats {
  total_documents: number;
  total_results: number;
  pending_approvals: number;
  recent_uploads: number;
  user: User;
  role: string;
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/dashboard/');
  return response.data;
};
