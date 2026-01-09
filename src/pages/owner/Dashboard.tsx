import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/StatCard';
import { PaymentStatusBadge } from '@/components/PaymentStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, IndianRupee, AlertCircle, Plus, Eye, UserPlus, Mail } from 'lucide-react';
import { HowToUse } from '@/components/HowToUse';
import {
  getUsers,
  getRenters,
  getPayments,
  savePayments,
  getNotifications,
  saveNotifications,
  Payment,
  User,
  Renter,
  Notification,
} from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { AddRenterForm } from '@/components/AddRenterForm';
import { SendRenterRequest } from '@/components/SendRenterRequest';
import { OwnerDashboardSkeleton } from '@/components/DashboardSkeleton';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [renters, setRenters] = useState<Renter[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [addRenterOpen, setAddRenterOpen] = useState(false);
  const [proofDialogOpen, setProofDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    setLoading(true);
    // Simulate loading delay for skeleton visibility
    setTimeout(() => {
      setRenters(getRenters().filter(r => r.ownerId === user?.id && r.connectionStatus === 'accepted'));
      setUsers(getUsers());
      setPayments(getPayments().filter(p => p.ownerId === user?.id));
      setLoading(false);
    }, 500);
  };

  const getRenterName = (renterId: string) => {
    const renterUser = users.find(u => u.id === renterId);
    return renterUser?.name || 'Unknown';
  };

  // Statistics
  const totalRenters = renters.length;
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const thisMonthPayments = payments.filter(p => p.month === currentMonth);
  const paidAmount = thisMonthPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingProofs = thisMonthPayments.filter(p => p.status === 'proof_submitted').length;
  const unpaidAmount = thisMonthPayments
    .filter(p => p.status !== 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalExpected = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);
  const collectionRate = totalExpected > 0 
    ? Math.round((paidAmount / totalExpected) * 100) 
    : 0;

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    .slice(0, 5);

  const viewProof = (payment: Payment) => {
    setSelectedPayment(payment);
    setProofDialogOpen(true);
  };


  if (loading) {
    return <OwnerDashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="animate-fade-in">
          <StatCard
            title="Total Renters"
            value={totalRenters}
            icon={<Users className="w-6 h-6" />}
          />
        </div>
        <div className="animate-fade-in stagger-1">
          <StatCard
            title="Total Paid This Month"
            value={`₹${paidAmount.toLocaleString()}`}
            icon={<IndianRupee className="w-6 h-6" />}
            iconClassName="bg-success/10 text-success"
          />
        </div>
        <div className="animate-fade-in stagger-2">
          <StatCard
            title="Total Unpaid"
            value={`₹${unpaidAmount.toLocaleString()}`}
            icon={<AlertCircle className="w-6 h-6" />}
            iconClassName="bg-destructive/10 text-destructive"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 items-center">
        <HowToUse role="owner" />
        <Dialog open={addRenterOpen} onOpenChange={setAddRenterOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Renter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Renter</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="request" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="request" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Send Request
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add Manually
                </TabsTrigger>
              </TabsList>
              <TabsContent value="request" className="mt-4">
                <SendRenterRequest
                  ownerId={user?.id || ''}
                  onSuccess={() => {
                    setAddRenterOpen(false);
                    loadData();
                  }}
                />
              </TabsContent>
              <TabsContent value="manual" className="mt-4">
                <AddRenterForm
                  ownerId={user?.id || ''}
                  onSuccess={() => {
                    setAddRenterOpen(false);
                    loadData();
                  }}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        <Button variant="outline" asChild>
          <Link to="/owner/renters">
            <Users className="w-4 h-4 mr-2" />
            Manage Renters
          </Link>
        </Button>
      </div>

      {/* Recent Payments Table */}
      <Card className="relative overflow-hidden glass border-border/50 hover:border-primary/30 transition-all duration-500 animate-fade-in stagger-3">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-space">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-sm">
              <IndianRupee className="w-5 h-5 text-primary-foreground" />
            </div>
            Recent Payments
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          {recentPayments.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center animate-float">
                <IndianRupee className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No payments yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Renter Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {getRenterName(payment.renterId)}
                      </TableCell>
                      <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{payment.month}</TableCell>
                      <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={payment.status} />
                      </TableCell>
                      <TableCell>
                        {payment.status === 'proof_submitted' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewProof(payment)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Proof
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proof Dialog - View Only */}
      <Dialog open={proofDialogOpen} onOpenChange={setProofDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p><strong>Renter:</strong> {getRenterName(selectedPayment.renterId)}</p>
                <p><strong>Amount:</strong> ₹{selectedPayment.amount.toLocaleString()}</p>
                <p><strong>Month:</strong> {selectedPayment.month}</p>
                <p><strong>Status:</strong> <span className="text-success font-medium">Paid</span></p>
              </div>
              {selectedPayment.proofImage && (
                <img
                  src={selectedPayment.proofImage}
                  alt="Payment Proof"
                  className="w-full rounded-lg border"
                />
              )}
              <Button
                onClick={() => setProofDialogOpen(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OwnerDashboard;
