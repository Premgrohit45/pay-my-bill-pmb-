import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Upload, QrCode, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getUsers,
  saveUsers,
  User,
} from '@/lib/mockData';

interface OwnerBankDetailsProps {
  owner: User;
  onUpdate: () => void;
}

export const OwnerBankDetails = ({ owner, onUpdate }: OwnerBankDetailsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    upiId: owner.upiId || '',
    bankName: (owner as any).bankName || '',
    accountNumber: (owner as any).accountNumber || '',
    ifscCode: (owner as any).ifscCode || '',
  });
  const [qrPreview, setQrPreview] = useState(owner.upiQrCode || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setQrPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    const users = getUsers();
    const index = users.findIndex(u => u.id === owner.id);

    if (index !== -1) {
      users[index] = {
        ...users[index],
        upiId: formData.upiId,
        upiQrCode: qrPreview,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
      } as any;
      saveUsers(users);

      toast({
        title: 'Bank Details Updated',
        description: 'Your payment details have been saved.',
      });

      onUpdate();
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              placeholder="yourname@upi"
            />
          </div>

          <div className="space-y-2">
            <Label>UPI QR Code</Label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleQrUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload your payment QR code image
                </p>
              </div>
              {qrPreview && (
                <div className="w-24 h-24 rounded-lg border overflow-hidden bg-white">
                  <img
                    src={qrPreview}
                    alt="QR Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">Bank Account Details (Optional)</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="e.g., State Bank of India"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Account number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    placeholder="IFSC code"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            <Save className="w-4 h-4 mr-2" />
            Save Payment Details
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
