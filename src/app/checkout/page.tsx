
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useCart } from '@/context/cart-context';
import type { CartItem as CartItemType } from '@/context/cart-context';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CreditCard, ShoppingBag, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast'; // Added useToast

const checkoutFormSchema = z.object({
  fullName: z.string().min(3, { message: 'نام و نام خانوادگی باید حداقل ۳ حرف باشد.' }),
  email: z.string().email({ message: 'آدرس ایمیل نامعتبر است.' }),
  phoneNumber: z.string().regex(/^09[0-9]{9}$/, { message: 'شماره تماس باید با 09 شروع شود و ۱۱ رقم باشد.' }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

function OrderSummaryItem({ item }: { item: CartItemType }) {
  const parsePrice = (priceString: string): number => {
    const cleanedString = priceString.replace(/[^\d]/g, '');
    return parseInt(cleanedString, 10) || 0;
  };
  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('fa-IR')} تومان`;
  };
  const itemPrice = parsePrice(item.price);
  const totalPriceForItem = itemPrice * item.quantity;

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
          <Image src={item.imageUrl} alt={item.name} layout="fill" objectFit="cover" data-ai-hint={item.imageHint} />
        </div>
        <div>
          <p className="font-medium text-sm text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">تعداد: {item.quantity}</p>
        </div>
      </div>
      <p className="text-sm font-semibold text-foreground">{formatPrice(totalPriceForItem)}</p>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast(); // Initialized useToast
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
  });

  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      router.replace('/cart');
    }
  }, [items, router, isProcessing]);

  const parsePrice = (priceString: string): number => {
    const cleanedString = priceString.replace(/[^\d]/g, '');
    return parseInt(cleanedString, 10) || 0;
  };

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('fa-IR')} تومان`;
  };

  const cartTotal = items.reduce((total, item) => {
    return total + (parsePrice(item.price) * item.quantity);
  }, 0);

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    setIsProcessing(true);
    setPaymentStatus('idle');
    console.log('Checkout data:', data);
    const mockOrderId = `ORD-${Date.now().toString().slice(-6)}`;


    // Simulate payment gateway interaction
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate a successful payment for this example
    const paymentSuccessful = true; // Math.random() > 0.2; // Simulate success/failure

    if (paymentSuccessful) {
      setPaymentStatus('success');
      
      // Simulate admin notification
      toast({
        title: "اطلاع به ادمین (نمایشی)",
        description: `یک سفارش جدید با موفقیت ثبت شد. شماره سفارش: ${mockOrderId}`,
        variant: "default",
        duration: 5000, // Show for 5 seconds
      });

      // Normally, order details would be sent to a backend here
      // And then cart would be cleared upon successful backend confirmation
      clearCart();
      router.push(`/order-confirmation?orderId=${mockOrderId}`); 
    } else {
      setPaymentStatus('error');
      setIsProcessing(false);
    }
  };
  
  if (items.length === 0 && !isProcessing) {
     return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground mb-6">سبد خرید شما برای پرداخت خالی است.</p>
            <Button asChild>
              <Link href="/products">بازگشت به فروشگاه</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            تکمیل خرید و پرداخت
          </h1>
        </div>

        <Alert variant="default" className="mb-8 bg-blue-50 border-blue-200 text-blue-700">
          <Info className="h-5 w-5 !text-blue-700" />
          <AlertTitle className="font-semibold">توجه: پرداخت آزمایشی</AlertTitle>
          <AlertDescription>
            این یک فرآیند پرداخت شبیه‌سازی شده است. هیچ تراکنش مالی واقعی انجام نخواهد شد و به درگاه پرداخت واقعی متصل نمی‌شوید.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="md:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">اطلاعات خریدار</CardTitle>
                <CardDescription>لطفا اطلاعات خود را برای تکمیل سفارش وارد کنید.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="fullName">نام و نام خانوادگی</Label>
                    <Input id="fullName" {...register('fullName')} className="mt-1 h-11" />
                    {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">آدرس ایمیل</Label>
                    <Input id="email" type="email" {...register('email')} dir="ltr" className="mt-1 h-11" />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">شماره تماس</Label>
                    <Input id="phoneNumber" type="tel" {...register('phoneNumber')} dir="ltr" className="mt-1 h-11" />
                    {errors.phoneNumber && <p className="text-sm text-destructive mt-1">{errors.phoneNumber.message}</p>}
                  </div>
                  <Button type="submit" size="lg" className="w-full mt-6 h-12 text-base" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <CreditCard className="ml-2 h-5 w-5 animate-pulse rtl:mr-2 rtl:ml-0" />
                        در حال انتقال به درگاه پرداخت...
                      </>
                    ) : (
                      <>
                        <CreditCard className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
                        پرداخت و تکمیل سفارش
                      </>
                    )}
                  </Button>
                </form>
                {paymentStatus === 'error' && (
                  <Alert variant="destructive" className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>پرداخت ناموفق</AlertTitle>
                    <AlertDescription>
                      متاسفانه در فرآیند پرداخت مشکلی پیش آمد. لطفا مجددا تلاش کنید یا با پشتیبانی تماس بگیرید.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">خلاصه سفارش</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map(item => (
                  <OrderSummaryItem key={item.id} item={item} />
                ))}
                <Separator className="my-4" />
                <div className="flex items-center justify-between text-lg font-semibold">
                  <p>مبلغ کل قابل پرداخت:</p>
                  <p className="text-primary">{formatPrice(cartTotal)}</p>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-xs text-muted-foreground">
                 <p>پس از تکمیل اطلاعات، به صفحه پرداخت امن هدایت خواهید شد.</p>
                 <p>این سفارش شامل هزینه ارسال نمی‌باشد.</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

