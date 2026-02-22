import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetListingById } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function EditListing() {
  const { id } = useParams({ from: '/edit-listing/$id' });
  const { data: listing, isLoading } = useGetListingById(id);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate({ to: '/seller-dashboard' })} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="max-w-2xl mx-auto border-border/40">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gold to-emerald bg-clip-text text-transparent">
              Edit Listing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Edit functionality is not available in the current backend implementation. The backend does not provide an update method for listings.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
