import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, QrCode, Save, Loader2 } from 'lucide-react';

const OwnerProfile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState(user?.upiId || '');
  const [qrPreview, setQrPreview] = useState(user?.upiQrCode || '');

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate QR code URL if UPI ID provided but no custom QR
    let qrCode = qrPreview;
    if (upiId && !qrPreview.startsWith('data:')) {
      qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${encodeURIComponent(upiId)}`;
    }

    updateUser({
      upiId,
      upiQrCode: qrCode,
    });

    toast({
      title: 'Profile Updated',
      description: 'Your payment details have been saved.',
    });
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <User className="w-6 h-6" />
        Profile
      </h1>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Username</Label>
              <p className="font-medium">{user?.username}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Phone</Label>
              <p className="font-medium">{user?.phone}</p>
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">Address</Label>
            <p className="font-medium">{user?.address}</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g., yourname@upi"
            />
            <p className="text-xs text-muted-foreground">
              Your renters will use this to pay rent
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qrCode">UPI QR Code</Label>
            <Input
              id="qrCode"
              type="file"
              accept="image/*"
              onChange={handleQrUpload}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Upload your payment QR code (optional - we'll generate one from UPI ID)
            </p>
          </div>

          {(qrPreview || upiId) && (
            <div className="flex justify-center p-4 bg-muted rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">QR Code Preview</p>
                <img
                  src={qrPreview || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${encodeURIComponent(upiId)}`}
                  alt="UPI QR Code"
                  className="w-48 h-48 mx-auto rounded-lg border bg-white"
                />
                {upiId && (
                  <p className="mt-2 text-sm font-medium">{upiId}</p>
                )}
              </div>
            </div>
          )}

          <Button onClick={handleSave} className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerProfile;
