import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  action?: ReactNode;
}

export function Header({ title, showBack = false, action }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {showBack && (
            <button onClick={() => navigate(-1)} className="p-1 -ml-1 hover:bg-accent rounded-lg">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
          )}
          {title && <h1 className="text-xl text-foreground truncate">{title}</h1>}
        </div>
        {action && <div className="ml-2">{action}</div>}
      </div>
    </header>
  );
}
