import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  className?: string;
  iconClassName?: string;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  className,
  iconClassName,
  trend,
  subtitle,
}: StatCardProps) => {
  return (
    <Card className={cn(
      'group relative overflow-hidden glass border-border/50 hover:border-primary/30 transition-all duration-500 animate-fade-in',
      className
    )}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <CardContent className="p-5 md:p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase">
              {title}
            </p>
            <p className="text-3xl md:text-4xl font-bold font-space tracking-tight">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div
            className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow',
              iconClassName || 'gradient-primary text-primary-foreground'
            )}
          >
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className={cn(
            'mt-3 inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
            trend === 'up' && 'bg-success/10 text-success',
            trend === 'down' && 'bg-destructive/10 text-destructive',
            trend === 'neutral' && 'bg-muted text-muted-foreground'
          )}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trend === 'neutral' && '→'}
            <span>vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
