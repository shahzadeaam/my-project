'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Logo from '@/components/common/logo';

export default function LoginPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder for login logic
    console.log('Login form submitted');
    // Here you would typically call an authentication API
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">آدرس ایمیل</Label>
                <Input id="email" type="email" placeholder="example@email.com" required dir="ltr" className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input id="password" type="password" placeholder="••••••••" required dir="ltr" className="h-12 text-base" />
              </div>
              <div className="flex items-center justify-between text-sm">
                {/* <div className="flex items-center gap-2">
                  <Checkbox id="remember-me" />
                  <Label htmlFor="remember-me">مرا به خاطر بسپار</Label>
                </div> */}
                <Link href="#" className="font-medium text-primary hover:underline">
                  رمز عبور خود را فراموش کرده‌اید؟
                </Link>
              </div>
              <Button type="submit" className="w-full h-12 text-base font-semibold mt-4">ورود</Button>
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
