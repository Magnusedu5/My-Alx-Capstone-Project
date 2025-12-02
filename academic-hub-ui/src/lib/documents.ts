/**
 * Documents Service
 * Handles document-related API calls
 */

import api from './api';

export interface Document {
  id: number;
  title: string;
  description: string | null;
  file: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  status_display: string;
  upload_date: string;
  uploaded_by: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
}

export interface UploadDocumentData {
  title: string;
  description: string;
  file: File;
  category?: string;
}

/**
 * Get all documents
 */
export const getDocuments = async (): Promise<Document[]> => {
  const response = await api.get<Document[]>('/documents/');
  return response.data;
};

/**
 * Get a single document by ID
 */
export const getDocument = async (id: number): Promise<Document> => {
  const response = await api.get<Document>(`/documents/${id}/`);
  return response.data;
};

/**
 * Upload a new document
 */
export const uploadDocument = async (data: UploadDocumentData): Promise<Document> => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('file', data.file);
  if (data.category) {
    formData.append('category', data.category);
  }

  const response = await api.post<Document>('/documents/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Delete a document
 */
export const deleteDocument = async (id: number): Promise<void> => {
  await api.delete(`/documents/${id}/`);
};

/**
 * Get pending documents (HOD only)
 */
export const getPendingDocuments = async (): Promise<Document[]> => {
  const response = await api.get<Document[]>('/hod/documents/pending/');
  return response.data;
};

/**
 * Approve a document (HOD only)
 */
export const approveDocument = async (id: number): Promise<{ message: string }> => {
  const response = await api.post(`/hod/documents/${id}/approve/`);
  return response.data;
};

/**
 * Reject a document (HOD only)
 */
export const rejectDocument = async (id: number): Promise<{ message: string }> => {
  const response = await api.post(`/hod/documents/${id}/reject/`);
  return response.data;
};
