import { Badge } from '@/components/ui/badge';
import { Payment } from '@/lib/mockData';

interface PaymentStatusBadgeProps {
  status: Payment['status'];
}

const statusConfig = {
  pending: { label: 'Pending', variant: 'pending' as const },
  proof_submitted: { label: 'Proof Submitted', variant: 'proof' as const },
  approved: { label: 'Approved', variant: 'success' as const },
  paid: { label: 'Paid', variant: 'success' as const },
  overdue: { label: 'Overdue', variant: 'destructive' as const },
};

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
