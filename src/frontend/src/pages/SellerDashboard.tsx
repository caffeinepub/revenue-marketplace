import { useGetAllListings } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import ListingCard from '../components/ListingCard';
import DeleteListingButton from '../components/DeleteListingButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SellerDashboard() {
  const { data: allListings, isLoading } = useGetAllListings();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  const myListings = allListings?.filter(
    (listing) => identity && listing.seller.toString() === identity.getPrincipal().toString()
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-gold to-emerald bg-clip-text text-transparent">
                My Listings
              </span>
            </h1>
            <p className="text-muted-foreground">Manage your product listings</p>
          </div>
          <Button
            size="lg"
            onClick={() => navigate({ to: '/create-listing' })}
            className="bg-gradient-to-r from-gold to-emerald hover:opacity-90 text-background font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Listing
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-gold/30 bg-card/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gold">{myListings?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Listings */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : myListings && myListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map((listing) => (
              <div key={listing.id} className="space-y-3">
                <ListingCard listing={listing} />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate({ to: '/edit-listing/$id', params: { id: listing.id } })}
                  >
                    Edit
                  </Button>
                  <DeleteListingButton listingId={listing.id} listingTitle={listing.title} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="border-border/40">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Package className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
              <p className="text-muted-foreground mb-6">Create your first listing to get started</p>
              <Button
                onClick={() => navigate({ to: '/create-listing' })}
                className="bg-gradient-to-r from-gold to-emerald hover:opacity-90 text-background font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Listing
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
