import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getDocuments, approveDocument, rejectDocument, type Document } from "@/lib/documents";
import { isHOD } from "@/lib/auth";

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const userIsHOD = isHOD();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number, title: string) => {
    setProcessingId(id);
    try {
      await approveDocument(id);
      toast.success(`"${title}" has been approved`);
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error('Error approving document:', error);
      toast.error('Failed to approve document');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number, title: string) => {
    setProcessingId(id);
    try {
      await rejectDocument(id);
      toast.error(`"${title}" has been rejected`);
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast.error('Failed to reject document');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusValue = (status: string): "pending" | "approved" | "rejected" => {
    return status.toLowerCase() as "pending" | "approved" | "rejected";
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Documents</h2>
            <p className="text-muted-foreground mt-1">Manage and review academic documents</p>
          </div>
          <Button asChild>
            <Link to="/upload-document">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Link>
          </Button>
        </div>

        {/* Documents Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No documents found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Document Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Uploaded By
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Upload Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    {userIsHOD && (
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{doc.title}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {doc.uploaded_by.first_name} {doc.uploaded_by.last_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(doc.upload_date)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={getStatusValue(doc.status)} />
                      </td>
                      {userIsHOD && (
                        <td className="px-6 py-4">
                          {doc.status === "PENDING" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(doc.id, doc.title)}
                                disabled={processingId === doc.id}
                                className="hover:bg-success/10 hover:text-success hover:border-success"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                {processingId === doc.id ? "Processing..." : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(doc.id, doc.title)}
                                disabled={processingId === doc.id}
                                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                {processingId === doc.id ? "Processing..." : "Reject"}
                              </Button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Documents;
