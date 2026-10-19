import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await login(formData);
      if (response?.status === "success") {
        const userRole = response?.data?.user?.role;
        navigate(userRole === "recruiter" ? "/recruiter" : "/", { replace: true });
      }
    } catch (err) {
      setErrorMessage(
        err?.message || err?.errors?.email?.[0] || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-violet-600">
            <div className="p-2 bg-violet-50 rounded-xl border border-violet-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-violet-600" />
            </div>
            <span>SmartAts</span>
          </Link>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-bold text-slate-900">Welcome back</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-600 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-9 h-10 focus-visible:ring-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-9 h-10 focus-visible:ring-violet-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white h-10 shadow-sm font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-violet-600 hover:underline">
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}