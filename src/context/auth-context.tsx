
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      // Redirect logic after auth state changes
      if (user) {
        // If user is logged in and on login/signup page, redirect to home
        if (pathname === '/auth/login' || pathname === '/auth/signup') {
          // router.push('/'); // Or '/profile' if preferred after login
        }
      } else {
        // If user is not logged in and on a protected route (e.g., profile), redirect to login
        // For now, profile page is public, so no explicit redirect here for this prototype
        // if (pathname === '/profile') {
        //   router.push('/auth/login');
        // }
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const logout = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      // setCurrentUser(null) is handled by onAuthStateChanged
      router.push('/auth/login');
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle logout error if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, logout }}>
      {/* We render children even while loading to prevent UI flickers, 
          individual components can decide to show loading indicators based on context.loading */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
