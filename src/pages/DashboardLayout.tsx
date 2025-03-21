import { Sidebar } from "@/components/app";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardLayout = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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

  return (
    <div className="flex flex-col min-h-[calc(100vh-64.8px)]">
      {/* Mobile sidebar toggle */}
      {isMobileView && (
        <div className="p-2 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="md:hidden"
          >
            <Menu size={20} />
            <span className="ml-2">Menu</span>
          </Button>
        </div>
      )}

      <div className="flex flex-1 relative">
        {/* Desktop sidebar - always visible on larger screens */}
        {!isMobileView && <Sidebar />}

        {/* Mobile sidebar - conditionally visible */}
        {isMobileView && showMobileSidebar && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="h-full w-[240px]">
              <Sidebar />
            </div>
            <div
              className="absolute inset-0 z-[-1]"
              onClick={() => setShowMobileSidebar(false)}
            />
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
