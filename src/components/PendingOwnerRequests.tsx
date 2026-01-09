import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Building, UserPlus } from 'lucide-react';
import {
  getUsers,
  getRenters,
  saveRenters,
  saveNotifications,
  getNotifications,
  User,
  Renter,
  Notification,
} from '@/lib/mockData';

interface PendingOwnerRequestsProps {
  onAccept?: () => void;
}

export const PendingOwnerRequests = ({ onAccept }: PendingOwnerRequestsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingRequests, setPendingRequests] = useState<Renter[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    const allUsers = getUsers();
    const renters = getRenters();
    
    // Find pending requests initiated by owners for this renter
    const pending = renters.filter(
      r => r.userId === user?.id && 
           r.connectionStatus === 'pending' && 
           r.initiatedBy === 'owner'
    );
    
    setPendingRequests(pending);
    setUsers(allUsers);
  };

  const getOwnerName = (ownerId: string | null) => {
    if (!ownerId) return 'Unknown Owner';
    const owner = users.find(u => u.id === ownerId);
    return owner?.name || 'Unknown Owner';
  };

  const getOwnerDetails = (ownerId: string | null) => {
    if (!ownerId) return null;
    return users.find(u => u.id === ownerId);
  };

  const handleAccept = (renter: Renter) => {
    const renters = getRenters();
    const index = renters.findIndex(r => r.id === renter.id);
    
    if (index !== -1) {
      renters[index].connectionStatus = 'accepted';
      saveRenters(renters);

      // Notify owner
      const notifications = getNotifications();
      const newNotification: Notification = {
        id: `notif_${Date.now()}`,
        userId: renter.ownerId!,
        type: 'connection_request',
        title: 'Renter Accepted',
        message: `${user?.name} has accepted your connection request. Please add their room details.`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: renter.id,
      };
      notifications.push(newNotification);
      saveNotifications(notifications);

      toast({
        title: 'Request Accepted',
        description: `You are now connected with ${getOwnerName(renter.ownerId)}.`,
      });

      loadData();
      onAccept?.();
    }
  };

  const handleReject = (renter: Renter) => {
    const renters = getRenters();
    const index = renters.findIndex(r => r.id === renter.id);
    
    if (index !== -1) {
      renters[index].connectionStatus = 'rejected';
      saveRenters(renters);

      // Notify owner
      const notifications = getNotifications();
      const newNotification: Notification = {
        id: `notif_${Date.now()}`,
        userId: renter.ownerId!,
        type: 'connection_request',
        title: 'Request Declined',
        message: `${user?.name} has declined your connection request.`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: renter.id,
      };
      notifications.push(newNotification);
      saveNotifications(notifications);

      toast({
        title: 'Request Declined',
        description: 'The connection request has been declined.',
      });

      loadData();
    }
  };

  if (pendingRequests.length === 0) {
    return null;
  }

  return (
    <Card className="relative overflow-hidden border-warning/50 bg-gradient-to-br from-warning/5 to-transparent animate-fade-in group hover:border-warning transition-all duration-500">
      <div className="absolute top-0 left-0 right-0 h-1 bg-warning animate-glow-pulse" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-warning/10 rounded-full blur-2xl group-hover:bg-warning/20 transition-colors" />
      
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-space">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center animate-bounce-subtle">
            <UserPlus className="w-5 h-5 text-warning" />
          </div>
          Pending Owner Requests
          <Badge variant="warning" className="ml-auto animate-pulse">
            {pendingRequests.length} pending
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        {pendingRequests.map((request, index) => {
          const owner = getOwnerDetails(request.ownerId);
          return (
            <div
              key={request.id}
              className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-glow-sm animate-float">
                  <Building className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{owner?.name || 'Unknown Owner'}</p>
                  <p className="text-sm text-muted-foreground">
                    {owner?.email} • {owner?.phone}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    📍 {owner?.address}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => handleAccept(request)}
                  className="flex-1 gradient-primary shadow-glow hover:shadow-glow-lg transition-all group"
                  variant="default"
                >
                  <Check className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Accept Request
                </Button>
                <Button
                  onClick={() => handleReject(request)}
                  className="flex-1"
                  variant="outline"
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
