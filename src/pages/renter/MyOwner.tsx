import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Phone, Mail, MapPin, QrCode, CreditCard, Banknote, Copy, Check, Sparkles, Calendar, Users, Home, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  getUsers,
  getRenters,
  User,
  Renter,
} from '@/lib/mockData';

const MyOwner = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [owner, setOwner] = useState<User | null>(null);
  const [renterInfo, setRenterInfo] = useState<Renter | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    const users = getUsers();
    const renters = getRenters();

    const myRenterInfo = renters.find(r => r.userId === user?.id && r.connectionStatus === 'accepted');
    setRenterInfo(myRenterInfo || null);

    if (myRenterInfo?.ownerId) {
      const ownerUser = users.find(u => u.id === myRenterInfo.ownerId);
      setOwner(ownerUser || null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'UPI ID copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // If not connected
  if (!renterInfo || !owner) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-3 font-space animate-fade-in">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Building className="w-5 h-5 text-primary-foreground" />
          </div>
          My Owner
        </h1>

        <Card className="relative overflow-hidden glass border-warning/30 animate-fade-in stagger-1">
          <div className="absolute top-0 left-0 right-0 h-1 bg-warning" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-warning/10 rounded-full blur-3xl" />
          
          <CardContent className="py-12 text-center relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-warning/10 flex items-center justify-center animate-float">
              <Building className="w-10 h-10 text-warning" />
            </div>
            <h2 className="text-2xl font-bold font-space mb-3">No Owner Connected</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You're not connected to any property owner yet. Your owner needs to send you a connection request.
            </p>
            <Badge variant="warning" className="px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Waiting for Owner Request
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Connected state - show owner details
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-3 font-space animate-fade-in">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <Building className="w-5 h-5 text-primary-foreground" />
        </div>
        My Owner
      </h1>

      {/* Owner Details Card */}
      <Card className="relative overflow-hidden glass border-border/50 hover:border-primary/30 transition-all duration-500 animate-fade-in stagger-1">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 font-space">
              <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center">
                <Building className="w-5 h-5 text-secondary-foreground" />
              </div>
              Owner Details
            </CardTitle>
            <Badge className="bg-success/10 text-success border-success/30 px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
              Connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow-sm animate-float">
              <Building className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold font-space">{owner.name}</p>
              <p className="text-muted-foreground">Property Owner</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                <p className="font-medium">{owner.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="font-medium">{owner.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors md:col-span-2">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Address</p>
                <p className="font-medium">{owner.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information Card */}
      {(owner.upiQrCode || owner.upiId) && (
        <Card className="relative overflow-hidden glass border-border/50 hover:border-secondary/30 transition-all duration-500 animate-fade-in stagger-2">
          <div className="absolute top-0 left-0 right-0 h-1 gradient-secondary" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
          
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-space">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-accent-foreground" />
              </div>
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              {/* QR Code */}
              {owner.upiQrCode && (
                <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 gradient-primary blur-xl opacity-30 rounded-2xl" />
                    <img
                      src={owner.upiQrCode}
                      alt="UPI QR Code"
                      className="w-48 h-48 rounded-2xl border-4 border-background shadow-xl relative z-10 bg-card"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <QrCode className="w-4 h-4" />
                    Scan to Pay
                  </p>
                </div>
              )}

              {/* UPI Details */}
              <div className="space-y-4">
                {owner.upiId && (
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-all">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Banknote className="w-4 h-4" />
                      UPI ID
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="font-mono text-lg font-semibold text-primary flex-1">{owner.upiId}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(owner.upiId!)}
                        className="shrink-0"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
                  <p className="text-sm font-medium text-success flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Quick Payment Methods
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-background">Google Pay</Badge>
                    <Badge variant="outline" className="bg-background">PhonePe</Badge>
                    <Badge variant="outline" className="bg-background">Paytm</Badge>
                    <Badge variant="outline" className="bg-background">BHIM</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Room Details Card */}
      <Card className="relative overflow-hidden glass border-border/50 hover:border-accent/30 transition-all duration-500 animate-fade-in stagger-3">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-accent" />
        
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-space">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Home className="w-5 h-5 text-accent" />
            </div>
            My Room Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all group">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Room</p>
              <p className="text-xl font-bold font-space text-primary">{renterInfo.roomNumber || '-'}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 hover:border-secondary/40 transition-all group">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <IndianRupee className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Rent</p>
              <p className="text-xl font-bold font-space text-secondary">₹{renterInfo.rentAmount.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-all group">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Due Date</p>
              <p className="text-xl font-bold font-space text-accent">{renterInfo.dueDate}th</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20 hover:border-success/40 transition-all group">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-success" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">People</p>
              <p className="text-xl font-bold font-space text-success">{renterInfo.numberOfPeople}</p>
            </div>
          </div>

          {/* Additional Charges */}
          {(renterInfo.electricBill || renterInfo.waterBill || renterInfo.otherCharges) && (
            <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border/50">
              <p className="text-sm font-medium mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Additional Charges
              </p>
              <div className="grid grid-cols-3 gap-4">
                {renterInfo.electricBill && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Electric</p>
                    <p className="font-semibold">₹{renterInfo.electricBill}</p>
                  </div>
                )}
                {renterInfo.waterBill && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Water</p>
                    <p className="font-semibold">₹{renterInfo.waterBill}</p>
                  </div>
                )}
                {renterInfo.otherCharges && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Other</p>
                    <p className="font-semibold">₹{renterInfo.otherCharges}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyOwner;