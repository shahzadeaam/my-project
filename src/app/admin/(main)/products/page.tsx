
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import { products, type Product } from '@/data/products'; // Using existing products data
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';

// Mock function, in real app this would fetch paginated products
async function getProducts() {
  return products;
}

export default async function AdminProductsPage() {
  const productList = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">مدیریت محصولات</h2>
          <p className="text-sm text-muted-foreground">
            افزودن، ویرایش و مدیریت محصولات فروشگاه.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/add"> {/* Placeholder link */}
            <PlusCircle className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
            افزودن محصول جدید
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="px-7">
          <CardTitle>لیست محصولات</CardTitle>
          <CardDescription>
            در مجموع {productList.length} محصول در سیستم موجود است.
          </CardDescription>
           {/* <div className="mt-4">
            <form>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground rtl:right-2.5 rtl:left-auto" />
                    <Input
                    type="search"
                    placeholder="جستجوی محصول (نام، شناسه و ...)"
                    className="w-full pl-8 md:w-1/3 lg:w-1/4 h-9 bg-background"
                    dir="rtl"
                    />
                </div>
            </form>
          </div> */}
        </CardHeader>
        <CardContent>
          {productList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[80px] sm:table-cell">تصویر</TableHead>
                  <TableHead>نام محصول</TableHead>
                  <TableHead>قیمت</TableHead>
                  <TableHead className="hidden md:table-cell">موجودی (نمایشی)</TableHead>
                  <TableHead className="hidden md:table-cell">تاریخ ایجاد (نمایشی)</TableHead>
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
                          src={product.imageUrl}
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
                    <TableCell>{product.price}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={Math.random() > 0.3 ? "default" : "destructive"} className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200 data-[variant=destructive]:bg-red-100 data-[variant=destructive]:text-red-700 data-[variant=destructive]:border-red-200 data-[variant=destructive]:hover:bg-red-200">
                        {Math.random() > 0.3 ? `موجود (${Math.floor(Math.random() * 100) + 1})` : 'ناموجود'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">۱۴۰۳/۰۲/۱۵ (نمایشی)</TableCell>
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
                          <DropdownMenuItem onSelect={() => console.log(`Edit product ${product.id} (mock)`)}>
                            ویرایش (نمایشی)
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => console.log(`View product ${product.id} details (mock)`)}>
                            مشاهده جزئیات (نمایشی)
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onSelect={() => console.log(`Delete product ${product.id} (mock)`)}>
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
              هیچ محصولی یافت نشد.
            </div>
          )}
        </CardContent>
        {/* Add pagination here in a real app */}
      </Card>
    </div>
  );
}
