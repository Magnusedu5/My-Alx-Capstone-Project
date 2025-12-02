import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { uploadResult } from "@/lib/results";

const UploadResult = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [session, setSession] = useState("");
  const [semester, setSemester] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (!session || !semester) {
      toast.error("Please select session and semester");
      return;
    }

    setIsUploading(true);
    try {
      await uploadResult({
        course_code: courseCode,
        course_title: courseTitle,
        session,
        semester,
        file,
      });
      toast.success("Result uploaded successfully!");
      navigate("/results");
    } catch (error: any) {
      console.error('Error uploading result:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail || 
                          'Failed to upload result';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Upload Result</h2>
          <p className="text-muted-foreground mt-1">Upload academic results for your course</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="courseCode">Course Code</Label>
              <Input 
                id="courseCode" 
                placeholder="e.g., CS201" 
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required 
                disabled={isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseTitle">Course Title</Label>
              <Input 
                id="courseTitle" 
                placeholder="e.g., Data Structures" 
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                required 
                disabled={isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="session">Session</Label>
              <Select value={session} onValueChange={setSession} disabled={isUploading} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024/2025">2024/2025</SelectItem>
                  <SelectItem value="2023/2024">2023/2024</SelectItem>
                  <SelectItem value="2022/2023">2022/2023</SelectItem>
                  <SelectItem value="2021/2022">2021/2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={semester} onValueChange={setSemester} disabled={isUploading} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="First">First Semester</SelectItem>
                  <SelectItem value="Second">Second Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload File</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <Input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
                <Label
                  htmlFor="file"
                  className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                >
                  {file ? (
                    <span className="text-foreground font-medium">{file.name}</span>
                  ) : (
                    <>
                      <span className="text-primary font-medium">Click to upload</span> or drag and
                      drop
                      <br />
                      <span className="text-xs">PDF, XLSX, or CSV (max. 10MB)</span>
                    </>
                  )}
                </Label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Submit"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/results")}
                disabled={isUploading}
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

export default UploadResult;
