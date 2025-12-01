// 📚 LESSON: Documents Service
// This file handles all document-related API calls
// (upload, list, approve, reject, delete)

import api from './api';

// 🎯 Function 1: Get all documents
// Fetches the list of documents from the API
export const getDocuments = async () => {
  try {
    const response = await api.get('/documents/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch documents' };
  }
};

// 🎯 Function 2: Upload a document
// Sends a new document to the server
// Note: We use FormData because we're uploading a file
export const uploadDocument = async (title, description, file) => {
  try {
    // FormData is special - it can handle files
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);
    
    // When uploading files, we need to set the content type to multipart/form-data
    const response = await api.post('/documents/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to upload document' };
  }
};

// 🎯 Function 3: Approve a document (HOD only)
// Sends a request to approve a document by its ID
export const approveDocument = async (documentId) => {
  try {
    const response = await api.patch(`/documents/${documentId}/approve/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to approve document' };
  }
};

// 🎯 Function 4: Reject a document (HOD only)
// Sends a request to reject a document by its ID
export const rejectDocument = async (documentId) => {
  try {
    const response = await api.patch(`/documents/${documentId}/reject/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reject document' };
  }
};

// 🎯 Function 5: Delete a document
// Deletes a document by its ID
export const deleteDocument = async (documentId) => {
  try {
    const response = await api.delete(`/documents/${documentId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete document' };
  }
};
