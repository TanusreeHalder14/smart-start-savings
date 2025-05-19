
import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Close sidebar when changing from mobile to desktop view
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse-light">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        {!isMobile && (
          <div className="hidden lg:block h-full transition-all duration-300">
            <Sidebar isMobile={false} />
          </div>
        )}

        {/* Mobile sidebar with sheet */}
        {isMobile && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-[300px]">
              <Sidebar isMobile={true} closeSidebar={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
        )}

        <main className="flex-1 overflow-auto p-4">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
