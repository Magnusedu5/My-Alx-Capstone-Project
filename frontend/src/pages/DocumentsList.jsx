// 📚 LESSON: Documents List Page
// Shows all documents with ability to delete (own documents only for staff)

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDocuments, deleteDocument } from '../services/documents';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

const DocumentsList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, isHOD } = useAuth();

  // 🎯 Fetch documents when page loads
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Handle delete
  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await deleteDocument(documentId);
      // Remove from list without reloading
      setDocuments(documents.filter(doc => doc.id !== documentId));
      alert('Document deleted successfully');
    } catch (err) {
      alert(err.message || 'Failed to delete document');
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
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">📄 Documents</h1>
        <Link to="/documents/upload">
          <Button>Upload Document</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {documents.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-600">No documents found</p>
            <Link to="/documents/upload">
              <Button className="mt-4">Upload Your First Document</Button>
            </Link>
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
                    <span>👤 {doc.uploaded_by_name || 'Unknown'}</span>
                    <span>📅 {new Date(doc.upload_date).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  {/* Download button */}
                  {doc.file && (
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Button variant="primary" className="text-sm">
                        Download
                      </Button>
                    </a>
                  )}

                  {/* Delete button (only for own documents or HOD) */}
                  {(isHOD || doc.uploaded_by === user?.id) && (
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(doc.id)}
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

export default DocumentsList;
