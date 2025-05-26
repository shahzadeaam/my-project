
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, UserCircle } from 'lucide-react';
import { SheetClose } from '@/components/ui/sheet';

interface AuthButtonsProps {
  inSheet?: boolean;
  isMobile?: boolean; 
}

export default function AuthButtons({ inSheet = false, isMobile = false }: AuthButtonsProps) {
  // Placeholder for authentication state - SET TO TRUE FOR PROFILE PAGE DEMO
  const isAuthenticated = true; // Replace with actual auth check in a real app

  if (isAuthenticated) {
    const ProfileLinkContent = (
        <>
            <UserCircle className={inSheet || (isMobile && !inSheet) ? "ml-2 rtl:mr-2 rtl:ml-0" : "ml-2 rtl:mr-2 rtl:ml-0"} />
            {(!isMobile || inSheet) && 'پروفایل من'}
        </>
    );
    
    const profileButton = (
         <Button variant={inSheet ? "ghost" : "outline"} asChild className={inSheet ? "w-full justify-start text-base py-2.5" : (isMobile ? "px-2" : "") }>
            <Link href="/profile">
                {ProfileLinkContent}
            </Link>
        </Button>
    );
    
    return inSheet ? <SheetClose asChild>{profileButton}</SheetClose> : profileButton;
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
