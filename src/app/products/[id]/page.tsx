import type { Product } from '@/types/firestore';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import AddToCartButton from '@/components/products/add-to-cart-button';
import type { Metadata, ResolvingMetadata } from 'next';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Package, Home } from 'lucide-react'; // Import Package and Home icons
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

const DEFAULT_PRODUCT_DETAIL_IMAGE = "https://placehold.co/600x750.png"; 
const ICON_PLACEHOLDER_SIZE_DETAIL = "w-24 h-24 text-muted-foreground";

// Mock data for development
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'لپ تاپ گیمینگ',
    price: 45000000,
    description: 'لپ تاپ قدرتمند برای بازی و کارهای گرافیکی\n\nویژگی‌ها:\n• پردازنده Intel Core i7\n• کارت گرافیک RTX 4070\n• رم 32GB DDR5\n• هارد 1TB SSD',
    imageUrl: '/images/products/product-1.jpg',
    imageHint: 'لپ تاپ گیمینگ',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '2',
    name: 'گوشی هوشمند',
    price: 25000000,
    description: 'گوشی هوشمند با دوربین پیشرفته\n\nویژگی‌ها:\n• دوربین 108MP\n• پردازنده Snapdragon 8 Gen 2\n• باتری 5000mAh\n• شارژ سریع 67W',
    imageUrl: '/images/products/product-2.jpg',
    imageHint: 'گوشی هوشمند',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '3',
    name: 'هدفون بی‌سیم',
    price: 3500000,
    description: 'هدفون با کیفیت صدای عالی\n\nویژگی‌ها:\n• صدای Hi-Fi\n• حذف نویز فعال\n• باتری 30 ساعته\n• شارژ سریع',
    imageUrl: '/images/products/product-3.jpg',
    imageHint: 'هدفون بی‌سیم',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '4',
    name: 'ساعت هوشمند',
    price: 8500000,
    description: 'ساعت هوشمند با قابلیت‌های پیشرفته\n\nویژگی‌ها:\n• نمایشگر AMOLED\n• GPS داخلی\n• مانیتور ضربان قلب\n• مقاوم در برابر آب',
    imageUrl: '/images/products/product-4.jpg',
    imageHint: 'ساعت هوشمند',
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
];

async function getProduct(id: string): Promise<Product | null> {
  // Check if Firebase is available
  if (!db) {
    console.log('Firebase not configured, using mock data');
    return mockProducts.find(p => p.id === id) || null;
  }

  try {
    const productDocRef = doc(db, 'products', id);
    const productSnap = await getDoc(productDocRef);

    if (!productSnap.exists()) {
      return null;
    }
    const data = productSnap.data();
    return { 
      id: productSnap.id,
      name: data.name || "نام محصول نامشخص",
      price: data.price || 0,
      description: data.description || "توضیحات موجود نیست.",
      imageUrl: data.imageUrl || "", 
      imageHint: data.imageHint || "product image",
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
     } as Product;
  } catch (error) {
    console.error('Error fetching product from Firebase:', error);
    console.log('Falling back to mock data');
    return mockProducts.find(p => p.id === id) || null;
  }
}

export async function generateMetadata(
  { params }: ProductDetailsPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);
  if (!product) {
    return {
      title: 'محصول یافت نشد - زومجی',
    };
  }
  return {
    title: `${product.name} - زومجی`,
    description: product.description,
  };
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const cartProduct: Product = { // This type is used by AddToCartButton
    id: product.id,
    name: product.name,
    price: product.price, // price is number
    description: product.description,
    imageUrl: product.imageUrl, 
    imageHint: product.imageHint,
    // createdAt and updatedAt are not needed for cart item
  };
  
  const displayPrice = product.price.toLocaleString('fa-IR') + ' تومان';
  const displayImageUrl = product.imageUrl && product.imageUrl.trim() !== "" ? product.imageUrl : "";
  const displayImageHint = displayImageUrl ? (product.imageHint || "product image") : "no image detail placeholder";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back to Home Button */}
        <div className="mb-6">
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
            <Link href="/products" className="hover:text-primary transition-colors duration-300">
              محصولات
            </Link>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-xl">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
                <div className="aspect-[4/5] relative w-full overflow-hidden rounded-lg shadow-lg bg-muted flex items-center justify-center">
                  {displayImageUrl ? (
                    <Image
                      src={displayImageUrl}
                      alt={product.name}
                      fill
                      className="rounded-lg transition-transform duration-300 hover:scale-105 object-cover"
                      data-ai-hint={displayImageHint}
                      priority
                    />
                  ) : (
                    <Package className={ICON_PLACEHOLDER_SIZE_DETAIL} data-ai-hint="product detail icon placeholder" />
                  )}
                </div>
                <div className="flex flex-col gap-4 py-4">
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{product.name}</h1>
                  <p className="text-2xl font-semibold text-primary">{displayPrice}</p>
                  <Separator className="my-4" />
                  <h2 className="text-xl font-semibold text-foreground">توضیحات محصول</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
                  <div className="mt-6">
                    <AddToCartButton product={cartProduct} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  // Check if Firebase is available
  if (!db) {
    console.log('Firebase not configured, using mock data for static params');
    return mockProducts.map((product) => ({
      id: product.id,
    }));
  }

  try {
    const productsCol = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCol);
    const paths = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
    }));
    return paths;
  } catch (error) {
    console.error("Error generating static params for products:", error);
    console.log('Falling back to mock data for static params');
    return mockProducts.map((product) => ({
      id: product.id,
    }));
  }
}
