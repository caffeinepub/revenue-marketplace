import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { useIsCallerAdmin } from '../hooks/useQueries';
import LoginButton from './LoginButton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Store, User, History, BarChart3, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SiCoffeescript } from 'react-icons/si';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const NavLinks = () => (
    <>
      <Link to="/" className="text-foreground/80 hover:text-gold transition-colors font-medium">
        Browse
      </Link>
      {isAuthenticated && (
        <>
          <Link to="/seller-dashboard" className="text-foreground/80 hover:text-gold transition-colors font-medium">
            My Listings
          </Link>
          <Link to="/transaction-history" className="text-foreground/80 hover:text-gold transition-colors font-medium">
            Transactions
          </Link>
        </>
      )}
      {isAdmin && (
        <Link to="/revenue-dashboard" className="text-foreground/80 hover:text-emerald transition-colors font-medium">
          Revenue
        </Link>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-emerald flex items-center justify-center">
                <Store className="w-6 h-6 text-background" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gold to-emerald bg-clip-text text-transparent">
                Revenue Marketplace
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <NavLinks />
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated && userProfile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden md:flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{userProfile.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate({ to: '/seller-dashboard' })}>
                      <Store className="w-4 h-4 mr-2" />
                      My Listings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/transaction-history' })}>
                      <History className="w-4 h-4 mr-2" />
                      Transactions
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate({ to: '/revenue-dashboard' })}>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Revenue Dashboard
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <LoginButton />

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <nav className="flex flex-col gap-4 mt-8">
                    <NavLinks />
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} Revenue Marketplace</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with</span>
              <SiCoffeescript className="w-4 h-4 text-gold" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold/80 transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
