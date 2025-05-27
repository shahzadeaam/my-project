
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import CartContents from '@/components/cart/cart-contents';
import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'سبد خرید - زومجی',
  description: 'سبد خرید شما در زومجی.',
};

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card className="shadow-xl">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                    سبد خرید شما
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
                 <CartContents />
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

