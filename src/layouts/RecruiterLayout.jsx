import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Globe,
} from "lucide-react";

export default function RecruiterLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "R";
  };

  const handelLogout = async () => {
    const response = await logout();
    if (response?.status === "success") {
      navigate("/login", { replace: true });
    }
  };
  const navItems = [
    {
      title: "Dashboard",
      path: "/recruiter",
      icon: LayoutDashboard,
      end: true,
    },
    {
      title: "My Job Posts",
      path: "/recruiter/jobs",
      icon: Briefcase,
      end: true,
    },
    {
      title: "Post New Job",
      path: "/recruiter/jobs/new",
      icon: PlusCircle,
      end: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <Link
              to="/recruiter"
              className="flex items-center gap-2 font-bold text-xl text-violet-600"
            >
              <div className="p-2 bg-violet-50 rounded-xl border border-violet-100 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-violet-600" />
              </div>
              <span>SmartAts</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-violet-50 text-violet-700 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-xs text-slate-600 hover:text-violet-600 hover:bg-violet-50"
          >
            <Link to="/">
              <Globe className="w-4 h-4 mr-2" />
              <span>Public Portal</span>
            </Link>
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-sm font-bold text-slate-800 hidden sm:block">
              Recruiter Workspace
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-9"
            >
              <Link
                to="/recruiter/jobs/new"
                className="flex gap-2 items-center"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                <span>Post Job</span>
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9 border border-violet-200">
                    <AvatarFallback className="bg-violet-100 text-violet-700 font-semibold text-xs">
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
                  <DropdownMenuItem asChild>
                    <Link
                      to="/"
                      className="cursor-pointer flex gap-2 items-center"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      <span>View Portal</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handelLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
