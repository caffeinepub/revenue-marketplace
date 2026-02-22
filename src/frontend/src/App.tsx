import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useUserProfile';
import Layout from './components/Layout';
import ProfileSetupModal from './components/ProfileSetupModal';
import BrowseListings from './pages/BrowseListings';
import ListingDetails from './pages/ListingDetails';
import SellerDashboard from './pages/SellerDashboard';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import TransactionHistory from './pages/TransactionHistory';
import TransactionSuccess from './pages/TransactionSuccess';
import TransactionFailure from './pages/TransactionFailure';
import RevenueDashboard from './pages/RevenueDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: BrowseListings,
});

const listingDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listing/$id',
  component: ListingDetails,
});

const sellerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/seller-dashboard',
  component: () => (
    <ProtectedRoute>
      <SellerDashboard />
    </ProtectedRoute>
  ),
});

const createListingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-listing',
  component: () => (
    <ProtectedRoute>
      <CreateListing />
    </ProtectedRoute>
  ),
});

const editListingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/edit-listing/$id',
  component: () => (
    <ProtectedRoute>
      <EditListing />
    </ProtectedRoute>
  ),
});

const transactionHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transaction-history',
  component: () => (
    <ProtectedRoute>
      <TransactionHistory />
    </ProtectedRoute>
  ),
});

const transactionSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transaction-success',
  component: TransactionSuccess,
});

const transactionFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transaction-failure',
  component: TransactionFailure,
});

const revenueDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/revenue-dashboard',
  component: () => (
    <ProtectedRoute adminOnly>
      <RevenueDashboard />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  listingDetailsRoute,
  sellerDashboardRoute,
  createListingRoute,
  editListingRoute,
  transactionHistoryRoute,
  transactionSuccessRoute,
  transactionFailureRoute,
  revenueDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
