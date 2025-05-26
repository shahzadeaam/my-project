
import type { Product } from '@/types/firestore'; // Updated import
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

interface ProductDetailsPageProps {
  params: { id: string };
}

async function getProduct(id: string): Promise<Product | null> {
  const productDocRef = doc(db, 'products', id);
  const productSnap = await getDoc(productDocRef);

  if (!productSnap.exists()) {
    return null;
  }
  return { id: productSnap.id, ...productSnap.data() } as Product;
}

export async function generateMetadata(
  { params }: ProductDetailsPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getProduct(params.id);
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

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Create a version of the product suitable for AddToCartButton and CartContext
  // (since CartItem extends Product from '@/data/products' which is now removed)
  const cartProduct: Product = {
    id: product.id,
    name: product.name,
    // Price for display is formatted, but AddToCartButton might expect a string like "۱,۸۵۰,۰۰۰ تومان"
    // For cart logic, it's better to work with numbers. The Product type now has price as number.
    // We'll pass the raw product (with price as number) to AddToCartButton
    price: product.price, // Pass number directly
    description: product.description,
    imageUrl: product.imageUrl,
    imageHint: product.imageHint,
  };
  
  const displayPrice = product.price.toLocaleString('fa-IR') + ' تومان';

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
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  const productsCol = collection(db, 'products');
  const productsSnapshot = await getDocs(productsCol);
  const paths = productsSnapshot.docs.map((doc) => ({
    id: doc.id,
  }));
  return paths;
}
