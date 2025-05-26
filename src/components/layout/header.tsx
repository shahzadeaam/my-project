'use client';

import Link from 'next/link';
import { Menu, ShoppingBag } from 'lucide-react';
import Logo from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCart } from '@/context/cart-context';
import { useEffect, useState } from 'react';
import AuthButtons from './auth-buttons'; 

const navItems = [
  { label: 'خانه', href: '/' },
  { label: 'محصولات', href: '/products' },
  { label: 'درباره ما', href: '/about' },
  { label: 'تماس با ما', href: '/contact' },
];

export default function Header() {
  const isMobileHook = useIsMobile(); // Renamed to avoid conflict
  const { totalItems } = useCart(); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use mounted state to decide rendering
  const isMobile = mounted ? isMobileHook : false; // Default to false if not mounted to avoid SSR mismatch with conditional rendering logic

  if (!mounted) {
    // Consistent placeholder for SSR/hydration phase
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-muted rounded-md animate-pulse md:hidden"></div> {/* Placeholder for mobile menu button or auth icon */}
                    <div className="hidden md:flex h-8 w-40 bg-muted rounded-md animate-pulse"></div> {/* Placeholder for desktop auth buttons */}
                </div>
                <div className="h-8 w-32 bg-muted rounded-md animate-pulse"></div> {/* Placeholder for Logo */}
                <div className="flex items-center gap-2">
                     <div className="h-8 w-8 bg-muted rounded-md animate-pulse"></div> {/* Placeholder for cart icon */}
                     <div className="h-8 w-8 bg-muted rounded-md animate-pulse md:hidden"></div> {/* Placeholder for mobile auth icon */}
                </div>
            </div>
        </header>
    );
  }

  const NavLinks = ({ inSheet }: { inSheet?: boolean }) => (
    <nav className={inSheet ? 'flex flex-col space-y-1 p-4' : 'hidden items-center space-x-6 rtl:space-x-reverse md:flex'}>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${inSheet ? 'block py-2.5 text-right text-base' : ''}`}
        >
          {inSheet ? <SheetClose asChild><span className="w-full block">{item.label}</span></SheetClose> : item.label}
        </Link>
      ))}
      {inSheet && (
        <div className="pt-4 mt-2 border-t border-border/40">
            <AuthButtons inSheet />
        </div>
      )}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 md:gap-2">
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="باز کردن منو">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-background p-0">
                  <div className="p-6 border-b border-border/40">
                    <SheetClose asChild>
                      <Logo />
                    </SheetClose>
                  </div>
                  <NavLinks inSheet />
                </SheetContent>
              </Sheet>
            ) : (
              <NavLinks />
            )}
        </div>
        
        <div className={isMobile ? "absolute left-1/2 transform -translate-x-1/2" : ""}>
          <Logo />
        </div>

        <div className="flex items-center gap-1 md:gap-2">
            <Button asChild variant="ghost" size="icon" aria-label="سبد خرید">
                <Link href="/cart" className="relative">
                    <ShoppingBag className="h-6 w-6" />
                    {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 rtl:-left-1 rtl:-right-auto bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {totalItems}
                    </span>
                    )}
                </Link>
            </Button>
            <AuthButtons isMobile={isMobile} />
        </div>
      </div>
    </header>
  );
}
