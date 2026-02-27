import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user, isOwner, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Laster…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/dashboard/login" state={{ from: pathname }} replace />;
  }

  if (isOwner === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-2">
        <h1 className="font-display text-xl font-bold text-foreground">Ingen tilgang</h1>
        <p className="text-muted-foreground text-sm">Du er ikke eier av dette kontrollrommet.</p>
      </div>
    );
  }

  return <>{children}</>;
}
