import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentStatusBadge } from '@/components/PaymentStatusBadge';
import { PendingOwnerRequests } from '@/components/PendingOwnerRequests';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IndianRupee, Calendar, Clock, Building, AlertCircle, CreditCard, ArrowRight, Sparkles, Home, Users, Zap, HelpCircle } from 'lucide-react';
import { HowToUse } from '@/components/HowToUse';
import {
  getUsers,
  getRenters,
  getPayments,
  User,
  Renter,
  Payment,
} from '@/lib/mockData';
import { differenceInDays, format } from 'date-fns';
import { RenterDashboardSkeleton } from '@/components/DashboardSkeleton';

const RenterDashboard = () => {
  const { user } = useAuth();
  const [owner, setOwner] = useState<User | null>(null);
  const [renterInfo, setRenterInfo] = useState<Renter | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const renters = getRenters();
      const allPayments = getPayments();

      // Find renter's connection
      const myRenterInfo = renters.find(
        r => r.userId === user?.id && r.connectionStatus === 'accepted'
      );
      setRenterInfo(myRenterInfo || null);

      if (myRenterInfo) {
        // Find owner
        const ownerUser = users.find(u => u.id === myRenterInfo.ownerId);
        setOwner(ownerUser || null);

        // Find payments
        const myPayments = allPayments
          .filter(p => p.renterId === user?.id)
          .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        setPayments(myPayments);
      }
      setLoading(false);
    }, 500);
  };

  // Current payment info
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentPayment = payments.find(p => p.month === currentMonth);
  const daysUntilDue = currentPayment
    ? differenceInDays(new Date(currentPayment.dueDate), new Date())
    : null;

  const recentPayments = payments.slice(0, 3);

  if (loading) {
    return <RenterDashboardSkeleton />;
  }

  // No connection - show pending requests or waiting state
  if (!renterInfo) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Check for pending requests first */}
        <PendingOwnerRequests onAccept={loadData} />
        
        <Card className="relative overflow-hidden glass border-warning/30 animate-fade-in">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-warning via-warning/80 to-warning" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-warning/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <CardContent className="py-12 text-center relative z-10">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-warning/20 to-warning/10 flex items-center justify-center animate-float shadow-lg">
              <AlertCircle className="w-12 h-12 text-warning" />
            </div>
            <h2 className="text-2xl font-bold font-space mb-3">No Owner Connected</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You're waiting for your property owner to send you a connection request. Once they add you, you'll see it here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Badge variant="warning" className="px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Waiting for Owner
              </Badge>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all group">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Step 1</p>
                <p className="text-sm font-medium">Owner adds you</p>
              </div>
              <div className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-secondary/30 transition-all group">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-xs text-muted-foreground">Step 2</p>
                <p className="text-sm font-medium">Accept request</p>
              </div>
              <div className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-accent/30 transition-all group">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5 text-accent" />
                </div>
                <p className="text-xs text-muted-foreground">Step 3</p>
                <p className="text-sm font-medium">Start paying</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with How to Use */}
      <div className="flex justify-end">
        <HowToUse role="renter" />
      </div>

      {/* Pending Owner Requests */}
      <PendingOwnerRequests onAccept={loadData} />
      
      {/* Owner Info Card */}
      <Card className="relative overflow-hidden glass border-border/50 hover:border-primary/30 transition-all duration-500 animate-fade-in group">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
        
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-space">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-sm group-hover:scale-110 transition-transform">
              <Building className="w-5 h-5 text-primary-foreground" />
            </div>
            Owner Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-secondary flex items-center justify-center shadow-lg animate-float">
              <Building className="w-8 h-8 text-secondary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-xl font-space">{owner?.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                📞 {owner?.phone} • ✉️ {owner?.email}
              </p>
            </div>
            <Badge className="bg-success/10 text-success border-success/30 px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
              Active
            </Badge>
          </div>
          
          {/* Quick room info */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            <div className="text-center p-3 rounded-xl bg-muted/50 hover:bg-primary/10 transition-colors">
              <Home className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Room</p>
              <p className="font-semibold text-sm">{renterInfo.roomNumber || '-'}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50 hover:bg-secondary/10 transition-colors">
              <IndianRupee className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Rent</p>
              <p className="font-semibold text-sm">₹{renterInfo.rentAmount.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50 hover:bg-accent/10 transition-colors">
              <Calendar className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Due</p>
              <p className="font-semibold text-sm">{renterInfo.dueDate}th</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50 hover:bg-success/10 transition-colors">
              <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">People</p>
              <p className="font-semibold text-sm">{renterInfo.numberOfPeople}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Payment Status */}
      <Card className="relative overflow-hidden glass border-border/50 hover:border-primary/30 transition-all duration-500 animate-fade-in stagger-1 group">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors" />
        
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-space">
            <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center shadow-glow-secondary group-hover:scale-110 transition-transform">
              <IndianRupee className="w-5 h-5 text-secondary-foreground" />
            </div>
            Current Payment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentPayment ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Rent Amount</p>
                <p className="text-2xl md:text-3xl font-bold font-space text-primary">₹{currentPayment.amount.toLocaleString()}</p>
              </div>
              <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:scale-105">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Due Date</p>
                <p className="text-2xl md:text-3xl font-bold font-space text-secondary">
                  {format(new Date(currentPayment.dueDate), 'MMM d')}
                </p>
              </div>
              <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Days Left</p>
                <p className={`text-2xl md:text-3xl font-bold font-space ${daysUntilDue! < 0 ? 'text-destructive' : daysUntilDue! <= 5 ? 'text-warning' : 'text-accent'}`}>
                  {daysUntilDue! < 0 ? 'Overdue' : `${daysUntilDue} days`}
                </p>
              </div>
              <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Status</p>
                <div className="mt-1">
                  <PaymentStatusBadge status={currentPayment.status} />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-success/10 flex items-center justify-center animate-float">
                <Sparkles className="w-8 h-8 text-success" />
              </div>
              <p className="text-muted-foreground">No payment due for this month.</p>
            </div>
          )}

          {currentPayment && (currentPayment.status === 'pending' || currentPayment.status === 'overdue') && (
            <div className="mt-6">
              <Button asChild className="w-full gradient-primary shadow-glow hover:shadow-glow-lg transition-all duration-300 group h-12 text-lg">
                <Link to="/renter/payments" className="flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Pay Rent Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="relative overflow-hidden glass border-border/50 hover:border-primary/30 transition-all duration-500 animate-fade-in stagger-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 font-space">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow-accent">
                <Clock className="w-5 h-5 text-accent-foreground" />
              </div>
              Recent Payments
            </CardTitle>
            <Button variant="outline" size="sm" asChild className="border-border/50 hover:border-primary/50 hover:bg-primary/5 group">
              <Link to="/renter/payments" className="flex items-center gap-2">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentPayments.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No payment history yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="font-semibold">Month</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Paid Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment, index) => (
                    <TableRow 
                      key={payment.id} 
                      className="border-border/50 hover:bg-primary/5 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <TableCell className="font-medium font-space">
                        {payment.month} {payment.year}
                      </TableCell>
                      <TableCell className="font-semibold">₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={payment.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {payment.paidDate
                          ? format(new Date(payment.paidDate), 'MMM d, yyyy')
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RenterDashboard;