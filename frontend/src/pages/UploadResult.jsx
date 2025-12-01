// 📚 LESSON: Upload Result Page
// Form to upload a new result

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResult } from '../services/results';
import api from '../services/api';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

const UploadResult = () => {
  // 🎯 Form state
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [session, setSession] = useState('');
  const [semester, setSemester] = useState('First');
  const [file, setFile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // 🎯 Fetch available sessions
  useEffect(() => {
    // For now, we'll create a simple list
    // In a real app, you'd fetch this from an API
    setSessions([
      { id: 1, name: '2023/2024' },
      { id: 2, name: '2024/2025' },
    ]);
  }, []);

  // 🎯 Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  // 🎯 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);

    try {
      await uploadResult(courseCode, courseTitle, session, semester, file);
      alert('Result uploaded successfully!');
      navigate('/results');
    } catch (err) {
      setError(err.message || 'Failed to upload result');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          📝 Upload Result
        </h1>

        <Card>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Course Code */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Course Code *
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CSC101"
                required
              />
            </div>

            {/* Course Title */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Introduction to Computer Science"
                required
              />
            </div>

            {/* Session */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Session *
              </label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Session</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Semester *
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="First">First Semester</option>
                <option value="Second">Second Semester</option>
              </select>
            </div>

            {/* File upload */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Result File (Optional)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Maximum file size: 10MB
              </p>
              {file && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Selected: {file.name}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Uploading...' : 'Upload Result'}
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/results')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default UploadResult;
