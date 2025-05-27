
import type { Timestamp } from 'firebase/firestore';

// محصولات
export interface Product {
  id: string; // Firestore document ID - معمولا در زمان خواندن اضافه می‌شود
  name: string;
  price: number; // قیمت به صورت عددی ذخیره شود
  description: string;
  imageUrl: string;
  imageHint: string; // برای جستجوی تصویر جایگزین
  createdAt?: Timestamp; // زمان ایجاد محصول (توسط سرور مقداردهی می‌شود)
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
    showPublicProfile?: boolean;
    receiveNewsletter?: boolean;
    shareActivity?: boolean;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// آدرس‌های کاربر (به عنوان زیرکالکشن در داکیومنت کاربر)
export interface Address {
  id: string; // Firestore document ID برای آدرس
  recipientName: string;
  street: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  isDefault?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// آیتم‌های موجود در یک سفارش
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

// سفارش‌ها در کالکشن orders
export interface OrderDocument {
  id: string; // Firestore document ID برای سفارش
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'در حال پردازش' | 'ارسال شده' | 'تحویل داده شده' | 'لغو شده';
  customerInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  shippingAddress?: Address;
  paymentDetails?: {
    orderId: string;
    gateway?: string;
  };
  createdAt: Timestamp; // زمان ثبت سفارش (توسط سرور مقداردهی می‌شود)
  updatedAt?: Timestamp;
}
