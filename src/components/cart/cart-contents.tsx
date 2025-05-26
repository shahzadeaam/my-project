
'use client';

import { useCart, type CartItem as CartItemType } from '@/context/cart-context';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Minus, Plus, ShoppingBag, AlertTriangle, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


function CartItem({ item, onUpdateQuantity, onRemoveItem }: { item: CartItemType, onUpdateQuantity: (id: string, quantity: number) => void, onRemoveItem: (id: string) => void }) {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity)) {
      onUpdateQuantity(item.id, Math.max(0, newQuantity));
    } else if (e.target.value === '') {
        onUpdateQuantity(item.id, 0); 
    }
  };

  const incrementQuantity = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const decrementQuantity = () => {
    onUpdateQuantity(item.id, Math.max(0, item.quantity - 1));
  };
  
  const parsePrice = (priceString: string): number => {
    const cleanedString = priceString.replace(/[^\d]/g, '');
    return parseInt(cleanedString, 10) || 0;
  };

  const itemPrice = parsePrice(item.price);
  const totalPriceForItem = itemPrice * item.quantity;
  
  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('fa-IR')} تومان`;
  };


  return (
    <Card className="mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <div className="w-24 h-[120px] sm:w-28 sm:h-[140px] relative rounded-md overflow-hidden flex-shrink-0 bg-muted">
          <Image src={item.imageUrl} alt={item.name} layout="fill" objectFit="cover" data-ai-hint={item.imageHint} className="rounded-md" />
        </div>
        <div className="flex-grow text-center sm:text-right">
          <Link href={`/products/${item.id}`} className="text-md sm:text-lg font-semibold hover:text-primary transition-colors line-clamp-2">
            {item.name}
          </Link>
          <p className="text-sm text-muted-foreground mt-1">{item.price}</p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Button variant="outline" size="icon" onClick={decrementQuantity} aria-label="کاهش تعداد" className="h-9 w-9 sm:h-10 sm:w-10">
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={item.quantity > 0 ? item.quantity.toString() : ''} 
            onChange={handleQuantityChange}
            onBlur={(e) => { if(e.target.value === '' || parseInt(e.target.value) === 0) onUpdateQuantity(item.id, 0);}}
            className="w-12 sm:w-16 text-center h-9 sm:h-10"
            min="0"
            aria-label={`تعداد ${item.name}`}
            placeholder="0"
          />
          <Button variant="outline" size="icon" onClick={incrementQuantity} aria-label="افزایش تعداد" className="h-9 w-9 sm:h-10 sm:w-10">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-md sm:text-lg font-semibold text-foreground w-32 text-center sm:text-left mt-2 sm:mt-0">
          {formatPrice(totalPriceForItem)}
        </p>
        <Button variant="ghost" size="icon" onClick={() => onRemoveItem(item.id)} className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-9 w-9 sm:h-10 sm:w-10" aria-label={`حذف ${item.name}`}>
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default function CartContents() {
  const { items, updateItemQuantity, removeItem, clearCart } = useCart();

  const parsePrice = (priceString: string): number => {
    const cleanedString = priceString.replace(/[^\d]/g, '');
    return parseInt(cleanedString, 10) || 0;
  };

  const cartTotal = items.reduce((total, item) => {
    return total + (parsePrice(item.price) * item.quantity);
  }, 0);
  
  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('fa-IR')} تومان`;
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
        <p className="text-xl text-muted-foreground mb-8">سبد خرید شما خالی است.</p>
        <Button asChild size="lg" className="px-10 py-6 text-lg">
          <Link href="/products">بازگشت به فروشگاه</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        {items.map(item => (
          <CartItem key={item.id} item={item} onUpdateQuantity={updateItemQuantity} onRemoveItem={removeItem} />
        ))}
      </div>
      <Separator className="my-6" />
      <div className="p-4 bg-muted/30 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="text-xl font-bold text-foreground">
            جمع کل سفارش:
            </div>
            <div className="text-2xl font-extrabold text-primary">
            {formatPrice(cartTotal)}
            </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
            <Button variant="outline" onClick={clearCart} className="w-full sm:w-auto text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="ml-2 rtl:mr-2 h-4 w-4" />
                پاک کردن سبد خرید
            </Button>
            <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/checkout">
                    <CreditCard className="ml-2 rtl:mr-2 h-5 w-5" />
                    ادامه و تکمیل خرید
                </Link>
            </Button>
        </div>
      </div>
       <Alert variant="default" className="mt-8 bg-secondary/50 border-secondary">
          <AlertTriangle className="h-5 w-5 text-secondary-foreground" />
          <AlertTitle className="font-semibold text-secondary-foreground">توجه</AlertTitle>
          <AlertDescription className="text-secondary-foreground/80">
           در حال حاضر امکان ذخیره سبد خرید برای کاربران وارد شده وجود ندارد. این قابلیت در آینده اضافه خواهد شد. سبد خرید شما فقط در همین مرورگر ذخیره می‌شود.
          </AlertDescription>
        </Alert>
    </div>
  );
}

