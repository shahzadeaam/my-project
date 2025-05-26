
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/products/product-card';
import type { Product } from '@/types/firestore'; // Updated import
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'محصولات - نیلوفر بوتیک',
  description: 'مجموعه‌ای از بهترین و جدیدترین محصولات نیلوفر بوتیک.',
};

async function getProducts(): Promise<Product[]> {
  const productsCol = collection(db, 'products');
  // You can add orderBy or limit here if needed, e.g., orderBy('createdAt', 'desc')
  const productsSnapshot = await getDocs(query(productsCol, orderBy('createdAt', 'desc')));
  const productList = productsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Product));
  return productList;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            همه محصولات
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            جدیدترین و با کیفیت‌ترین محصولات را در نیلوفر بوتیک بیابید.
          </p>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price.toLocaleString('fa-IR') + ' تومان'} // Format price
                imageUrl={product.imageUrl}
                imageHint={product.imageHint}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              در حال حاضر محصولی برای نمایش وجود ندارد. (مطمئن شوید محصولات در Firestore اضافه شده‌اند)
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
