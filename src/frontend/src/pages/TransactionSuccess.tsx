import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function TransactionSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-card/30">
      <Card className="max-w-md mx-4 border-emerald/30">
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald/10 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Purchase Successful!</h1>
            <p className="text-muted-foreground">
              Your transaction has been completed successfully. You can view it in your transaction history.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={() => navigate({ to: '/transaction-history' })} variant="outline" className="flex-1">
              View Transactions
            </Button>
            <Button
              onClick={() => navigate({ to: '/' })}
              className="flex-1 bg-gradient-to-r from-gold to-emerald hover:opacity-90 text-background font-semibold"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
