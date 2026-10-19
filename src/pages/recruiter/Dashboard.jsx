import { Link } from "react-router";
import { useApiQuery } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Users,
  PlusCircle,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Clock,
  Info,
  CheckCircle2,
} from "lucide-react";

const PIPELINE_STAGES = [
  { key: "applied", label: "Applied", color: "bg-blue-500" },
  { key: "shortlisted", label: "Shortlisted", color: "bg-purple-500" },
  { key: "interview", label: "Interview", color: "bg-amber-500" },
  { key: "hired", label: "Hired", color: "bg-emerald-500" },
];

export default function Dashboard() {
  const { user } = useAuth();

  const { data, isLoading, isError, refetch } = useApiQuery({
    url: "/recruiter/dashboard",
    queryKey: ["recruiter-dashboard"],
  });

  const dashboardData = data?.data || null;

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-40 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">
          Failed to load Dashboard
        </h2>
        <Button onClick={() => refetch()} variant="outline" className="text-xs">
          Try Again
        </Button>
      </div>
    );
  }

  if (!dashboardData?.has_posts) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto text-violet-600">
          <Briefcase className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome to Smart ATS, {user?.name || "Recruiter"}!
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Get started by posting your first job opening to collect applicants
            and evaluate them using AI intelligence.
          </p>
        </div>
        <Button
          asChild
          className="bg-violet-600 hover:bg-violet-700 text-white shadow-md text-xs h-10 px-6 font-medium"
        >
          <Link to="/recruiter/jobs/new">
            <PlusCircle className="w-4 h-4 mr-2" /> Post Your First Job
          </Link>
        </Button>
      </div>
    );
  }

  const { stats, pipeline, top_candidates, skill_gaps, job_posts, recent_activity } =
    dashboardData;

  const totalPipeCount =
    Object.values(pipeline || {}).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name || "Recruiter"} 👋
          </h1>
          <p className="text-xs text-slate-500">
            Here is your recruitment overview and AI-driven candidate insights
          </p>
        </div>

        <Button
          asChild
          className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-9 shadow-sm shrink-0"
        >
          <Link to="/recruiter/jobs/new" className="flex gap-2 items-center">
            <PlusCircle className="w-4 h-4 mr-1.5" /> 
            <span>Post New Job</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-3xs">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Open Job Posts</span>
              <Briefcase className="w-4 h-4 text-violet-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.open_posts}
            </p>
            <p className="text-[11px] text-slate-400">
              {stats.posts_closing_soon > 0
                ? `${stats.posts_closing_soon} closing within 3 days`
                : "Active recruitment"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-3xs">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Total Applications</span>
              <Users className="w-4 h-4 text-violet-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.total_applications}
            </p>
            <p className="text-[11px] text-amber-600 font-medium">
              {stats.pending_review > 0
                ? `${stats.pending_review} pending review`
                : "All reviewed"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-3xs">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>New Applications</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              +{stats.new_this_week}
            </p>
            <p className="text-[11px] text-slate-400">
              Last week: {stats.new_last_week}
            </p>
          </CardContent>
        </Card>

        <Card className="border-violet-100 bg-violet-50/30 shadow-3xs">
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-violet-700 font-semibold">
              <span>Avg AI Score</span>
              <Sparkles className="w-4 h-4 text-violet-600" />
            </div>
            <p className="text-2xl font-bold text-violet-950">
              {stats.avg_ai_score}%
            </p>
            <p className="text-[11px] text-violet-600/80">
              {stats.analyzed_count} applications analyzed
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-3xs">
        <CardHeader className="p-5 pb-2 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">
            Recruitment Pipeline Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="space-y-2">
            {PIPELINE_STAGES.map((stage) => {
              const count = pipeline[stage.key] ?? 0;
              const percentage = Math.round((count / totalPipeCount) * 100);

              return (
                <div key={stage.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      {stage.label}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stage.color} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Rejected:{" "}
              <strong className="text-red-600">{pipeline.rejected}</strong>
            </span>
            <span>•</span>
            <span>
              Withdrawn: <strong>{pipeline.withdrawn}</strong>
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-3xs flex flex-col justify-between">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-600" />
                Top AI Candidate Match (Pending Review)
              </CardTitle>
              <p className="text-[11px] text-slate-400">
                High fit candidates in applied state
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs text-violet-600 hover:text-violet-700"
            >
              <Link to="/recruiter/jobs">View All →</Link>
            </Button>
          </CardHeader>

          <CardContent className="p-5 space-y-3 flex-1">
            {top_candidates?.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">
                No unreviewed AI analyzed candidates right now.
              </p>
            ) : (
              top_candidates.map((candidate) => (
                <Link
                  key={candidate.id}
                  to={`/recruiter/applications/${candidate.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                      {candidate.candidate_name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {candidate.job_title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="bg-violet-100 text-violet-700 border-violet-200 text-xs font-bold px-2 py-0.5">
                      {candidate.ai_score}% Match
                    </Badge>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-violet-600 transition-colors" />
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-3xs flex flex-col justify-between">
          <CardHeader className="p-5 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Most Common Missing Skills (AI Insights)
            </CardTitle>
            <p className="text-[11px] text-slate-400">
              Top missing skills across all candidate CVs
            </p>
          </CardHeader>

          <CardContent className="p-5 space-y-4 flex-1">
            {skill_gaps?.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">
                No skill gap patterns detected yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {skill_gaps.map((item) => (
                  <div key={item.skill} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        {item.skill}
                      </span>
                      <span className="text-slate-500 font-mono">
                        {item.count} applicants missing
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${Math.min(item.count * 10, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2 mt-auto">
              <Info className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
              <span>
                Tip: Consider revising Job Descriptions if mandatory skills are
                consistently missing in candidate pools.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-3xs">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-900">
            Job Posts Summary
          </CardTitle>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs text-violet-600 hover:text-violet-700"
          >
            <Link to="/recruiter/jobs">Manage All Posts →</Link>
          </Button>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                <th className="p-3.5 pl-5">Job Title</th>
                <th className="p-3.5">Applicants</th>
                <th className="p-3.5">Avg AI Fit</th>
                <th className="p-3.5">Shortlisted</th>
                <th className="p-3.5">Deadline</th>
                <th className="p-3.5 pr-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {job_posts?.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 pl-5 font-bold text-slate-900">
                    <Link
                      to={`/recruiter/jobs/${post.id}/applicants`}
                      className="hover:text-violet-600"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">
                    {post.applications_count}
                  </td>
                  <td className="p-3.5">
                    {post.avg_ai_score ? (
                      <Badge className="bg-violet-50 text-violet-700 border-violet-200 font-bold">
                        {post.avg_ai_score}%
                      </Badge>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">
                    {post.shortlisted_count}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {post.days_remaining > 0 ? (
                      <span>{post.days_remaining} days left</span>
                    ) : (
                      <span className="text-red-500 font-medium">Expired</span>
                    )}
                  </td>
                  <td className="p-3.5 pr-5">
                    <Badge
                      variant="outline"
                      className={`capitalize text-[10px] font-semibold ${
                        post.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {post.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-3xs">
        <CardHeader className="p-5 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-violet-600" /> Recent Application
            Activity
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5 space-y-3">
          {recent_activity?.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              No recent activity logged.
            </p>
          ) : (
            recent_activity.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 text-xs border-b border-slate-100 pb-2.5 last:border-0 last:pb-0"
              >
                <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <p className="text-slate-800">
                    <strong>{act.candidate_name}</strong> status changed to{" "}
                    <span className="capitalize font-bold text-violet-700">
                      {act.to_status}
                    </span>{" "}
                    for <strong>{act.job_title}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Updated by {act.changed_by} • {act.created_at}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}