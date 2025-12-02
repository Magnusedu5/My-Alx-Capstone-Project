import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getResults, approveResult, rejectResult, type Result } from "@/lib/results";
import { isHOD } from "@/lib/auth";

const Results = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
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

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Results</h2>
            <p className="text-muted-foreground mt-1">View and manage academic results</p>
          </div>
          <Button asChild>
            <Link to="/upload-result">
              <Upload className="w-4 h-4 mr-2" />
              Upload New Result
            </Link>
          </Button>
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
