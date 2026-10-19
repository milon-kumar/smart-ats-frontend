// src/pages/recruiter/MyJobPosts.jsx
import { useState } from "react";
import { Link } from "react-router";
import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Pagination from "@/components/Pagination";
import {
  Briefcase,
  Users,
  Plus,
  MoreVertical,
  Edit3,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";

export default function MyJobPosts() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useApiQuery({
    url: "/recruiter/job-posts",
    params: { page },
    queryKey: ["recruiter-job-posts", page],
  });

  const updateStatusMutation = useApiMutation({
    method: "PATCH",
  });

  const jobs = data?.data?.items || [];
  const pagination = data?.data?.pagination || {};

  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === "open" ? "closed" : "open";
    try {
      await updateStatusMutation.mutateAsync({
        url: `/recruiter/job-posts/${jobId}/status`,
        data: { status: newStatus },
      });
      refetch();
    } catch (err) {
      alert(err?.message || "Failed to update job status.");
    }
  };

  const employmentTypeLabels = {
    full_time: "Full-time",
    part_time: "Part-time",
    remote: "Remote",
    internship: "Internship",
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">My Job Posts</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your posted jobs and view candidate applications
          </p>
        </div>
        <Button
          asChild
          className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm font-medium text-xs h-10 shrink-0"
        >
          <Link to="/recruiter/jobs/new" className="flex gap-2 items-center">
            <Plus className="w-4 h-4 mr-1.5" /> 
            <span>Post New Job</span>
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-slate-200/70 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Failed to load job posts. Please try refreshing the page.
        </div>
      ) : jobs.length === 0 ? (
        <Card className="border-slate-200 text-center py-16">
          <CardContent className="space-y-4">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">No Job Posts Found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                You haven't posted any jobs yet. Create your first job posting to start recruiting.
              </p>
            </div>
            <Button
              asChild
              className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-9"
            >
              <Link to="/recruiter/jobs/new">
                <Plus className="w-4 h-4 mr-1" /> Post Job Now
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const isActive = job.status === "active";
            return (
              <Card
                key={job.id}
                className="border-slate-200 hover:border-violet-300 transition-all shadow-sm group"
              >
                <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Job Main Meta */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="font-bold text-lg text-slate-900 group-hover:text-violet-600 transition-colors"
                      >
                        {job.title}
                      </Link>
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-semibold capitalize ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {job.status}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-600 border-slate-200 text-[11px] font-normal"
                      >
                        {employmentTypeLabels[job.employment_type] || job.employment_type}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-violet-500" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Posted: {new Date(job.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Deadline: {job.deadline}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Applicants Stats */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-violet-200 bg-violet-50/50 hover:bg-violet-100 text-violet-700 font-semibold text-xs h-9"
                    >
                      <Link to={`/recruiter/jobs/${job.id}/applicants`} className="flex gap-2 items-center">
                        <Users className="w-4 h-4 mr-1.5 text-violet-600" />
                        <span>Applicants ({job.job_applications_count ?? job.applications?.length ?? 0})</span>
                      </Link>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem asChild>
                          <Link to={`/jobs/${job.id}`} className="cursor-pointer flex gap-2 items-center">
                            <Eye className="w-4 h-4 mr-2" /> 
                            <span>View Listing</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/recruiter/jobs/${job.id}/edit`} className="cursor-pointer flex gap-2 items-center">
                            <Edit3 className="w-4 h-4 mr-2" /> Edit Job
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(job.id, job.status)}
                          className="cursor-pointer flex gap-2 items-center"
                        >
                          {isActive ? (
                            <>
                              <XCircle className="w-4 h-4 mr-2 text-red-500" /> Close Post
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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