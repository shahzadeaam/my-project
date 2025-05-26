
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BellRing, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  channel: 'sms' | 'email' | 'inAppUser' | 'inAppAdmin';
  enabled: boolean;
}

const initialSettings: NotificationSetting[] = [
  { id: 'user-order-confirmation-sms', label: 'تایید سفارش کاربر (پیامک)', description: 'ارسال پیامک به کاربر پس از ثبت موفق سفارش.', channel: 'sms', enabled: true },
  { id: 'user-order-shipped-sms', label: 'ارسال سفارش کاربر (پیامک)', description: 'ارسال پیامک به کاربر هنگام ارسال سفارش.', channel: 'sms', enabled: true },
  { id: 'user-order-status-change-inapp', label: 'تغییر وضعیت سفارش (داخل سایت)', description: 'نمایش نوتیفیکیشن به کاربر هنگام تغییر وضعیت سفارش.', channel: 'inAppUser', enabled: true },
  { id: 'user-discount-news-inapp', label: 'تخفیف‌ها و اخبار (داخل سایت)', description: 'نمایش نوتیفیکیشن تخفیف‌ها و اخبار جدید به کاربران.', channel: 'inAppUser', enabled: false },
  { id: 'admin-new-order-email', label: 'ثبت سفارش جدید (ایمیل به ادمین)', description: 'ارسال ایمیل به ادمین هنگام ثبت سفارش جدید.', channel: 'email', enabled: true },
  { id: 'admin-new-order-inapp', label: 'ثبت سفارش جدید (داخل پنل ادمین)', description: 'نمایش نوتیفیکیشن در پنل ادمین هنگام ثبت سفارش جدید.', channel: 'inAppAdmin', enabled: true },
];


export default function AdminNotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings);

  const handleToggle = (id: string) => {
    setSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
    // In a real app, you would save this change to the backend.
    console.log(`Notification setting ${id} toggled (mock).`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">تنظیمات اطلاع‌رسانی</h2>
        <p className="text-sm text-muted-foreground">
          مدیریت نحوه و زمان ارسال اطلاع‌رسانی‌ها به کاربران و مدیران.
        </p>
      </div>

      <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800">
          <AlertTriangle className="h-5 w-5 !text-yellow-800" />
          <AlertTitle className="font-semibold">توجه: تنظیمات نمایشی</AlertTitle>
          <AlertDescription>
            این تنظیمات صرفاً جنبه نمایشی دارند و در حال حاضر عملکرد واقعی در سیستم ایجاد نمی‌کنند. برای فعال‌سازی کامل، نیاز به توسعه بک‌اند و اتصال به سرویس‌های پیامک و ایمیل است.
          </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary" />
            لیست اعلان‌ها
          </CardTitle>
          <CardDescription>
            فعال یا غیرفعال کردن انواع مختلف اعلان‌های سیستم.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {settings.map((setting, index) => (
            <div key={setting.id}>
              <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse">
                <div className="flex-1">
                  <Label htmlFor={setting.id} className="text-base font-medium">
                    {setting.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
                </div>
                <Switch
                  id={setting.id}
                  checked={setting.enabled}
                  onCheckedChange={() => handleToggle(setting.id)}
                  aria-label={setting.label}
                />
              </div>
              {index < settings.length - 1 && <Separator className="mt-5" />}
            </div>
          ))}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                تغییرات در این بخش (در صورت پیاده‌سازی بک‌اند) بلافاصله اعمال خواهند شد.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
