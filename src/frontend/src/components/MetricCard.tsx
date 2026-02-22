import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  accentColor?: 'gold' | 'emerald';
}

export default function MetricCard({ label, value, icon: Icon, trend, accentColor = 'gold' }: MetricCardProps) {
  const borderColor = accentColor === 'gold' ? 'border-gold/30' : 'border-emerald/30';
  const iconColor = accentColor === 'gold' ? 'text-gold' : 'text-emerald';

  return (
    <Card className={`border-2 ${borderColor} bg-card/50 backdrop-blur-sm`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && <p className="text-xs text-emerald">{trend}</p>}
          </div>
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${accentColor}/20 to-${accentColor}/10 flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
