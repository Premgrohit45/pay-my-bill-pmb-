import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  HelpCircle,
  UserPlus,
  Send,
  CheckCircle,
  CreditCard,
  Upload,
  Bell,
  Home,
  User,
  ArrowRight,
  QrCode,
  FileText,
} from 'lucide-react';

interface Step {
  icon: React.ElementType;
  title: string;
  description: string;
  forRole: 'owner' | 'renter' | 'both';
}

const ownerSteps: Step[] = [
  {
    icon: UserPlus,
    title: '1. Add a Renter',
    description: 'Go to Dashboard → Add Renter. Enter the renter\'s name and email, then click "Send Request".',
    forRole: 'owner',
  },
  {
    icon: Send,
    title: '2. Wait for Acceptance',
    description: 'The renter will receive your request in their dashboard. Once they accept, you\'ll be notified.',
    forRole: 'owner',
  },
  {
    icon: FileText,
    title: '3. Complete Renter Details',
    description: 'After acceptance, go to Manage Renters → Edit to add room number, rent amount, due date, and other charges.',
    forRole: 'owner',
  },
  {
    icon: QrCode,
    title: '4. Add Bank Details',
    description: 'Go to Profile → Bank Details. Add your UPI ID and upload QR code so renters can pay you.',
    forRole: 'owner',
  },
  {
    icon: Bell,
    title: '5. Track Payments',
    description: 'View payment status on your Dashboard. You\'ll get notifications when renters submit payment proof.',
    forRole: 'owner',
  },
  {
    icon: CheckCircle,
    title: '6. Approve Payments',
    description: 'Review submitted payment proofs in Manage Renters → Payment History and approve them.',
    forRole: 'owner',
  },
];

const renterSteps: Step[] = [
  {
    icon: Bell,
    title: '1. Accept Owner Request',
    description: 'When an owner sends you a request, you\'ll see it on your Dashboard. Click "Accept" to connect.',
    forRole: 'renter',
  },
  {
    icon: Home,
    title: '2. View Owner Details',
    description: 'After connecting, go to "My Owner" to see owner\'s profile, bank details, and payment QR code.',
    forRole: 'renter',
  },
  {
    icon: CreditCard,
    title: '3. Make Payment',
    description: 'Go to Payments → Click "Pay Rent" on pending payment. Use the QR code or UPI ID shown.',
    forRole: 'renter',
  },
  {
    icon: Upload,
    title: '4. Upload Proof',
    description: 'After paying, upload a screenshot of your payment. This sends proof to your owner for approval.',
    forRole: 'renter',
  },
  {
    icon: CheckCircle,
    title: '5. Track Status',
    description: 'View your payment history and status on the Dashboard. You\'ll be notified when payment is approved.',
    forRole: 'renter',
  },
];

interface HowToUseProps {
  role: 'owner' | 'renter';
}

export const HowToUse = ({ role }: HowToUseProps) => {
  const [open, setOpen] = useState(false);
  const steps = role === 'owner' ? ownerSteps : renterSteps;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/10 transition-all">
          <HelpCircle className="w-4 h-4" />
          How to Use
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              {role === 'owner' ? (
                <Home className="w-5 h-5 text-primary-foreground" />
              ) : (
                <User className="w-5 h-5 text-primary-foreground" />
              )}
            </div>
            {role === 'owner' ? 'Owner Guide' : 'Renter Guide'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors animate-fade-in group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Need more help? Contact support
          </p>
          <Button size="sm" onClick={() => setOpen(false)}>
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
