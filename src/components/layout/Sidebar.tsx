import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Bell,
  User,
  Home,
  LogOut,
  Building,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const ownerLinks = [
    { to: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/owner/renters', label: 'Manage Renters', icon: Users },
    { to: '/owner/notifications', label: 'Notifications', icon: Bell },
    { to: '/owner/profile', label: 'Profile', icon: User },
  ];

  const renterLinks = [
    { to: '/renter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/renter/my-owner', label: 'My Owner', icon: Building },
    { to: '/renter/payments', label: 'Payments', icon: CreditCard },
    { to: '/renter/notifications', label: 'Notifications', icon: Bell },
  ];

  const links = user?.role === 'owner' ? ownerLinks : renterLinks;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 gradient-hero text-sidebar-foreground transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:z-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="flex flex-col h-full relative z-10">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border/50">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-110">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-space bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                PayMyBill
              </span>
            </Link>
          </div>

          {/* User info */}
          <div className="p-4 mx-4 mt-4 rounded-2xl bg-sidebar-accent/50 backdrop-blur-sm border border-sidebar-border/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user?.name}</p>
                <p className="text-xs text-sidebar-foreground/60 capitalize flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            <p className="text-xs uppercase text-sidebar-foreground/50 font-semibold tracking-wider px-3 mb-3">
              Menu
            </p>
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden',
                    isActive
                      ? 'gradient-primary text-primary-foreground shadow-glow'
                      : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground'
                  )}
                >
                  {/* Active indicator glow */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent animate-shimmer" />
                  )}
                  <Icon className={cn(
                    'w-5 h-5 transition-transform duration-300',
                    isActive ? '' : 'group-hover:scale-110'
                  )} />
                  <span className="text-sm font-medium flex-1">{link.label}</span>
                  <ChevronRight className={cn(
                    'w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300',
                    isActive ? 'opacity-100 translate-x-0' : 'group-hover:opacity-50 group-hover:translate-x-0'
                  )} />
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border/50 space-y-1.5">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sidebar-accent/50 transition-all duration-300 text-sidebar-foreground/80 hover:text-sidebar-foreground group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/20 transition-all duration-300 text-sidebar-foreground/80 hover:text-destructive group"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
