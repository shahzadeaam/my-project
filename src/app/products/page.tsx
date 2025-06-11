'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/products/product-card';
import type { Product } from '@/types/firestore';
import { db, isFirebaseAvailable } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import ProductHeroBanner from '@/components/products/product-hero-banner';
import Link from 'next/link';

// Mock data for development with categories
const mockProducts: Product[] = [
  // محصولات اشتراکی
  {
    id: '1',
    name: 'اشتراک ماهانه نتفلیکس',
    price: 450000,
    description: 'دسترسی نامحدود به محتوای نتفلیکس',
    imageUrl: '/images/products/product-1.jpg',
    imageHint: 'اشتراک نتفلیکس',
    category: 'subscription',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '2',
    name: 'اشتراک اسپاتیفای',
    price: 350000,
    description: 'موسیقی بدون تبلیغات',
    imageUrl: '/images/products/product-2.jpg',
    imageHint: 'اشتراک اسپاتیفای',
    category: 'subscription',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '3',
    name: 'اشتراک یوتیوب پریمیوم',
    price: 550000,
    description: 'محتوای یوتیوب بدون تبلیغات',
    imageUrl: '/images/products/product-3.jpg',
    imageHint: 'اشتراک یوتیوب',
    category: 'subscription',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '4',
    name: 'اشتراک آپل تی‌وی',
    price: 250000,
    description: 'دسترسی به محتوای اپل',
    imageUrl: '/images/products/product-4.jpg',
    imageHint: 'اشتراک آپل',
    category: 'subscription',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '5',
    name: 'اشتراک دیزنی پلاس',
    price: 400000,
    description: 'محتوای دیزنی و مارول',
    imageUrl: '/images/products/product-5.jpg',
    imageHint: 'اشتراک دیزنی',
    category: 'subscription',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '6',
    name: 'اشتراک آمازون پرایم',
    price: 600000,
    description: 'ارسال رایگان و محتوای ویدیویی',
    imageUrl: '/images/products/product-6.jpg',
    imageHint: 'اشتراک آمازون',
    category: 'subscription',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },

  // دوره‌های آموزشی
  {
    id: '7',
    name: 'دوره React.js پیشرفته',
    price: 2500000,
    description: 'آموزش کامل React.js از مبتدی تا پیشرفته',
    imageUrl: '/images/products/product-1.jpg',
    imageHint: 'دوره React',
    category: 'courses',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '8',
    name: 'دوره Node.js و Express',
    price: 1800000,
    description: 'توسعه API با Node.js',
    imageUrl: '/images/products/product-2.jpg',
    imageHint: 'دوره Node.js',
    category: 'courses',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '9',
    name: 'دوره Python برای مبتدیان',
    price: 1200000,
    description: 'آموزش Python از صفر',
    imageUrl: '/images/products/product-3.jpg',
    imageHint: 'دوره Python',
    category: 'courses',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '10',
    name: 'دوره UI/UX Design',
    price: 3200000,
    description: 'طراحی رابط کاربری و تجربه کاربری',
    imageUrl: '/images/products/product-4.jpg',
    imageHint: 'دوره UI/UX',
    category: 'courses',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '11',
    name: 'دوره DevOps و Docker',
    price: 2800000,
    description: 'مدیریت زیرساخت و کانتینرها',
    imageUrl: '/images/products/product-5.jpg',
    imageHint: 'دوره DevOps',
    category: 'courses',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '12',
    name: 'دوره Machine Learning',
    price: 4500000,
    description: 'یادگیری ماشین و هوش مصنوعی',
    imageUrl: '/images/products/product-6.jpg',
    imageHint: 'دوره ML',
    category: 'courses',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },

  // آموزش‌های آنلاین
  {
    id: '13',
    name: 'کارگاه آنلاین JavaScript',
    price: 800000,
    description: 'کارگاه 4 ساعته JavaScript',
    imageUrl: '/images/products/product-1.jpg',
    imageHint: 'کارگاه JavaScript',
    category: 'workshops',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '14',
    name: 'وبینار طراحی وب',
    price: 500000,
    description: 'وبینار 2 ساعته طراحی وب',
    imageUrl: '/images/products/product-2.jpg',
    imageHint: 'وبینار طراحی وب',
    category: 'workshops',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '15',
    name: 'کارگاه آنلاین SEO',
    price: 650000,
    description: 'بهینه‌سازی موتورهای جستجو',
    imageUrl: '/images/products/product-3.jpg',
    imageHint: 'کارگاه SEO',
    category: 'workshops',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '16',
    name: 'وبینار دیجیتال مارکتینگ',
    price: 750000,
    description: 'بازاریابی دیجیتال',
    imageUrl: '/images/products/product-4.jpg',
    imageHint: 'وبینار دیجیتال مارکتینگ',
    category: 'workshops',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '17',
    name: 'کارگاه آنلاین React Native',
    price: 950000,
    description: 'توسعه اپلیکیشن موبایل',
    imageUrl: '/images/products/product-5.jpg',
    imageHint: 'کارگاه React Native',
    category: 'workshops',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '18',
    name: 'وبینار امنیت سایبری',
    price: 850000,
    description: 'مبانی امنیت در فضای مجازی',
    imageUrl: '/images/products/product-6.jpg',
    imageHint: 'وبینار امنیت',
    category: 'workshops',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
];

// Category definitions
const categories = [
  {
    id: 'subscription',
    name: 'محصولات اشتراکی',
    description: 'اشتراک‌های دیجیتال و سرویس‌های آنلاین',
    icon: '🎬',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'courses',
    name: 'دوره‌های آموزشی',
    description: 'دوره‌های جامع و تخصصی برنامه‌نویسی',
    icon: '📚',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'workshops',
    name: 'آموزش‌های آنلاین',
    description: 'کارگاه‌ها و وبینارهای تخصصی',
    icon: '🎓',
    color: 'from-purple-500 to-indigo-500'
  }
];

// Client component for scrollable category
function CategorySection({ category, products }: { category: any, products: Product[] }) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Adjust as needed
      if (direction === 'left') {
        scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const categoryProducts = products.filter(product => product.category === category.id);

  if (categoryProducts.length === 0) return null;

  return (
    <div className="mb-16">
      {/* Category Header */}
      <div className={`glass-card p-8 rounded-3xl mb-8 max-w-2xl mx-auto bg-zinc-800`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{category.icon}</div>
            <div>
              <h2 className="text-3xl font-bold apple-text-gradient mb-2">
                {category.name}
              </h2>
              <p className="text-muted-foreground/80 text-lg">
                {category.description}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="glass-button rounded-2xl hover:scale-110 transition-all duration-300"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="glass-button rounded-2xl hover:scale-110 transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Products */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-4 sm:px-6 lg:px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoryProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="flex-shrink-0 w-80 float"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price.toLocaleString('fa-IR') + ' تومان'}
                imageUrl={product.imageUrl}
                imageHint={product.imageHint}
                color={category.color}
              />
            </div>
          ))}
        </div>
        {/* Left fading shadow */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-background to-transparent z-10"></div>
        {/* Right fading shadow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-background to-transparent z-10"></div>
      </div>
    </div>
  );
}

async function getProducts(): Promise<Product[]> {
  if (!isFirebaseAvailable() || !db) {
    console.log("Firebase not configured, using mock data");
    return mockProducts;
  }

  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return products.length > 0 ? products : mockProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return mockProducts;
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 apple-gradient opacity-30"></div>
        </div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="glass-card p-16 rounded-3xl text-center">
            <div className="text-4xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold apple-text-gradient">
              در حال بارگذاری محصولات...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Apple-style background gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 apple-gradient opacity-30"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Back to Home Button */}
        <div className="mb-8">
          <Button asChild variant="outline" className="glass-button rounded-2xl hover:scale-105 transition-all duration-300 group">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              بازگشت به خانه
            </Link>
          </Button>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground/80">
            <Link href="/" className="hover:text-primary transition-colors duration-300 flex items-center gap-1">
              <Home className="h-3 w-3" />
              خانه
            </Link>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground font-medium">محصولات</span>
          </nav>
        </div>

        {/* Main Products Hero Banner */}
        <ProductHeroBanner
          images={[
            '/images/banners/banner-1.jpg',
            '/images/banners/banner-2.jpg',
            '/images/banners/banner-3.jpg',
          ]}
          title="کشف دنیای زومجی"
          description="محصولات نوآورانه و دوره‌های آموزشی منحصربه‌فرد"
        />

        {/* Categories */}
        {categories.map((category) => (
          <CategorySection 
            key={category.id} 
            category={category} 
            products={products} 
          />
        ))}

        {/* Apple-style empty state */}
        {products.length === 0 && (
          <div className="glass-card p-16 rounded-3xl text-center">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-3xl font-bold apple-text-gradient mb-4">
              محصولی یافت نشد
            </h2>
            <p className="text-muted-foreground/80 text-lg">
              در حال حاضر محصولی برای نمایش وجود ندارد.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
