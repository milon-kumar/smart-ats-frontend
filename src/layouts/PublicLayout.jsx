import { Link, Outlet, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Briefcase, LogOut, LayoutDashboard, User } from "lucide-react";

export default function PublicLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const handelLogout = async () =>{
    const response = await logout();
    if(response.status === 'success')
    {
      navigate('/login');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-violet-600"
          >
            <div className="p-2 bg-violet-50 rounded-lg border border-violet-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-violet-600" />
            </div>
            <span>SmartAts</span>
          </Link>

          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {user?.role === "recruiter" && (
                  <Button
                    variant="outline"
                    asChild
                    className="border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
                  >
                    <Link to="/recruiter" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-9 w-9 border border-violet-200 cursor-pointer">
                        <AvatarFallback className="bg-violet-100 text-violet-700 font-semibold">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      {user?.role === "candidate" && (
                        <DropdownMenuItem asChild>
                          <Link
                            to="/my-applications"
                            className="cursor-pointer flex gap-2 items-center"
                          >
                            <User className="mr-2 h-4 w-4" />
                            <span>My Applications</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {user?.role === "recruiter" && (
                        <DropdownMenuItem asChild>
                          <Link to="/recruiter" className="cursor-pointer flex gap-2 items-center">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Recruiter Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handelLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  asChild
                  className="text-slate-600 hover:text-violet-600"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} SmartAts. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
