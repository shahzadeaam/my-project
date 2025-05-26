
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Send, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Metadata } from 'next'; // For reference, actual metadata set by parent

// If this page needs strict metadata, it should be set in a parent Server Component or layout.
// export const metadata: Metadata = {
//   title: 'تماس با ما - نیلوفر بوتیک',
//   description: 'با تیم پشتیبانی نیلوفر بوتیک در تماس باشید یا پیام خود را ارسال کنید.',
// };

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'نام باید حداقل ۲ حرف باشد.' }).max(50, { message: 'نام نمی‌تواند بیشتر از ۵۰ حرف باشد.'}),
  email: z.string().email({ message: 'آدرس ایمیل نامعتبر است.' }),
  subject: z.string().min(5, { message: 'موضوع باید حداقل ۵ حرف باشد.' }).max(100, { message: 'موضوع نمی‌تواند بیشتر از ۱۰۰ حرف باشد.'}),
  message: z.string().min(10, { message: 'پیام شما باید حداقل ۱۰ حرف باشد.' }).max(1000, { message: 'پیام شما نمی‌تواند بیشتر از ۱۰۰۰ حرف باشد.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    console.log('Contact form data (mock submission):', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: 'پیام شما (به صورت نمایشی) ارسال شد!',
      description: 'از تماس شما سپاسگزاریم. به زودی پاسخگوی شما خواهیم بود.',
      variant: 'default',
      duration: 5000,
    });
    reset(); // Reset form after successful mock submission
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card className="shadow-xl mb-10">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              تماس با ما
            </CardTitle>
            <CardDescription className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              ما همیشه آماده پاسخگویی به سوالات، شنیدن نظرات و پیشنهادات سازنده شما هستیم. از یکی از راه‌های زیر با ما در ارتباط باشید.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3">
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Send className="h-6 w-6 text-primary rtl:ml-2 rtl:mr-0" />
                  ارسال پیام مستقیم
                </CardTitle>
                <CardDescription>فرم زیر را تکمیل کنید تا پیام شما مستقیماً برای تیم پشتیبانی ما ارسال شود.</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
                    <Info className="h-5 w-5 !text-blue-700" />
                    <AlertTitle className="font-semibold">توجه: ارسال نمایشی</AlertTitle>
                    <AlertDescription>
                      این فرم در حال حاضر پیام واقعی به ایمیل مدیر ارسال نمی‌کند و صرفاً جنبه نمایشی دارد. اطلاعات ورودی شما در کنسول مرورگر نمایش داده خواهد شد.
                    </AlertDescription>
                </Alert>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <Label htmlFor="name">نام و نام خانوادگی</Label>
                    <Input id="name" {...register('name')} className="mt-1.5 h-11" placeholder="مثلا: نیلوفر محمدی" />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">آدرس ایمیل</Label>
                    <Input id="email" type="email" {...register('email')} dir="ltr" className="mt-1.5 h-11" placeholder="example@email.com" />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                  </div>
                   <div>
                    <Label htmlFor="subject">موضوع پیام</Label>
                    <Input id="subject" {...register('subject')} className="mt-1.5 h-11" placeholder="مثلا: سوال در مورد محصول X" />
                    {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="message">متن پیام شما</Label>
                    <Textarea id="message" {...register('message')} rows={6} className="mt-1.5" placeholder="پیام خود را با جزئیات اینجا بنویسید..." />
                    {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" size="lg" className="w-full h-12 text-base font-semibold" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                         <Send className="ml-2 h-4 w-4 animate-pulse rtl:mr-2 rtl:ml-0" />
                         در حال ارسال...
                        </>
                    ) : (
                        <>
                         <Send className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                         ارسال پیام
                        </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-primary rtl:ml-2 rtl:mr-0" />
                  اطلاعات تماس
                </CardTitle>
                <CardDescription>می‌توانید از طریق اطلاعات زیر نیز با ما در تماس باشید.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-muted-foreground pt-1">
                <div className="flex items-start gap-4 p-3 rounded-md hover:bg-muted/30 transition-colors">
                  <MapPin className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground text-base mb-0.5">آدرس دفتر مرکزی (نمایشی):</h3>
                    <p className="text-sm">تهران، خیابان ولیعصر، بالاتر از پارک ساعی، کوچه نیلوفر، پلاک ۱۰، واحد ۳</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-md hover:bg-muted/30 transition-colors">
                  <Phone className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground text-base mb-0.5">تلفن پشتیبانی (نمایشی):</h3>
                    <p dir="ltr" className="text-sm hover:text-primary transition-colors">۰۲۱ - ۸۸ ۷۷ ۶۶ ۵۵</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-md hover:bg-muted/30 transition-colors">
                  <Mail className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground text-base mb-0.5">آدرس ایمیل (نمایشی):</h3>
                    <p dir="ltr" className="text-sm hover:text-primary transition-colors">support@niloofarboutique.com</p>
                  </div>
                </div>
                 <div className="pt-2 p-3 rounded-md hover:bg-muted/30 transition-colors">
                      <h3 className="font-semibold text-foreground text-base mb-1.5">ساعات کاری پشتیبانی (نمایشی):</h3>
                      <p className="text-sm">شنبه تا چهارشنبه: ۹:۰۰ صبح الی ۱۸:۰۰ عصر</p>
                      <p className="text-sm">پنجشنبه‌ها: ۹:۰۰ صبح الی ۱۴:۰۰ ظهر</p>
                      <p className="text-sm mt-1">روزهای تعطیل رسمی، پشتیبانی از طریق ایمیل انجام می‌شود.</p>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
