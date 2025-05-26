
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
import type { CartItem as CartItemType } from '@/context/cart-context'; // CartItemType uses Product from firestore (price is number)
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CreditCard, ShoppingBag, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { db, Timestamp } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { OrderDocument, OrderItem, Address as UserAddress } from '@/types/firestore';

const checkoutFormSchema = z.object({
  fullName: z.string().min(3, { message: 'نام و نام خانوادگی باید حداقل ۳ حرف باشد.' }),
  email: z.string().email({ message: 'آدرس ایمیل نامعتبر است.' }),
  phoneNumber: z.string().regex(/^09[0-9]{9}$/, { message: 'شماره تماس باید با 09 شروع شود و ۱۱ رقم باشد.' }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

function OrderSummaryItem({ item }: { item: CartItemType }) {
  // item.price is now a number
  const totalPriceForItem = item.price * item.quantity;

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('fa-IR')} تومان`;
  };

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
  const { currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
  });

  useEffect(() => {
    if (currentUser) {
      setValue('fullName', currentUser.displayName || '');
      setValue('email', currentUser.email || '');
      // Assuming phone number is not directly in currentUser from Firebase Auth
      // It would be fetched from user's Firestore profile if available
    }
  }, [currentUser, setValue]);

  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      router.replace('/cart');
    }
  }, [items, router, isProcessing]);

  const cartTotal = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('fa-IR')} تومان`;
  };

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    if (!currentUser) {
      toast({
        title: "خطا",
        description: "برای تکمیل خرید باید وارد حساب کاربری خود شوید.",
        variant: "destructive",
      });
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('idle');
    const mockOrderId = `ORD-${Date.now().toString().slice(-6)}`;

    // Simulate payment gateway interaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    const paymentSuccessful = true; 

    if (paymentSuccessful) {
      try {
        const orderItems: OrderItem[] = items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price, // price is already a number
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        }));

        const newOrder: Omit<OrderDocument, 'id'> = {
          userId: currentUser.uid,
          items: orderItems,
          totalAmount: cartTotal,
          status: 'در حال پردازش',
          customerInfo: {
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
          },
          // shippingAddress: undefined, // TODO: Implement address selection if needed
          paymentDetails: { // For simulated payment
            orderId: mockOrderId,
            gateway: "Simulated Gateway",
          },
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        const ordersCol = collection(db, 'orders');
        const docRef = await addDoc(ordersCol, newOrder);

        setPaymentStatus('success');
        toast({
          title: "اطلاع به ادمین (نمایشی)",
          description: `یک سفارش جدید با شناسه ${docRef.id} ثبت شد. شماره سفارش: ${mockOrderId}`,
          variant: "default",
          duration: 7000,
        });
        clearCart();
        router.push(`/order-confirmation?orderId=${mockOrderId}&docId=${docRef.id}`); 
      } catch (error) {
        console.error("Error creating order in Firestore: ", error);
        toast({
          title: "خطا در ثبت سفارش",
          description: "مشکلی در ذخیره سفارش شما در پایگاه داده پیش آمد. لطفاً با پشتیبانی تماس بگیرید.",
          variant: "destructive",
        });
        setPaymentStatus('error');
      }
    } else {
      setPaymentStatus('error');
    }
    setIsProcessing(false);
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
            این یک فرآیند پرداخت شبیه‌سازی شده است. هیچ تراکنش مالی واقعی انجام نخواهد شد. سفارش شما در پایگاه داده ثبت خواهد شد.
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
                  {/* TODO: Add address selection here if multiple addresses are supported */}
                  <Button type="submit" size="lg" className="w-full mt-6 h-12 text-base" disabled={isProcessing || !currentUser}>
                    {isProcessing ? (
                      <>
                        <CreditCard className="ml-2 h-5 w-5 animate-pulse rtl:mr-2 rtl:ml-0" />
                        در حال پردازش سفارش...
                      </>
                    ) : (
                      <>
                        <CreditCard className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
                        ثبت سفارش و پرداخت (شبیه‌سازی)
                      </>
                    )}
                  </Button>
                   {!currentUser && <p className="text-sm text-destructive mt-2 text-center">برای تکمیل خرید باید وارد حساب کاربری خود شوید.</p>}
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
                 <p>پس از تکمیل اطلاعات، سفارش شما ثبت خواهد شد.</p>
                 <p>این سفارش شامل هزینه ارسال نمی‌باشد (در این مرحله).</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
