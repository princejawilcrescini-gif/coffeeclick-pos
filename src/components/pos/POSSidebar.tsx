import { 
  LayoutGrid, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  Receipt,
  Tags,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutGrid, label: "Dashboard", path: "/dashboard" },
  { icon: Receipt, label: "Sales", path: "/" },
  { icon: Package, label: "Inventory", path: "/products" },
  { icon: Tags, label: "Categories", path: "/categories" },
  { icon: Users, label: "Customers", path: "/customers" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
];

export function POSSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-sidebar flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl pos-gradient flex items-center justify-center">
            <Receipt className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">CoffeeClick</h1>
            <p className="text-xs text-sidebar-muted">Point of Sale</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150",
              currentPath === item.path
                ? "bg-sidebar-accent text-sidebar-primary border-l-[3px] border-sidebar-primary"
                : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button 
          onClick={() => navigate("/settings")}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150",
            currentPath === "/settings"
              ? "bg-sidebar-accent text-sidebar-primary"
              : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-muted hover:text-destructive hover:bg-destructive/10 transition-all duration-150">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-semibold text-sidebar-primary">SY</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Shane Yepez</p>
            <p className="text-xs text-sidebar-muted truncate">Store Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
