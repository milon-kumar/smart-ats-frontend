import { useState } from "react";
import { useParams, Link } from "react-router";
import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  FileDown,
  Clock,
  Mail,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  Target,
  Check,
  X,
  RotateCw,
} from "lucide-react";
import axiosInstance from "@/lib/axios";

const STATUS_BADGE_VARIANTS = {
  applied: "bg-blue-50 text-blue-700 border-blue-200",
  shortlisted: "bg-purple-50 text-purple-700 border-purple-200",
  interview: "bg-amber-50 text-amber-700 border-amber-200",
  hired: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  withdrawn: "bg-slate-100 text-slate-600 border-slate-200",
};

const STATUS_OPTIONS = [
  { label: "Applied", value: "applied" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Interview", value: "interview" },
  { label: "Hired", value: "hired" },
  { label: "Rejected", value: "rejected" },
];

export default function ApplicantDetail() {
  const { id } = useParams();

  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");
  const [updateError, setUpdateError] = useState("");

  const { data, isLoading, isError, refetch } = useApiQuery({
    url: `/recruiter/applications/${id}`,
    queryKey: ["recruiter-application-detail", id],
  });

  const updateStatusMutation = useApiMutation({
    url: `/recruiter/applications/${id}/status`,
    method: "PATCH",
  });

  const reanalyzeMutation = useApiMutation({
    url: `/recruiter/applications/${id}/analyze`,
    method: "POST",
  });

  const application = data?.data || null;

  const handleDownloadResume = async () => {
    try {
      const response = await axiosInstance.get(`/applications/${id}/resume`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        application?.resume_original_name || `Resume-${id}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to download resume file.");
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdateError("");

    if (!newStatus) {
      setUpdateError("Please select a new status.");
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({
        data: {
          status: newStatus,
          note: note || undefined,
        },
      });
      setNote("");
      refetch();
    } catch (err) {
      setUpdateError(err?.message || "Failed to update status.");
    }
  };

  const handleReanalyze = async () => {
    try {
      await reanalyzeMutation.mutateAsync({});
      setTimeout(() => {
        refetch();
      }, 3000);
    } catch (err) {
      alert(err?.message || "Failed to start re-analysis.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Application Not Found</h2>
        <Button asChild variant="outline">
          <Link to="/recruiter/jobs">Back to Jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="text-slate-600 hover:text-violet-600 -ml-2"
      >
        <Link
          to={`/recruiter/jobs/${application.job_post_id}/applicants`}
          className="flex gap-2 items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to Applicants List</span>
        </Link>
      </Button>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold text-slate-900">
                {application.candidate?.name}
              </CardTitle>
              <Badge
                variant="outline"
                className={`capitalize text-[11px] font-semibold ${
                  STATUS_BADGE_VARIANTS[application.status] || "bg-slate-100"
                }`}
              >
                {application.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {application.candidate?.email}
              </span>
              <span>•</span>
              <span>Applied for: {application.job_post?.title}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReanalyze}
              disabled={reanalyzeMutation.isPending}
              className="text-slate-600 border-slate-200 hover:text-violet-600 text-xs h-9"
            >
              <RotateCw
                className={`w-3.5 h-3.5 mr-1.5 ${
                  reanalyzeMutation.isPending ? "animate-spin" : ""
                }`}
              />
              Re-analyze
            </Button>

            <Button
              onClick={handleDownloadResume}
              className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-9 shrink-0 shadow-sm"
            >
              <FileDown className="w-4 h-4 mr-1.5" /> Download PDF
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Target className="w-4 h-4 text-violet-600" />
                  <span>Keyword Match Score</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {application.keyword_score !== null && application.keyword_score !== undefined
                    ? `${application.keyword_score}%`
                    : "N/A"}
                </p>
                <p className="text-[11px] text-slate-400">
                  Based on exact skills in resume
                </p>
              </div>

              <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center font-bold text-violet-700 text-lg border-2 border-violet-200">
                {application.keyword_score ?? 0}%
              </div>
            </div>

            {/* AI Score Card */}
            <div className="p-5 rounded-2xl bg-violet-50/50 border border-violet-100 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-700">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  <span>Smart AI Match Score</span>
                </div>
                <p className="text-2xl font-bold text-violet-950">
                  {application.ai_score !== null && application.ai_score !== undefined
                    ? `${application.ai_score}%`
                    : "Analyzing..."}
                </p>
                <p className="text-[11px] text-violet-600/70">
                  Evaluated by Gemini AI
                </p>
              </div>

              <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white text-lg shadow-sm">
                {application.ai_score ?? "..."}
              </div>
            </div>
          </div>

          {/* AI Analysis Breakdown */}
          {application.ai_summary && (
            <div className="space-y-4 p-5 rounded-2xl bg-gradient-to-br from-violet-50/30 to-slate-50 border border-violet-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-600" /> AI Applicant Evaluation
                </h3>
                {application.ai_analyzed_at && (
                  <span className="text-[11px] text-slate-400">
                    Analyzed at {new Date(application.ai_analyzed_at).toLocaleTimeString()}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-2xs">
                {application.ai_summary}
              </p>

              {/* Matched & Missing Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Matched Skills */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Matched Skills (
                    {application.ai_matched_skills?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {application.ai_matched_skills?.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-medium"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Missing / Gap Skills (
                    {application.ai_missing_skills?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {application.ai_missing_skills?.length > 0 ? (
                      application.ai_missing_skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-medium"
                        >
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status Update Form */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-violet-600" /> Update Candidate Status
            </h3>

            {updateError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {updateError}
              </div>
            )}

            <form onSubmit={handleUpdateStatus} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">New Status</Label>
                  <Select
                    value={newStatus || application.status}
                    onValueChange={(val) => setNewStatus(val)}
                  >
                    <SelectTrigger className="h-10 text-xs focus:ring-violet-500 bg-white">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Optional Note</Label>
                  <Textarea
                    rows={1}
                    placeholder="Add a remark or note..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="bg-white focus-visible:ring-violet-500 text-xs h-10 min-h-10 py-2 resize-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={updateStatusMutation.isPending}
                className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-9 font-medium"
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Updating...
                  </>
                ) : (
                  "Save Status"
                )}
              </Button>
            </form>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-violet-600" /> Application History
            </h3>

            <div className="space-y-3 pl-2 border-l-2 border-slate-200 ml-2">
              {application.status_histories?.map((history) => (
                <div key={history.id} className="relative pl-4 space-y-0.5">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-violet-600 border-2 border-white" />
                  <div className="text-xs font-semibold text-slate-800 capitalize">
                    {history.to_status}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(history.created_at).toLocaleString()}
                    {history.changed_by?.name && ` by ${history.changed_by.name}`}
                  </div>
                  {history.note && (
                    <p className="text-xs text-slate-600 mt-1 italic bg-slate-50 p-2 rounded border">
                      "{history.note}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-violet-600" /> Extracted Resume Content
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-mono max-h-96 overflow-y-auto">
              {application.resume_original_name || "No text extracted from resume."}
            </div>
          </div>
          
          {application.cover_letter && (
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-semibold text-slate-800">Cover Letter</h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {application.cover_letter}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}