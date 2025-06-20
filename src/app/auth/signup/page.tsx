'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Logo from '@/components/common/logo';
import { useToast } from '@/hooks/use-toast';
import { auth, db, Timestamp, isFirebaseAvailable } from '@/lib/firebase'; 
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2, Eye, EyeOff } from 'lucide-react';
import type { UserProfileDocument } from '@/types/firestore';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    

    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن با هم تطابق ندارند.');
      return;
    }

    if (password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
      return;
    }
    setIsLoading(true);

    // Check if Firebase is available
    if (!isFirebaseAvailable() || !auth || !db) {
      // Mock functionality for development
      setTimeout(() => {
        toast({
          title: 'ثبت نام موفق! (Demo)',
          description: 'در حالت توسعه، حساب کاربری شما با موفقیت ایجاد شد.',
          variant: 'default',
        });
        router.push('/profile');
        setIsLoading(false);
      }, 2000);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set display name in Firebase Auth
      if (user) {
        await updateProfile(user, {
          displayName: fullName,
        });

        // Create user document in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const newUserProfile: UserProfileDocument = {
          uid: user.uid,
          fullName: fullName,
          email: user.email || '',
          phoneNumber: '', // Initialize as empty or get from form if added
          privacySettings: { // Default privacy settings
            showPublicProfile: false,
            receiveNewsletter: true,
          },
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        await setDoc(userDocRef, newUserProfile);
      }
      
      toast({
        title: 'ثبت نام موفق!',
        description: 'حساب کاربری شما با موفقیت ایجاد شد. اکنون به پروفایل خود هدایت می‌شوید.',
        variant: 'default',
      });
      router.push('/profile'); 
    } catch (err: any) {
      let friendlyMessage = 'خطایی در هنگام ثبت نام رخ داد. لطفا دوباره تلاش کنید.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'این آدرس ایمیل قبلاً استفاده شده است.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'رمز عبور شما ضعیف است. لطفا رمز عبور قوی‌تری انتخاب کنید.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'آدرس ایمیل وارد شده معتبر نیست.';
      }
      setError(friendlyMessage);
      toast({
        title: 'خطا در ثبت نام',
        description: friendlyMessage,
        variant: 'destructive',
      });
      console.error('Firebase Signup Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
        <Card className="w-full max-w-md shadow-2xl rounded-xl">
          <CardHeader className="text-center space-y-3 pt-8">
             <div className="mx-auto mb-2">
                <Logo />
            </div>
            <CardTitle className="text-3xl font-bold">ایجاد حساب کاربری</CardTitle>
            <CardDescription className="text-muted-foreground">برای شروع خرید و لذت بردن از امکانات سایت ثبت نام کنید.</CardDescription>
            {!isFirebaseAvailable() && (
              <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>حالت توسعه</AlertTitle>
                <AlertDescription>
                  Firebase تنظیم نشده است. این یک نسخه نمایشی است.
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent className="px-6 py-8 sm:px-8">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>خطا!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName">نام و نام خانوادگی</Label>
                <Input 
                  id="fullName" 
                  type="text" 
                  placeholder="مثلا: نیلوفر محمدی" 
                  required 
                  className="h-12 text-base"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">آدرس ایمیل</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="example@email.com" 
                  required 
                  dir="ltr" 
                  className="h-12 text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="password">رمز عبور</Label>
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="حداقل ۶ کاراکتر" 
                  required 
                  dir="ltr" 
                  className="h-12 text-base pr-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-8 h-8 w-8 text-muted-foreground hover:text-foreground" 
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
              </div>
               <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="رمز عبور خود را تکرار کنید" 
                  required 
                  dir="ltr" 
                  className="h-12 text-base pr-10" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-8 h-8 w-8 text-muted-foreground hover:text-foreground" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "مخفی کردن تکرار رمز عبور" : "نمایش تکرار رمز عبور"}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
              </div>
              <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-5 w-5 animate-spin rtl:mr-2 rtl:ml-0" />
                    در حال ایجاد حساب کاربری...
                  </>
                ) : (
                  'ایجاد حساب کاربری'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center text-sm pb-8">
            <p className="text-muted-foreground">
              قبلاً حساب کاربری دارید؟{' '}
              <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                ورود به حساب کاربری
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
