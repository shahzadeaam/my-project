
'use client';

import { useState, type FormEvent } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, CheckCircle } from 'lucide-react';
import type { Product } from '@/types/firestore';

const productFormSchema = z.object({
  name: z.string().min(3, { message: 'نام محصول باید حداقل ۳ حرف باشد.' }).max(100, { message: 'نام محصول نمی‌تواند بیشتر از ۱۰۰ حرف باشد.'}),
  price: z.coerce.number().positive({ message: 'قیمت باید یک عدد مثبت باشد.' }),
  description: z.string().min(10, { message: 'توضیحات باید حداقل ۱۰ حرف باشد.' }).max(1000, { message: 'توضیحات نمی‌تواند بیشتر از ۱۰۰۰ حرف باشد.'}),
  imageUrl: z.string().url({ message: 'آدرس تصویر نامعتبر است.' }).min(1, {message: 'آدرس تصویر الزامی است.'}),
  imageHint: z.string().min(2, { message: 'راهنمای تصویر باید حداقل ۲ حرف باشد.'}).max(50, {message: 'راهنمای تصویر نمی‌تواند بیشتر از ۵۰ حرف باشد.'}),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface AddProductFormProps {
  onProductAdded: () => void; // Callback to refresh product list
  setOpen: (open: boolean) => void; // To close the dialog
}

export default function AddProductForm({ onProductAdded, setOpen }: AddProductFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
  });

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const productsCollectionRef = collection(db, 'products');
      await addDoc(productsCollectionRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'محصول با موفقیت اضافه شد',
        description: `محصول "${data.name}" به لیست محصولات اضافه گردید.`,
        variant: 'default',
      });
      reset();
      onProductAdded(); // Refresh the list in the parent component
      setOpen(false); // Close the dialog
    } catch (error) {
      console.error('Error adding product: ', error);
      toast({
        title: 'خطا در افزودن محصول',
        description: 'مشکلی در هنگام ذخیره محصول در پایگاه داده رخ داد.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
      <div>
        <Label htmlFor="name">نام محصول</Label>
        <Input id="name" {...register('name')} className="mt-1.5 h-11" placeholder="مثلا: مانتو کتان بهاره" />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="price">قیمت (تومان)</Label>
        <Input id="price" type="number" {...register('price')} className="mt-1.5 h-11" placeholder="مثلا: 1850000" />
        {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
      </div>
      <div>
        <Label htmlFor="description">توضیحات محصول</Label>
        <Textarea id="description" {...register('description')} rows={4} className="mt-1.5" placeholder="توضیحات کامل محصول را اینجا بنویسید..." />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>
      <div>
        <Label htmlFor="imageUrl">آدرس URL تصویر محصول</Label>
        <Input id="imageUrl" {...register('imageUrl')} className="mt-1.5 h-11" dir="ltr" placeholder="https://example.com/image.png" />
        {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
      </div>
      <div>
        <Label htmlFor="imageHint">راهنمای تصویر (برای جستجو)</Label>
        <Input id="imageHint" {...register('imageHint')} className="mt-1.5 h-11" placeholder="مثلا: مانتو کتان" />
        {errors.imageHint && <p className="text-sm text-destructive mt-1">{errors.imageHint.message}</p>}
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={() => { reset(); setOpen(false); }}>لغو</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin rtl:mr-2 rtl:ml-0" />
              در حال افزودن...
            </>
          ) : (
            <>
              <CheckCircle className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
              افزودن محصول
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
