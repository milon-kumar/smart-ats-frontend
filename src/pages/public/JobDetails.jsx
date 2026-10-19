import { useParams, Link } from "react-router";
import { useApiQuery } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Briefcase,
  Clock,
  Banknote,
  Calendar,
  Building,
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function JobDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const { data, isLoading, isError } = useApiQuery({
    url: `/job-posts/${id}`,
    queryKey: ["job-post", id],
  });

  const job = data?.data || null;

  const employmentTypeLabels = {
    full_time: "Full-time",
    part_time: "Part-time",
    remote: "Remote",
    internship: "Internship",
  };

  let skills = [];
  if (job?.required_skills) {
    if (Array.isArray(job.required_skills)) {
      skills = job.required_skills;
    } else if (typeof job.required_skills === "string") {
      try {
        skills = JSON.parse(job.required_skills);
      } catch (e) {
        skills = [];
      }
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-40 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Job Post Not Found</h2>
        <p className="text-sm text-slate-500">
          The job listing you are looking for does not exist or has been removed.
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Jobs
          </Link>
        </Button>
      </div>
    );
  }

  const isClosed = job.status === "closed";
  const isCandidate = user?.role === "candidate";
  const isRecruiter = user?.role === "recruiter";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:text-violet-600 -ml-2"
        >
          <Link to="/" className="flex gap-2 items-center">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> 
            <span>Back to Jobs</span>
          </Link>
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-violet-50 text-violet-700 border-violet-100 font-medium"
                >
                  {employmentTypeLabels[job.employment_type] || job.employment_type}
                </Badge>
                {isClosed && (
                  <Badge variant="destructive" className="bg-red-100 text-red-700 font-medium">
                    Closed
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h1>
              {job.recruiter?.name && (
                <p className="text-sm text-slate-600 flex items-center gap-1.5 font-medium">
                  <Building className="w-4 h-4 text-slate-400" />
                  Posted by {job.recruiter.name}
                </p>
              )}
            </div>

            <div className="flex-shrink-0 pt-2 sm:pt-0">
              {isClosed ? (
                <Button disabled className="w-full sm:w-auto">
                  Applications Closed
                </Button>
              ) : isCandidate ? (
                <Button
                  asChild
                  className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
                >
                  <Link to={`/jobs/${job.id}/apply`} className="flex gap-2 items-center">
                    <Send className="w-4 h-4 mr-2" /> 
                    <span>Apply Now</span>
                  </Link>
                </Button>
              ) : isAuthenticated && isRecruiter ? (
                <Button disabled variant="outline" className="w-full sm:w-auto">
                  Recruiter View
                </Button>
              ) : (
                <Button
                  asChild
                  className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
                >
                  <Link to="/login">Login to Apply</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-violet-500" /> Location
              </span>
              <p className="text-sm font-semibold text-slate-800">{job.location}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-violet-500" /> Experience
              </span>
              <p className="text-sm font-semibold text-slate-800">
                {job.experience_years} {job.experience_years === 1 ? "Year" : "Years"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5 text-violet-500" /> Salary
              </span>
              <p className="text-sm font-semibold text-slate-800">
                {job.salary_min && job.salary_max ? (
                  <span>৳{Number(job.salary_min).toLocaleString()} - ৳{Number(job.salary_max).toLocaleString()}</span>
                ) : (
                  <span className="text-slate-500 font-normal">Negotiable</span>
                )}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-violet-500" /> Deadline
              </span>
              <p className="text-sm font-semibold text-slate-800">{job.deadline}</p>
            </div>
          </div>
          
          {skills.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-semibold text-slate-800">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-violet-200 bg-violet-50/50 text-violet-700 px-3 py-1 font-medium text-xs"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1 text-violet-500" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-normal">
            {job.description}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}