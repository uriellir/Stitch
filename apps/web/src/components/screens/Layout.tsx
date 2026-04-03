import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from '../BottomNav';

export default function Layout() {
  const location = useLocation();
  const hideNav = location.pathname === "/outfit/result";
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20">
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}