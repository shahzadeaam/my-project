
'use client'; // Added to make this a Client Component

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Added Button import
import { PackageSearch, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp as FirestoreTimestamp } from 'firebase/firestore';
import type { OrderDocument } from '@/types/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react'; // Import useEffect and useState for client-side data fetching

async function getOrdersFromFirestore(): Promise<OrderDocument[]> {
  const ordersCol = collection(db, 'orders');
  const ordersSnapshot = await getDocs(query(ordersCol, orderBy('createdAt', 'desc')));
  const orderList = ordersSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId || "نامشخص",
      items: data.items || [],
      totalAmount: data.totalAmount || 0,
      status: data.status || 'نامشخص',
      customerInfo: data.customerInfo || { fullName: "نامشخص", email: "", phoneNumber: "" },
      shippingAddress: data.shippingAddress,
      paymentDetails: data.paymentDetails,
      createdAt: data.createdAt, 
      updatedAt: data.updatedAt, 
    } as OrderDocument;
  });
  return orderList;
}

const getOrderStatusBadgeVariant = (status: OrderDocument['status']): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case 'تحویل داده شده': return "default"; 
    case 'ارسال شده': return "secondary"; 
    case 'در حال پردازش': return "outline"; 
    case 'لغو شده': return "destructive"; 
    default: return "outline";
  }
};

const formatOrderPrice = (price: number): string => {
  return `${price.toLocaleString('fa-IR')} تومان`;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const fetchedOrders = await getOrdersFromFirestore();
        setOrders(fetchedOrders);
      } catch (error: any) {
        console.error("Error fetching orders for admin page:", error);
        if (error.message && error.message.includes("indexes?create_composite")) {
            setFetchError("ایندکس مورد نیاز برای نمایش سفارش‌ها در پایگاه داده وجود ندارد. لطفاً با استفاده از لینک ارائه شده در کنسول Firebase (هنگام بروز این خطا در صفحه پروفایل کاربر) ایندکس را ایجاد کنید و سپس صفحه را رفرش نمایید.");
        } else if (error.message && error.message.includes("permission-denied") || error.message && error.message.includes("insufficient permissions")) {
            setFetchError("شما مجوز کافی برای دسترسی به این اطلاعات را ندارید. لطفاً با مدیر سیستم تماس بگیرید یا از صحت قوانین امنیتی Firestore اطمینان حاصل کنید.");
        }
         else {
            setFetchError("خطا در بارگذاری سفارش‌ها از پایگاه داده.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 rtl:mr-2">در حال بارگذاری سفارش‌ها...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-semibold tracking-tight">مدیریت سفارش‌ها</h2>
            <p className="text-sm text-muted-foreground">
                مشاهده و پیگیری سفارش‌های ثبت شده در فروشگاه. (تغییر وضعیت هنوز پیاده‌سازی نشده)
            </p>
        </div>
        {fetchError ? (
            <Card className="min-h-[400px] flex flex-col items-center justify-center text-center">
                <CardHeader>
                <PackageSearch className="mx-auto h-16 w-16 text-destructive mb-4" />
                <CardTitle className="text-xl text-destructive">خطا در بارگذاری سفارش‌ها</CardTitle>
                <CardDescription className="text-muted-foreground px-4 whitespace-pre-line">
                    {fetchError}
                </CardDescription>
                </CardHeader>
                 <CardContent>
                    <Button onClick={() => window.location.reload()}>تلاش مجدد</Button>
                </CardContent>
            </Card>
        ) : orders.length > 0 ? (
            <Card>
                <CardHeader>
                    <CardTitle>لیست سفارش‌ها</CardTitle>
                    <CardDescription>در مجموع {orders.length} سفارش در سیستم موجود است.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>شناسه سفارش (داخلی)</TableHead>
                                <TableHead>شماره پیگیری (نمایشی)</TableHead>
                                <TableHead className="hidden sm:table-cell">مشتری</TableHead>
                                <TableHead>مبلغ کل</TableHead>
                                <TableHead className="hidden md:table-cell">تاریخ</TableHead>
                                <TableHead>وضعیت</TableHead>
                                <TableHead className="text-left">عملیات (بزودی)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                    <TableCell className="font-mono text-xs">{order.paymentDetails?.orderId || '-'}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div>{order.customerInfo.fullName}</div>
                                        <div className="text-xs text-muted-foreground dir-ltr">{order.customerInfo.email}</div>
                                    </TableCell>
                                    <TableCell>{formatOrderPrice(order.totalAmount)}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {(order.createdAt as FirestoreTimestamp)?.toDate().toLocaleDateString('fa-IR') || 'نامشخص'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getOrderStatusBadgeVariant(order.status)}
                                            className={
                                                order.status === 'تحویل داده شده' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' :
                                                order.status === 'ارسال شده' ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' :
                                                order.status === 'در حال پردازش' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200' :
                                                order.status === 'لغو شده' ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' : ''
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-left">
                                        <Button variant="ghost" size="sm" disabled>مشاهده</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        ) : (
            <Card className="min-h-[400px] flex flex-col items-center justify-center">
                <CardHeader className="text-center">
                <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="text-xl">هیچ سفارشی یافت نشد</CardTitle>
                <CardDescription className="text-muted-foreground">
                    در حال حاضر هیچ سفارشی در پایگاه داده ثبت نشده است.
                </CardDescription>
                </CardHeader>
            </Card>
        )}
    </div>
  );
}
