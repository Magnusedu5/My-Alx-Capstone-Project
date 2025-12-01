// 📚 LESSON: Approve Documents Page (HOD Only)
// HOD can approve or reject pending documents

import { useState, useEffect } from 'react';
import { getDocuments, approveDocument, rejectDocument } from '../services/documents';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

const ApproveDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // 🎯 Fetch documents when page loads
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      // Filter to show only pending documents
      const pending = data.filter(doc => doc.status?.toLowerCase() === 'pending');
      setDocuments(pending);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Handle approve
  const handleApprove = async (documentId) => {
    setProcessingId(documentId);
    try {
      await approveDocument(documentId);
      // Remove from list after approval
      setDocuments(documents.filter(doc => doc.id !== documentId));
      alert('Document approved successfully');
    } catch (err) {
      alert(err.message || 'Failed to approve document');
    } finally {
      setProcessingId(null);
    }
  };

  // 🎯 Handle reject
  const handleReject = async (documentId) => {
    if (!window.confirm('Are you sure you want to reject this document?')) {
      return;
    }

    setProcessingId(documentId);
    try {
      await rejectDocument(documentId);
      // Remove from list after rejection
      setDocuments(documents.filter(doc => doc.id !== documentId));
      alert('Document rejected');
    } catch (err) {
      alert(err.message || 'Failed to reject document');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading pending documents...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        ✅ Approve Documents
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {documents.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-gray-600 text-lg">No pending documents</p>
            <p className="text-gray-500 text-sm mt-2">
              All documents have been reviewed!
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {doc.title}
                  </h3>
                  
                  {doc.description && (
                    <p className="text-gray-600 mb-3">{doc.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>👤 Uploaded by: {doc.uploaded_by_name || 'Unknown'}</span>
                    <span>📅 {new Date(doc.upload_date).toLocaleDateString()}</span>
                  </div>

                  {/* Download link */}
                  {doc.file && (
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                    >
                      📄 View/Download Document
                    </a>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {/* Approve button */}
                  <Button
                    variant="success"
                    onClick={() => handleApprove(doc.id)}
                    disabled={processingId === doc.id}
                    className="min-w-[120px]"
                  >
                    {processingId === doc.id ? 'Processing...' : '✓ Approve'}
                  </Button>
                  
                  {/* Reject button */}
                  <Button
                    variant="danger"
                    onClick={() => handleReject(doc.id)}
                    disabled={processingId === doc.id}
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

export default ApproveDocuments;
