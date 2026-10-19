import { useState } from "react";
import { Link } from "react-router";
import { useApiQuery } from "@/hooks/useApi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import { Calendar, ChevronRight, Inbox } from "lucide-react";

export default function MyApplications() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useApiQuery({
    url: "/me/applications",
    params: { page },
    queryKey: ["my-applications", page],
  });

  const applications = data?.data?.items || [];
  const pagination = data?.data?.pagination || {};

  const statusBadgeVariants = {
    applied: "bg-blue-50 text-blue-700 border-blue-200",
    shortlisted: "bg-purple-50 text-purple-700 border-purple-200",
    interview: "bg-amber-50 text-amber-700 border-amber-200",
    hired: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    withdrawn: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
        <p className="text-sm text-slate-500">Track the status of your submitted job applications</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Failed to load applications. Please refresh the page.
        </div>
      ) : applications.length === 0 ? (
        <Card className="border-slate-200 text-center py-12">
          <CardContent className="space-y-3">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-600 font-medium">You haven't applied for any jobs yet</p>
            <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white text-xs">
              <Link to="/">Explore Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Card
              key={app.id}
              className="border-slate-200 hover:border-violet-300 transition-all shadow-sm group"
            >
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/my-applications/${app.id}`}
                      className="font-bold text-base text-slate-900 group-hover:text-violet-600 transition-colors"
                    >
                      {app.job_post?.title || "Job Post"}
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Applied on{" "}
                      {new Date(app.created_at).toLocaleDateString()}
                    </span>
                    <Badge
                      variant="outline"
                      className={`capitalize text-[11px] font-semibold ${
                        statusBadgeVariants[app.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {app.status}
                    </Badge>
                  </div>
                </div>

                <Button asChild variant="ghost" size="sm" className="shrink-0 text-slate-400 group-hover:text-violet-600">
                  <Link to={`/my-applications/${app.id}`}>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        currentPage={pagination.current_page || page}
        lastPage={pagination.last_page || 1}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}