'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { items, removeItem, updateItemQuantity, totalItems, totalPrice } = useCart();

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Apple-style background gradients */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 apple-gradient opacity-30"></div>
          <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="glass-card p-16 rounded-3xl max-w-2xl mx-auto text-center">
            <div className="text-8xl mb-8 float">🛒</div>
            <h1 className="text-5xl font-bold apple-text-gradient mb-6">
              سبد خرید شما خالی است
            </h1>
            <p className="text-muted-foreground/80 text-xl leading-relaxed mb-12">
              محصولات مورد نظر خود را به سبد خرید اضافه کنید
            </p>
            <Link href="/products" passHref legacyBehavior>
              <Button size="lg" className="glass-button bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-2xl px-12 py-6 text-xl font-bold hover:scale-110 transition-all duration-500">
                <ShoppingBag className="ml-2 rtl:mr-2 rtl:ml-0 h-6 w-6" />
                شروع خرید
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Apple-style background gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 apple-gradient opacity-30"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Apple-style header */}
        <div className="glass-card p-8 rounded-3xl max-w-6xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/products" passHref legacyBehavior>
                <Button variant="ghost" size="icon" className="glass-button rounded-2xl hover:scale-110 transition-all duration-500">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold apple-text-gradient">
                  سبد خرید
                </h1>
                <p className="text-muted-foreground/80 text-lg">
                  {totalItems} محصول در سبد خرید شما
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold apple-text-gradient">
                مجموع: {totalPrice.toLocaleString('fa-IR')} تومان
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <Card key={item.id} className="glass-card overflow-hidden rounded-3xl apple-hover">
                <CardContent className="p-8">
                  <div className="flex items-center gap-6">
                    {/* Product image */}
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-muted/20 flex-shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          data-ai-hint={item.imageHint || "cart item"}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Product details */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground/80 mb-4">
                        {item.price.toLocaleString('fa-IR')} تومان
                      </p>
                      
                      {/* Quantity controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="glass-button rounded-2xl hover:scale-110 transition-all duration-300"
                          >
                            -
                          </Button>
                          <span className="text-lg font-bold px-4 py-2 glass-card rounded-2xl min-w-[60px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            className="glass-button rounded-2xl hover:scale-110 transition-all duration-300"
                          >
                            +
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="glass-button text-destructive hover:text-destructive hover:scale-110 transition-all duration-300 rounded-2xl"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Total price for this item */}
                    <div className="text-right">
                      <p className="text-xl font-bold apple-text-gradient">
                        {(item.price * item.quantity).toLocaleString('fa-IR')} تومان
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-8 rounded-3xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold apple-text-gradient">
                  خلاصه سفارش
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground/80">تعداد محصولات:</span>
                    <span className="font-bold">{totalItems}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground/80">مجموع:</span>
                    <span className="text-xl font-bold apple-text-gradient">
                      {totalPrice.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground/80">هزینه ارسال:</span>
                    <span className="font-bold">رایگان</span>
                  </div>
                  <div className="border-t border-border/50 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">مجموع نهایی:</span>
                      <span className="text-2xl font-bold apple-text-gradient">
                        {totalPrice.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" passHref legacyBehavior>
                  <Button 
                    className="w-full glass-button bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-2xl py-6 text-lg font-bold hover:scale-105 transition-all duration-500 rounded-2xl"
                    disabled={totalItems === 0}
                  >
                    ادامه خرید
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

