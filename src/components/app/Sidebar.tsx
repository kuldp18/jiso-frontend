import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  MessagesSquare,
  HelpCircle,
  X,
  SmilePlus,
  NotebookPen,
  MessageSquarePlus,
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
    <div className="w-full">
      <Link to={to} className="w-full block">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 p-2",
            isActive
              ? "bg-primary/10 text-primary hover:bg-primary/20"
              : "hover:bg-sidebar-accent/30 text-sidebar-foreground",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? label : undefined} // ✅ Native tooltip when collapsed
        >
          <span className="flex-shrink-0">{icon}</span>
          {!isCollapsed && <span className="truncate">{label}</span>}
        </Button>
      </Link>
    </div>
  );
};

interface SidebarProps {
  isMobile?: boolean;
  closeMobileSidebar?: () => void;
}

const Sidebar = ({ isMobile = false, closeMobileSidebar }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const user = useAuthStore((state) => state.user);

  // Prevent scrollbar flicker by controlling overflow
  useEffect(() => {
    if (sidebarRef.current) {
      // Add a small delay to avoid the scrollbar flicker during transition
      sidebarRef.current.classList.add("overflow-hidden");

      const timer = setTimeout(() => {
        if (sidebarRef.current) {
          sidebarRef.current.classList.remove("overflow-hidden");
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isCollapsed]);

  // Always uncollapse sidebar when in mobile view
  useEffect(() => {
    if (isMobile && isCollapsed) {
      setIsCollapsed(false);
    }
  }, [isMobile, isCollapsed]);

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarLinks = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      to: "/dashboard/moods",
      icon: <SmilePlus size={20} />,
      label: "Moods",
    },
    {
      to: "/dashboard/journals",
      icon: <NotebookPen size={20} />,
      label: "Journals",
    },
    {
      to: "/dashboard/new-chat",
      icon: <MessageSquarePlus size={20} />,
      label: "New Chat",
    },
    {
      to: "/dashboard/chats",
      icon: <MessagesSquare size={20} />,
      label: "Chats",
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
      ref={sidebarRef}
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        isMobile ? "h-full" : "h-[calc(100vh-64px)]", // Adjusted to match navbar exactly
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Mobile close button */}
      {isMobile && (
        <div className="flex justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobileSidebar}
            className="md:hidden"
          >
            <X size={18} />
          </Button>
        </div>
      )}

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
            <div className="min-w-0 flex-1">
              <span className="font-medium text-sm block truncate">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-sidebar-foreground/70 block truncate">
                {user?.email || "user@example.com"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation links */}
      <nav className="p-2 flex-1 overflow-y-auto scrollbar-thin">
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

      {/* Collapse button - only on desktop */}
      {!isMobile && (
        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={handleCollapseToggle}
            className="w-full justify-center"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </Button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
