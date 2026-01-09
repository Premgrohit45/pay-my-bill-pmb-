import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Link2, Mail } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getUsers,
  getRenters,
  saveUsers,
  saveRenters,
  saveNotifications,
  getNotifications,
  User,
  Renter,
  Notification,
} from '@/lib/mockData';

interface SendRenterRequestProps {
  ownerId: string;
  onSuccess: () => void;
}

export const SendRenterRequest = ({ ownerId, onSuccess }: SendRenterRequestProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [generatedLink, setGeneratedLink] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getUsers();
    let existingUser = users.find(u => u.email === formData.email);

    // Create new user if not exists
    if (!existingUser) {
      existingUser = {
        id: `user_${Date.now()}`,
        username: formData.email.split('@')[0] + Date.now(),
        password: 'renter123',
        role: 'renter',
        name: formData.name,
        phone: '',
        email: formData.email,
        address: '',
      };
      users.push(existingUser);
      saveUsers(users);
    }

    // Check if already connected
    const renters = getRenters();
    const existingConnection = renters.find(
      r => r.userId === existingUser!.id && r.ownerId === ownerId
    );

    if (existingConnection) {
      toast({
        title: 'Already Connected',
        description: 'This renter is already connected or has a pending request.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // Create pending connection initiated by owner
    const newRenter: Renter = {
      id: `renter_${Date.now()}`,
      userId: existingUser.id,
      ownerId: ownerId,
      roomNumber: '',
      rentAmount: 0,
      rentStartDate: new Date().toISOString().split('T')[0],
      numberOfPeople: 1,
      numberOfRooms: 1,
      dueDate: 1,
      connectionStatus: 'pending',
      initiatedBy: 'owner',
    };
    renters.push(newRenter);
    saveRenters(renters);

    // Get owner name for notification
    const owner = users.find(u => u.id === ownerId);

    // Create notification for renter
    const notifications = getNotifications();
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      userId: existingUser.id,
      type: 'connection_request',
      title: 'New Owner Request',
      message: `${owner?.name || 'A property owner'} wants to add you as their renter.`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: newRenter.id,
    };
    notifications.push(newNotification);
    saveNotifications(notifications);

    toast({
      title: 'Request Sent',
      description: `Connection request sent to ${formData.name}.`,
    });

    setFormData({ name: '', email: '' });
    setLoading(false);
    onSuccess();
  };

  const handleGenerateLink = () => {
    // In a real app, this would generate a unique invite link
    const mockLink = `${window.location.origin}/register?invite=${ownerId}`;
    setGeneratedLink(mockLink);
    navigator.clipboard.writeText(mockLink);
    toast({
      title: 'Link Copied!',
      description: 'Share this link with your renter to invite them.',
    });
  };

  return (
    <Tabs defaultValue="send" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="send" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Send Request
        </TabsTrigger>
        <TabsTrigger value="link" className="flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          Generate Link
        </TabsTrigger>
      </TabsList>

      <TabsContent value="send" className="mt-4">
        <form onSubmit={handleSendRequest} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Renter Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter renter's name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Renter Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter renter's email"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send Connection Request
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            The renter will receive a notification to accept your request.
          </p>
        </form>
      </TabsContent>

      <TabsContent value="link" className="mt-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          Generate a unique invite link that you can share with your renter. When they register using this link, they'll automatically be connected to you.
        </p>

        <Button onClick={handleGenerateLink} className="w-full">
          <Link2 className="w-4 h-4 mr-2" />
          Generate & Copy Invite Link
        </Button>

        {generatedLink && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Generated Link:</p>
            <p className="text-sm font-mono break-all">{generatedLink}</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
