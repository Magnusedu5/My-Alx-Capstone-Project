// 📚 LESSON: Upload Document Page
// Form to upload a new document

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDocument } from '../services/documents';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

const UploadDocument = () => {
  // 🎯 Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // 🎯 Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (max 10MB)
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

    // Validation
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);

    try {
      await uploadDocument(title, description, file);
      alert('Document uploaded successfully!');
      navigate('/documents');
    } catch (err) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          📤 Upload Document
        </h1>

        <Card>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Document Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter document title"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter document description"
                rows="4"
              />
            </div>

            {/* File upload */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Select File *
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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
                {loading ? 'Uploading...' : 'Upload Document'}
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/documents')}
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

export default UploadDocument;
