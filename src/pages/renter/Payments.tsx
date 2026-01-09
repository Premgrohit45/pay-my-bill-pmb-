import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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
} from '@/components/ui/dialog';
import { PaymentStatusBadge } from '@/components/PaymentStatusBadge';
import { useToast } from '@/hooks/use-toast';
import {
  CreditCard,
  IndianRupee,
  QrCode,
  Upload,
  Loader2,
  Copy,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  getUsers,
  getRenters,
  getPayments,
  savePayments,
  saveNotifications,
  getNotifications,
  User,
  Renter,
  Payment,
  Notification,
} from '@/lib/mockData';
import { format } from 'date-fns';

const RenterPayments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [owner, setOwner] = useState<User | null>(null);
  const [renterInfo, setRenterInfo] = useState<Renter | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    const users = getUsers();
    const renters = getRenters();
    const allPayments = getPayments();

    const myRenterInfo = renters.find(
      r => r.userId === user?.id && r.connectionStatus === 'accepted'
    );
    setRenterInfo(myRenterInfo || null);

    if (myRenterInfo?.ownerId) {
      const ownerUser = users.find(u => u.id === myRenterInfo.ownerId);
      setOwner(ownerUser || null);

      const myPayments = allPayments
        .filter(p => p.renterId === user?.id)
        .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
      setPayments(myPayments);
    }
  };

  const openPayDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setProofImage(null);
    setPayDialogOpen(true);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = async () => {
    if (!selectedPayment || !proofImage) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const allPayments = getPayments();
    const index = allPayments.findIndex(p => p.id === selectedPayment.id);
    if (index !== -1) {
      // Directly mark as paid
      allPayments[index].status = 'paid';
      allPayments[index].proofImage = proofImage;
      allPayments[index].paidDate = new Date().toISOString().split('T')[0];
      savePayments(allPayments);

      // Notify owner
      const notifications = getNotifications();
      const ownerNotification: Notification = {
        id: `notif_${Date.now()}`,
        userId: selectedPayment.ownerId,
        type: 'payment_approved',
        title: 'Payment Received ✅',
        message: `${user?.name} has paid ₹${selectedPayment.amount.toLocaleString()} for ${selectedPayment.month} ${selectedPayment.year} rent.`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: selectedPayment.id,
      };
      notifications.push(ownerNotification);

      // Notify renter (confirmation)
      const renterNotification: Notification = {
        id: `notif_${Date.now() + 1}`,
        userId: user?.id || '',
        type: 'payment_approved',
        title: 'Payment Successful! ✅',
        message: `Your payment of ₹${selectedPayment.amount.toLocaleString()} for ${selectedPayment.month} ${selectedPayment.year} has been recorded as paid.`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: selectedPayment.id,
      };
      notifications.push(renterNotification);
      
      saveNotifications(notifications);

      toast({
        title: 'Payment Successful!',
        description: 'Your payment has been recorded and marked as paid.',
      });

      loadData();
    }

    setPayDialogOpen(false);
    setLoading(false);
  };

  const copyUpiId = () => {
    if (owner?.upiId) {
      navigator.clipboard.writeText(owner.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Copied!',
        description: 'UPI ID copied to clipboard.',
      });
    }
  };

  const canPay = (payment: Payment) => {
    return payment.status === 'pending' || payment.status === 'overdue';
  };

  if (!renterInfo) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="py-12 text-center">
          <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Connect with an owner to view your payments.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CreditCard className="w-6 h-6" />
        My Payments
      </h1>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <div className="py-12 text-center">
              <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No payments yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, index) => (
                    <TableRow 
                      key={payment.id}
                      className="animate-fade-in hover:bg-muted/50 transition-colors"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-medium">
                        {payment.month} {payment.year}
                      </TableCell>
                      <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {format(new Date(payment.dueDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={payment.status} />
                      </TableCell>
                      <TableCell>
                        {canPay(payment) && (
                          <Button
                            size="sm"
                            onClick={() => openPayDialog(payment)}
                            className="gap-1 hover:scale-105 transition-transform"
                          >
                            <IndianRupee className="w-4 h-4" />
                            Pay Rent
                          </Button>
                        )}
                        {payment.status === 'paid' && (
                          <span className="text-sm text-success flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Paid
                          </span>
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

      {/* Pay Dialog - Side by Side Layout */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Pay Rent
            </DialogTitle>
          </DialogHeader>
          {selectedPayment && owner && (
            <div className="space-y-4">
              {/* Amount Display */}
              <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                <p className="text-sm text-muted-foreground">Amount to Pay</p>
                <p className="text-4xl font-bold text-primary">
                  ₹{selectedPayment.amount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedPayment.month} {selectedPayment.year}
                </p>
              </div>

              {/* Side by Side Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Section 1: Pay Rent - QR & UPI Details */}
                <div className="space-y-4 p-4 border rounded-xl bg-muted/30 h-fit">
                  <h3 className="font-semibold text-sm flex items-center gap-2 text-primary">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</span>
                    Pay Rent
                  </h3>
                  
                  {/* QR Code */}
                  {owner.upiQrCode && (
                    <div className="text-center">
                      <p className="text-sm font-medium mb-3 flex items-center justify-center gap-2">
                        <QrCode className="w-4 h-4" />
                        Scan QR Code to Pay
                      </p>
                      <img
                        src={owner.upiQrCode}
                        alt="UPI QR Code"
                        className="w-40 h-40 mx-auto rounded-lg border bg-white p-2 shadow-sm"
                      />
                    </div>
                  )}

                  {/* UPI ID */}
                  {owner.upiId && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Or use UPI ID</p>
                      <div className="flex items-center justify-center gap-2">
                        <code className="px-3 py-2 bg-background rounded-lg text-sm font-mono border">
                          {owner.upiId}
                        </code>
                        <Button variant="outline" size="sm" onClick={copyUpiId}>
                          {copied ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {!owner.upiQrCode && !owner.upiId && (
                    <p className="text-sm text-muted-foreground text-center">
                      Owner has not set up payment details yet.
                    </p>
                  )}
                </div>

                {/* Section 2: Upload Payment Proof */}
                <div className="space-y-4 p-4 border rounded-xl bg-muted/30 h-fit">
                  <h3 className="font-semibold text-sm flex items-center gap-2 text-primary">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</span>
                    Upload Payment Proof
                  </h3>
                  
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative bg-background">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleProofUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click or drag to upload screenshot
                    </p>
                  </div>

                  {proofImage && (
                    <div className="animate-fade-in">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Preview:
                      </p>
                      <img
                        src={proofImage}
                        alt="Payment proof preview"
                        className="w-full max-h-48 object-contain rounded-lg border"
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleSubmitProof}
                    className="w-full gradient-primary text-white shadow-lg hover:shadow-xl transition-all"
                    disabled={!proofImage || loading}
                    size="lg"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                    )}
                    Submit Payment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RenterPayments;
