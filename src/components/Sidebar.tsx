
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart3, MessageCircle, Target, User } from "lucide-react";

interface SidebarProps {
  isMobile: boolean;
  closeSidebar?: () => void;
}

const Sidebar = ({ isMobile, closeSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const navItems = [
    {
      label: "Dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
      href: "/dashboard",
    },
    {
      label: "Goal Planner",
      icon: <Target className="w-5 h-5" />,
      href: "/goal-planner",
    },
    {
      label: "AI Coach",
      icon: <MessageCircle className="w-5 h-5" />,
      href: "/ai-coach",
    },
    {
      label: "Mutual Funds",
      icon: <BarChart3 className="w-5 h-5" />,
      href: "/mutual-funds",
    },
  ];
  
  const handleNavigation = (href: string) => {
    navigate(href);
    if (isMobile && closeSidebar) {
      closeSidebar();
    }
  };
  
  return (
    <aside className={cn(
      "flex flex-col h-full bg-white border-r",
      isMobile ? "w-full" : "w-64"
    )}>
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-finance-primary to-finance-secondary">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={location.pathname === item.href ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              location.pathname === item.href
                ? "bg-finance-primary text-white hover:bg-finance-primary/90"
                : "hover:bg-gray-100"
            )}
            onClick={() => handleNavigation(item.href)}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Button>
        ))}
      </nav>
      
      <div className="p-4 border-t">
        <div className="rounded-lg bg-finance-muted p-4">
          <h3 className="font-medium text-sm mb-2">Pro Tip</h3>
          <p className="text-xs text-gray-600">
            Consistency is key in financial planning. Even small regular investments 
            can yield significant results over time.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
