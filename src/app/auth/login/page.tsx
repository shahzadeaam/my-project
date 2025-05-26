
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Logo from '@/components/common/logo';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'ورود موفق!',
        description: 'خوش آمدید! اکنون به صفحه اصلی هدایت می‌شوید.',
        variant: 'default',
      });
      router.push('/'); // Redirect to home page on successful login
    } catch (err: any) {
      let friendlyMessage = 'ایمیل یا رمز عبور نامعتبر است. لطفا دوباره تلاش کنید.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMessage = 'ایمیل یا رمز عبور وارد شده صحیح نمی‌باشد.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'فرمت ایمیل وارد شده صحیح نمی‌باشد.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMessage = 'دسترسی به این حساب به دلیل تلاش‌های زیاد برای ورود، موقتاً مسدود شده است. لطفاً بعداً دوباره امتحان کنید یا رمز عبور خود را بازنشانی کنید.';  
      }
      setError(friendlyMessage);
      toast({
        title: 'خطا در ورود',
        description: friendlyMessage,
        variant: 'destructive',
      });
      console.error('Firebase Login Error:', err);
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
            <CardTitle className="text-3xl font-bold">ورود به حساب کاربری</CardTitle>
            <CardDescription className="text-muted-foreground">برای دسترسی به سفارشات و سبد خرید خود وارد شوید.</CardDescription>
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
                    size="icon" 
                    className="absolute right-1 top-8 h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <Link href="#" className="font-medium text-primary hover:underline">
                  رمز عبور خود را فراموش کرده‌اید؟ (نمایشی)
                </Link>
              </div>
              <Button type="submit" className="w-full h-12 text-base font-semibold mt-4" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-5 w-5 animate-spin rtl:mr-2 rtl:ml-0" />
                    در حال ورود...
                  </>
                ) : (
                  'ورود'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center text-sm pb-8">
            <p className="text-muted-foreground">
              هنوز حساب کاربری ندارید؟{' '}
              <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
                ایجاد حساب کاربری
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
