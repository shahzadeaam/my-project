
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
  date: string;
  status: 'در حال پردازش' | 'ارسال شده' | 'تحویل داده شده' | 'لغو شده';
  items: OrderItem[];
  totalAmount: string;
  shippingAddress?: string; // Optional
}

export const mockOrders: Order[] = [
  {
    id: 'order-123',
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
    date: '۱۴۰۳/۰۴/۱۰',
    status: 'در حال پردازش',
    items: [
      { id: 'prod-007', name: 'پیراهن ساحلی نخی', quantity: 1, price: '۸۹۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/100x125.png', imageHint: 'summer dress' },
      { id: 'prod-006', name: 'روسری نخی طرح‌دار', quantity: 3, price: '۴۸۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/100x125.png', imageHint: 'cotton scarf' },
    ],
    totalAmount: '۲,۳۳۰,۰۰۰ تومان',
    shippingAddress: 'شیراز، بلوار کریمخان زند، پلاک ۲۰',
  },
];
