
export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'مانتو کتان بهاره',
    price: '۱,۸۵۰,۰۰۰ تومان',
    description: 'مانتو کتان خنک و سبک، مناسب برای فصل بهار و تابستان با دوخت عالی.',
    imageUrl: 'https://placehold.co/400x500.png',
    imageHint: 'spring manteau',
  },
  {
    id: 'prod-002',
    name: 'شومیز حریر مجلسی',
    price: '۹۵۰,۰۰۰ تومان',
    description: 'شومیز حریر با طراحی شیک و مناسب برای مهمانی‌ها و مجالس رسمی.',
    imageUrl: 'https://placehold.co/400x500.png',
    imageHint: 'party blouse',
  },
  {
    id: 'prod-003',
    name: 'دامن جین کوتاه',
    price: '۷۲۰,۰۰۰ تومان',
    description: 'دامن جین کوتاه اسپرت، ایده‌آل برای استایل‌های روزمره و جوان‌پسند.',
    imageUrl: 'https://placehold.co/400x500.png',
    imageHint: 'denim miniskirt',
  },
  {
    id: 'prod-004',
    name: 'کیف دوشی چرم طبیعی',
    price: '۲,۳۰۰,۰۰۰ تومان',
    description: 'کیف دوشی ساخته شده از چرم طبیعی با کیفیت بالا و طراحی کلاسیک.',
    imageUrl: 'https://placehold.co/400x500.png',
    imageHint: 'leather handbag',
  },
  {
    id: 'prod-005',
    name: 'کفش پاشنه‌دار چرم',
    price: '۱,۶۰۰,۰۰۰ تومان',
    description: 'کفش پاشنه‌دار چرم، زیبا و راحت برای استفاده در مجالس و محیط کار.',
    imageUrl: 'https://placehold.co/400x500.png',
    imageHint: 'leather heels',
  },
  {
    id: 'prod-006',
    name: 'روسری نخی طرح‌دار',
    price: '۴۸۰,۰۰۰ تومان',
    description: 'روسری نخی با طرح‌های متنوع و رنگ‌بندی شاد، مناسب فصل.',
    imageUrl: 'https://placehold.co/400x500.png',
    imageHint: 'cotton scarf',
  },
  {
    id: 'prod-007',
    name: 'پیراهن ساحلی نخی',
    price: '۸۹۰,۰۰۰ تومان',
    description: 'پیراهن ساحلی بلند و نخی، بسیار خنک و راحت برای روزهای گرم تابستان.',
    imageUrl: 'https://placehold.co/400x500.png',
    imageHint: 'summer dress',
  },
  {
    id: 'prod-008',
    name: 'ست بدلیجات ظریف',
    price: '۶۵۰,۰۰۰ تومان',
    description: 'ست بدلیجات شامل گردنبند و گوشواره با طراحی ظریف و مدرن.',
    imageUrl: 'https://placehold.co/400x500.png',
    imageHint: 'delicate jewelry',
  },
];
