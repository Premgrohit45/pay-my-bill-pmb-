import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import {
  getRenters,
  saveRenters,
  getPayments,
  savePayments,
  Renter,
  Payment,
} from '@/lib/mockData';

interface EditRenterDetailsProps {
  renter: Renter;
  renterName: string;
  onSuccess: () => void;
}

export const EditRenterDetails = ({ renter, renterName, onSuccess }: EditRenterDetailsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: renter.roomNumber || '',
    rentAmount: renter.rentAmount?.toString() || '',
    numberOfPeople: renter.numberOfPeople?.toString() || '1',
    numberOfRooms: renter.numberOfRooms?.toString() || '1',
    dueDate: renter.dueDate?.toString() || '1',
    electricBill: renter.electricBill?.toString() || '',
    waterBill: renter.waterBill?.toString() || '',
    otherCharges: renter.otherCharges?.toString() || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    const renters = getRenters();
    const index = renters.findIndex(r => r.id === renter.id);

    if (index !== -1) {
      renters[index] = {
        ...renters[index],
        roomNumber: formData.roomNumber,
        rentAmount: parseInt(formData.rentAmount) || 0,
        numberOfPeople: parseInt(formData.numberOfPeople) || 1,
        numberOfRooms: parseInt(formData.numberOfRooms) || 1,
        dueDate: parseInt(formData.dueDate) || 1,
        electricBill: formData.electricBill ? parseInt(formData.electricBill) : undefined,
        waterBill: formData.waterBill ? parseInt(formData.waterBill) : undefined,
        otherCharges: formData.otherCharges ? parseInt(formData.otherCharges) : undefined,
      };
      saveRenters(renters);

      // Create initial payment if rent amount is set and no payments exist
      const payments = getPayments();
      const existingPayments = payments.filter(p => p.renterId === renter.userId);
      
      if (parseInt(formData.rentAmount) > 0 && existingPayments.length === 0) {
        const currentDate = new Date();
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        const dueDay = parseInt(formData.dueDate) || 1;
        const dueDate = new Date(year, currentDate.getMonth(), dueDay);

        const totalAmount = 
          (parseInt(formData.rentAmount) || 0) +
          (parseInt(formData.electricBill) || 0) +
          (parseInt(formData.waterBill) || 0) +
          (parseInt(formData.otherCharges) || 0);

        const newPayment: Payment = {
          id: `payment_${Date.now()}`,
          renterId: renter.userId,
          ownerId: renter.ownerId!,
          month: month,
          year: year,
          amount: totalAmount,
          dueDate: dueDate.toISOString().split('T')[0],
          status: 'pending',
        };
        payments.push(newPayment);
        savePayments(payments);
      }

      toast({
        title: 'Details Updated',
        description: `${renterName}'s details have been updated.`,
      });

      onSuccess();
    }

    setLoading(false);
  };

  const totalRent = 
    (parseInt(formData.rentAmount) || 0) +
    (parseInt(formData.electricBill) || 0) +
    (parseInt(formData.waterBill) || 0) +
    (parseInt(formData.otherCharges) || 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="roomNumber">Room Number</Label>
          <Input
            id="roomNumber"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            placeholder="e.g., 101"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rentAmount">Base Rent (₹)</Label>
          <Input
            id="rentAmount"
            name="rentAmount"
            type="number"
            value={formData.rentAmount}
            onChange={handleChange}
            placeholder="Monthly rent"
            required
            min={1}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numberOfPeople">People</Label>
          <Input
            id="numberOfPeople"
            name="numberOfPeople"
            type="number"
            value={formData.numberOfPeople}
            onChange={handleChange}
            min={1}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numberOfRooms">Rooms</Label>
          <Input
            id="numberOfRooms"
            name="numberOfRooms"
            type="number"
            value={formData.numberOfRooms}
            onChange={handleChange}
            min={1}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Day</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="number"
            value={formData.dueDate}
            onChange={handleChange}
            min={1}
            max={31}
            required
          />
        </div>
      </div>

      <div className="pt-2 border-t">
        <p className="text-sm text-muted-foreground mb-3">Additional Charges</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="electricBill">Electric (₹)</Label>
            <Input
              id="electricBill"
              name="electricBill"
              type="number"
              value={formData.electricBill}
              onChange={handleChange}
              placeholder="0"
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waterBill">Water (₹)</Label>
            <Input
              id="waterBill"
              name="waterBill"
              type="number"
              value={formData.waterBill}
              onChange={handleChange}
              placeholder="0"
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="otherCharges">Other (₹)</Label>
            <Input
              id="otherCharges"
              name="otherCharges"
              type="number"
              value={formData.otherCharges}
              onChange={handleChange}
              placeholder="0"
              min={0}
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Monthly Rent</span>
          <span className="text-2xl font-bold text-primary">₹{totalRent.toLocaleString()}</span>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        <Save className="w-4 h-4 mr-2" />
        Save Details
      </Button>
    </form>
  );
};
