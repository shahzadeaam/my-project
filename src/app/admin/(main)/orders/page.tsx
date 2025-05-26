
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageSearch } from 'lucide-react';

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-semibold tracking-tight">مدیریت سفارش‌ها</h2>
            <p className="text-sm text-muted-foreground">
                مشاهده و پیگیری سفارش‌های ثبت شده در فروشگاه.
            </p>
        </div>
        <Card className="min-h-[400px] flex flex-col items-center justify-center">
            <CardHeader className="text-center">
            <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-xl">بخش مدیریت سفارش‌ها</CardTitle>
            <CardDescription className="text-muted-foreground">
                این بخش به زودی تکمیل خواهد شد. در اینجا می‌توانید لیست سفارش‌ها، جزئیات آن‌ها و وضعیتشان را مدیریت کنید.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <p className="text-sm text-muted-foreground">
                (نمایش جدول سفارش‌ها، فیلترها، و امکان تغییر وضعیت در اینجا قرار خواهد گرفت.)
            </p>
            </CardContent>
        </Card>
    </div>
  );
}
