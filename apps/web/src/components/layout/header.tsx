'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Diamond } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useAuth } from '@/lib/hooks/use-auth';

const diamondShapes = [
  'Round',
  'Oval',
  'Cushion',
  'Princess',
  'Emerald',
  'Pear',
  'Radiant',
  'Marquise',
  'Asscher',
  'Heart',
];

const navLinks = [
  { label: 'Diamonds', href: '/diamonds', hasMega: true },
  { label: 'Engagement Rings', href: '/engagement-rings', hasMega: false },
  { label: 'Jewelry', href: '/jewelry', hasMega: false },
  { label: 'Education', href: '/education', hasMega: false },
  { label: 'About', href: '/about', hasMega: false },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCartStore();
  const { user, isAuthenticated } = useAuth();
  const megaRef = useRef<HTMLDivElement>(null);
  const isHomePage = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const headerBg =
    isHomePage && !scrolled
      ? 'bg-transparent'
      : 'bg-white/95 backdrop-blur-sm border-b border-charcoal-100 shadow-sm';

  const textColor = isHomePage && !scrolled ? 'text-white' : 'text-charcoal-900';
  const logoAccent = isHomePage && !scrolled ? 'text-gold-300' : 'text-gold-500';

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${headerBg}`}
        style={{ height: 'var(--header-height, 80px)' }}
      >
        <div className="container mx-auto flex h-full items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Diamond className={`h-6 w-6 ${logoAccent}`} />
            <span className={`font-display text-xl font-bold ${textColor}`}>
              Diamond <span className={logoAccent}>Factory</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) =>
              link.hasMega ? (
                <div
                  key={link.label}
                  className="relative"
                  ref={megaRef}
                  onMouseEnter={() => setMegaMenuOpen(true)}
                  onMouseLeave={() => setMegaMenuOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${textColor} hover:text-gold-500`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Mega Menu */}
                  {megaMenuOpen && (
                    <div className="border-charcoal-100 animate-slide-down absolute top-full left-1/2 mt-2 w-[640px] -translate-x-1/2 rounded-2xl border bg-white p-6 shadow-2xl">
                      <div className="grid grid-cols-3 gap-6">
                        {/* Shop by Shape */}
                        <div className="col-span-2">
                          <p className="text-charcoal-400 mb-3 text-xs font-medium tracking-wider uppercase">
                            Shop by Shape
                          </p>
                          <div className="grid grid-cols-5 gap-2">
                            {diamondShapes.map((shape) => (
                              <Link
                                key={shape}
                                href={`/diamonds?shapes=${shape.toLowerCase()}`}
                                className="hover:bg-gold-50 group flex flex-col items-center gap-1 rounded-lg p-2 transition-colors"
                              >
                                <div className="bg-charcoal-100 group-hover:bg-gold-100 flex h-8 w-8 items-center justify-center rounded-full transition-colors">
                                  <span className="text-xs">💎</span>
                                </div>
                                <span className="text-charcoal-600 group-hover:text-gold-600 text-center text-xs leading-tight transition-colors">
                                  {shape}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Shop by Type + Popular */}
                        <div className="space-y-4">
                          <div>
                            <p className="text-charcoal-400 mb-2 text-xs font-medium tracking-wider uppercase">
                              Shop by Type
                            </p>
                            <div className="space-y-1">
                              <Link
                                href="/diamonds?labGrown=false"
                                className="text-charcoal-700 hover:text-gold-600 block py-1 text-sm transition-colors"
                              >
                                Natural Diamonds
                              </Link>
                              <Link
                                href="/diamonds?labGrown=true"
                                className="text-charcoal-700 hover:text-gold-600 block py-1 text-sm transition-colors"
                              >
                                Lab Grown Diamonds
                              </Link>
                            </div>
                          </div>
                          <div>
                            <p className="text-charcoal-400 mb-2 text-xs font-medium tracking-wider uppercase">
                              Popular Filters
                            </p>
                            <div className="space-y-1">
                              <Link
                                href="/diamonds?priceMax=100000"
                                className="text-charcoal-700 hover:text-gold-600 block py-1 text-sm transition-colors"
                              >
                                Under ₹1 Lakh
                              </Link>
                              <Link
                                href="/diamonds?caratMin=1"
                                className="text-charcoal-700 hover:text-gold-600 block py-1 text-sm transition-colors"
                              >
                                1 Carat+
                              </Link>
                              <Link
                                href="/diamonds?labs=GIA"
                                className="text-charcoal-700 hover:text-gold-600 block py-1 text-sm transition-colors"
                              >
                                GIA Certified
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${textColor} hover:text-gold-500`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className={`rounded-lg p-2 transition-colors hover:bg-white/10 ${textColor}`}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className={`rounded-lg p-2 transition-colors hover:bg-white/10 ${textColor} relative`}
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className={`rounded-lg p-2 transition-colors hover:bg-white/10 ${textColor} relative`}
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="bg-gold-500 absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold text-white">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className={`hidden rounded-lg p-2 transition-colors hover:bg-white/10 sm:flex ${textColor}`}
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className={`hidden items-center gap-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors sm:flex ${
                  isHomePage && !scrolled
                    ? 'border-white/40 text-white hover:bg-white/10'
                    : 'border-charcoal-300 text-charcoal-700 hover:border-gold-500 hover:text-gold-600'
                }`}
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`rounded-lg p-2 transition-colors hover:bg-white/10 lg:hidden ${textColor}`}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-72 overflow-y-auto bg-white shadow-2xl">
            <div className="p-6 pt-24">
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-charcoal-700 hover:bg-gold-50 hover:text-gold-600 flex items-center rounded-lg px-4 py-3 font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="border-charcoal-100 mt-8 space-y-3 border-t pt-8">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="bg-charcoal-900 block w-full rounded-full py-3 text-center font-semibold text-white"
                  >
                    My Account
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="bg-gold-500 hover:bg-gold-600 block w-full rounded-full py-3 text-center font-semibold text-white transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="border-charcoal-300 text-charcoal-700 block w-full rounded-full border-2 py-3 text-center font-semibold"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-20">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <Search className="text-charcoal-400 h-5 w-5 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search diamonds, rings, jewelry..."
                className="text-charcoal-900 placeholder:text-charcoal-400 flex-1 text-lg outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-charcoal-400 hover:text-charcoal-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="border-charcoal-100 mt-4 border-t pt-4">
              <p className="text-charcoal-400 mb-2 text-xs tracking-wide uppercase">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Round Diamond',
                  'Oval Lab Grown',
                  'Engagement Ring',
                  '1 Carat',
                  'GIA Certified',
                ].map((term) => (
                  <Link
                    key={term}
                    href={`/diamonds?q=${encodeURIComponent(term)}`}
                    onClick={() => setSearchOpen(false)}
                    className="text-charcoal-600 hover:text-gold-600 bg-charcoal-50 hover:bg-gold-50 rounded-full px-3 py-1.5 text-sm transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to push content below fixed header */}
      {!isHomePage && <div style={{ height: 'var(--header-height, 80px)' }} />}
    </>
  );
}
