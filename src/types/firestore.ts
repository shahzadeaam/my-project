
import type { Timestamp } from 'firebase/firestore';

// محصولات
export interface Product {
  id: string; // Firestore document ID - معمولا در زمان خواندن اضافه می‌شود
  name: string; // نام محصول
  price: number; // قیمت به صورت عددی ذخیره شود
  description: string; // توضیحات محصول
  imageUrl?: string; // آدرس URL تصویر محصول (اختیاری)
  imageHint?: string; // برای جستجوی تصویر جایگزین (اختیاری)
  createdAt?: Timestamp; // زمان ایجاد محصول (توسط سرور مقداردهی می‌شود)
  updatedAt?: Timestamp; // زمان آخرین به‌روزرسانی
}

// پروفایل کاربر در کالکشن users
export interface UserProfileDocument {
  uid: string; // شناسه کاربر از Firebase Authentication
  fullName: string; // نام و نام خانوادگی
  email: string; // ایمیل کاربر، همگام با Firebase Auth
  phoneNumber?: string; // شماره تماس (اختیاری)
  role?: 'customer' | 'admin'; // نقش کاربر
  privacySettings?: {
    showPublicProfile?: boolean; // نمایش پروفایل به صورت عمومی
    receiveNewsletter?: boolean; // دریافت خبرنامه و پیشنهادات
    shareActivity?: boolean; // اشتراک‌گذاری فعالیت خرید با شرکای تجاری (نمایشی)
  };
  createdAt?: Timestamp; // زمان ایجاد پروفایل
  updatedAt?: Timestamp; // زمان آخرین به‌روزرسانی پروفایل
}

// آدرس‌های کاربر (به عنوان زیرکالکشن در داکیومنت کاربر)
export interface Address {
  id: string; // Firestore document ID برای آدرس
  recipientName: string; // نام گیرنده
  street: string; // خیابان، کوچه، پلاک، واحد
  city: string; // شهر
  postalCode: string; // کد پستی
  phoneNumber: string; // شماره تماس برای این آدرس
  isDefault?: boolean; // آیا این آدرس پیش‌فرض است
  createdAt?: Timestamp; // زمان ایجاد آدرس
  updatedAt?: Timestamp; // زمان آخرین به‌روزرسانی آدرس
}

// آیتم‌های موجود در یک سفارش
export interface OrderItem {
  productId: string; // شناسه محصولی که سفارش داده شده
  name: string; // نام محصول در زمان سفارش
  price: number; // قیمت واحد محصول در زمان سفارش
  quantity: number; // تعداد سفارش داده شده
  imageUrl?: string; // آدرس URL تصویر محصول در زمان سفارش (اختیاری)
}

// سفارش‌ها در کالکشن orders
export interface OrderDocument {
  id: string; // Firestore document ID برای سفارش
  userId: string; // شناسه کاربری که سفارش را ثبت کرده
  items: OrderItem[]; // لیست آیتم‌های سفارش
  totalAmount: number; // مبلغ کل سفارش
  status: 'در حال پردازش' | 'ارسال شده' | 'تحویل داده شده' | 'لغو شده'; // وضعیت سفارش
  customerInfo: { // اطلاعات مشتری از فرم پرداخت
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  shippingAddress?: Address; // آدرس ارسال (می‌تواند کپی از آدرس کاربر یا آدرس جدید باشد)
  paymentDetails?: { // جزئیات پرداخت (نمایشی)
    orderId: string; // شماره سفارش از درگاه پرداخت (نمایشی)
    gateway?: string; // نام درگاه پرداخت (نمایشی)
  };
  createdAt: Timestamp; // زمان ثبت سفارش (توسط سرور مقداردهی می‌شود)
  updatedAt?: Timestamp; // زمان آخرین به‌روزرسانی وضعیت سفارش
}
