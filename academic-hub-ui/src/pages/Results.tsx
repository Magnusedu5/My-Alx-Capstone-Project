import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, CheckCircle, XCircle, Eye, Download, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getResults, approveResult, rejectResult, deleteResult, bulkDeleteResults, type Result } from "@/lib/results";
import { isHOD } from "@/lib/auth";

const Results = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const userIsHOD = isHOD();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const data = await getResults();
      setResults(data);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to load results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number, courseCode: string) => {
    setProcessingId(id);
    try {
      await approveResult(id);
      toast.success(`Result for "${courseCode}" has been approved`);
      fetchResults();
    } catch (error) {
      console.error('Error approving result:', error);
      toast.error('Failed to approve result');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number, courseCode: string) => {
    setProcessingId(id);
    try {
      await rejectResult(id);
      toast.error(`Result for "${courseCode}" has been rejected`);
      fetchResults();
    } catch (error) {
      console.error('Error rejecting result:', error);
      toast.error('Failed to reject result');
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

  const handleViewFile = (result: Result) => {
    const fileUrl = result.file_url || result.gdrive_file_url || result.file;
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      toast.error('No file available to view');
    }
  };

  const handleDownloadFile = (result: Result) => {
    const fileUrl = result.file_url || result.gdrive_file_url || result.file;
    if (fileUrl) {
      // For Google Drive, convert view link to download link
      let downloadUrl = fileUrl;
      if (fileUrl.includes('drive.google.com')) {
        // Convert from /file/d/FILE_ID/view to /uc?export=download&id=FILE_ID
        const fileIdMatch = fileUrl.match(/\/d\/([^\/]+)/);
        if (fileIdMatch) {
          downloadUrl = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
        }
      }
      window.open(downloadUrl, '_blank');
    } else {
      toast.error('No file available to download');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(results.map(result => result.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(resultId => resultId !== id));
    }
  };

  const handleDeleteSingle = async (id: number) => {
    if (!confirm('Are you sure you want to delete this result?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteResult(id);
      toast.success('Result deleted successfully');
      fetchResults();
    } catch (error) {
      toast.error('Failed to delete result');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select results to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} result(s)?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await bulkDeleteResults(selectedIds);
      toast.success(result.message);
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach(error => toast.error(error));
      }
      setSelectedIds([]);
      fetchResults();
    } catch (error) {
      toast.error('Failed to delete results');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Results</h2>
            <p className="text-muted-foreground mt-1">
              View and manage academic results
              {selectedIds.length > 0 && ` • ${selectedIds.length} selected`}
            </p>
          </div>
          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedIds.length})
              </Button>
            )}
            <Button asChild>
              <Link to="/upload-result">
                <Upload className="w-4 h-4 mr-2" />
                Upload New Result
              </Link>
            </Button>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Loading results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No results found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-4 text-left">
                      <Checkbox
                        checked={selectedIds.length === results.length && results.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Course Code
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Course Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Session
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Semester
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Upload Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      File
                    </th>
                    {userIsHOD && (
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-4 py-4">
                        <Checkbox
                          checked={selectedIds.includes(result.id)}
                          onCheckedChange={(checked) => handleSelectOne(result.id, checked as boolean)}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {result.course_code}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{result.course_title}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{result.session_name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{result.semester_display}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(result.upload_date)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={getStatusValue(result.status)} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewFile(result)}
                            className="hover:bg-primary/10"
                            title="View file"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadFile(result)}
                            className="hover:bg-primary/10"
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteSingle(result.id)}
                            disabled={isDeleting}
                            className="hover:bg-destructive/10 hover:text-destructive"
                            title="Delete file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                      {userIsHOD && (
                        <td className="px-6 py-4">
                          {result.status === "PENDING" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(result.id, result.course_code)}
                                disabled={processingId === result.id}
                                className="hover:bg-success/10 hover:text-success hover:border-success"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                {processingId === result.id ? "Processing..." : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(result.id, result.course_code)}
                                disabled={processingId === result.id}
                                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                {processingId === result.id ? "Processing..." : "Reject"}
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

export default Results;
