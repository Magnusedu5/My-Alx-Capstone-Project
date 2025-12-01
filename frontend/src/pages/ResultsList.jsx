// 📚 LESSON: Results List Page
// Shows all results with filtering and delete options

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getResults, deleteResult } from '../services/results';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

const ResultsList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, isHOD } = useAuth();

  // 🎯 Fetch results when page loads
  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const data = await getResults();
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Handle delete
  const handleDelete = async (resultId) => {
    if (!window.confirm('Are you sure you want to delete this result?')) {
      return;
    }

    try {
      await deleteResult(resultId);
      setResults(results.filter(result => result.id !== resultId));
      alert('Result deleted successfully');
    } catch (err) {
      alert(err.message || 'Failed to delete result');
    }
  };

  // 🎯 Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">📊 Results</h1>
        <Link to="/results/upload">
          <Button>Upload Result</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {results.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-600">No results found</p>
            <Link to="/results/upload">
              <Button className="mt-4">Upload Your First Result</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {results.map((result) => (
            <Card key={result.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-blue-600 font-bold text-lg">
                      {result.course_code}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(result.status)}`}>
                      {result.status}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {result.course_title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📅 Session: {result.session_name || result.session}</span>
                    <span>📖 Semester: {result.semester}</span>
                    <span>👤 {result.uploaded_by_name || 'Unknown'}</span>
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-2">
                    Uploaded: {new Date(result.upload_date).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  {/* Download button */}
                  {result.file && (
                    <a
                      href={result.file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="primary" className="text-sm">
                        Download
                      </Button>
                    </a>
                  )}

                  {/* Delete button (only for own results or HOD) */}
                  {(isHOD || result.uploaded_by === user?.id) && (
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(result.id)}
                      className="text-sm"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default ResultsList;
