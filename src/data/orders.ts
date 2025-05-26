
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string; // Price per unit
  imageUrl?: string; // Optional image for the item
  imageHint?: string;
}

export interface Order {
  id: string;
  userId: string; // ID of the user who placed the order
  date: string;
  status: 'در حال پردازش' | 'ارسال شده' | 'تحویل داده شده' | 'لغو شده';
  items: OrderItem[];
  totalAmount: string;
  shippingAddress?: string; // Optional
}

/**
 * IMPORTANT FOR PROTOTYPE TESTING:
 * To see orders for a specific user in the profile page:
 * 1. Register a test user in your Firebase project.
 * 2. Get their UID from the Firebase Authentication console.
 * 3. Replace one of the `mock_firebase_uid_...` values below with that actual UID.
 * This will simulate that user having placed those orders.
 */
const MOCK_USER_ID_1 = 'mock_firebase_uid_user1';
const MOCK_USER_ID_2 = 'mock_firebase_uid_user2';

export const mockOrders: Order[] = [
  {
    id: 'order-123',
    userId: MOCK_USER_ID_1,
    date: '۱۴۰۳/۰۳/۱۵',
    status: 'تحویل داده شده',
    items: [
      { id: 'prod-001', name: 'مانتو کتان بهاره', quantity: 1, price: '۱,۸۵۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/100x125.png', imageHint: 'spring manteau' },
      { id: 'prod-002', name: 'شومیز حریر مجلسی', quantity: 2, price: '۹۵۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/100x125.png', imageHint: 'party blouse' },
    ],
    totalAmount: '۳,۷۵۰,۰۰۰ تومان',
    shippingAddress: 'تهران، خیابان آزادی، پلاک ۱۰، واحد ۵',
  },
  {
    id: 'order-456',
    userId: MOCK_USER_ID_2, // Belongs to a different mock user
    date: '۱۴۰۳/۰۴/۰۲',
    status: 'ارسال شده',
    items: [
      { id: 'prod-004', name: 'کیف دوشی چرم طبیعی', quantity: 1, price: '۲,۳۰۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/100x125.png', imageHint: 'leather handbag' },
    ],
    totalAmount: '۲,۳۰۰,۰۰۰ تومان',
    shippingAddress: 'اصفهان، خیابان چهارباغ، کوچه بهار، پلاک ۸',
  },
  {
    id: 'order-789',
    userId: MOCK_USER_ID_1,
    date: '۱۴۰۳/۰۴/۱۰',
    status: 'در حال پردازش',
    items: [
      { id: 'prod-007', name: 'پیراهن ساحلی نخی', quantity: 1, price: '۸۹۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/100x125.png', imageHint: 'summer dress' },
      { id: 'prod-006', name: 'روسری نخی طرح‌دار', quantity: 3, price: '۴۸۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/100x125.png', imageHint: 'cotton scarf' },
    ],
    totalAmount: '۲,۳۳۰,۰۰۰ تومان',
    shippingAddress: 'شیراز، بلوار کریمخان زند، پلاک ۲۰',
  },
  {
    id: 'order-010',
    userId: MOCK_USER_ID_1,
    date: '۱۴۰۳/۰۲/۰۵',
    status: 'لغو شده',
    items: [
      { id: 'prod-005', name: 'کفش پاشنه‌دار چرم', quantity: 1, price: '۱,۶۰۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/100x125.png', imageHint: 'leather heels' },
    ],
    totalAmount: '۱,۶۰۰,۰۰۰ تومان',
    shippingAddress: 'مشهد، بلوار سجاد، خیابان امین',
  },
];
