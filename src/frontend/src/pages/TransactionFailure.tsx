import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

export default function TransactionFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-card/30">
      <Card className="max-w-md mx-4 border-destructive/30">
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="w-12 h-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Transaction Failed</h1>
            <p className="text-muted-foreground">
              We couldn't complete your purchase. Please try again or contact support if the problem persists.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={() => navigate({ to: '/' })} variant="outline" className="flex-1">
              Back to Browse
            </Button>
            <Button
              onClick={() => window.history.back()}
              className="flex-1 bg-gradient-to-r from-gold to-emerald hover:opacity-90 text-background font-semibold"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
