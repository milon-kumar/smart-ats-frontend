import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, AlertCircle, Loader2, Building, Upload, FileCheck } from "lucide-react";

export default function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: jobData, isLoading: isJobLoading } = useApiQuery({
    url: `/job-posts/${id}`,
    queryKey: ["job-post", id],
  });

  const job = jobData?.data || null;

  const applyMutation = useApiMutation({
    url: `/job-posts/${id}/applications`,
    method: "POST",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setErrorMessage("Only PDF files are allowed.");
        setResumeFile(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("File size must not exceed 2 MB.");
        setResumeFile(null);
        return;
      }
      setErrorMessage("");
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!resumeFile) {
      setErrorMessage("Please select a PDF resume file.");
      return;
    }

    const payload = new FormData();
    payload.append("resume", resumeFile);
    if (coverLetter) {
      payload.append("cover_letter", coverLetter);
    }

    try {
      const response = await applyMutation.mutateAsync({
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.status === "success") {
        navigate("/my-applications", { replace: true });
      }
    } catch (err) {
      setErrorMessage(
        err?.message ||
          err?.response?.data?.message ||
          "Failed to submit application. Please make sure your PDF contains readable text."
      );
    }
  };

  if (isJobLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="text-slate-600 hover:text-violet-600 -ml-2"
      >
        <Link to={`/jobs/${id}`}>
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Job Details
        </Link>
      </Button>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="space-y-1">
            <Badge variant="outline" className="border-violet-200 text-violet-700 bg-violet-50">
              Applying For
            </Badge>
            <CardTitle className="text-xl font-bold text-slate-900">{job?.title}</CardTitle>
            {job?.recruiter?.name && (
              <CardDescription className="flex items-center gap-1 text-xs text-slate-500">
                <Building className="w-3.5 h-3.5" /> {job.recruiter.name}
              </CardDescription>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {errorMessage && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-600 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Component */}
            <div className="space-y-2">
              <Label htmlFor="resume" className="text-sm font-semibold text-slate-800">
                Upload Resume (PDF) <span className="text-red-500">*</span>
              </Label>

              <div className="border-2 border-dashed border-slate-200 hover:border-violet-400 transition-colors rounded-xl p-6 text-center space-y-3 bg-slate-50/50 relative">
                <Input
                  id="resume"
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {resumeFile ? (
                  <div className="flex items-center justify-center gap-2 text-violet-700 font-medium text-sm">
                    <FileCheck className="w-5 h-5 text-violet-600" />
                    <span>{resumeFile.name}</span>
                    <span className="text-xs text-slate-400">
                      ({(resumeFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">
                      Click or drag PDF file here to upload
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Only text-based PDF files are accepted. Max 2MB.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Cover Letter */}
            <div className="space-y-2">
              <Label htmlFor="cover_letter" className="text-sm font-semibold text-slate-800">
                Cover Letter <span className="text-slate-400 font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="cover_letter"
                name="cover_letter"
                rows={5}
                placeholder="Briefly explain why you are a great fit for this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="focus-visible:ring-violet-500 text-sm leading-relaxed"
              />
            </div>

            <Button
              type="submit"
              disabled={applyMutation.isPending}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white h-11 shadow-sm font-medium"
            >
              {applyMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading & Processing PDF...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" /> Submit Application
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}