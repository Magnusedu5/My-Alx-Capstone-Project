// 📚 LESSON: Approve Results Page (HOD Only)
// HOD can approve or reject pending results

import { useState, useEffect } from 'react';
import { getResults, approveResult, rejectResult } from '../services/results';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

const ApproveResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // 🎯 Fetch results when page loads
  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const data = await getResults();
      // Filter to show only pending results
      const pending = data.filter(result => result.status?.toLowerCase() === 'pending');
      setResults(pending);
    } catch (err) {
      setError(err.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Handle approve
  const handleApprove = async (resultId) => {
    setProcessingId(resultId);
    try {
      await approveResult(resultId);
      // Remove from list after approval
      setResults(results.filter(result => result.id !== resultId));
      alert('Result approved successfully');
    } catch (err) {
      alert(err.message || 'Failed to approve result');
    } finally {
      setProcessingId(null);
    }
  };

  // 🎯 Handle reject
  const handleReject = async (resultId) => {
    if (!window.confirm('Are you sure you want to reject this result?')) {
      return;
    }

    setProcessingId(resultId);
    try {
      await rejectResult(resultId);
      // Remove from list after rejection
      setResults(results.filter(result => result.id !== resultId));
      alert('Result rejected');
    } catch (err) {
      alert(err.message || 'Failed to reject result');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading pending results...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        ✅ Approve Results
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {results.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-gray-600 text-lg">No pending results</p>
            <p className="text-gray-500 text-sm mt-2">
              All results have been reviewed!
            </p>
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
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {result.course_title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <span>📅 Session: {result.session_name || result.session}</span>
                    <span>📖 Semester: {result.semester}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>👤 Uploaded by: {result.uploaded_by_name || 'Unknown'}</span>
                    <span>🕒 {new Date(result.upload_date).toLocaleDateString()}</span>
                  </div>

                  {/* Download link */}
                  {result.file && (
                    <a
                      href={result.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                    >
                      📄 View/Download Result
                    </a>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {/* Approve button */}
                  <Button
                    variant="success"
                    onClick={() => handleApprove(result.id)}
                    disabled={processingId === result.id}
                    className="min-w-[120px]"
                  >
                    {processingId === result.id ? 'Processing...' : '✓ Approve'}
                  </Button>
                  
                  {/* Reject button */}
                  <Button
                    variant="danger"
                    onClick={() => handleReject(result.id)}
                    disabled={processingId === result.id}
                    className="min-w-[120px]"
                  >
                    ✗ Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default ApproveResults;
