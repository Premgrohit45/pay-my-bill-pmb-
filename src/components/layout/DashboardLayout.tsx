import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { Menu, Bell, Sparkles, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getNotifications, getUsers, getRenters } from '@/lib/mockData';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PaymentReminder } from '@/components/PaymentReminder';
import { Particles3D } from '@/components/FloatingElements';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DashboardLayoutProps {
  requiredRole: 'owner' | 'renter';
}

export const DashboardLayout = ({ requiredRole }: DashboardLayoutProps) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== requiredRole) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  const notifications = getNotifications().filter(n => n.userId === user.id && !n.read);
  const notificationPath = `/${user.role}/notifications`;

  // Get owner info for renter to show QR
  const getOwnerInfo = () => {
    if (user.role !== 'renter') return null;
    const renters = getRenters();
    const myRenterInfo = renters.find(r => r.userId === user.id && r.connectionStatus === 'accepted');
    if (!myRenterInfo) return null;
    const users = getUsers();
    return users.find(u => u.id === myRenterInfo.ownerId);
  };

  const owner = getOwnerInfo();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-mesh-gradient opacity-50 pointer-events-none" />
      <Particles3D />
      
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 glass border-b border-border/50 sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="hover:bg-primary/10"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow-sm">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-space text-gradient">PayMyBill</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Payment Reminder for renter */}
            {user.role === 'renter' && <PaymentReminder />}
            {/* QR Code for renter */}
            {user.role === 'renter' && owner?.upiQrCode && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                    <QrCode className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Owner's QR Code</DialogTitle>
                  </DialogHeader>
                  <div className="text-center space-y-4">
                    <img
                      src={owner.upiQrCode}
                      alt="Owner UPI QR Code"
                      className="w-64 h-64 mx-auto rounded-lg border bg-white"
                    />
                    {owner.upiId && (
                      <p className="font-medium">UPI ID: {owner.upiId}</p>
                    )}
                    <p className="text-sm text-muted-foreground">Scan to pay {owner.name}</p>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <Link to={notificationPath} className="relative">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 relative">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold gradient-primary text-primary-foreground rounded-full shadow-glow-sm animate-pulse-soft">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </header>

        {/* Desktop header */}
        <header className="hidden lg:flex items-center justify-between p-6 glass border-b border-border/50">
          <div>
            <h1 className="text-2xl font-bold font-space capitalize flex items-center gap-3">
              <span className="w-2 h-8 rounded-full gradient-primary" />
              {requiredRole} Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, {user.name}!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* Payment Reminder for renter - desktop */}
            {user.role === 'renter' && <PaymentReminder />}
            {/* QR Code for renter - desktop */}
            {user.role === 'renter' && owner?.upiQrCode && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 gap-2"
                  >
                    <QrCode className="w-5 h-5" />
                    Owner's QR
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Owner's QR Code</DialogTitle>
                  </DialogHeader>
                  <div className="text-center space-y-4">
                    <img
                      src={owner.upiQrCode}
                      alt="Owner UPI QR Code"
                      className="w-64 h-64 mx-auto rounded-lg border bg-white"
                    />
                    {owner.upiId && (
                      <p className="font-medium">UPI ID: {owner.upiId}</p>
                    )}
                    <p className="text-sm text-muted-foreground">Scan to pay {owner.name}</p>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <Link to={notificationPath} className="relative group">
              <Button 
                variant="outline" 
                size="icon" 
                className="border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold gradient-primary text-primary-foreground rounded-full shadow-glow-sm animate-glow-pulse">
                  {notifications.length}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
