import { Link } from '@tanstack/react-router';
import type { ProductListing } from '../backend';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '../lib/utils';

interface ListingCardProps {
  listing: ProductListing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = listing.image.getDirectURL();

  return (
    <Link to="/listing/$id" params={{ id: listing.id }} className="group">
      <Card className="overflow-hidden border-border/40 hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10">
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-gold transition-colors">
              {listing.title}
            </h3>
            <Badge variant="outline" className="shrink-0 border-emerald/50 text-emerald">
              {listing.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="text-2xl font-bold bg-gradient-to-r from-gold to-emerald bg-clip-text text-transparent">
            {formatPrice(listing.price)}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
