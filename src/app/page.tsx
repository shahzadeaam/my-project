import Header from '@/components/layout/header';
import ProductBanner from '@/components/homepage/product-banner';
import FeaturedProducts from '@/components/homepage/featured-products';
import AINewsSection from '@/components/homepage/ai-news-section';
import Footer from '@/components/layout/footer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Apple-style animated background gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 apple-gradient opacity-40"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
      </div>
      
      <Header />
      <main className="flex-grow relative z-10">
        <ProductBanner />
        <AINewsSection />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}
