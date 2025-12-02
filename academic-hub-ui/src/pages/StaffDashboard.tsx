import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { FileText, Upload, Files } from "lucide-react";
import { getDashboardStats } from "@/lib/dashboard";
import { toast } from "sonner";

const StaffDashboard = () => {
  const [stats, setStats] = useState({
    total_documents: 0,
    total_results: 0,
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
      title: "My Documents",
      value: stats.total_documents,
      icon: Files,
      description: "Documents uploaded by me",
    },
    {
      title: "My Results",
      value: stats.total_results,
      icon: FileText,
      description: "Results I've uploaded",
    },
    {
      title: "Recent Uploads",
      value: stats.recent_uploads,
      icon: Upload,
      description: "Uploaded this semester",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Staff Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Welcome back! Manage your documents and results here.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-card rounded-xl border border-border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <h3 className="text-lg font-semibold text-foreground mb-4">My Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: "Result uploaded", course: "CS201", time: "2 hours ago" },
                { action: "Document uploaded", course: "ENG101", time: "5 hours ago" },
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
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Info</h3>
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
                <span className="text-muted-foreground">Department</span>
                <span className="font-semibold text-foreground">Computer Science</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StaffDashboard;
