'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import type { Product } from '@/data/products';
import { ShoppingCart, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useCallback } from 'react';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, getItemQuantity } = useCart();
  const { toast } = useToast();
  const [isAddedOrProcessing, setIsAddedOrProcessing] = useState(false);

  const checkProductInCart = useCallback(() => {
     return getItemQuantity(product.id) > 0;
  }, [getItemQuantity, product.id]);

  useEffect(() => {
    setIsAddedOrProcessing(checkProductInCart());
  }, [checkProductInCart]);


  const handleAddToCart = () => {
    if (checkProductInCart()) return; // Already in cart, do nothing (button should be disabled)

    setIsAddedOrProcessing(true);
    addItem(product, 1);
    toast({
      title: "محصول به سبد خرید اضافه شد",
      description: `"${product.name}" با موفقیت به سبد شما اضافه شد.`,
      variant: "default",
    });
    // Visual feedback, but the actual "added" state comes from context via checkProductInCart
    setTimeout(() => {
        setIsAddedOrProcessing(checkProductInCart());
    }, 1500); 
  };
  
  const isInCart = checkProductInCart();

  return (
    <Button 
      onClick={handleAddToCart} 
      size="lg" 
      className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
      disabled={isInCart || isAddedOrProcessing && !isInCart} // Disable if in cart, or if processing adding (and not yet in cart from context)
    >
      {isInCart ? (
        <>
          <Check className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
          اضافه شده به سبد
        </>
      ) : isAddedOrProcessing ? (
         <>
          <ShoppingCart className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0 animate-pulse" />
          در حال افزودن...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
          افزودن به سبد خرید
        </>
      )}
    </Button>
  );
}
