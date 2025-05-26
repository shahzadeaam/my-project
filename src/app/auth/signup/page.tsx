'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Logo from '@/components/common/logo';

export default function SignupPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder for signup logic
    console.log('Signup form submitted');
    // Here you would typically call an API to create a new user
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
          </CardHeader>
          <CardContent className="px-6 py-8 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName">نام و نام خانوادگی</Label>
                <Input id="fullName" type="text" placeholder="مثلا: نیلوفر محمدی" required className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">آدرس ایمیل</Label>
                <Input id="email" type="email" placeholder="example@email.com" required dir="ltr" className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input id="password" type="password" placeholder="حداقل ۸ کاراکتر" required dir="ltr" className="h-12 text-base" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
                <Input id="confirmPassword" type="password" placeholder="رمز عبور خود را تکرار کنید" required dir="ltr" className="h-12 text-base" />
              </div>
              <Button type="submit" className="w-full h-12 text-base font-semibold mt-3">ثبت نام</Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center text-sm pb-8">
            <p className="text-muted-foreground">
              قبلاً ثبت نام کرده‌اید؟{' '}
              <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                وارد شوید
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
