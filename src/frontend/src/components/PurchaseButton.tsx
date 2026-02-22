import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateTransaction } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ProductListing } from '../backend';
import { Principal } from '@dfinity/principal';
import { formatPrice } from '../lib/utils';

interface PurchaseButtonProps {
  listing: ProductListing;
}

export default function PurchaseButton({ listing }: PurchaseButtonProps) {
  const { identity } = useInternetIdentity();
  const createTransaction = useCreateTransaction();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = !!identity;
  const commission = listing.price / BigInt(10); // 10% commission

  const handlePurchase = async () => {
    if (!identity) {
      toast.error('Please log in to make a purchase');
      return;
    }

    try {
      const buyer = identity.getPrincipal();
      await createTransaction.mutateAsync({
        buyer,
        seller: listing.seller,
        amount: listing.price,
        commission,
      });
      toast.success('Purchase successful!');
      navigate({ to: '/transaction-success' });
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error(error.message || 'Purchase failed');
      navigate({ to: '/transaction-failure' });
    }
  };

  if (!isAuthenticated) {
    return (
      <Button size="lg" className="w-full bg-gradient-to-r from-gold to-emerald hover:opacity-90 text-background font-semibold" disabled>
        <ShoppingCart className="w-5 h-5 mr-2" />
        Login to Purchase
      </Button>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="w-full bg-gradient-to-r from-gold to-emerald hover:opacity-90 text-background font-semibold">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Purchase Now
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to purchase this item?</p>
            <div className="mt-4 space-y-1 text-foreground">
              <p className="font-semibold">{listing.title}</p>
              <p className="text-sm">Price: {formatPrice(listing.price)}</p>
              <p className="text-xs text-muted-foreground">Platform fee: {formatPrice(commission)}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handlePurchase} disabled={createTransaction.isPending} className="bg-gradient-to-r from-gold to-emerald hover:opacity-90 text-background">
            {createTransaction.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Purchase'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
