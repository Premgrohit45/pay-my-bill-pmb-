import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  getUsers,
  getRenters,
  getPayments,
  saveUsers,
  saveRenters,
  savePayments,
  saveNotifications,
  getNotifications,
  User,
  Renter,
  Payment,
  Notification,
} from '@/lib/mockData';

interface AddRenterFormProps {
  ownerId: string;
  onSuccess: () => void;
}

export const AddRenterForm = ({ ownerId, onSuccess }: AddRenterFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    roomNumber: '',
    rentAmount: '',
    rentStartDate: '',
    numberOfPeople: '1',
    numberOfRooms: '1',
    dueDate: '1',
    electricBill: '',
    waterBill: '',
    otherCharges: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if renter with this phone/email already exists
    const users = getUsers();
    let existingUser = users.find(
      u => u.phone === formData.phone || u.email === formData.email
    );

    // Create new user if not exists
    if (!existingUser) {
      existingUser = {
        id: `user_${Date.now()}`,
        username: formData.email.split('@')[0] + Date.now(),
        password: 'renter123',
        role: 'renter',
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: `Room ${formData.roomNumber}`,
      };
      users.push(existingUser);
      saveUsers(users);
    }

    // Create renter connection
    const renters = getRenters();
    const newRenter: Renter = {
      id: `renter_${Date.now()}`,
      userId: existingUser.id,
      ownerId: ownerId,
      roomNumber: formData.roomNumber,
      rentAmount: parseInt(formData.rentAmount),
      rentStartDate: formData.rentStartDate,
      numberOfPeople: parseInt(formData.numberOfPeople),
      numberOfRooms: parseInt(formData.numberOfRooms),
      dueDate: parseInt(formData.dueDate),
      connectionStatus: 'accepted',
      initiatedBy: 'owner',
      electricBill: formData.electricBill ? parseInt(formData.electricBill) : undefined,
      waterBill: formData.waterBill ? parseInt(formData.waterBill) : undefined,
      otherCharges: formData.otherCharges ? parseInt(formData.otherCharges) : undefined,
    };
    renters.push(newRenter);
    saveRenters(renters);

    // Create payment for current month only (not 3 times)
    const payments = getPayments();
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    const dueDay = parseInt(formData.dueDate);
    const dueDate = new Date(year, currentDate.getMonth(), dueDay);

    const newPayment: Payment = {
      id: `payment_${Date.now()}`,
      renterId: existingUser.id,
      ownerId: ownerId,
      month: month,
      year: year,
      amount: parseInt(formData.rentAmount),
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'pending',
    };
    payments.push(newPayment);
    savePayments(payments);

    // Create notification for renter
    const notifications = getNotifications();
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      userId: existingUser.id,
      type: 'connection_request',
      title: 'Connected to Owner',
      message: 'You have been added as a renter. Check your payments.',
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.push(newNotification);
    saveNotifications(notifications);

    toast({
      title: 'Renter Added',
      description: `${formData.name} has been added successfully.`,
    });

    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Renter Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (10 digits)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit number"
            required
            maxLength={10}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email address"
          required
        />
      </div>

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
          <Label htmlFor="rentAmount">Rent Amount (₹)</Label>
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

      <div className="space-y-2">
        <Label htmlFor="rentStartDate">Rent Start Date</Label>
        <Input
          id="rentStartDate"
          name="rentStartDate"
          type="date"
          value={formData.rentStartDate}
          onChange={handleChange}
          required
        />
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

      {/* Optional Bills */}
      <div className="pt-2 border-t">
        <p className="text-sm text-muted-foreground mb-3">Optional Charges</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="electricBill">Electric Bill (₹)</Label>
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
            <Label htmlFor="waterBill">Water Bill (₹)</Label>
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

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        Add Renter
      </Button>
    </form>
  );
};
