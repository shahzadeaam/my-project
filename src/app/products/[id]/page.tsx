
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
import { Package } from 'lucide-react'; // Import Package icon

interface ProductDetailsPageProps {
  params: { id: string };
}

const DEFAULT_PRODUCT_DETAIL_IMAGE = "https://placehold.co/600x750.png"; 
const ICON_PLACEHOLDER_SIZE_DETAIL = "w-24 h-24 text-muted-foreground";

async function getProduct(id: string): Promise<Product | null> {
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
}

export async function generateMetadata(
  { params }: ProductDetailsPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getProduct(params.id);
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
  const product = await getProduct(params.id);

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
        <Card className="overflow-hidden shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="aspect-[4/5] relative w-full overflow-hidden rounded-lg shadow-lg bg-muted flex items-center justify-center">
                {displayImageUrl ? (
                  <Image
                    src={displayImageUrl}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={displayImageHint}
                    className="rounded-lg transition-transform duration-300 hover:scale-105"
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
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const productsCol = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCol);
    const paths = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
    }));
    return paths;
  } catch (error) {
    console.error("Error generating static params for products:", error);
    return [];
  }
}
