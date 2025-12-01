// 📚 LESSON: Results Service
// This file handles all result-related API calls
// (upload, list, approve, reject, delete, filter)

import api from './api';

// 🎯 Function 1: Get all results
// Fetches the list of results from the API
export const getResults = async () => {
  try {
    const response = await api.get('/results/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch results' };
  }
};

// 🎯 Function 2: Filter results
// Fetches results based on session, semester, or course code
export const filterResults = async (filters) => {
  try {
    // Build query string from filters
    // Example: ?session=1&semester=First&course_code=CSC101
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/results/filter/?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to filter results' };
  }
};

// 🎯 Function 3: Upload a result
// Sends a new result to the server
export const uploadResult = async (courseCode, courseTitle, session, semester, file) => {
  try {
    const formData = new FormData();
    formData.append('course_code', courseCode);
    formData.append('course_title', courseTitle);
    formData.append('session', session);
    formData.append('semester', semester);
    if (file) {
      formData.append('file', file);
    }
    
    const response = await api.post('/results/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to upload result' };
  }
};

// 🎯 Function 4: Approve a result (HOD only)
export const approveResult = async (resultId) => {
  try {
    const response = await api.patch(`/results/${resultId}/approve/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to approve result' };
  }
};

// 🎯 Function 5: Reject a result (HOD only)
export const rejectResult = async (resultId) => {
  try {
    const response = await api.patch(`/results/${resultId}/reject/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reject result' };
  }
};

// 🎯 Function 6: Delete a result
export const deleteResult = async (resultId) => {
  try {
    const response = await api.delete(`/results/${resultId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete result' };
  }
};
