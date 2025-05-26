import ProductCard from '@/components/products/product-card';
import { products } from '@/data/products'; // Import products from the main data source

// Select a subset of products to be featured, e.g., the first 4
const featuredProductsData = products.slice(0, 4);

export default function FeaturedProducts() {
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
                price={product.price}
                imageUrl={product.imageUrl}
                imageHint={product.imageHint}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">محصول ویژه‌ای برای نمایش وجود ندارد.</p>
        )}
      </div>
    </section>
  );
}
