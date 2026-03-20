import { Home, ShoppingBag, Sparkles, Heart, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ShoppingBag, label: "Closet", path: "/closet" },
    { icon: Sparkles, label: "Outfit", path: "/outfit" },
    { icon: Heart, label: "Saved", path: "/saved" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="max-w-md mx-auto flex justify-around items-center px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center py-2 px-3 min-w-[60px]"
            >
              <Icon
                className={`h-6 w-6 mb-1 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-xs ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}