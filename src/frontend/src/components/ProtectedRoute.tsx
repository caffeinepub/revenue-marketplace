import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import AccessDeniedScreen from './AccessDeniedScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <AccessDeniedScreen message="Please log in to access this page" />;
  }

  if (adminOnly && !isLoading && !isAdmin) {
    return <AccessDeniedScreen message="Admin access required" />;
  }

  return <>{children}</>;
}
