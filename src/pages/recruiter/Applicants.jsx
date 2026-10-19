// src/pages/recruiter/Applicants.jsx
import { useState } from "react";
import { useParams, Link } from "react-router";
import { useApiQuery } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/Pagination";
import {
  ArrowLeft,
  Users,
  Calendar,
  FileDown,
  Eye,
  Inbox,
  Briefcase,
} from "lucide-react";
import axiosInstance from "@/lib/axios";

export default function Applicants() {
  const { id } = useParams(); // Job Post ID
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const queryParams = {
    page,
    ...(statusFilter !== "all" && { status: statusFilter }),
  };

  const { data, isLoading, isError } = useApiQuery({
    url: `/recruiter/job-posts/${id}/applications`,
    params: queryParams,
    queryKey: ["recruiter-applicants", id, queryParams],
  });

  const applications = data?.data?.items || [];
  const pagination = data?.data?.pagination || {};
  const jobTitle = data?.data?.job_title || "Job Applicants";

  const statusBadgeVariants = {
    applied: "bg-blue-50 text-blue-700 border-blue-200",
    shortlisted: "bg-purple-50 text-purple-700 border-purple-200",
    interview: "bg-amber-50 text-amber-700 border-amber-200",
    hired: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    withdrawn: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const handleDownloadResume = async (applicationId, filename) => {
    try {
      const response = await axiosInstance.get(
        `/applications/${applicationId}/resume`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename || `Resume-${applicationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to download resume file.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="space-y-3">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:text-violet-600 -ml-2"
        >
          <Link to="/recruiter/jobs" className="flex gap-2 items-center">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> 
            <span>Back to Job Posts</span>
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-violet-600" />
              <span>Applicants List</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1 font-medium">
              <Briefcase className="w-3.5 h-3.5" /> {jobTitle}
            </p>
          </div>

          {/* Status Filter Dropdown */}
          <div className="w-full sm:w-48">
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 text-xs focus:ring-violet-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-24 bg-slate-200/70 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Failed to load applicants. Please try refreshing.
        </div>
      ) : applications.length === 0 ? (
        <Card className="border-slate-200 text-center py-16">
          <CardContent className="space-y-3">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Applicants Found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              There are currently no candidates matching the selected filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Card
              key={app.id}
              className="border-slate-200 hover:border-violet-300 transition-all shadow-sm group"
            >
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link
                      to={`/recruiter/applications/${app.id}`}
                      className="font-bold text-base text-slate-900 group-hover:text-violet-600 transition-colors"
                    >
                      {app.candidate?.name || "Candidate Name"}
                    </Link>
                    <Badge
                      variant="outline"
                      className={`capitalize text-[11px] font-semibold ${
                        statusBadgeVariants[app.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {app.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span>{app.candidate?.email}</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Applied: {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleDownloadResume(app.id, app.resume_original_name)
                    }
                    className="border-slate-200 hover:bg-slate-50 text-slate-700 text-xs h-9"
                  >
                    <FileDown className="w-4 h-4 mr-1.5 text-slate-500" /> 
                    <span>Resume</span>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-9"
                  >
                    <Link to={`/recruiter/applications/${app.id}`} className="flex gap-2 items-center">
                      <Eye className="w-4 h-4 mr-1.5" />
                      <span>View Details</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pagination.current_page || page}
        lastPage={pagination.last_page || 1}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}