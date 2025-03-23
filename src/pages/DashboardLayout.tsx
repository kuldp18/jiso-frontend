import { Sidebar, Onboarding } from "@/components/app";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sidebar as SidebarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

const DashboardLayout = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const user = useAuthStore((state) => state.user);

  // Determine if user needs onboarding (You might need to adapt this based on your user object structure)
  const needsOnboarding = user && !user.authenticated;

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowMobileSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileSidebar = () => {
    setShowMobileSidebar(false);
  };

  // Prevent scrolling when mobile sidebar is open
  useEffect(() => {
    if (showMobileSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileSidebar]);

  return (
    <div className="flex flex-col min-h-screen">
      {needsOnboarding && <Onboarding />}

      <div className="flex flex-1 relative">
        {/* Desktop sidebar - always visible on larger screens */}
        {!isMobileView && <Sidebar />}

        {/* Mobile sidebar - conditionally visible with improved overlay */}
        {isMobileView && showMobileSidebar && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="h-full w-[240px] bg-sidebar shadow-xl animate-in slide-in-from-left">
              <Sidebar
                isMobile={true}
                closeMobileSidebar={closeMobileSidebar}
              />
            </div>
            <div
              className="absolute inset-0 z-[-1]"
              onClick={closeMobileSidebar}
            />
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Floating sidebar toggle button for mobile */}
      {isMobileView && (
        <Button
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="fixed left-4 bottom-4 z-40 shadow-lg size-12 rounded-full p-0 flex items-center justify-center bg-primary hover:bg-primary/90"
          aria-label="Toggle sidebar"
        >
          {showMobileSidebar ? <X size={24} /> : <SidebarIcon size={24} />}
        </Button>
      )}
    </div>
  );
};

export default DashboardLayout;
