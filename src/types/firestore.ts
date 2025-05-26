
import type { Timestamp } from 'firebase/firestore';

// Used for product listings and cart context
export interface Product {
  id: string; // Firestore document ID
  name: string;
  price: number; // Store price as number
  description: string;
  imageUrl: string;
  imageHint: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// For user profile document in Firestore
export interface UserProfileDocument {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  privacySettings?: {
    showPublicProfile?: boolean;
    receiveNewsletter?: boolean;
    shareActivity?: boolean;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// For user addresses subcollection in Firestore
export interface Address {
  id: string; // Firestore document ID
  recipientName: string;
  street: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  isDefault?: boolean;
  createdAt?: Timestamp;
}

// For items within an order
export interface OrderItem {
  productId: string;
  name: string;
  price: number; // Price per unit at the time of order
  quantity: number;
  imageUrl?: string;
}

// For orders collection in Firestore
export interface OrderDocument {
  id: string; // Firestore document ID
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'در حال پردازش' | 'ارسال شده' | 'تحویل داده شده' | 'لغو شده';
  customerInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  shippingAddress?: Address; // Can be a copy of one of the user's addresses
  paymentDetails?: { // For simulated payment
    orderId: string; // Mock order ID from payment simulation
    gateway?: string; // e.g., "Simulated Gateway"
  };
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
