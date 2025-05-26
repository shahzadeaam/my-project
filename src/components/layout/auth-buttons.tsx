
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, UserCircle, LogOut, Loader2 } from 'lucide-react';
import { SheetClose } from '@/components/ui/sheet';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface AuthButtonsProps {
  inSheet?: boolean;
  isMobile?: boolean; 
}

export default function AuthButtons({ inSheet = false, isMobile = false }: AuthButtonsProps) {
  const { currentUser, loading: authLoading, logout } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout(); // This will also redirect via AuthContext
      toast({
        title: 'خروج موفق',
        description: 'شما با موفقیت از حساب کاربری خود خارج شدید.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'خطا در خروج',
        description: 'مشکلی در هنگام خروج از حساب پیش آمد.',
        variant: 'destructive',
      });
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (authLoading) {
    // Show a simple placeholder or spinner while auth state is loading
    return (
      <div className={`flex items-center gap-1 md:gap-2 ${inSheet ? "flex-col space-y-1" : ""}`}>
        <Button variant={inSheet ? "ghost" : "outline"} disabled className={inSheet ? "w-full justify-start text-base py-2.5" : ""}>
          <Loader2 className="ml-2 h-4 w-4 animate-spin rtl:mr-2 rtl:ml-0" />
          {inSheet ? "بارگذاری..." : ""}
        </Button>
        {!inSheet &&
          <Button variant={inSheet ? "ghost" : "default"} disabled className={inSheet ? "w-full justify-start text-base py-2.5" : ""}>
            <Loader2 className="ml-2 h-4 w-4 animate-spin rtl:mr-2 rtl:ml-0" />
          </Button>
        }
      </div>
    );
  }

  if (currentUser) { // User is authenticated
    // Profile Button
    const ProfileLinkContent = (
      <>
        <UserCircle className="ml-2 rtl:mr-2 rtl:ml-0" />
        {'پروفایل من'}
      </>
    );
    const profileButton = (
      <Button 
        variant={inSheet || isMobile ? "ghost" : "outline"} 
        size={isMobile && !inSheet ? "icon" : "default"}
        asChild 
        className={inSheet ? "w-full justify-start text-base py-2.5" : ""}
        aria-label="پروفایل من"
      >
        <Link href="/profile">
          {isMobile && !inSheet ? <UserCircle className="h-6 w-6" /> : ProfileLinkContent}
        </Link>
      </Button>
    );

    // Logout Button
    const LogoutLinkContent = (
      <>
        {isLoggingOut ? <Loader2 className="ml-2 h-4 w-4 animate-spin rtl:mr-2 rtl:ml-0" /> : <LogOut className="ml-2 rtl:mr-2 rtl:ml-0" />}
        {isLoggingOut ? 'در حال خروج...' : 'خروج'}
      </>
    );
    const logoutButtonAction = (
      <Button 
        variant={inSheet || isMobile ? "ghost" : "outline"}
        size={isMobile && !inSheet ? "icon" : "default"}
        onClick={handleLogout} 
        disabled={isLoggingOut}
        className={
          `${inSheet ? "w-full justify-start text-base py-2.5" : ""} ${
            isMobile && !inSheet ? "" : 
            (inSheet ? "text-destructive hover:text-destructive focus:text-destructive" : "text-destructive hover:text-destructive border-destructive hover:bg-destructive/10 focus:text-destructive")
          }`
        }
        aria-label="خروج"
      >
        {isMobile && !inSheet ? (isLoggingOut ? <Loader2 className="h-6 w-6 animate-spin" /> : <LogOut className="h-6 w-6 text-destructive" />) : LogoutLinkContent}
      </Button>
    );
    
    const logoutButton = inSheet ? <SheetClose asChild>{logoutButtonAction}</SheetClose> : logoutButtonAction;


    if (isMobile && !inSheet) { // Mobile header: Two icon buttons
      return (
        <div className="flex items-center gap-1">
          {profileButton}
          {logoutButton}
        </div>
      );
    } else { // Desktop header OR inSheet (mobile menu)
       if (inSheet) {
        return (
          <>
            <SheetClose asChild>{profileButton}</SheetClose>
            {logoutButton}
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

  // Logic for non-authenticated users (currentUser is null)
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
        <LogIn className="ml-2 rtl:mr-2 rtl:ml-0" />
        ورود
    </>
  );
  const SignupLinkContent = (
     <>
        <UserPlus className="ml-2 rtl:mr-2 rtl:ml-0" />
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
