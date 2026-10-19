import { useState } from "react";
import { useApiQuery } from "@/hooks/useApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Briefcase,
  RotateCcw,
  ChevronDown,
  Check,
} from "lucide-react";
import JobCard from "@/components/JobCard";
import Pagination from "@/components/Pagination";

const EMPLOYMENT_TYPES = [
  { label: "All", value: "all" },
  { label: "Full time", value: "full_time" },
  { label: "Part time", value: "part_time" },
  { label: "Remote", value: "remote" },
  { label: "Intern", value: "internship" },
];

const LOCATIONS = [
  { label: "All Locations", value: "all" },
  { label: "Dhaka", value: "Dhaka" },
  { label: "Dhaka (Hybrid)", value: "Dhaka (Hybrid)" },
  { label: "Dhaka (Gulshan)", value: "Dhaka (Gulshan)" },
  { label: "Dhaka (Banani)", value: "Dhaka (Banani)" },
  { label: "Dhaka (Uttara)", value: "Dhaka (Uttara)" },
  { label: "Dhaka (Dhanmondi)", value: "Dhaka (Dhanmondi)" },
  { label: "Chattogram", value: "Chattogram" },
  { label: "Remote", value: "Remote" },
];

const EXPERIENCE_OPTIONS = [
  { label: "Any", value: "all" },
  { label: "Fresher (0 years)", value: "0" },
  { label: "Up to 1 year", value: "1" },
  { label: "Up to 3 years", value: "3" },
  { label: "Up to 5 years", value: "5" },
];

function PopoverSelect({
  value,
  options,
  onChange,
  placeholder,
  className = "",
  contentClassName = "",
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`justify-between font-normal border-slate-200 text-slate-700 hover:bg-slate-50 ${className}`}
        >
          <span className="truncate">
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className={`w-[var(--radix-popover-trigger-width)] p-1 ${contentClassName}`}
      >
        <div className="max-h-64 overflow-y-auto hide-scrollbar">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 text-xs rounded-md text-left transition-colors ${
                  isSelected
                    ? "bg-violet-50 text-violet-700 font-medium"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function JobList() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [employmentType, setEmploymentType] = useState("all");
  const [maxExperience, setMaxExperience] = useState("all");
  const [page, setPage] = useState(1);

  const queryParams = {
    page,
    ...(search && { search }),
    ...(location !== "all" && { location }),
    ...(employmentType !== "all" && { employment_type: employmentType }),
    ...(maxExperience !== "all" && { max_experience: maxExperience }),
  };

  const { data, isLoading, isError } = useApiQuery({
    url: "/job-posts",
    params: queryParams,
    queryKey: ["job-posts", queryParams],
  });

  const jobs = data?.data?.items || [];
  const pagination = data?.data?.pagination || {};

  const hasActiveFilters =
    search ||
    location !== "all" ||
    employmentType !== "all" ||
    maxExperience !== "all";

  const handleResetFilters = () => {
    setSearch("");
    setLocation("all");
    setEmploymentType("all");
    setMaxExperience("all");
    setPage(1);
  };

  const updateFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find Your Next Job
        </h1>
        <p className="text-slate-500 font-medium text-sm sm:text-base">
          {pagination.total
            ? `${pagination.total} open positions available`
            : "Choose the best career for you"}
        </p>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Search + Location (popover select) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by job title or skill..."
              value={search}
              onChange={(e) => updateFilter(setSearch)(e.target.value)}
              className="pl-10 h-11 focus-visible:ring-violet-500"
            />
          </div>

          <div className="sm:col-span-4">
            <PopoverSelect
              value={location}
              options={LOCATIONS}
              onChange={updateFilter(setLocation)}
              placeholder="Select location"
              className="h-11 w-full"
            />
          </div>
        </div>

        {/* Employment pills + Experience (popover select) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {EMPLOYMENT_TYPES.map((type) => (
              <Button
                key={type.value}
                type="button"
                variant={employmentType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilter(setEmploymentType)(type.value)}
                className={
                  employmentType === type.value
                    ? "bg-violet-600 hover:bg-violet-700 text-white rounded-full text-xs h-8"
                    : "text-slate-600 border-slate-200 hover:bg-slate-50 rounded-full text-xs h-8"
                }
              >
                {type.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <PopoverSelect
              value={maxExperience}
              options={EXPERIENCE_OPTIONS}
              onChange={updateFilter(setMaxExperience)}
              placeholder="Experience"
              className="h-8 text-xs w-[170px]"
              contentClassName="text-xs"
            />

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs text-slate-500 hover:text-violet-600 h-8 px-2 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-48 bg-slate-200/60 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Failed to load data. Please try again.
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-slate-600 font-medium">No jobs found</p>
          <Button
            variant="link"
            onClick={handleResetFilters}
            className="text-violet-600 text-sm"
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
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