
import type { Timestamp } from 'firebase/firestore';

// محصولات
export interface Product {
  id: string; // Firestore document ID
  name: string;
  price: number; // قیمت به صورت عددی ذخیره شود
  description: string;
  imageUrl: string;
  imageHint: string; // برای جستجوی تصویر جایگزین
  createdAt?: Timestamp; // زمان ایجاد محصول
  updatedAt?: Timestamp; // زمان آخرین به‌روزرسانی
}

// پروفایل کاربر در کالکشن users
export interface UserProfileDocument {
  uid: string; // شناسه کاربر از Firebase Authentication
  fullName: string;
  email: string; // ایمیل کاربر، همگام با Firebase Auth
  phoneNumber?: string; // شماره تماس (اختیاری)
  role?: 'customer' | 'admin'; // نقش کاربر
  privacySettings?: {
    showPublicProfile?: boolean; // آیا پروفایل عمومی نمایش داده شود (برای آینده)
    receiveNewsletter?: boolean; // آیا خبرنامه دریافت کند
    shareActivity?: boolean; // برای آینده، اشتراک فعالیت خرید
  };
  createdAt?: Timestamp; // زمان ایجاد پروفایل
  updatedAt?: Timestamp; // زمان آخرین به‌روزرسانی پروفایل
}

// آدرس‌های کاربر (به عنوان زیرکالکشن در داکیومنت کاربر)
export interface Address {
  id: string; // Firestore document ID برای آدرس
  recipientName: string; // نام گیرنده
  street: string; // خیابان، کوچه، پلاک
  city: string; // شهر
  postalCode: string; // کد پستی
  phoneNumber: string; // شماره تماس برای این آدرس
  isDefault?: boolean; // آیا آدرس پیش‌فرض است
  createdAt?: Timestamp; // زمان ایجاد آدرس
  updatedAt?: Timestamp; // زمان آخرین به‌روزرسانی آدرس
}

// آیتم‌های موجود در یک سفارش
export interface OrderItem {
  productId: string; // شناسه محصول
  name: string; // نام محصول در زمان سفارش
  price: number; // قیمت واحد محصول در زمان سفارش
  quantity: number; // تعداد سفارش داده شده
  imageUrl?: string; // URL تصویر محصول در زمان سفارش
}

// سفارش‌ها در کالکشن orders
export interface OrderDocument {
  id: string; // Firestore document ID برای سفارش
  userId: string; // UID کاربری که سفارش را ثبت کرده
  items: OrderItem[]; // لیست محصولات سفارش داده شده
  totalAmount: number; // مبلغ کل سفارش
  status: 'در حال پردازش' | 'ارسال شده' | 'تحویل داده شده' | 'لغو شده'; // وضعیت سفارش
  customerInfo: { // اطلاعات مشتری که در فرم پرداخت وارد شده
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  shippingAddress?: Address; // آدرس ارسال سفارش (می‌تواند کپی از آدرس کاربر یا آدرس جدید باشد)
  paymentDetails?: { // جزئیات پرداخت شبیه‌سازی شده
    orderId: string; // شناسه سفارش از درگاه پرداخت (نمایشی)
    gateway?: string; // نام درگاه (نمایشی)
  };
  createdAt: Timestamp; // زمان ثبت سفارش
  updatedAt?: Timestamp; // زمان آخرین به‌روزرسانی وضعیت سفارش
}
