import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Trash2, History, Users, Edit, Mail, UserPlus } from 'lucide-react';
import {
  getUsers,
  getRenters,
  getPayments,
  saveRenters,
  savePayments,
  User,
  Renter,
  Payment,
} from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { AddRenterForm } from '@/components/AddRenterForm';
import { SendRenterRequest } from '@/components/SendRenterRequest';
import { EditRenterDetails } from '@/components/EditRenterDetails';
import { PaymentStatusBadge } from '@/components/PaymentStatusBadge';

const ManageRenters = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [renters, setRenters] = useState<Renter[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [addRenterOpen, setAddRenterOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRenter, setSelectedRenter] = useState<Renter | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    setRenters(getRenters().filter(r => r.ownerId === user?.id));
    setUsers(getUsers());
    setPayments(getPayments().filter(p => p.ownerId === user?.id));
  };

  const getRenterUser = (renterId: string): User | undefined => {
    return users.find(u => u.id === renterId);
  };

  const handleDelete = (renter: Renter) => {
    // Delete renter
    const allRenters = getRenters();
    const renterIndex = allRenters.findIndex(r => r.id === renter.id);
    if (renterIndex !== -1) {
      allRenters.splice(renterIndex, 1);
      saveRenters(allRenters);
    }

    // Also delete related payments
    const allPayments = getPayments();
    const filteredPayments = allPayments.filter(p => p.renterId !== renter.userId);
    savePayments(filteredPayments);

    loadData();
    toast({
      title: 'Renter Removed',
      description: 'The renter and their payments have been removed.',
    });
  };

  const viewHistory = (renter: Renter) => {
    setSelectedRenter(renter);
    setHistoryOpen(true);
  };

  const editDetails = (renter: Renter) => {
    setSelectedRenter(renter);
    setEditOpen(true);
  };

  const getRenterPayments = (renterId: string): Payment[] => {
    return payments.filter(p => p.renterId === renterId);
  };

  const getConnectionStatusBadge = (status: Renter['connectionStatus']) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success">Active</Badge>;
      case 'pending':
        return <Badge variant="warning">Awaiting Response</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" />
          Manage Renters
        </h1>
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
      </div>

      <Card>
        <CardContent className="p-0">
          {renters.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No renters yet.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setAddRenterOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Renter
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renters.map((renter) => {
                    const renterUser = getRenterUser(renter.userId);
                    return (
                      <TableRow key={renter.id}>
                        <TableCell className="font-medium">
                          {renterUser?.name || 'Unknown'}
                        </TableCell>
                        <TableCell>{renterUser?.phone || '-'}</TableCell>
                        <TableCell>{renter.roomNumber}</TableCell>
                        <TableCell>₹{renter.rentAmount.toLocaleString()}</TableCell>
                        <TableCell>{renter.dueDate}th</TableCell>
                        <TableCell>
                          {getConnectionStatusBadge(renter.connectionStatus)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {renter.connectionStatus === 'accepted' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => editDetails(renter)}
                                title="Edit Details"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewHistory(renter)}
                              title="Payment History"
                            >
                              <History className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(renter)}
                              title="Remove Renter"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History Dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Payment History - {getRenterUser(selectedRenter?.userId || '')?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedRenter && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Room</p>
                  <p className="font-medium">{selectedRenter.roomNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Monthly Rent</p>
                  <p className="font-medium">₹{selectedRenter.rentAmount.toLocaleString()}</p>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getRenterPayments(selectedRenter.userId).map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.month} {payment.year}</TableCell>
                        <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={payment.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Renter Details Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Edit Details - {getRenterUser(selectedRenter?.userId || '')?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedRenter && (
            <EditRenterDetails
              renter={selectedRenter}
              renterName={getRenterUser(selectedRenter.userId)?.name || 'Unknown'}
              onSuccess={() => {
                setEditOpen(false);
                loadData();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageRenters;
