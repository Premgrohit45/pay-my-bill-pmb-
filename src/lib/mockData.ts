export type UserRole = 'owner' | 'renter' | 'admin';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  phone: string;
  email: string;
  address: string;
  upiId?: string;
  upiQrCode?: string;
}

export interface Renter {
  id: string;
  userId: string;
  ownerId: string | null;
  roomNumber: string;
  rentAmount: number;
  rentStartDate: string;
  numberOfPeople: number;
  numberOfRooms: number;
  dueDate: number;
  connectionStatus: 'pending' | 'accepted' | 'rejected';
  initiatedBy: 'owner' | 'renter';
  electricBill?: number;
  waterBill?: number;
  otherCharges?: number;
}

export interface Payment {
  id: string;
  renterId: string;
  ownerId: string;
  month: string;
  year: number;
  amount: number;
  dueDate: string;
  status: 'pending' | 'proof_submitted' | 'approved' | 'paid' | 'overdue';
  proofImage?: string;
  paidDate?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'connection_request' | 'payment_proof' | 'payment_approved' | 'payment_overdue' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

export const sampleUsers: User[] = [
  {
    id: 'admin1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    phone: '9000000000',
    email: 'admin@paymybill.com',
    address: 'Admin Office',
  },
  {
    id: 'owner1',
    username: 'owner1',
    password: 'owner123',
    role: 'owner',
    name: 'Rajesh Sharma',
    phone: '9876543210',
    email: 'rajesh@example.com',
    address: '123 Main Street, Mumbai',
    upiId: 'rajesh@upi',
    upiQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=rajesh@upi',
  },
  {
    id: 'renter1',
    username: 'renter1',
    password: 'renter123',
    role: 'renter',
    name: 'Ravi Kumar',
    phone: '9123456789',
    email: 'ravi@example.com',
    address: 'Room 101, Main Street',
  },
  {
    id: 'renter2',
    username: 'renter2',
    password: 'renter123',
    role: 'renter',
    name: 'Amit Singh',
    phone: '9987654321',
    email: 'amit@example.com',
    address: 'Room 102, Main Street',
  },
];

export const sampleRenters: Renter[] = [
  {
    id: 'r1',
    userId: 'renter1',
    ownerId: 'owner1',
    roomNumber: '101',
    rentAmount: 5000,
    rentStartDate: '2024-01-01',
    numberOfPeople: 2,
    numberOfRooms: 1,
    dueDate: 1,
    connectionStatus: 'accepted',
    initiatedBy: 'owner',
  },
  {
    id: 'r2',
    userId: 'renter2',
    ownerId: 'owner1',
    roomNumber: '102',
    rentAmount: 6000,
    rentStartDate: '2024-01-01',
    numberOfPeople: 1,
    numberOfRooms: 1,
    dueDate: 15,
    connectionStatus: 'accepted',
    initiatedBy: 'owner',
  },
];

const currentYear = new Date().getFullYear();

export const samplePayments: Payment[] = [
  // Ravi's payments
  {
    id: 'p1',
    renterId: 'renter1',
    ownerId: 'owner1',
    month: 'January',
    year: currentYear,
    amount: 5000,
    dueDate: `${currentYear}-01-01`,
    status: 'paid',
    paidDate: `${currentYear}-01-01`,
  },
  {
    id: 'p2',
    renterId: 'renter1',
    ownerId: 'owner1',
    month: 'February',
    year: currentYear,
    amount: 5000,
    dueDate: `${currentYear}-02-01`,
    status: 'pending',
  },
  {
    id: 'p3',
    renterId: 'renter1',
    ownerId: 'owner1',
    month: 'March',
    year: currentYear,
    amount: 5000,
    dueDate: `${currentYear}-03-01`,
    status: 'proof_submitted',
    proofImage: 'https://placehold.co/400x600/e2e8f0/1e293b?text=Payment+Proof',
  },
  // Amit's payments
  {
    id: 'p4',
    renterId: 'renter2',
    ownerId: 'owner1',
    month: 'January',
    year: currentYear,
    amount: 6000,
    dueDate: `${currentYear}-01-15`,
    status: 'paid',
    paidDate: `${currentYear}-01-14`,
  },
  {
    id: 'p5',
    renterId: 'renter2',
    ownerId: 'owner1',
    month: 'February',
    year: currentYear,
    amount: 6000,
    dueDate: `${currentYear}-02-15`,
    status: 'overdue',
  },
  {
    id: 'p6',
    renterId: 'renter2',
    ownerId: 'owner1',
    month: 'March',
    year: currentYear,
    amount: 6000,
    dueDate: `${currentYear}-03-15`,
    status: 'pending',
  },
];

export const sampleNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'owner1',
    type: 'payment_proof',
    title: 'Payment Proof Submitted',
    message: 'Ravi Kumar has submitted payment proof for March rent.',
    read: false,
    createdAt: new Date().toISOString(),
    relatedId: 'p3',
  },
  {
    id: 'n2',
    userId: 'owner1',
    type: 'payment_overdue',
    title: 'Payment Overdue',
    message: 'Amit Singh has not paid February rent. Payment is overdue.',
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    relatedId: 'p5',
  },
];

export const initializeData = () => {
  if (!localStorage.getItem('paymybill_initialized')) {
    localStorage.setItem('paymybill_users', JSON.stringify(sampleUsers));
    localStorage.setItem('paymybill_renters', JSON.stringify(sampleRenters));
    localStorage.setItem('paymybill_payments', JSON.stringify(samplePayments));
    localStorage.setItem('paymybill_notifications', JSON.stringify(sampleNotifications));
    localStorage.setItem('paymybill_initialized', 'true');
  }
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem('paymybill_users');
  return data ? JSON.parse(data) : sampleUsers;
};

export const getRenters = (): Renter[] => {
  const data = localStorage.getItem('paymybill_renters');
  return data ? JSON.parse(data) : sampleRenters;
};

export const getPayments = (): Payment[] => {
  const data = localStorage.getItem('paymybill_payments');
  return data ? JSON.parse(data) : samplePayments;
};

export const getNotifications = (): Notification[] => {
  const data = localStorage.getItem('paymybill_notifications');
  return data ? JSON.parse(data) : sampleNotifications;
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem('paymybill_users', JSON.stringify(users));
};

export const saveRenters = (renters: Renter[]) => {
  localStorage.setItem('paymybill_renters', JSON.stringify(renters));
};

export const savePayments = (payments: Payment[]) => {
  localStorage.setItem('paymybill_payments', JSON.stringify(payments));
};

export const saveNotifications = (notifications: Notification[]) => {
  localStorage.setItem('paymybill_notifications', JSON.stringify(notifications));
};
