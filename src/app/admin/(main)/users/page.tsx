
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersRound } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-semibold tracking-tight">مدیریت کاربران</h2>
            <p className="text-sm text-muted-foreground">
                مشاهده و مدیریت حساب‌های کاربری ثبت شده در سایت.
            </p>
        </div>
        <Card className="min-h-[400px] flex flex-col items-center justify-center">
            <CardHeader className="text-center">
            <UsersRound className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-xl">بخش مدیریت کاربران</CardTitle>
            <CardDescription className="text-muted-foreground">
                این بخش به زودی تکمیل خواهد شد. در اینجا می‌توانید لیست کاربران، وضعیت حساب و دسترسی‌هایشان را مدیریت کنید.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <p className="text-sm text-muted-foreground">
                (نمایش جدول کاربران، امکان فعال/غیرفعال کردن، و تنظیم دسترسی‌ها در اینجا قرار خواهد گرفت.)
            </p>
            </CardContent>
        </Card>
    </div>
  );
}
