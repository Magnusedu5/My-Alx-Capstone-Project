import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { FileText, CheckCircle, Clock, Files } from "lucide-react";
import { getDashboardStats } from "@/lib/dashboard";
import { toast } from "sonner";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_documents: 0,
    total_results: 0,
    pending_approvals: 0,
    recent_uploads: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Documents",
      value: stats.total_documents,
      icon: Files,
      description: "All uploaded documents",
    },
    {
      title: "Total Results",
      value: stats.total_results,
      icon: FileText,
      description: "Academic results uploaded",
    },
    {
      title: "Recent Uploads",
      value: stats.recent_uploads,
      icon: CheckCircle,
      description: "Uploaded recently",
    },
    {
      title: "Pending Approvals",
      value: stats.pending_approvals,
      icon: Clock,
      description: "Awaiting HOD review",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your document management system.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-card rounded-xl border border-border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <div
                key={stat.title}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <StatCard {...stat} />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: "Result uploaded", course: "CS201", time: "2 hours ago" },
                { action: "Document approved", course: "ENG101", time: "5 hours ago" },
                { action: "Result uploaded", course: "MTH301", time: "1 day ago" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.action}</p>
                    <p className="text-sm text-muted-foreground">{item.course}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">This Semester</span>
                <span className="font-semibold text-foreground">2023/2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Session</span>
                <span className="font-semibold text-foreground">Second Semester</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Approval Rate</span>
                <span className="font-semibold text-success">83%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
