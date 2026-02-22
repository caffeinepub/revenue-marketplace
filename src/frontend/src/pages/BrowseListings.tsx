import { useState } from 'react';
import { useGetAllListings } from '../hooks/useQueries';
import ListingCard from '../components/ListingCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Skeleton } from '@/components/ui/skeleton';

export default function BrowseListings() {
  const { data: listings, isLoading } = useGetAllListings();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const filteredListings = listings?.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) || listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || listing.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(listings?.map((l) => l.category) || []));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-card to-background border-b border-border/40">
        <div className="absolute inset-0 bg-[url('/assets/generated/hero-banner.dim_1200x400.png')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-gold via-emerald to-gold bg-clip-text text-transparent">
                Your Revenue Marketplace
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Buy and sell premium products. Build your revenue stream today.
            </p>
            {identity && (
              <Button
                size="lg"
                onClick={() => navigate({ to: '/create-listing' })}
                className="bg-gradient-to-r from-gold to-emerald hover:opacity-90 text-background font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Listing
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border/40 bg-card/30 backdrop-blur-sm sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredListings && filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No listings found</p>
            {identity && (
              <Button
                onClick={() => navigate({ to: '/create-listing' })}
                className="mt-6 bg-gradient-to-r from-gold to-emerald hover:opacity-90 text-background font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Listing
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
