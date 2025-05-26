
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, Search, PackageOpen } from 'lucide-react';
import type { Product } from '@/types/firestore'; 
import { db, Timestamp } from '@/lib/firebase'; // Import Timestamp
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';

const DEFAULT_ADMIN_PRODUCT_IMAGE = "https://placehold.co/80x80.png";

async function getProductsFromFirestore(): Promise<Product[]> {
  const productsCol = collection(db, 'products');
  const productsSnapshot = await getDocs(query(productsCol, orderBy('createdAt', 'desc')));
  const productList = productsSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || "بدون نام",
      price: data.price || 0,
      description: data.description || "",
      imageUrl: data.imageUrl && data.imageUrl.trim() !== "" ? data.imageUrl : DEFAULT_ADMIN_PRODUCT_IMAGE,
      imageHint: data.imageHint || "product image",
      createdAt: data.createdAt, 
      updatedAt: data.updatedAt, 
    } as Product;
  });
  return productList;
}

export default async function AdminProductsPage() {
  let productList: Product[] = [];
  let fetchError = null;

  try {
    productList = await getProductsFromFirestore();
  } catch (error) {
    console.error("Error fetching products for admin page:", error);
    fetchError = "خطا در بارگذاری محصولات از پایگاه داده.";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">مدیریت محصولات</h2>
          <p className="text-sm text-muted-foreground">
            افزودن، ویرایش و مدیریت محصولات فروشگاه. (عملیات CRUD هنوز پیاده‌سازی نشده)
          </p>
        </div>
        <Button asChild disabled> 
          <Link href="#"> 
            <PlusCircle className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
            افزودن محصول جدید (بزودی)
          </Link>
        </Button>
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
                  <TableHead className="hidden md:table-cell">موجودی (نمایشی)</TableHead>
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
                          src={product.imageUrl} // Already has default
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
                      <Badge variant={Math.random() > 0.3 ? "default" : "destructive"} className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200 data-[variant=destructive]:bg-red-100 data-[variant=destructive]:text-red-700 data-[variant=destructive]:border-red-200 data-[variant=destructive]:hover:bg-red-200">
                        {Math.random() > 0.3 ? `موجود (${Math.floor(Math.random() * 100) + 1})` : 'ناموجود'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {product.createdAt ? (product.createdAt as Timestamp).toDate().toLocaleDateString('fa-IR') : 'نامشخص'}
                    </TableCell>
                    <TableCell className="text-left">
                      <DropdownMenu dir="rtl">
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">منوی عملیات</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                          <DropdownMenuItem disabled onSelect={() => console.log(`Edit product ${product.id} (mock)`)}>
                            ویرایش (نمایشی)
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled onSelect={() => console.log(`View product ${product.id} details (mock)`)}>
                            مشاهده جزئیات (نمایشی)
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled className="text-destructive focus:text-destructive focus:bg-destructive/10" onSelect={() => console.log(`Delete product ${product.id} (mock)`)}>
                            حذف (نمایشی)
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
              هیچ محصولی در پایگاه داده یافت نشد. (می‌توانید محصولات را مستقیماً از طریق کنسول Firebase اضافه کنید.)
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
