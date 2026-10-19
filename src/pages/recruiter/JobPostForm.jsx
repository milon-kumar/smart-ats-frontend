import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, AlertCircle, Loader2, Plus, X } from "lucide-react";

export default function JobPostForm() {
  const { id } = useParams(); 
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    employment_type: "full_time",
    location: "Dhaka",
    salary_min: "",
    salary_max: "",
    experience_years: 0,
    deadline: "",
    status: "open",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch Job details if editing
  const { data: existingJobData, isLoading: isFetchingJob } = useApiQuery({
    url: `/job-posts/${id}`,
    queryKey: ["job-post-edit", id],
    enabled: isEditMode,
  });

  useEffect(() => {
    if (isEditMode && existingJobData?.data) {
      const job = existingJobData.data;
      setFormData({
        title: job.title || "",
        description: job.description || "",
        employment_type: job.employment_type || "full_time",
        location: job.location || "Dhaka",
        salary_min: job.salary_min || "",
        salary_max: job.salary_max || "",
        experience_years: job.experience_years ?? 0,
        deadline: job.deadline || "",
        status: job.status || "active",
      });

      // Parse skills
      if (Array.isArray(job.required_skills)) {
        setSkills(job.required_skills);
      } else if (typeof job.required_skills === "string") {
        try {
          setSkills(JSON.parse(job.required_skills));
        } catch (e) {
          setSkills([]);
        }
      }
    }
  }, [isEditMode, existingJobData]);

  // Mutations for Create & Update
  const saveMutation = useApiMutation({
    url: isEditMode ? `/recruiter/job-posts/${id}` : "/recruiter/job-posts",
    method: isEditMode ? "PUT" : "POST",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (skills.length === 0) {
      setErrorMessage("Please add at least one required skill.");
      return;
    }

    const payload = {
      ...formData,
      required_skills: skills,
      salary_min: formData.salary_min ? Number(formData.salary_min) : null,
      salary_max: formData.salary_max ? Number(formData.salary_max) : null,
      experience_years: Number(formData.experience_years),
    };

    try {
      const response = await saveMutation.mutateAsync({ data: payload });
      if (response?.status === "success") {
        navigate("/recruiter/jobs", { replace: true });
      }
    } catch (err) {
      setErrorMessage(
        err?.message ||
          err?.response?.data?.message ||
          "Failed to save job post. Please check all required fields."
      );
    }
  };

  if (isEditMode && isFetchingJob) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button & Header */}
      <div className="space-y-1">
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
        <h1 className="text-2xl font-bold text-slate-900">
          {isEditMode ? "Edit Job Post" : "Create New Job Post"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Fill in the details below to publish your career opening
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-lg font-bold text-slate-900">Job Information</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Provide accurate details to attract suitable candidates
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {errorMessage && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-600 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold text-slate-700">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="e.g. Senior Full Stack Developer"
                value={formData.title}
                onChange={handleChange}
                className="h-10 focus-visible:ring-violet-500"
              />
            </div>

            {/* Employment Type & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Employment Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(val) => handleSelectChange("employment_type", val)}
                >
                  <SelectTrigger className="h-10 focus:ring-violet-500">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full-time</SelectItem>
                    <SelectItem value="part_time">Part-time</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-xs font-semibold text-slate-700">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  required
                  placeholder="e.g. Dhaka (Hybrid) or Remote"
                  value={formData.location}
                  onChange={handleChange}
                  className="h-10 focus-visible:ring-violet-500"
                />
              </div>
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="salary_min" className="text-xs font-semibold text-slate-700">
                  Minimum Salary (BDT)
                </Label>
                <Input
                  id="salary_min"
                  name="salary_min"
                  type="number"
                  placeholder="e.g. 40000"
                  value={formData.salary_min}
                  onChange={handleChange}
                  className="h-10 focus-visible:ring-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="salary_max" className="text-xs font-semibold text-slate-700">
                  Maximum Salary (BDT)
                </Label>
                <Input
                  id="salary_max"
                  name="salary_max"
                  type="number"
                  placeholder="e.g. 60000"
                  value={formData.salary_max}
                  onChange={handleChange}
                  className="h-10 focus-visible:ring-violet-500"
                />
              </div>
            </div>

            {/* Experience & Application Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="experience_years" className="text-xs font-semibold text-slate-700">
                  Experience Required (Years) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="experience_years"
                  name="experience_years"
                  type="number"
                  min="0"
                  required
                  placeholder="e.g. 2"
                  value={formData.experience_years}
                  onChange={handleChange}
                  className="h-10 focus-visible:ring-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="deadline" className="text-xs font-semibold text-slate-700">
                  Application Deadline <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={handleChange}
                  className="h-10 focus-visible:ring-violet-500"
                />
              </div>
            </div>

            {/* Status Selection (Only in Edit Mode) */}
            {isEditMode && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Post Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => handleSelectChange("status", val)}
                >
                  <SelectTrigger className="h-10 focus:ring-violet-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Required Skills Tag Input */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700">
                Required Skills <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Add a skill (e.g. React, Laravel) and click Add"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="h-10 focus-visible:ring-violet-500"
                />
                <Button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-slate-800 hover:bg-slate-900 text-white h-10 px-4 shrink-0"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>

              {/* Skills Tags List */}
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-violet-50 text-violet-700 border border-violet-100 text-xs px-2.5 py-1 flex items-center gap-1.5"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-slate-700">
                Job Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={8}
                placeholder="Write full job requirements, responsibilities, and benefits..."
                value={formData.description}
                onChange={handleChange}
                className="focus-visible:ring-violet-500 text-sm leading-relaxed"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                asChild
                className="border-slate-200 text-slate-600 h-10"
              >
                <Link to="/recruiter/jobs">Cancel</Link>
              </Button>

              <Button
                type="submit"
                disabled={saveMutation.isPending}
                className="bg-violet-600 hover:bg-violet-700 text-white h-10 font-medium shadow-sm"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditMode ? "Update Job Post" : "Publish Job Post"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}