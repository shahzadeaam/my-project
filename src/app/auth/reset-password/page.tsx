
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
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2, MailCheck } from 'lucide-react';
import type { Metadata } from 'next';

// Metadata should be defined in a parent server component or layout if strict static generation is needed.
// export const metadata: Metadata = {
//   title: 'بازیابی رمز عبور - نیلوفر بوتیک',
//   description: 'رمز عبور خود را در نیلوفر بوتیک بازیابی کنید.',
// };

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setEmailSent(false);
    setIsLoading(true);

    if (!email) {
      setError('لطفاً آدرس ایمیل خود را وارد کنید.');
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast({
        title: 'ایمیل ارسال شد!',
        description: `یک ایمیل حاوی لینک بازنشانی رمز عبور به ${email} ارسال شد. لطفاً پوشه اسپم خود را نیز بررسی کنید.`,
        variant: 'default',
        duration: 7000,
      });
    } catch (err: any) {
      let friendlyMessage = 'خطایی در ارسال ایمیل بازنشانی رخ داد. لطفاً دوباره تلاش کنید.';
      if (err.code === 'auth/user-not-found') {
        friendlyMessage = 'کاربری با این آدرس ایمیل یافت نشد.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'فرمت ایمیل وارد شده صحیح نمی‌باشد.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMessage = 'درخواست‌های زیادی برای این ایمیل ارسال شده است. لطفاً بعداً امتحان کنید.';
      }
      setError(friendlyMessage);
      toast({
        title: 'خطا در ارسال ایمیل',
        description: friendlyMessage,
        variant: 'destructive',
      });
      console.error('Firebase Reset Password Error:', err);
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
            <CardTitle className="text-3xl font-bold">بازیابی رمز عبور</CardTitle>
            <CardDescription className="text-muted-foreground">
              ایمیل حساب کاربری خود را وارد کنید تا لینک بازیابی برایتان ارسال شود.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-8 sm:px-8">
            {error && !emailSent && ( // Only show error if email has not been successfully sent
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>خطا!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {emailSent ? (
              <Alert variant="default" className="mb-4 bg-green-50 border-green-200 text-green-700">
                <MailCheck className="h-5 w-5 text-green-600" />
                <AlertTitle className="font-semibold">ایمیل ارسال شد!</AlertTitle>
                <AlertDescription>
                  یک ایمیل حاوی لینک بازنشانی رمز عبور به <strong>{email}</strong> ارسال شد.
                  لطفاً صندوق ورودی و پوشه اسپم خود را بررسی کنید. ممکن است دریافت ایمیل چند دقیقه طول بکشد.
                </AlertDescription>
              </Alert>
            ) : (
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
                <Button type="submit" className="w-full h-12 text-base font-semibold mt-4" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-5 w-5 animate-spin rtl:mr-2 rtl:ml-0" />
                      در حال ارسال...
                    </>
                  ) : (
                    'ارسال لینک بازیابی'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center text-sm pb-8">
            <p className="text-muted-foreground">
              رمز عبور خود را به خاطر دارید؟{' '}
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
