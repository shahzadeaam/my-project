
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, UserCircle, LogOut } from 'lucide-react';
import { SheetClose } from '@/components/ui/sheet';

interface AuthButtonsProps {
  inSheet?: boolean;
  isMobile?: boolean; 
}

export default function AuthButtons({ inSheet = false, isMobile = false }: AuthButtonsProps) {
  // Placeholder for authentication state - Default to false
  const isAuthenticated = false; // Users are logged out by default

  if (isAuthenticated) {
    if (isMobile && !inSheet) { // Mobile header: Two icon buttons
      return (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild aria-label="پروفایل من">
            <Link href="/profile">
              <UserCircle className="h-6 w-6" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="خروج" className="text-destructive hover:text-destructive focus:text-destructive">
            <Link href="/auth/login"> {/* Redirect to login on logout */}
              <LogOut className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      );
    } else { // Desktop header OR inSheet (mobile menu)
      // Profile Button
      const ProfileLinkContent = (
        <>
          <UserCircle className="ml-2 rtl:mr-2 rtl:ml-0" />
          {'پروفایل من'}
        </>
      );
      const profileButton = (
        <Button 
          variant={inSheet ? "ghost" : "outline"} 
          asChild 
          className={inSheet ? "w-full justify-start text-base py-2.5" : ""}
        >
          <Link href="/profile">
            {ProfileLinkContent}
          </Link>
        </Button>
      );

      // Logout Button
      const LogoutLinkContent = (
        <>
          <LogOut className="ml-2 rtl:mr-2 rtl:ml-0" />
          {'خروج'}
        </>
      );
      const logoutButton = (
        <Button 
          variant={inSheet ? "ghost" : "outline"} 
          asChild 
          className={
            inSheet ? "w-full justify-start text-base py-2.5 text-destructive hover:text-destructive focus:text-destructive" : 
            "text-destructive hover:text-destructive border-destructive hover:bg-destructive/10 focus:text-destructive"
          }
        >
          <Link href="/auth/login"> {/* Redirect to login on logout */}
            {LogoutLinkContent}
          </Link>
        </Button>
      );

      if (inSheet) {
        return (
          <>
            <SheetClose asChild>{profileButton}</SheetClose>
            <SheetClose asChild>{logoutButton}</SheetClose>
          </>
        );
      } else { // Desktop header
        return (
          <div className="flex items-center gap-1 md:gap-2">
            {profileButton}
            {logoutButton}
          </div>
        );
      }
    }
  }

  // Logic for non-authenticated users
  if (isMobile && !inSheet) { // Only icon for mobile header (not in sheet)
    return (
         <Button asChild variant="ghost" size="icon" aria-label="ورود یا ثبت نام">
            <Link href="/auth/login">
                <UserCircle className="h-6 w-6" />
            </Link>
        </Button>
    );
  }

  const LoginLinkContent = (
    <>
        <LogIn className={inSheet ? "ml-2 rtl:mr-2 rtl:ml-0" : "ml-2 rtl:mr-2 rtl:ml-0"} />
        ورود
    </>
  );
  const SignupLinkContent = (
     <>
        <UserPlus className={inSheet ? "ml-2 rtl:mr-2 rtl:ml-0" : "ml-2 rtl:mr-2 rtl:ml-0"} />
        ثبت نام
    </>
  );

  const loginButton = (
     <Button variant={inSheet ? "ghost" : "outline"} asChild className={inSheet ? "w-full justify-start text-base py-2.5" : ""}>
        <Link href="/auth/login">
           {LoginLinkContent}
        </Link>
      </Button>
  );

   const signupButton = (
     <Button variant={inSheet ? "ghost" : "default"} asChild className={inSheet ? "w-full justify-start text-base py-2.5" : ""}>
        <Link href="/auth/signup">
            {SignupLinkContent}
        </Link>
      </Button>
  );


  return (
    <div className={inSheet ? "flex flex-col space-y-1" : "flex items-center space-x-1 rtl:space-x-reverse md:space-x-2"}>
      {inSheet ? <SheetClose asChild>{loginButton}</SheetClose> : loginButton}
      {inSheet ? <SheetClose asChild>{signupButton}</SheetClose> : signupButton}
    </div>
  );
}
