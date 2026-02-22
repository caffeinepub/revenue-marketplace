import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetListingById } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import PurchaseButton from '../components/PurchaseButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, User, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '../lib/utils';

export default function ListingDetails() {
  const { id } = useParams({ from: '/listing/$id' });
  const { data: listing, isLoading } = useGetListingById(id);
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  const isOwner = identity && listing && listing.seller.toString() === identity.getPrincipal().toString();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-muted-foreground">Listing not found</p>
        <Button onClick={() => navigate({ to: '/' })} className="mt-6">
          Back to Browse
        </Button>
      </div>
    );
  }

  const imageUrl = listing.image.getDirectURL();
  const listingDate = new Date(Number(listing.timestamp) / 1000000).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden border-2 border-border/40 bg-muted">
              <img src={imageUrl} alt={listing.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-4xl font-bold text-foreground">{listing.title}</h1>
                <Badge variant="outline" className="border-emerald/50 text-emerald shrink-0">
                  {listing.category}
                </Badge>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-gold to-emerald bg-clip-text text-transparent">
                {formatPrice(listing.price)}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
            </div>

            <Separator />

            <Card className="border-border/40 bg-card/50">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>Seller: {listing.seller.toString().slice(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Listed: {listingDate}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3 pt-4">
              {isOwner ? (
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate({ to: '/edit-listing/$id', params: { id: listing.id } })}
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Listing
                </Button>
              ) : (
                <PurchaseButton listing={listing} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
