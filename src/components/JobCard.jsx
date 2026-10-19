import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, UserCheck } from "lucide-react";

const EMPLOYMENT_TYPE_LABELS = {
  full_time: "Full time",
  part_time: "Part time",
  remote: "Remote",
  internship: "Internship",
};

export default function JobCard({ job }) {
  const skills = job.required_skills ?? [];
  const visibleSkills = skills.slice(0, 3);
  const remainingSkillsCount = skills.length - visibleSkills.length;

  const hasSalary = job.salary_min && job.salary_max;

  return (
    <Card className="hover:border-violet-300 hover:shadow-md transition-all group duration-200 flex flex-col justify-between">
      <CardContent className="p-5 space-y-4">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/jobs/${job.id}`}
              className="font-bold text-lg text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1"
            >
              {job.title}
            </Link>
          </div>
          {job.recruiter?.name && (
            <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              {job.recruiter.name}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-violet-500" />
            {job.location}
          </span>
          <span className="text-slate-300">•</span>
          <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-700 hover:bg-slate-100 font-normal"
          >
            {EMPLOYMENT_TYPE_LABELS[job.employment_type] || job.employment_type}
          </Badge>
        </div>

        <div className="text-sm font-semibold text-slate-800">
          {hasSalary ? (
            <span>
              ৳{Number(job.salary_min).toLocaleString()} –{" "}
              {Number(job.salary_max).toLocaleString()}
            </span>
          ) : (
            <span className="text-slate-500 font-normal italic">
              Salary negotiable
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {visibleSkills.map((skill, index) => (
            <Badge
              key={index}
              variant="outline"
              className="border-violet-100 bg-violet-50/50 text-violet-700 text-[11px] font-normal"
            >
              {skill}
            </Badge>
          ))}
          {remainingSkillsCount > 0 && (
            <Badge
              variant="outline"
              className="text-[11px] text-slate-500 border-slate-200"
            >
              +{remainingSkillsCount}
            </Badge>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Experience: {job.experience_years} yrs</span>
          <span className="flex items-center gap-1 font-medium text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Deadline: {job.deadline}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}