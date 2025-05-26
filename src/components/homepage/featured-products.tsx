import ProductCard from '@/components/products/product-card';

const featuredProductsData = [
  { id: '1', name: 'لباس مجلسی شیک', price: '۱,۲۰۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/300x300.png', imageHint: 'elegant dress' },
  { id: '2', name: 'کیف دستی چرم', price: '۷۵۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/300x301.png', imageHint: 'leather handbag' },
  { id: '3', name: 'کفش پاشنه بلند', price: '۹۸۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/301x300.png', imageHint: 'high heels' },
  { id: '4', name: 'شال نخی طرحدار', price: '۳۲۰,۰۰۰ تومان', imageUrl: 'https://placehold.co/301x301.png', imageHint: 'patterned scarf' },
];

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
      </div>
    </section>
  );
}
