
'use client'; 

import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation'; 
import { Suspense } from 'react';


function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const mockOrderId = searchParams.get('orderId'); // This is the simulated ID
  const firestoreDocId = searchParams.get('docId'); // This is the actual Firestore document ID

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center p-6 bg-gradient-to-br from-background to-muted/30">
        <Card className="w-full max-w-lg text-center shadow-2xl rounded-xl p-8">
          <CardHeader className="pt-2">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-5" />
            <CardTitle className="text-3xl font-bold text-foreground">سفارش شما با موفقیت ثبت شد!</CardTitle>
            <CardDescription className="text-muted-foreground text-lg mt-3">
              از خرید شما سپاسگزاریم. {mockOrderId ? `شماره سفارش پیگیری (نمایشی): ${mockOrderId}. ` : ''}
              {firestoreDocId && <span className="block text-xs mt-1">(شناسه واقعی سفارش در پایگاه داده: {firestoreDocId})</span>}
              جزئیات سفارش به ایمیل شما ارسال خواهد شد (نمایشی).
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <p className="text-muted-foreground mb-6">
              می‌توانید برای مشاهده سایر محصولات به فروشگاه بازگردید یا وضعیت سفارش خود را در پروفایل کاربری پیگیری نمایید.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button asChild size="lg" className="px-8 py-3 text-base">
                    <Link href="/products">بازگشت به فروشگاه</Link>
                </Button>
                 <Button asChild variant="outline" size="lg" className="px-8 py-3 text-base">
                    <Link href="/profile">مشاهده سفارش‌ها در پروفایل</Link>
                 </Button>
            </div>
          </CardContent>
           <CardFooter className="flex justify-center pt-6">
            <p className="text-xs text-muted-foreground">زومجی - خرید با اطمینان</p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">در حال بارگذاری...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
