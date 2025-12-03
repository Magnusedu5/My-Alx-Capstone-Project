/**
 * Results Service
 * Handles result-related API calls
 */

import api from './api';

export interface Result {
  id: number;
  course_code: string;
  course_title: string;
  session: number;
  session_name: string;
  semester: 'First' | 'Second';
  semester_display: string;
  file: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  status_display: string;
  upload_date: string;
  updated_at: string;
  uploaded_by: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
  // Google Drive fields
  gdrive_file_id?: string;
  gdrive_file_url?: string;
  file_url?: string;
  original_filename?: string;
}

export interface UploadResultData {
  course_code: string;
  course_title: string;
  session: string;
  semester: string;
  file: File;
  level?: string;
}

/**
 * Get all results
 */
export const getResults = async (): Promise<Result[]> => {
  const response = await api.get<Result[]>('/results/');
  return response.data;
};

/**
 * Get a single result by ID
 */
export const getResult = async (id: number): Promise<Result> => {
  const response = await api.get<Result>(`/results/${id}/`);
  return response.data;
};

export const deleteResult = async (id: number): Promise<void> => {
  await api.delete(`/results/${id}/`);
};

export const bulkDeleteResults = async (ids: number[]): Promise<{ message: string; deleted_count: number; errors: string[] | null }> => {
  const response = await api.post('/results/bulk-delete/', { ids });
  return response.data;
};

/**
 * Upload a new result
 */
export const uploadResult = async (data: UploadResultData): Promise<Result> => {
  const formData = new FormData();
  formData.append('course_code', data.course_code);
  formData.append('course_title', data.course_title);
  formData.append('session', data.session);
  formData.append('semester', data.semester);
  formData.append('file', data.file);
  if (data.level) {
    formData.append('level', data.level);
  }

  const response = await api.post<Result>('/results/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get pending results (HOD only)
 */
export const getPendingResults = async (): Promise<Result[]> => {
  const response = await api.get<Result[]>('/hod/results/pending/');
  return response.data;
};

/**
 * Approve a result (HOD only)
 */
export const approveResult = async (id: number): Promise<{ message: string }> => {
  const response = await api.post(`/hod/results/${id}/approve/`);
  return response.data;
};

/**
 * Reject a result (HOD only)
 */
export const rejectResult = async (id: number): Promise<{ message: string }> => {
  const response = await api.post(`/hod/results/${id}/reject/`);
  return response.data;
};
