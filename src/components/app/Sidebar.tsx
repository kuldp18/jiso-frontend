import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Users,
  PieChart,
  Calendar,
  MessagesSquare,
  FileText,
  HelpCircle,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({ to, icon, label, isCollapsed }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 p-2",
          isActive
            ? "bg-primary/10 text-primary hover:bg-primary/20"
            : "hover:bg-sidebar-accent/30 text-sidebar-foreground",
          isCollapsed && "justify-center"
        )}
      >
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </Button>
    </Link>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);

  const sidebarLinks = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      to: "/dashboard/analytics",
      icon: <PieChart size={20} />,
      label: "Analytics",
    },
    {
      to: "/dashboard/users",
      icon: <Users size={20} />,
      label: "Users",
    },
    {
      to: "/dashboard/messages",
      icon: <MessagesSquare size={20} />,
      label: "Messages",
    },
    {
      to: "/dashboard/calendar",
      icon: <Calendar size={20} />,
      label: "Calendar",
    },
    {
      to: "/dashboard/documents",
      icon: <FileText size={20} />,
      label: "Documents",
    },
    {
      to: "/dashboard/settings",
      icon: <Settings size={20} />,
      label: "Settings",
    },
    {
      to: "/dashboard/help",
      icon: <HelpCircle size={20} />,
      label: "Help & Support",
    },
  ];

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border h-[calc(100vh-64.8px)] transition-all duration-300 flex flex-col",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* User info section */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex-shrink-0 bg-sidebar-primary text-sidebar-primary-foreground rounded-full w-10 h-10 grid place-content-center font-semibold uppercase"
            )}
          >
            {user?.name?.charAt(0) || "U"}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-medium text-sm truncate">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-sidebar-foreground/70 truncate">
                {user?.email}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation links */}
      <nav className="p-2 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {sidebarLinks.map((link) => (
            <li key={link.to}>
              <SidebarLink
                to={link.to}
                icon={link.icon}
                label={link.label}
                isCollapsed={isCollapsed}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse button */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-center"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
