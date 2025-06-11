'use client';

import Link from 'next/link';
import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Logo from '@/components/common/logo';
import { useToast } from '@/hooks/use-toast';
import { auth, isFirebaseAvailable } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2, Eye, EyeOff, Info, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context'; // Import useAuth

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser, loading: authLoading } = useAuth(); // Use auth context

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if user is already logged in and auth state is resolved
  // This useEffect is not strictly necessary if we hide the form, but good for explicit redirect.
  // useEffect(() => {
  //   if (!authLoading && currentUser) {
  //     router.replace('/'); // Or '/profile'
  //   }
  // }, [currentUser, authLoading, router]);


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    // Check if Firebase is available
    if (!isFirebaseAvailable() || !auth) {
      // Mock functionality for development
      setTimeout(() => {
        toast({
          title: 'ورود موفق! (Demo)',
          description: 'در حالت توسعه، ورود شما با موفقیت انجام شد.',
          variant: 'default',
        });
        router.push('/');
        setIsLoading(false);
      }, 2000);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'ورود موفق!',
        description: 'خوش آمدید! اکنون به صفحه اصلی هدایت می‌شوید.',
        variant: 'default',
      });
      router.push('/'); 
    } catch (err: any) {
      let friendlyMessage: React.ReactNode = 'خطایی در هنگام ورود رخ داد. لطفا دوباره تلاش کنید.';
      
      switch (err.code) {
        case 'auth/user-not-found':
          friendlyMessage = (
            <>
              کاربری با این آدرس ایمیل یافت نشد. آیا می‌خواهید{' '}
              <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
                ثبت نام کنید
              </Link>
              ؟
            </>
          );
          break;
        case 'auth/wrong-password':
          friendlyMessage = (
            <>
              رمز عبور وارد شده صحیح نمی‌باشد. آیا رمز خود را{' '}
              <Link href="/auth/reset-password" className="font-semibold text-primary hover:underline">
                فراموش کرده‌اید
              </Link>
              ؟
            </>
          );
          break;
        case 'auth/invalid-credential':
           friendlyMessage = (
            <>
              اطلاعات ورود (ایمیل یا رمز عبور) نامعتبر است. لطفاً دوباره تلاش کنید.
              می‌توانید{' '}
              <Link href="/auth/reset-password" className="font-semibold text-primary hover:underline">
                رمز عبور خود را بازیابی کنید
              </Link>
              {' یا اگر حساب کاربری ندارید، '}
              <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
                ثبت نام کنید
              </Link>
              .
            </>
          );
          break;
        case 'auth/invalid-email':
          friendlyMessage = 'فرمت ایمیل وارد شده صحیح نمی‌باشد. لطفاً ایمیل معتبری وارد کنید.';
          break;
        case 'auth/too-many-requests':
          friendlyMessage = 'دسترسی به این حساب به دلیل تلاش‌های زیاد برای ورود، موقتاً مسدود شده است. لطفاً بعداً دوباره امتحان کنید یا رمز عبور خود را بازنشانی کنید.';
          break;
        case 'auth/user-disabled':
          friendlyMessage = 'حساب کاربری شما غیرفعال شده است. لطفاً با پشتیبانی تماس بگیرید.';
          break;
        default:
          console.error('Firebase Login Error:', err);
          friendlyMessage = 'خطایی در هنگام ورود رخ داد. لطفا دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.';
          break;
      }
      
      setError(friendlyMessage);
      toast({
        title: 'خطا در ورود',
        description: typeof friendlyMessage === 'string' ? friendlyMessage : 'لطفاً پیام خطا در فرم را بررسی کنید.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
           <p className="ml-2 rtl:mr-2 text-muted-foreground">در حال بررسی وضعیت ورود...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
        {currentUser ? (
          <Card className="w-full max-w-md shadow-2xl rounded-xl text-center">
            <CardHeader className="pt-8">
              <Info className="mx-auto h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl font-bold">شما وارد شده‌اید</CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-4">
              <AlertDescription className="text-muted-foreground text-base">
                شما هم‌اکنون وارد سیستم شده‌اید. برای مشاهده اطلاعات خود یا انجام تغییرات به پروفایل خود مراجعه کنید.
              </AlertDescription>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pb-8 pt-5">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/">بازگشت به صفحه اصلی</Link>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/profile">مشاهده پروفایل</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full max-w-md shadow-2xl rounded-xl">
            <CardHeader className="text-center space-y-3 pt-8">
              <div className="mx-auto mb-2">
                  <Logo />
              </div>
              <CardTitle className="text-3xl font-bold">ورود به حساب کاربری</CardTitle>
              <CardDescription className="text-muted-foreground">برای دسترسی به سفارشات و سبد خرید خود وارد شوید.</CardDescription>
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
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="••••••••" 
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
                    size="sm"
                    className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-5 w-5 animate-spin rtl:mr-2 rtl:ml-0" />
                      در حال ورود...
                    </>
                  ) : (
                    'ورود به حساب کاربری'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center text-sm pb-8">
              <p className="text-muted-foreground">
                حساب کاربری ندارید؟{' '}
                <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
                  ثبت نام کنید
                </Link>
              </p>
              <p className="text-muted-foreground mt-2">
                رمز عبور خود را فراموش کرده‌اید؟{' '}
                <Link href="/auth/reset-password" className="font-semibold text-primary hover:underline">
                  بازیابی رمز عبور
                </Link>
              </p>
            </CardFooter>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}

    