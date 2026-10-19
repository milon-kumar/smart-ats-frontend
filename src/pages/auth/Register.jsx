import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, Lock, Mail, User, AlertCircle, Loader2 } from "lucide-react";

const DEFAULT_ROLE = "candidate";

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
    if (generalError) setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    try {
      const response = await register({ ...formData, role: DEFAULT_ROLE });
      if (response?.status === "success") {
        navigate("/", { replace: true });
      }
    } catch (err) {
      if (err?.errors) {
        setErrors(err.errors);
      } else {
        setGeneralError(
          err?.message || "Registration failed. Please check your inputs."
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold text-2xl text-violet-600"
          >
            <div className="p-2 bg-violet-50 rounded-xl border border-violet-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-violet-600" />
            </div>
            <span>SmartAts</span>
          </Link>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-bold text-slate-900">
              Create an Account
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Get started with SmartAts today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generalError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-600 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{generalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-9 h-10 focus-visible:ring-violet-500"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 font-medium">{errors.name[0]}</p>
                )}
              </div>

              <div className="space-y-1.5">
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
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium">{errors.email[0]}</p>
                )}
              </div>

              <div className="space-y-1.5">
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
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium">{errors.password[0]}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password_confirmation"
                  className="text-xs font-semibold text-slate-700"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="pl-9 h-10 focus-visible:ring-violet-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white h-10 shadow-sm font-medium mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-violet-600 hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}