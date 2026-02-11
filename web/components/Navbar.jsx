'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cpu, Menu, X, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NAV_LINKS = [{ label: 'Home', href: '/' }];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [auth, setAuth] = useState({ isLoggedIn: false, userName: '', profilePhoto: '' });
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);

        const fetchProfile = async (authToken) => {
          try {
            const response = await fetch('/api/auth/provider-settings', {
              headers: { Authorization: `Bearer ${authToken}` }
            });
            const result = await response.json();
            if (result.success) {
              const profileName = result.data.name || localStorage.getItem('name') || 'You';
              const profilePhoto = result.data.profilePhoto || '';
              localStorage.setItem('name', profileName);
              if (profilePhoto) {
                localStorage.setItem('profilePhoto', profilePhoto);
              } else {
                localStorage.removeItem('profilePhoto');
              }
              setAuth((prev) => ({
                ...prev,
                isLoggedIn: true,
                userName: profileName,
                profilePhoto
              }));
            }
          } catch (error) {
            console.error('Failed to refresh profile', error);
          }
        };

        const checkAuth = () => {
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          const name = typeof window !== 'undefined' ? localStorage.getItem('name') : 'You';
          const profilePhoto = typeof window !== 'undefined' ? localStorage.getItem('profilePhoto') : '';
          setAuth({ isLoggedIn: !!token, userName: name, profilePhoto: profilePhoto || '' });
          if (token) {
            void fetchProfile(token);
          }
        };

      checkAuth();

      const handleAuth = () => checkAuth();
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };

      window.addEventListener('storage', handleAuth);
      window.addEventListener('auth-change', handleAuth);
      window.addEventListener('click', handleClickOutside);

      return () => {
        window.removeEventListener('storage', handleAuth);
        window.removeEventListener('auth-change', handleAuth);
        window.removeEventListener('click', handleClickOutside);
      };
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  };

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Cpu className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Decision Fatigue Reducer</span>
            </Link>
            <div className="hidden md:flex items-center gap-3">
              <div className="h-9 w-20 bg-muted rounded animate-pulse" />
              <div className="h-9 w-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const initials = (auth.userName || 'You')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', href: '/settings' },
  ];

  const visibleNavLinks = auth.isLoggedIn ? [] : NAV_LINKS;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Cpu className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Decision Fatigue Reducer
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {auth.isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="transition-transform hover:translate-y-0.5"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  <Avatar>
                    {auth.profilePhoto ? (
                      <AvatarImage src={auth.profilePhoto} alt={auth.userName || 'User avatar'} />
                    ) : (
                      <AvatarFallback>{initials}</AvatarFallback>
                    )}
                  </Avatar>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl border border-border bg-card p-3 text-sm shadow-lg shadow-primary/20">
                    {menuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-md px-2 py-2 font-medium text-foreground hover:bg-accent"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="mt-2 flex w-full items-center gap-2 rounded-md border border-border px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-destructive shadow-sm shadow-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-3">
              {!auth.isLoggedIn &&
                NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

              {auth.isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-left text-sm font-medium text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-2">
                  <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
