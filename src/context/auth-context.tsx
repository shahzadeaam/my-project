'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { UserProfileDocument } from '@/types/firestore';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null; // Firebase Auth User object
  userDocument: UserProfileDocument | null; // Firestore user document
  loading: boolean; // Combined loading state
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userDocument, setUserDocument] = useState<UserProfileDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if Firebase auth is available
    if (!auth) {
      console.log('Firebase auth not configured, skipping auth setup');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user && db) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserDocument(userDocSnap.data() as UserProfileDocument);
          } else {
            setUserDocument(null);
            console.warn(`User profile document not found for UID: ${user.uid}. It should be created during signup.`);
          }
        } catch (error) {
          console.error("Error fetching user document from Firestore:", error);
          setUserDocument(null);
        }
      } else {
        setUserDocument(null);
      }
      setLoading(false); // Set loading to false after auth state and document fetch attempt are resolved
      
      // Redirect logic (remains the same)
      if (user) {
        if (pathname === '/auth/login' || pathname === '/auth/signup') {
          // router.push('/'); // Or '/profile' if preferred after login
        }
      }
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []); // router and pathname are not needed as direct dependencies for user fetching logic

  const logout = async () => {
    if (!auth) {
      console.log('Firebase auth not configured, cannot logout');
      return;
    }

    setLoading(true); // Optional: indicate loading during logout
    try {
      await auth.signOut();
      // setCurrentUser(null) and setUserDocument(null) are handled by onAuthStateChanged
      router.push('/auth/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    } finally {
      // setLoading(false); // onAuthStateChanged will set loading to false
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, userDocument, loading, logout }}>
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
