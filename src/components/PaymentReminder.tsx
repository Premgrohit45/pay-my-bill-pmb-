import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getPayments, getRenters, Payment } from '@/lib/mockData';
import { differenceInDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Bell, AlertTriangle, Clock } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface ReminderNotification {
  id: string;
  type: 'warning' | 'urgent' | 'overdue';
  message: string;
  daysLeft: number;
  payment: Payment;
}

export const PaymentReminder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<ReminderNotification[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (user?.role !== 'renter') return;

    const checkPaymentReminders = () => {
      const renters = getRenters();
      const myRenter = renters.find(r => r.userId === user.id && r.connectionStatus === 'accepted');
      
      if (!myRenter) return;

      const payments = getPayments();
      const currentMonth = new Date().toLocaleString('default', { month: 'long' });
      const pendingPayments = payments.filter(
        p => p.renterId === user.id && 
        (p.status === 'pending' || p.status === 'overdue') &&
        p.month === currentMonth
      );

      const reminders: ReminderNotification[] = [];

      pendingPayments.forEach(payment => {
        const daysUntilDue = differenceInDays(new Date(payment.dueDate), new Date());

        if (daysUntilDue < 0) {
          reminders.push({
            id: payment.id,
            type: 'overdue',
            message: `Your rent payment of ₹${payment.amount.toLocaleString()} is overdue by ${Math.abs(daysUntilDue)} day(s)!`,
            daysLeft: daysUntilDue,
            payment
          });
        } else if (daysUntilDue <= 3) {
          reminders.push({
            id: payment.id,
            type: 'urgent',
            message: `Urgent: Rent payment of ₹${payment.amount.toLocaleString()} is due in ${daysUntilDue} day(s)!`,
            daysLeft: daysUntilDue,
            payment
          });
        } else if (daysUntilDue <= 7) {
          reminders.push({
            id: payment.id,
            type: 'warning',
            message: `Reminder: Rent payment of ₹${payment.amount.toLocaleString()} is due in ${daysUntilDue} days.`,
            daysLeft: daysUntilDue,
            payment
          });
        }
      });

      setNotifications(reminders);

      // Show toast notification for urgent/overdue payments (only once per session)
      if (reminders.length > 0 && !hasShownToast) {
        const mostUrgent = reminders[0];
        toast({
          title: mostUrgent.type === 'overdue' ? '⚠️ Payment Overdue!' : '🔔 Payment Reminder',
          description: mostUrgent.message,
          variant: mostUrgent.type === 'overdue' ? 'destructive' : 'default',
        });
        setHasShownToast(true);
      }
    };

    checkPaymentReminders();
    
    // Check every minute for new reminders
    const interval = setInterval(checkPaymentReminders, 60000);
    return () => clearInterval(interval);
  }, [user, toast, hasShownToast]);

  if (user?.role !== 'renter' || notifications.length === 0) return null;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'overdue':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'urgent':
        return 'bg-warning/10 text-warning border-warning/30';
      default:
        return 'bg-primary/10 text-primary border-primary/30';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'overdue':
        return <AlertTriangle className="w-5 h-5" />;
      case 'urgent':
        return <Clock className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setShowDialog(true)}
      >
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
          {notifications.length}
        </span>
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Payment Reminders
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border ${getTypeStyles(notification.type)} animate-fade-in`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant={notification.type === 'overdue' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {notification.type === 'overdue' ? 'OVERDUE' : 
                         notification.type === 'urgent' ? 'URGENT' : 'REMINDER'}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.payment.month} • Due: {new Date(notification.payment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button asChild className="w-full gradient-primary">
            <Link to="/renter/payments" onClick={() => setShowDialog(false)}>
              Go to Payments
            </Link>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
