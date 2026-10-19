import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ role, children }) {
  const { isAuthenticated, role: userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to={userRole === "recruiter" ? "/recruiter" : "/"} replace />;
  }

  return children ? children : <Outlet />;
}