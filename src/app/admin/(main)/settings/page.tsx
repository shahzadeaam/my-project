
// This is a placeholder page for admin settings
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cog } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-semibold tracking-tight">تنظیمات پنل مدیریت</h2>
            <p className="text-sm text-muted-foreground">
                پیکربندی و تنظیمات عمومی پنل مدیریت.
            </p>
        </div>
        <Card className="min-h-[400px] flex flex-col items-center justify-center">
            <CardHeader className="text-center">
            <Cog className="mx-auto h-16 w-16 text-muted-foreground mb-4 animate-spin-slow" />
            <CardTitle className="text-xl">بخش تنظیمات</CardTitle>
            <CardDescription className="text-muted-foreground">
                این بخش برای تنظیمات کلی پنل ادمین در آینده در نظر گرفته شده است.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <p className="text-sm text-muted-foreground">
                (گزینه‌های تنظیمات مانند اطلاعات فروشگاه، تنظیمات ایمیل و ... در اینجا قرار خواهد گرفت.)
            </p>
            </CardContent>
        </Card>
    </div>
  );
}

// Add this to tailwind.config.ts if you want the slow spin animation:
// theme: {
//   extend: {
//     animation: {
//       'spin-slow': 'spin 3s linear infinite',
//     }
//   }
// }
