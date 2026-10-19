import { useParams, Link } from "react-router";
import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, AlertCircle, FileText, Ban, Loader2 } from "lucide-react";

export default function ApplicationDetail() {
  const { id } = useParams();

  const { data, isLoading, isError, refetch } = useApiQuery({
    url: `/applications/${id}`,
    queryKey: ["application-detail", id],
  });

  const withdrawMutation = useApiMutation({
    url: `/applications/${id}/withdraw`,
    method: "PATCH",
  });

  const application = data?.data || null;

  const handleWithdraw = async () => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      try {
        await withdrawMutation.mutateAsync({});
        refetch();
      } catch (err) {
        alert(err?.message || "Failed to withdraw application.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Application Not Found</h2>
        <Button asChild variant="outline">
          <Link to="/my-applications">Back to My Applications</Link>
        </Button>
      </div>
    );
  }

  const isWithdrawn = application.status === "withdrawn";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="text-slate-600 hover:text-violet-600 -ml-2"
      >
        <Link to="/my-applications" className="flex gap-2 items-center">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> 
          <span>Back to My Applications</span>
        </Link>
      </Button>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-900">
              {application.job_post?.title}
            </CardTitle>
            <p className="text-xs text-slate-500">
              Submitted on {new Date(application.created_at).toLocaleDateString()}
            </p>
          </div>

          {!isWithdrawn && application.status === "applied" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleWithdraw}
              disabled={withdrawMutation.isPending}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              {withdrawMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Ban className="w-4 h-4 mr-1" />
              )}
              Withdraw Application
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-6 space-y-6">
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

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-violet-600" /> Submitted Resume
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-mono">
              {application.resume_original_name}
            </div>
          </div>

          {/* Cover Letter */}
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