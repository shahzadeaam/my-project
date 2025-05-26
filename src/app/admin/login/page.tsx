
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/common/logo'; 
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    // --- THIS IS A MOCK LOGIN ---
    // In a real application, you would call an authentication API here.
    // For this prototype, we'll use a dummy check.
    if (email === 'admin@example.com' && password === 'password123') {
      console.log('Admin login successful (mock)');
      // In a real app, you'd set a session/token here.
      // For now, just redirect to the dashboard.
      router.push('/admin/dashboard');
    } else {
      setError('نام کاربری یا رمز عبور نامعتبر است. (ورود نمایشی: admin@example.com / password123)');
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-muted/20 via-background to-muted/20 p-4">
      <div className="absolute top-6 left-6">
        <Logo />
      </div>
      <Card className="w-full max-w-md shadow-2xl rounded-xl">
        <CardHeader className="text-center space-y-3 pt-8">
          <CardTitle className="text-3xl font-bold">ورود به پنل مدیریت</CardTitle>
          <CardDescription className="text-muted-foreground">برای دسترسی به پنل، اطلاعات خود را وارد کنید.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-8 sm:px-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>خطا در ورود</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">آدرس ایمیل</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@example.com" 
                required 
                dir="ltr" 
                className="h-12 text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
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
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-8 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
            {/* <div className="flex items-center justify-between text-sm">
              <Link href="#" className="font-medium text-primary hover:underline">
                رمز عبور خود را فراموش کرده‌اید؟ (نمایشی)
              </Link>
            </div> */}
            <Button type="submit" className="w-full h-12 text-base font-semibold mt-4">ورود</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm pb-8">
            <p className="text-xs text-muted-foreground">
                این یک صفحه ورود نمایشی است. برای ورود از ایمیل admin@example.com و رمز عبور password123 استفاده کنید.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
