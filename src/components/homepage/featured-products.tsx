
import ProductCard from '@/components/products/product-card';
import type { Product } from '@/types/firestore'; // Updated import
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit as firestoreLimit } from 'firebase/firestore';

async function getFeaturedProducts(): Promise<Product[]> {
  const productsCol = collection(db, 'products');
  // Fetch, for example, the 4 most recently created products
  const q = query(productsCol, orderBy('createdAt', 'desc'), firestoreLimit(4));
  const productsSnapshot = await getDocs(q);
  const productList = productsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Product));
  return productList;
}

export default async function FeaturedProducts() {
  const featuredProductsData = await getFeaturedProducts();

  return (
    <section className="py-12 bg-background sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            محصولات ویژه
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            محبوب‌ترین محصولات این هفته را بررسی کنید.
          </p>
        </div>
        {featuredProductsData.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProductsData.map((product) => (
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
          <p className="text-center text-muted-foreground">محصول ویژه‌ای برای نمایش وجود ندارد. (مطمئن شوید محصولات در Firestore با فیلد createdAt اضافه شده‌اند)</p>
        )}
      </div>
    </section>
  );
}
