
'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User, ShoppingBag, Lock, Settings, Edit3, Save, ListOrdered, Eye } from 'lucide-react';
import { mockOrders, type Order } from '@/data/orders'; // Assuming mockOrders are here
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import type { Metadata } from 'next';

// Cannot use metadata in client component, would need to move to parent or make this a server component
// export const metadata: Metadata = {
//   title: 'پروفایل کاربری - نیلوفر بوتیک',
//   description: 'مدیریت اطلاعات کاربری و مشاهده تاریخچه سفارش‌ها در نیلوفر بوتیک.',
// };

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export default function ProfilePage() {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: 'کاربر نمونه نیلوفر',
    email: 'user.niloofar@example.com',
    phoneNumber: '۰۹۱۲۳۴۵۶۷۸۹',
  });
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveInfo = () => {
    setProfile(tempProfile);
    setIsEditingInfo(false);
    // In a real app, call an API to save data here
    console.log('Profile info saved (mock):', tempProfile);
  };

  const handleCancelEdit = () => {
    setTempProfile(profile);
    setIsEditingInfo(false);
  };
  
  const getOrderStatusBadgeVariant = (status: Order['status']): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'تحویل داده شده':
        return "default"; // Typically green, but default is primary here
      case 'ارسال شده':
        return "secondary"; // Blue/Info
      case 'در حال پردازش':
        return "outline"; // Yellow/Warning - using outline as substitute
      case 'لغو شده':
        return "destructive";
      default:
        return "outline";
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            پروفایل کاربری شما
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            اطلاعات حساب خود را مدیریت کنید و سفارش‌هایتان را پیگیری نمایید.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Navigation/Quick Settings (optional for now) */}
          {/* <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>دسترسی سریع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start"><User className="ml-2 h-4 w-4" /> اطلاعات شخصی</Button>
                <Button variant="ghost" className="w-full justify-start"><ListOrdered className="ml-2 h-4 w-4" /> تاریخچه سفارشات</Button>
                <Button variant="ghost" className="w-full justify-start"><Lock className="ml-2 h-4 w-4" /> تغییر رمز عبور</Button>
                <Button variant="ghost" className="w-full justify-start"><Settings className="ml-2 h-4 w-4" /> تنظیمات حساب</Button>
              </CardContent>
            </Card>
          </div> */}

          {/* Right Column - Main Content */}
          <div className="md:col-span-3 space-y-8">
            {/* Personal Information Section */}
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">اطلاعات شخصی</CardTitle>
                </div>
                {!isEditingInfo ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditingInfo(true)}>
                    <Edit3 className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> ویرایش
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={handleSaveInfo}>
                      <Save className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> ذخیره
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                      لغو
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                {isEditingInfo ? (
                  <>
                    <div>
                      <Label htmlFor="fullName">نام و نام خانوادگی</Label>
                      <Input id="fullName" name="fullName" value={tempProfile.fullName} onChange={handleInputChange} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">آدرس ایمیل</Label>
                      <Input id="email" name="email" type="email" value={tempProfile.email} onChange={handleInputChange} dir="ltr" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">شماره تماس</Label>
                      <Input id="phoneNumber" name="phoneNumber" type="tel" value={tempProfile.phoneNumber} onChange={handleInputChange} dir="ltr" className="mt-1" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between py-2 border-b border-dashed">
                      <span className="text-sm text-muted-foreground">نام و نام خانوادگی:</span>
                      <span className="font-medium">{profile.fullName}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-dashed">
                      <span className="text-sm text-muted-foreground">آدرس ایمیل:</span>
                      <span className="font-medium dir-ltr">{profile.email}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">شماره تماس:</span>
                      <span className="font-medium dir-ltr">{profile.phoneNumber}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Order History Section */}
            <Card className="shadow-lg">
              <CardHeader className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">تاریخچه سفارش‌ها</CardTitle>
              </CardHeader>
              <CardContent>
                {mockOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>شناسه سفارش</TableHead>
                        <TableHead className="hidden sm:table-cell">تاریخ</TableHead>
                        <TableHead>مبلغ کل</TableHead>
                        <TableHead>وضعیت</TableHead>
                        <TableHead className="text-left">جزئیات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-xs">{order.id}</TableCell>
                          <TableCell className="hidden sm:table-cell">{order.date}</TableCell>
                          <TableCell>{order.totalAmount}</TableCell>
                          <TableCell>
                            <Badge variant={getOrderStatusBadgeVariant(order.status)} 
                                   className={
                                     order.status === 'تحویل داده شده' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' :
                                     order.status === 'ارسال شده' ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' :
                                     order.status === 'در حال پردازش' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200' :
                                     order.status === 'لغو شده' ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' : ''
                                   }>
                                {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-left">
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only sm:not-sr-only sm:ml-1 rtl:sm:mr-1">مشاهده</span>
                              </Button>
                            </DialogTrigger>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-4">شما تاکنون هیچ سفارشی ثبت نکرده‌اید.</p>
                )}
              </CardContent>
            </Card>

            {/* Account Settings Section */}
            <Card className="shadow-lg">
              <CardHeader className="flex items-center gap-3">
                <Settings className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">تنظیمات حساب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                 <Button variant="outline" className="w-full justify-start text-base py-3 h-auto">
                    <Lock className="ml-3 h-5 w-5 rtl:mr-3 rtl:ml-0" />
                    تغییر رمز عبور (نمایشی)
                </Button>
                <Button variant="outline" className="w-full justify-start text-base py-3 h-auto">
                    <Settings className="ml-3 h-5 w-5 rtl:mr-3 rtl:ml-0" />
                    مدیریت آدرس‌ها (نمایشی)
                </Button>
                 <Button variant="outline" className="w-full justify-start text-base py-3 h-auto">
                    <User className="ml-3 h-5 w-5 rtl:mr-3 rtl:ml-0" />
                    تنظیمات حریم خصوصی (نمایشی)
                </Button>
              </CardContent>
               <CardFooter>
                 <p className="text-xs text-muted-foreground">این بخش‌ها در آینده تکمیل خواهند شد.</p>
               </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg md:max-w-2xl max-h-[80svh] flex flex-col">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">جزئیات سفارش: {selectedOrder.id}</DialogTitle>
                <DialogDescription>
                  تاریخ ثبت: {selectedOrder.date} - وضعیت: <Badge variant={getOrderStatusBadgeVariant(selectedOrder.status)}
                       className={
                         selectedOrder.status === 'تحویل داده شده' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' :
                         selectedOrder.status === 'ارسال شده' ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' :
                         selectedOrder.status === 'در حال پردازش' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200' :
                         selectedOrder.status === 'لغو شده' ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' : ''
                       }>{selectedOrder.status}</Badge>
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 overflow-y-auto flex-grow pr-2 space-y-3">
                <h4 className="font-semibold mb-2">آیتم‌های سفارش:</h4>
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 border-b pb-2">
                    {item.imageUrl && (
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image src={item.imageUrl} alt={item.name} layout="fill" objectFit="cover" data-ai-hint={item.imageHint || "product"} />
                      </div>
                    )}
                    <div className="flex-grow">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">تعداد: {item.quantity}</p>
                      <p className="text-xs text-muted-foreground">قیمت واحد: {item.price}</p>
                    </div>
                     <p className="text-sm font-semibold">{ (parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity).toLocaleString('fa-IR') } تومان</p>
                  </div>
                ))}
                {selectedOrder.shippingAddress && (
                    <div className="pt-3">
                        <h4 className="font-semibold mb-1">آدرس ارسال:</h4>
                        <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress}</p>
                    </div>
                )}
                 <Separator className="my-3" />
                 <div className="flex justify-between items-center font-bold text-md">
                    <span>مبلغ کل سفارش:</span>
                    <span>{selectedOrder.totalAmount}</span>
                 </div>
              </div>
              <DialogFooter className="mt-auto pt-4 border-t">
                <DialogClose asChild>
                  <Button type="button" variant="outline">بستن</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
