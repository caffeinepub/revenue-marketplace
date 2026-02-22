import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface AccessDeniedScreenProps {
  message?: string;
}

export default function AccessDeniedScreen({ message = 'Access Denied' }: AccessDeniedScreenProps) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldAlert className="w-10 h-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{message}</h1>
          <p className="text-muted-foreground">
            {isAuthenticated
              ? "You don't have permission to view this page."
              : 'You need to be logged in to access this page.'}
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          {!isAuthenticated && <LoginButton />}
          <Button variant="outline" onClick={() => navigate({ to: '/' })}>
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
