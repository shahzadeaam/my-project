
'use client'; // This page now needs client-side interactivity for dialogs and role checking

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, PackageOpen, Loader2 } from 'lucide-react';
import type { Product } from '@/types/firestore'; 
import { db, Timestamp } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // Added for better context in dialog
  DialogTrigger,
} from "@/components/ui/dialog";
import AddProductForm from '@/components/admin/products/add-product-form';
import { useAuth } from '@/context/auth-context';
import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_ADMIN_PRODUCT_IMAGE = "https://placehold.co/80x80.png";

export default function AdminProductsPage() {
  const { currentUser, userDocument, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);

  const isAdmin = userDocument?.role === 'admin';

  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    setFetchError(null);
    try {
      const productsCol = collection(db, 'products');
      const productsSnapshot = await getDocs(query(productsCol, orderBy('createdAt', 'desc')));
      const fetchedProducts = productsSnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || "بدون نام",
          price: data.price || 0,
          description: data.description || "",
          imageUrl: data.imageUrl && data.imageUrl.trim() !== "" ? data.imageUrl : DEFAULT_ADMIN_PRODUCT_IMAGE,
          imageHint: data.imageHint || "product image",
          createdAt: data.createdAt, 
          updatedAt: data.updatedAt, 
        } as Product;
      });
      setProductList(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products for admin page:", error);
      setFetchError("خطا در بارگذاری محصولات از پایگاه داده.");
      toast({ title: "خطا", description: "مشکلی در بارگذاری محصولات رخ داد.", variant: "destructive" });
    } finally {
      setIsLoadingProducts(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && currentUser) { // Fetch products once user auth state is resolved
        fetchProducts();
    } else if (!authLoading && !currentUser) {
        setIsLoadingProducts(false);
        setFetchError("برای دسترسی به این بخش باید وارد شده باشید.");
    }
  }, [currentUser, authLoading, fetchProducts]);
  
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!isAdmin) {
      toast({ title: "دسترسی غیرمجاز", description: "شما اجازه حذف محصول را ندارید.", variant: "destructive"});
      return;
    }
    // Add a confirmation dialog here in a real app
    if (window.confirm(`آیا از حذف محصول "${productName}" مطمئن هستید؟ این عملیات غیرقابل بازگشت است.`)) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        toast({ title: "موفقیت", description: `محصول "${productName}" با موفقیت حذف شد.` });
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error("Error deleting product: ", error);
        toast({ title: "خطا در حذف", description: "مشکلی در حذف محصول پیش آمد.", variant: "destructive" });
      }
    }
  };


  if (authLoading || isLoadingProducts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 rtl:mr-2">در حال بارگذاری اطلاعات...</p>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
     return (
      <div className="text-center py-12">
        <PackageOpen className="mx-auto h-12 w-12 mb-4 text-destructive" />
        <h3 className="text-xl font-semibold text-destructive">دسترسی غیرمجاز</h3>
        <p className="text-muted-foreground mt-2">شما اجازه مشاهده یا مدیریت محصولات را ندارید.</p>
         <Button asChild className="mt-4">
            <Link href="/admin/dashboard">بازگشت به داشبورد</Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">مدیریت محصولات</h2>
          <p className="text-sm text-muted-foreground">
            افزودن، ویرایش و مدیریت محصولات فروشگاه.
          </p>
        </div>
        {isAdmin && (
          <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
            <DialogTrigger asChild>
              <Button> 
                <PlusCircle className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                افزودن محصول جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg md:max-w-2xl">
              <DialogHeader>
                <DialogTitle>افزودن محصول جدید</DialogTitle>
                <DialogDescription>
                  اطلاعات محصول جدید را در فرم زیر وارد کنید.
                </DialogDescription>
              </DialogHeader>
              <AddProductForm onProductAdded={fetchProducts} setOpen={setIsAddProductDialogOpen} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Card>
        <CardHeader className="px-7">
          <CardTitle>لیست محصولات</CardTitle>
          <CardDescription>
            {fetchError ? fetchError : `در مجموع ${productList.length} محصول در پایگاه داده موجود است.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError ? (
             <div className="text-center py-12 text-destructive">
                <PackageOpen className="mx-auto h-12 w-12 mb-4" />
                {fetchError}
            </div>
          ) : productList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[80px] sm:table-cell">تصویر</TableHead>
                  <TableHead>نام محصول</TableHead>
                  <TableHead>قیمت</TableHead>
                  <TableHead className="hidden md:table-cell">تاریخ ایجاد</TableHead>
                  <TableHead className="text-left">
                    <span className="sr-only">عملیات</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productList.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell p-2">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={product.imageUrl || DEFAULT_ADMIN_PRODUCT_IMAGE}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                          data-ai-hint={product.imageHint}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                        <Link href={`/products/${product.id}`} className="hover:text-primary" target="_blank" title="مشاهده محصول در سایت">
                            {product.name}
                        </Link>
                    </TableCell>
                    <TableCell>{product.price.toLocaleString('fa-IR')} تومان</TableCell>
                    <TableCell className="hidden md:table-cell">
                        {product.createdAt ? (product.createdAt as Timestamp).toDate().toLocaleDateString('fa-IR') : 'نامشخص'}
                    </TableCell>
                    <TableCell className="text-left">
                      <DropdownMenu dir="rtl">
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!isAdmin}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">منوی عملیات</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                          <DropdownMenuItem disabled onSelect={() => console.log(`Edit product ${product.id} (mock)`)}>
                            ویرایش (بزودی)
                          </DropdownMenuItem>
                           <DropdownMenuItem 
                            className="text-destructive focus:text-destructive focus:bg-destructive/10" 
                            onSelect={() => handleDeleteProduct(product.id, product.name)}
                            disabled={!isAdmin}
                            >
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
               <PackageOpen className="mx-auto h-12 w-12 mb-4" />
              هیچ محصولی در پایگاه داده یافت نشد. (می‌توانید با کلیک بر روی دکمه "افزودن محصول جدید" اولین محصول را اضافه کنید.)
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
