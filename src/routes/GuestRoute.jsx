import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function GuestRoute() {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={role === "recruiter" ? "/recruiter" : "/"} replace />;
  }

  return <Outlet />;
}