// 📚 LESSON: Dashboard Service
// This file handles fetching dashboard statistics

import api from './api';

// 🎯 Function: Get dashboard data
// Fetches statistics for the current user's dashboard
// The backend returns different data based on role (Staff vs HOD)
export const getDashboardData = async () => {
  try {
    const response = await api.get('/dashboard/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch dashboard data' };
  }
};
