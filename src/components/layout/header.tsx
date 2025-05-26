'use client';

import Link from 'next/link';
import { Menu, ShoppingBag } from 'lucide-react';
import Logo from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'خانه', href: '/' },
  { label: 'محصولات', href: '/products' },
  { label: 'درباره ما', href: '/about' },
  { label: 'تماس با ما', href: '/contact' },
];

export default function Header() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted) {
    // Render a placeholder or null during SSR/hydration phase to avoid mismatch
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="h-6 w-24 bg-muted rounded-md animate-pulse md:hidden"></div> {/* Placeholder for mobile menu button */}
                <div className="hidden md:flex h-6 w-64 bg-muted rounded-md animate-pulse"></div> {/* Placeholder for desktop nav */}
                <div className="h-8 w-32 bg-muted rounded-md animate-pulse"></div> {/* Placeholder for Logo */}
            </div>
        </header>
    );
  }


  const NavLinks = ({ inSheet }: { inSheet?: boolean }) => (
    <nav className={inSheet ? 'flex flex-col space-y-4 p-4' : 'hidden items-center space-x-6 rtl:space-x-reverse md:flex'}>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${inSheet ? 'block py-2' : ''}`}
        >
          {inSheet ? <SheetClose asChild><span className="w-full text-right block">{item.label}</span></SheetClose> : item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] bg-background p-0">
              <div className="p-6">
                <Logo />
              </div>
              <NavLinks inSheet />
            </SheetContent>
          </Sheet>
        ) : (
          <NavLinks />
        )}
        
        <div className={isMobile ? "absolute left-1/2 transform -translate-x-1/2" : ""}>
         <Logo />
        </div>

        {!isMobile && (
          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingBag className="h-6 w-6" />
          </Button>
        )}
      </div>
    </header>
  );
}
