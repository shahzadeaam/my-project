import Header from '@/components/layout/header';
import ProductBanner from '@/components/homepage/product-banner';
import FeaturedProducts from '@/components/homepage/featured-products';
import Footer from '@/components/layout/footer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <ProductBanner />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}
