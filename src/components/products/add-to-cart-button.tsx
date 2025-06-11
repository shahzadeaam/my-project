'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import type { Product } from '@/types/firestore'; // Updated import
import { ShoppingCart, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useCallback } from 'react';

interface AddToCartButtonProps {
  product: Product; // Expects Product type with price as number
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
    if (checkProductInCart()) return; 

    setIsAddedOrProcessing(true);
    // addItem expects Product type where price is number
    addItem(product, 1); 
    toast({
      title: "محصول به سبد خرید اضافه شد",
      description: `"${product.name}" با موفقیت به سبد شما اضافه شد.`,
      variant: "default",
    });
    
    setTimeout(() => {
        setIsAddedOrProcessing(checkProductInCart());
    }, 1500); 
  };
  
  const isInCart = checkProductInCart();

  return (
    <Button 
      onClick={handleAddToCart} 
      size="lg" 
      className="w-full md:w-auto bg-accent text-white hover:bg-accent/90 transition-all duration-300"
      disabled={isInCart || (isAddedOrProcessing && !isInCart)} 
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
