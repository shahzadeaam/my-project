import { products, type Product } from '@/data/products';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import AddToCartButton from '@/components/products/add-to-cart-button';
import type { Metadata, ResolvingMetadata } from 'next';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

interface ProductDetailsPageProps {
  params: { id: string };
}

export async function generateMetadata(
  { params }: ProductDetailsPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = products.find(p => p.id === params.id);
  if (!product) {
    return {
      title: 'محصول یافت نشد - نیلوفر بوتیک',
    };
  }
  return {
    title: `${product.name} - نیلوفر بوتیک`,
    description: product.description,
  };
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card className="overflow-hidden shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="aspect-[4/5] relative w-full overflow-hidden rounded-lg shadow-lg bg-muted">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={product.imageHint}
                  className="rounded-lg transition-transform duration-300 hover:scale-105"
                  priority
                />
              </div>
              <div className="flex flex-col gap-4 py-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{product.name}</h1>
                <p className="text-2xl font-semibold text-primary">{product.price}</p>
                <Separator className="my-4" />
                <h2 className="text-xl font-semibold text-foreground">توضیحات محصول</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
                <div className="mt-6">
                  <AddToCartButton product={product} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}
